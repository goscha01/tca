# Fix AWS Setup Script
# This script completes the AWS setup that was partially done

$BucketName = "tca-website-20250813-145334"
$Region = "us-east-1"

Write-Host "Fixing AWS Setup for bucket: $BucketName" -ForegroundColor Green

# Fix S3 bucket website configuration
Write-Host "Fixing S3 bucket website configuration..." -ForegroundColor Yellow
$websiteConfig = '{"IndexDocument":{"Suffix":"index.html"},"ErrorDocument":{"Key":"404.html"}}'
$websiteConfig | Out-File -FilePath "website-config.json" -Encoding UTF8 -NoNewline
aws s3api put-bucket-website --bucket $BucketName --website-configuration file://website-config.json

# Fix S3 bucket policy
Write-Host "Fixing S3 bucket policy..." -ForegroundColor Yellow
$bucketPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BucketName/*"
        }
    ]
}
"@
$bucketPolicy | Out-File -FilePath "bucket-policy.json" -Encoding UTF8 -NoNewline
aws s3api put-bucket-policy --bucket $BucketName --policy file://bucket-policy.json

# Create CloudFront distribution with proper JSON
Write-Host "Creating CloudFront distribution..." -ForegroundColor Yellow
$callerReference = Get-Date -Format 'yyyyMMdd-HHmmss'
$distributionConfig = @"
{
    "CallerReference": "$callerReference",
    "Comment": "TCA Website Distribution",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$BucketName",
                "DomainName": "$BucketName.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$BucketName",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
"@

$distributionConfig | Out-File -FilePath "cloudfront-distribution.json" -Encoding UTF8 -NoNewline
aws cloudfront create-distribution --distribution-config file://cloudfront-distribution.json | Out-File -FilePath "cloudfront-response.json" -Encoding UTF8

# Extract CloudFront distribution ID and domain
$cloudfrontResponse = Get-Content "cloudfront-response.json" | ConvertFrom-Json
$DistributionId = $cloudfrontResponse.Distribution.Id
$CloudFrontDomain = $cloudfrontResponse.Distribution.DomainName

Write-Host "CloudFront Distribution ID: $DistributionId" -ForegroundColor Green
Write-Host "CloudFront Domain: $CloudFrontDomain" -ForegroundColor Green

# Create IAM policy with proper JSON
Write-Host "Creating IAM policy..." -ForegroundColor Yellow
$iamPolicy = @"
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::$BucketName",
                "arn:aws:s3:::$BucketName/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            ],
            "Resource": "arn:aws:cloudfront::*:distribution/$DistributionId"
        }
    ]
}
"@

$iamPolicy | Out-File -FilePath "iam-policy.json" -Encoding UTF8 -NoNewline
aws iam create-policy --policy-name "TCAGitHubActionsPolicy" --policy-document file://iam-policy.json

# Attach policy to user
Write-Host "Attaching policy to IAM user..." -ForegroundColor Yellow
$accountId = (aws sts get-caller-identity --query Account --output text).Trim()
aws iam attach-user-policy --user-name "tca-github-actions" --policy-arn "arn:aws:iam::$accountId:policy/TCAGitHubActionsPolicy"

# Clean up temporary files
Write-Host "Cleaning up temporary files..." -ForegroundColor Yellow
Remove-Item "website-config.json", "bucket-policy.json", "cloudfront-distribution.json", "cloudfront-response.json", "iam-policy.json" -ErrorAction SilentlyContinue

Write-Host "AWS Setup Fixed Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Updated Information:" -ForegroundColor Yellow
Write-Host "S3 Bucket: $BucketName"
Write-Host "CloudFront Distribution ID: $DistributionId"
Write-Host "CloudFront Domain: $CloudFrontDomain"
Write-Host ""
Write-Host "Now you can add CLOUDFRONT_DISTRIBUTION_ID: $DistributionId to your GitHub secrets" -ForegroundColor Green
