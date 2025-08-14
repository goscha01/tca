# Complete Deployment Script - Build, Git Push, and S3 Upload
Write-Host "Starting Complete TCA Website Deployment..." -ForegroundColor Green

# Load environment variables from .env.local
Write-Host "Loading environment variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Get-Content ".env.local" | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($name, $value, "Process")
            Write-Host "Loaded: $name" -ForegroundColor Gray
        }
    }
    Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
} else {
    Write-Host "No .env.local file found" -ForegroundColor Yellow
}

# Clean builds
Write-Host "Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" -ErrorAction SilentlyContinue }

# Install and build
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Exiting..." -ForegroundColor Red
    exit 1
}

Write-Host "Build completed successfully!" -ForegroundColor Green

# Git operations
Write-Host "Committing and pushing to Git..." -ForegroundColor Yellow

# Check if there are changes to commit
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Changes detected, committing..." -ForegroundColor Cyan
    
    # Add all changes
    git add .
    
    # Commit with timestamp
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Deploy: $timestamp - Built for S3 deployment"
    
    # Push to remote
    Write-Host "Pushing to remote repository..." -ForegroundColor Cyan
    git push
    
    Write-Host "Git operations completed!" -ForegroundColor Green
} else {
    Write-Host "No changes to commit" -ForegroundColor Yellow
}

# S3 Upload
Write-Host "Checking AWS CLI configuration..." -ForegroundColor Yellow

# Try to get AWS caller identity to check if CLI is configured
try {
    # Use a more robust AWS CLI check
    $awsOutput = aws sts get-caller-identity 2>&1
    $awsExitCode = $LASTEXITCODE
    
    if ($awsExitCode -eq 0) {
        # Try to parse the output as JSON
        try {
            $awsIdentity = $awsOutput | ConvertFrom-Json
            if ($awsIdentity -and $awsIdentity.Account) {
                Write-Host "AWS CLI configured! Account: $($awsIdentity.Account)" -ForegroundColor Green
                
                # Get bucket name from environment
                $bucketName = $env:AWS_S3_BUCKET
                if (-not $bucketName) {
                    Write-Host "AWS_S3_BUCKET not found in environment variables" -ForegroundColor Red
                    $bucketName = Read-Host "Enter S3 bucket name"
                }
                
                if ($bucketName) {
                    Write-Host "Uploading to S3 bucket: $bucketName" -ForegroundColor Yellow
                    
                    # Check if out directory exists
                    if (-not (Test-Path "out")) {
                        Write-Host "Error: 'out' directory not found. Build may have failed." -ForegroundColor Red
                        exit 1
                    }
                    
                    # Sync files to S3
                    aws s3 sync "out" "s3://$bucketName" --delete --cache-control "max-age=31536000,public"
                    
                    if ($LASTEXITCODE -eq 0) {
                        Write-Host "S3 upload completed successfully!" -ForegroundColor Green
                        
                        # Get website URL
                        $region = aws configure get region
                        $websiteUrl = "https://$bucketName.s3-website-$region.amazonaws.com"
                        Write-Host "Website deployed to: $websiteUrl" -ForegroundColor Green
                        
                        # CloudFront invalidation if configured
                        $cloudFrontId = $env:AWS_CLOUDFRONT_DISTRIBUTION_ID
                        if ($cloudFrontId) {
                            Write-Host "Invalidating CloudFront cache..." -ForegroundColor Yellow
                            aws cloudfront create-invalidation --distribution-id $cloudFrontId --paths "/*"
                            Write-Host "CloudFront cache invalidated!" -ForegroundColor Green
                        }
                    } else {
                        Write-Host "S3 upload failed!" -ForegroundColor Red
                    }
                } else {
                    Write-Host "No bucket name provided. Skipping S3 upload." -ForegroundColor Yellow
                }
            } else {
                throw "Invalid AWS identity response"
            }
        } catch {
            Write-Host "AWS CLI output parsing failed. Raw output:" -ForegroundColor Yellow
            Write-Host $awsOutput -ForegroundColor Gray
            throw "Failed to parse AWS CLI response"
        }
    } else {
        throw "AWS CLI command failed with exit code: $awsExitCode"
    }
} catch {
    Write-Host "AWS CLI not configured or not working properly." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Raw AWS output: $awsOutput" -ForegroundColor Gray
    Write-Host "Manual S3 upload required." -ForegroundColor Yellow
    Write-Host "Manual steps:" -ForegroundColor Cyan
    Write-Host "1. aws s3 sync out/ s3://your-bucket-name --delete" -ForegroundColor White
    Write-Host "2. Configure S3 bucket for static website hosting" -ForegroundColor White
    Write-Host "3. Set bucket policy for public read access" -ForegroundColor White
}

Write-Host "Deployment script completed!" -ForegroundColor Green
Write-Host "Files ready in 'out' directory" -ForegroundColor Cyan
