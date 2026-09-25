# Script to push changes to GitHub and trigger automatic deployment
param(
    [string]$RepoUrl = ""
)

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

$currentRemote = git remote get-url origin 2>$null

if (-not $currentRemote) {
    if (-not $RepoUrl) {
        Write-Host "No GitHub remote found for this project." -ForegroundColor Yellow
        $RepoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/your-username/StockPicking-App.git)"
    }

    if ($RepoUrl) {
        git remote add origin $RepoUrl
        Write-Host "Linked to $RepoUrl" -ForegroundColor Green
    } else {
        Write-Host "Aborted: No repository URL provided." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Pushing code to GitHub on 'main' branch..." -ForegroundColor Cyan
git add .
git commit -m "Update AlphaSelector India App" 2>$null
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Code successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "  GitHub Actions will now build and deploy automatically." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
