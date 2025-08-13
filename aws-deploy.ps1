# TCA Website AWS Deployment Script (PowerShell)
# This script sets up AWS resources for automatic deployment from GitHub to S3

param(
    [string]$Region = "us-east-1"
)

# Configuration
$BucketName = "tca-website-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
$GitHubBranch = "main"

Write-Host "Starting TCA Website AWS Deployment Setup..." -ForegroundColor Green

# Check if AWS CLI is installed
try {
    $null = Get-Command aws -ErrorAction Stop
} catch {
    Write-Host "AWS CLI is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

# Check if AWS credentials are configured
try {
    $null = aws sts get-caller-identity 2>$null
} catch {
    Write-Host "AWS credentials not configured. Please run 'aws configure' first." -ForegroundColor Red
    exit 1
}

Write-Host "Creating S3 bucket: $BucketName" -ForegroundColor Yellow
aws s3 mb "s3://$BucketName" --region $Region

Write-Host "Configuring S3 bucket for static website hosting" -ForegroundColor Yellow
$websiteConfig = @{
    IndexDocument = @{Suffix = "index.html"}
    ErrorDocument = @{Key = "404.html"}
} | ConvertTo-Json

aws s3api put-bucket-website --bucket $BucketName --website-configuration $websiteConfig

Write-Host "Setting S3 bucket policy for public read access" -ForegroundColor Yellow
$bucketPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Sid = "PublicReadGetObject"
            Effect = "Allow"
            Principal = "*"
            Action = "s3:GetObject"
            Resource = "arn:aws:s3:::$BucketName/*"
        }
    )
} | ConvertTo-Json

$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8 -NoNewline
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json

Write-Host "Enabling S3 bucket versioning" -ForegroundColor Yellow
aws s3api put-bucket-versioning --bucket $BucketName --versioning-configuration Status=Enabled

Write-Host "Creating CloudFront distribution" -ForegroundColor Yellow
$callerReference = Get-Date -Format 'yyyyMMdd-HHmmss'
$distributionConfig = @{
    CallerReference = $callerReference
    Comment = "TCA Website Distribution"
    DefaultRootObject = "index.html"
    Origins = @{
        Quantity = 1
        Items = @(
            @{
                Id = "S3-$BucketName"
                DomainName = "$BucketName.s3.amazonaws.com"
                S3OriginConfig = @{
                    OriginAccessIdentity = ""
                }
            }
        )
    }
    DefaultCacheBehavior = @{
        TargetOriginId = "S3-$BucketName"
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
} | ConvertTo-Json

$distributionConfig | Out-File -FilePath "cloudfront-distribution.json" -Encoding UTF8 -NoNewline
aws cloudfront create-distribution --distribution-config file://cloudfront-distribution.json | Out-File -FilePath "cloudfront-response.json" -Encoding UTF8

# Extract CloudFront distribution ID and domain
$cloudfrontResponse = Get-Content "cloudfront-response.json" | ConvertFrom-Json
$DistributionId = $cloudfrontResponse.Distribution.Id
$CloudFrontDomain = $cloudfrontResponse.Distribution.DomainName

Write-Host "Creating IAM user for GitHub Actions" -ForegroundColor Yellow
aws iam create-user --user-name "tca-github-actions"

Write-Host "Creating IAM policy for S3 and CloudFront access" -ForegroundColor Yellow
$iamPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @(
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            )
            Resource = @(
                "arn:aws:s3:::$BucketName",
                "arn:aws:s3:::$BucketName/*"
            )
        },
        @{
            Effect = "Allow"
            Action = @(
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            )
            Resource = "arn:aws:cloudfront::*:distribution/$DistributionId"
        }
    )
} | ConvertTo-Json

$iamPolicy | Out-File -FilePath "iam-policy.json" -Encoding UTF8 -NoNewline
aws iam create-policy --policy-name "TCAGitHubActionsPolicy" --policy-document file://iam-policy.json

Write-Host "Attaching policy to IAM user" -ForegroundColor Yellow
$accountId = (aws sts get-caller-identity --query Account --output text).Trim()
aws iam attach-user-policy --user-name "tca-github-actions" --policy-arn "arn:aws:iam::$accountId:policy/TCAGitHubActionsPolicy"

Write-Host "Creating access keys for GitHub Actions" -ForegroundColor Yellow
aws iam create-access-key --user-name "tca-github-actions" | Out-File -FilePath "access-keys.json" -Encoding UTF8

# Extract access key and secret
$accessKeys = Get-Content "access-keys.json" | ConvertFrom-Json
$AccessKeyId = $accessKeys.AccessKey.AccessKeyId
$SecretAccessKey = $accessKeys.AccessKey.SecretAccessKey

Write-Host "Cleaning up temporary files" -ForegroundColor Yellow
Remove-Item "bucket-policy.json", "iam-policy.json", "cloudfront-distribution.json", "cloudfront-response.json", "access-keys.json" -ErrorAction SilentlyContinue

Write-Host "AWS Resources Created Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Deployment Information:" -ForegroundColor Yellow
Write-Host "S3 Bucket: $BucketName"
Write-Host "CloudFront Distribution ID: $DistributionId"
Write-Host "CloudFront Domain: $CloudFrontDomain"
Write-Host "Region: $Region"
Write-Host ""
Write-Host "GitHub Actions Credentials:" -ForegroundColor Yellow
Write-Host "AWS_ACCESS_KEY_ID: $AccessKeyId"
Write-Host "AWS_SECRET_ACCESS_KEY: $SecretAccessKey"
Write-Host "AWS_REGION: $Region"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Add these secrets to your GitHub repository:"
Write-Host "   - Go to Settings > Secrets and variables > Actions"
Write-Host "   - Add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
Write-Host "   - Add S3_BUCKET_NAME: $BucketName"
Write-Host "   - Add CLOUDFRONT_DISTRIBUTION_ID: $DistributionId"
Write-Host "2. Push your code to trigger the deployment"
Write-Host ""
Write-Host "Setup complete! Your website will be deployed automatically on push to $GitHubBranch" -ForegroundColor Green
