# Check and Complete AWS Setup Script
# This script checks both buckets and completes the setup for the working one

$Bucket1 = "tca-website-20250813-145334"
$Bucket2 = "tca-website-20250813-145945"
$Region = "us-east-1"

Write-Host "Checking AWS Setup Status..." -ForegroundColor Green
Write-Host ""

# Check Bucket 1
Write-Host "Checking Bucket 1: $Bucket1" -ForegroundColor Yellow
try {
    $website1 = aws s3api get-bucket-website --bucket $Bucket1 2>$null
    if ($website1) {
        Write-Host "  ✅ Website configuration: OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Website configuration: Missing" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Website configuration: Error" -ForegroundColor Red
}

try {
    $policy1 = aws s3api get-bucket-policy --bucket $Bucket1 2>$null
    if ($policy1) {
        Write-Host "  ✅ Bucket policy: OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Bucket policy: Missing" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Bucket policy: Error" -ForegroundColor Red
}

Write-Host ""

# Check Bucket 2
Write-Host "Checking Bucket 2: $Bucket2" -ForegroundColor Yellow
try {
    $website2 = aws s3api get-bucket-website --bucket $Bucket2 2>$null
    if ($website2) {
        Write-Host "  ✅ Website configuration: OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Website configuration: Missing" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Website configuration: Error" -ForegroundColor Red
}

try {
    $policy2 = aws s3api get-bucket-policy --bucket $Bucket2 2>$null
    if ($policy2) {
        Write-Host "  ✅ Bucket policy: OK" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Bucket policy: Missing" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Bucket policy: Error" -ForegroundColor Red
}

Write-Host ""
Write-Host "Which bucket would you like to use for your website?" -ForegroundColor Cyan
Write-Host "1. $Bucket1 (first bucket)" -ForegroundColor White
Write-Host "2. $Bucket2 (second bucket)" -ForegroundColor White
Write-Host "3. Create a new bucket" -ForegroundColor White

$choice = Read-Host "Enter your choice (1, 2, or 3)"

if ($choice -eq "1") {
    $SelectedBucket = $Bucket1
    Write-Host "Using Bucket 1: $SelectedBucket" -ForegroundColor Green
} elseif ($choice -eq "2") {
    $SelectedBucket = $Bucket2
    Write-Host "Using Bucket 2: $SelectedBucket" -ForegroundColor Green
} elseif ($choice -eq "3") {
    $SelectedBucket = "tca-website-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "Creating new bucket: $SelectedBucket" -ForegroundColor Green
    aws s3 mb "s3://$SelectedBucket" --region $Region
} else {
    Write-Host "Invalid choice. Using Bucket 2: $Bucket2" -ForegroundColor Yellow
    $SelectedBucket = $Bucket2
}

Write-Host ""
Write-Host "Completing setup for bucket: $SelectedBucket" -ForegroundColor Green

# Complete the setup for selected bucket
Write-Host "Configuring S3 bucket website..." -ForegroundColor Yellow

# Create website config JSON
$websiteConfig = @{
    IndexDocument = @{Suffix = "index.html"}
    ErrorDocument = @{Key = "404.html"}
} | ConvertTo-Json -Compress

# Write to file with UTF8 encoding (no BOM)
[System.IO.File]::WriteAllText("website-config.json", $websiteConfig, [System.Text.UTF8Encoding]::new($false))

aws s3api put-bucket-website --bucket $SelectedBucket --website-configuration file://website-config.json

Write-Host "Setting bucket policy..." -ForegroundColor Yellow

# Create bucket policy JSON
$bucketPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Sid = "PublicReadGetObject"
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::$SelectedBucket/*"
        }
    )
} | ConvertTo-Json -Depth 10

# Write to file with UTF8 encoding (no BOM)
[System.IO.File]::WriteAllText("bucket-policy.json", $bucketPolicy, [System.Text.UTF8Encoding]::new($false))

aws s3api put-bucket-policy --bucket $SelectedBucket --policy file://bucket-policy.json

Write-Host "Enabling bucket versioning..." -ForegroundColor Yellow
aws s3api put-bucket-versioning --bucket $SelectedBucket --versioning-configuration Status=Enabled

Write-Host "Creating CloudFront distribution..." -ForegroundColor Yellow
$callerReference = Get-Date -Format 'yyyyMMdd-HHmmss'

# Create CloudFront distribution config JSON
$distributionConfig = @{
    CallerReference = $callerReference
    Comment = "TCA Website Distribution"
    DefaultRootObject = "index.html"
    Origins = @{
        Quantity = 1
        Items = @(
            @{
                Id = "S3-$SelectedBucket"
                DomainName = "$SelectedBucket.s3.amazonaws.com"
                S3OriginConfig = @{
                    OriginAccessIdentity = ""
                }
            }
        )
    }
    DefaultCacheBehavior = @{
        TargetOriginId = "S3-$SelectedBucket"
        ViewerProtocolPolicy = "redirect-to-https"
        TrustedSigners = @{
            Enabled = $false
            Quantity = 0
        }
        ForwardedValues = @{
            QueryString = $false
            Cookies = @{
                Forward = "none"
            }
        }
        MinTTL = 0
        DefaultTTL = 86400
        MaxTTL = 31536000
    }
    Enabled = $true
    PriceClass = "PriceClass_100"
} | ConvertTo-Json -Depth 10

# Write to file with UTF8 encoding (no BOM)
[System.IO.File]::WriteAllText("cloudfront-distribution.json", $distributionConfig, [System.Text.UTF8Encoding]::new($false))

# Create distribution and capture output
$cloudfrontResponse = aws cloudfront create-distribution --distribution-config file://cloudfront-distribution.json
$DistributionId = ($cloudfrontResponse | ConvertFrom-Json).Distribution.Id
$CloudFrontDomain = ($cloudfrontResponse | ConvertFrom-Json).Distribution.DomainName

Write-Host "CloudFront Distribution ID: $DistributionId" -ForegroundColor Green
Write-Host "CloudFront Domain: $CloudFrontDomain" -ForegroundColor Green

# Clean up temporary files
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item "website-config.json", "bucket-policy.json", "cloudfront-distribution.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Final Configuration:" -ForegroundColor Yellow
Write-Host "S3 Bucket: $SelectedBucket"
Write-Host "CloudFront Distribution ID: $DistributionId"
Write-Host "CloudFront Domain: $CloudFrontDomain"
Write-Host ""
Write-Host "GitHub Secrets to Add:" -ForegroundColor Cyan
Write-Host "AWS_ACCESS_KEY_ID: [Your Access Key ID]"
Write-Host "AWS_SECRET_ACCESS_KEY: [Your Secret Access Key]"
Write-Host "AWS_REGION: us-east-1"
Write-Host "S3_BUCKET_NAME: $SelectedBucket"
Write-Host "CLOUDFRONT_DISTRIBUTION_ID: $DistributionId"
Write-Host ""
Write-Host "Note: Replace [Your Access Key ID] and [Your Secret Access Key] with your actual AWS credentials" -ForegroundColor Yellow
Write-Host ""
Write-Host "Would you like me to help you delete the unused bucket?" -ForegroundColor Cyan
