@echo off
echo Starting TCA Website Deployment...
powershell -ExecutionPolicy Bypass -File deploy-s3.ps1
pause
