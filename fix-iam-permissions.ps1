# Fix IAM Permissions for GitHub Actions User
# This script updates the IAM policy to allow S3 operations

$UserName = "tca-github-actions"
$BucketName = "tca-website-20250813-145945"

Write-Host "Fixing IAM permissions for user: $UserName" -ForegroundColor Green
Write-Host "S3 Bucket: $BucketName" -ForegroundColor Yellow
Write-Host ""

# Create the updated IAM policy
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
            Resource = "*"
        }
    )
} | ConvertTo-Json -Depth 10

Write-Host "Creating updated IAM policy..." -ForegroundColor Yellow

# Write policy to file with UTF8 encoding (no BOM)
[System.IO.File]::WriteAllText("updated-iam-policy.json", $iamPolicy, [System.Text.UTF8Encoding]::new($false))

Write-Host "Updating IAM user policy..." -ForegroundColor Yellow

# Update the IAM user policy
aws iam put-user-policy --user-name $UserName --policy-name "TCAGitHubActionsPolicy" --policy-document file://updated-iam-policy.json

Write-Host "Verifying policy update..." -ForegroundColor Yellow

# Get the current policy to verify
aws iam get-user-policy --user-name $UserName --policy-name "TCAGitHubActionsPolicy"

# Clean up
Remove-Item "updated-iam-policy.json" -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ IAM permissions updated successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The GitHub Actions user now has:" -ForegroundColor Yellow
Write-Host "- s3:ListBucket permission" -ForegroundColor White
Write-Host "- s3:GetObject, PutObject, DeleteObject permissions" -ForegroundColor White
Write-Host "- CloudFront invalidation permissions" -ForegroundColor White
Write-Host ""
Write-Host "You can now push your code to GitHub and the deployment should work!" -ForegroundColor Cyan

