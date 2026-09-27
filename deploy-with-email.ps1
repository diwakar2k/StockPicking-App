<#
.SYNOPSIS
    Automated production build and Surge deployment script for AlphaSelector India.

.DESCRIPTION
    Builds the production bundle using Vite and publishes static assets to Surge.sh
    with custom subdomain routing and private link access.

.PARAMETER Domain
    The Surge subdomain to deploy to. Defaults to 'alpha-selector-india-feedback.surge.sh'.

.EXAMPLE
    .\deploy-with-email.ps1 -Domain "alpha-selector-india-preview.surge.sh"
#>
param(
    [string]$Domain = "alpha-selector-india-feedback.surge.sh"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ALPHA SELECTOR INDIA - 1-CLICK DEPLOYMENT TO SURGE" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: Enter your actual email address so you can click the" -ForegroundColor Yellow
Write-Host "1-click verification link sent to your inbox to keep it unpaused." -ForegroundColor Yellow
Write-Host ""

# Ensure production build is up to date
npm run build

# Run surge static deployment
npx surge ./dist $Domain

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Check your email inbox and click 'Verify' from Surge!" -ForegroundColor Green
Write-Host "  Your private link: https://$Domain`?access=alpha-feedback-2026" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
