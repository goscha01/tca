# TCA Website Deployment Guide

This guide explains how to deploy your TCA website to AWS S3 with automatic CI/CD from GitHub.

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   # Install AWS CLI (if not already installed)
   # Windows: Download from https://aws.amazon.com/cli/
   # macOS: brew install awscli
   # Linux: sudo apt-get install awscli
   
   # Configure AWS credentials
   aws configure
   ```

2. **GitHub repository set up**
   - Your code should be in the `goscha01/tca` repository
   - You should have admin access to add secrets

### Option 1: Windows PowerShell (Recommended for Windows)

```powershell
# Run the PowerShell deployment script
.\aws-deploy.ps1

# Or with custom region
.\aws-deploy.ps1 -Region "us-west-2"
```

### Option 2: Linux/macOS Bash

```bash
# Make the script executable
chmod +x aws-deploy.sh

# Run the bash deployment script
./aws-deploy.sh
```

## 📋 What the Scripts Create

The deployment scripts automatically create:

1. **S3 Bucket** - For hosting your static website
2. **CloudFront Distribution** - For global CDN and HTTPS
3. **IAM User** - For GitHub Actions to access AWS
4. **IAM Policy** - With minimal required permissions
5. **Access Keys** - For GitHub Actions authentication

## 🔑 Setting Up GitHub Secrets

After running the deployment script, you'll get credentials to add to GitHub:

1. Go to your GitHub repository: `https://github.com/goscha01/tca`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Add these repository secrets:

   | Secret Name | Value |
   |-------------|-------|
   | `AWS_ACCESS_KEY_ID` | From script output |
   | `AWS_SECRET_ACCESS_KEY` | From script output |
   | `AWS_REGION` | `us-east-1` (or your chosen region) |
   | `S3_BUCKET_NAME` | From script output |
   | `CLOUDFRONT_DISTRIBUTION_ID` | From script output |

## 🔄 How the CI/CD Pipeline Works

1. **Push to GitHub** → Triggers GitHub Actions workflow
2. **Build** → Installs dependencies and builds Next.js app
3. **Export** → Creates static files using `next export`
4. **Deploy** → Syncs files to S3 bucket
5. **Invalidate Cache** → Updates CloudFront distribution

## 📁 File Structure

```
TCA/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── aws-deploy.sh               # Linux/macOS deployment script
├── aws-deploy.ps1              # Windows PowerShell script
├── DEPLOYMENT.md               # This file
└── ... (your website files)
```

## 🌐 Accessing Your Website

After deployment, your website will be available at:

- **S3 Website URL**: `https://[bucket-name].s3-website-[region].amazonaws.com`
- **CloudFront URL**: `https://[distribution-id].cloudfront.net`

## 🔧 Customization

### Change AWS Region

```bash
# Bash
./aws-deploy.sh

# PowerShell
.\aws-deploy.ps1 -Region "us-west-2"
```

### Custom Domain Setup

1. Update the `DOMAIN_NAME` variable in the script
2. Add your domain to CloudFront distribution
3. Configure DNS to point to CloudFront

### Environment-Specific Deployments

Create different workflows for staging/production:

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging
on:
  push:
    branches: [ develop ]

# .github/workflows/deploy-production.yml
name: Deploy to Production
on:
  push:
    branches: [ main ]
  workflow_dispatch: # Manual trigger
```

## 🚨 Troubleshooting

### Common Issues

1. **AWS CLI not configured**
   ```bash
   aws configure
   # Enter your Access Key ID, Secret Access Key, Region
   ```

2. **Permission denied errors**
   - Ensure your AWS user has necessary permissions
   - Check IAM policies and roles

3. **S3 bucket already exists**
   - The script generates unique bucket names
   - Or manually specify a bucket name

4. **GitHub Actions failing**
   - Verify all secrets are correctly set
   - Check workflow logs for specific errors

### Manual Deployment

If you need to deploy manually:

```bash
# Build and export
npm run build
npm run export

# Deploy to S3
aws s3 sync out/ s3://[your-bucket-name] --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id [your-distribution-id] \
  --paths "/*"
```

## 💰 Cost Optimization

- **S3**: ~$0.023 per GB/month
- **CloudFront**: ~$0.085 per GB transferred
- **Data Transfer**: Free between S3 and CloudFront in same region

### Cost-Saving Tips

1. Use CloudFront caching to reduce S3 requests
2. Enable S3 lifecycle policies for old versions
3. Monitor usage with AWS Cost Explorer

## 🔒 Security Best Practices

1. **IAM Principle of Least Privilege**
   - Only grant necessary permissions
   - Use specific resource ARNs

2. **S3 Bucket Security**
   - Enable bucket versioning
   - Configure proper bucket policies
   - Consider using Origin Access Identity

3. **CloudFront Security**
   - Enable HTTPS only
   - Configure proper cache behaviors
   - Use security headers

## 📞 Support

If you encounter issues:

1. Check the GitHub Actions logs
2. Verify AWS credentials and permissions
3. Ensure all secrets are correctly set
4. Check AWS CloudTrail for API call logs

## 🎯 Next Steps

After successful deployment:

1. **Test your website** at the provided URLs
2. **Set up monitoring** with AWS CloudWatch
3. **Configure alerts** for deployment failures
4. **Set up custom domain** if needed
5. **Implement staging environment** for testing

---

**Happy Deploying! 🚀**

Your TCA website will now automatically deploy every time you push to the main branch!
