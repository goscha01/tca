# S3 Permissions Fix Script
Write-Host "Fixing S3 Bucket Permissions..." -ForegroundColor Green

# Get bucket name
$bucketName = $env:AWS_S3_BUCKET
if (-not $bucketName) {
    $bucketName = Read-Host "Enter S3 bucket name"
}

if (-not $bucketName) {
    Write-Host "No bucket name provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host "Working with bucket: $bucketName" -ForegroundColor Yellow

# Check if AWS CLI is configured
$awsConfigured = aws sts get-caller-identity 2>$null
if (-not $awsConfigured) {
    Write-Host "AWS CLI not configured. Please configure it first." -ForegroundColor Red
    exit 1
}

Write-Host "AWS CLI configured. Proceeding..." -ForegroundColor Green

# Step 1: Remove Block Public Access
Write-Host "Removing Block Public Access settings..." -ForegroundColor Yellow
aws s3api put-public-access-block --bucket $bucketName --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Step 2: Set bucket policy for public read
Write-Host "Setting bucket policy for public read access..." -ForegroundColor Yellow

$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$bucketName/*"
        }
    ]
}
"@

# Save policy to temp file
$policyFile = "bucket-policy.json"
$bucketPolicy | Out-File -FilePath $policyFile -Encoding UTF8

# Apply the policy
aws s3api put-bucket-policy --bucket $bucketName --policy file://$policyFile

# Clean up temp file
Remove-Item $policyFile

# Step 3: Enable static website hosting
Write-Host "Enabling static website hosting..." -ForegroundColor Yellow
aws s3 website s3://$bucketName --index-document index.html --error-document 404.html

# Step 4: Test access
Write-Host "Testing bucket access..." -ForegroundColor Yellow
try {
    $testResult = aws s3 ls s3://$bucketName 2>$null
    if ($testResult) {
        Write-Host "Bucket access test successful!" -ForegroundColor Green
    } else {
        Write-Host "Bucket access test failed." -ForegroundColor Red
    }
} catch {
    Write-Host "Error testing bucket access: $_" -ForegroundColor Red
}

Write-Host "S3 permissions fix completed!" -ForegroundColor Green
Write-Host "Now try running your deployment script again." -ForegroundColor Cyan
