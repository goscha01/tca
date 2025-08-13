#!/bin/bash

# TCA Website AWS Deployment Script
# This script sets up AWS resources for automatic deployment from GitHub to S3

set -e

# Configuration - Update these variables
BUCKET_NAME="tca-website-$(date +%s)"
REGION="us-east-1"
DOMAIN_NAME="your-domain.com"  # Update with your actual domain
GITHUB_REPO="goscha01/tca"
GITHUB_BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting TCA Website AWS Deployment Setup...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Creating S3 bucket: $BUCKET_NAME${NC}"
aws s3 mb s3://$BUCKET_NAME --region $REGION

echo -e "${YELLOW}🔒 Configuring S3 bucket for static website hosting${NC}"
aws s3api put-bucket-website \
    --bucket $BUCKET_NAME \
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "404.html"}
    }'

echo -e "${YELLOW}📜 Setting S3 bucket policy for public read access${NC}"
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

echo -e "${YELLOW}🔄 Enabling S3 bucket versioning${NC}"
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled

echo -e "${YELLOW}🗑️ Creating CloudFront distribution${NC}"
# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config '{
        "CallerReference": "'$(date +%s)'",
        "Comment": "TCA Website Distribution",
        "DefaultRootObject": "index.html",
        "Origins": {
            "Quantity": 1,
            "Items": [
                {
                    "Id": "S3-'$BUCKET_NAME'",
                    "DomainName": "'$BUCKET_NAME'.s3.amazonaws.com",
                    "S3OriginConfig": {
                        "OriginAccessIdentity": ""
                    }
                }
            ]
        },
        "DefaultCacheBehavior": {
            "TargetOriginId": "S3-'$BUCKET_NAME'",
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
    }' > cloudfront-distribution.json

# Extract CloudFront distribution ID
DISTRIBUTION_ID=$(cat cloudfront-distribution.json | grep -o '"Id": "[^"]*"' | cut -d'"' -f4)
CLOUDFRONT_DOMAIN=$(cat cloudfront-distribution.json | grep -o '"DomainName": "[^"]*"' | cut -d'"' -f4)

echo -e "${YELLOW}🔑 Creating IAM user for GitHub Actions${NC}"
aws iam create-user --user-name tca-github-actions

echo -e "${YELLOW}📋 Creating IAM policy for S3 and CloudFront access${NC}"
cat > iam-policy.json << EOF
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
                "arn:aws:s3:::$BUCKET_NAME",
                "arn:aws:s3:::$BUCKET_NAME/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            ],
            "Resource": "arn:aws:cloudfront::*:distribution/$DISTRIBUTION_ID"
        }
    ]
}
EOF

aws iam create-policy \
    --policy-name TCAGitHubActionsPolicy \
    --policy-document file://iam-policy.json

echo -e "${YELLOW}🔗 Attaching policy to IAM user${NC}"
aws iam attach-user-policy \
    --user-name tca-github-actions \
    --policy-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):policy/TCAGitHubActionsPolicy

echo -e "${YELLOW}🔑 Creating access keys for GitHub Actions${NC}"
aws iam create-access-key --user-name tca-github-actions > access-keys.json

# Extract access key and secret
ACCESS_KEY_ID=$(cat access-keys.json | grep -o '"AccessKeyId": "[^"]*"' | cut -d'"' -f4)
SECRET_ACCESS_KEY=$(cat access-keys.json | grep -o '"SecretAccessKey": "[^"]*"' | cut -d'"' -f4)

echo -e "${YELLOW}🧹 Cleaning up temporary files${NC}"
rm -f bucket-policy.json iam-policy.json cloudfront-distribution.json access-keys.json

echo -e "${GREEN}✅ AWS Resources Created Successfully!${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Information:${NC}"
echo "S3 Bucket: $BUCKET_NAME"
echo "CloudFront Distribution ID: $DISTRIBUTION_ID"
echo "CloudFront Domain: $CLOUDFRONT_DOMAIN"
echo "Region: $REGION"
echo ""
echo -e "${YELLOW}🔑 GitHub Actions Credentials:${NC}"
echo "AWS_ACCESS_KEY_ID: $ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY: $SECRET_ACCESS_KEY"
echo "AWS_REGION: $REGION"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Add these secrets to your GitHub repository:"
echo "   - Go to Settings > Secrets and variables > Actions"
echo "   - Add AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION"
echo "2. Update the GitHub Actions workflow file (.github/workflows/deploy.yml)"
echo "3. Push your code to trigger the deployment"
echo ""
echo -e "${GREEN}🎉 Setup complete! Your website will be deployed automatically on push to $GITHUB_BRANCH${NC}"
