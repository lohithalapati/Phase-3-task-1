param(
    [switch]$RunTests,
    [switch]$RunSecurity,
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message, [int]$Step, [int]$Total)
    Write-Host ""
    Write-Host ("=" * 50) -ForegroundColor DarkCyan
    Write-Host "  [$Step/$Total] $Message" -ForegroundColor Cyan
    Write-Host ("=" * 50) -ForegroundColor DarkCyan
}

function Test-CommandExists {
    param([string]$Command)
    return [bool](Get-Command $Command -ErrorAction SilentlyContinue)
}

# Prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
$prereqs = @('node', 'npm', 'git')
$missing = @()

foreach ($prereq in $prereqs) {
    if (Test-CommandExists $prereq) {
        $ver = & $prereq --version 2>&1
        Write-Host "  $prereq : $ver" -ForegroundColor Green
    } else {
        Write-Host "  $prereq : NOT FOUND" -ForegroundColor Red
        $missing += $prereq
    }
}

if ($missing.Count -gt 0) {
    Write-Host "Missing: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

# Step 1
Write-Step "Setting up GitHub Actions CI" 1 5
. "$PSScriptRoot\Setup-CI.ps1"

# Step 2
Write-Step "Adding Health Check Endpoint" 2 5
. "$PSScriptRoot\Add-HealthCheck.ps1"
. "$PSScriptRoot\Add-HealthCheck-Tests.ps1"

# Step 3
Write-Step "Setting up Structured Logging" 3 5
. "$PSScriptRoot\Add-Logging.ps1"

# Step 4
Write-Step "Security Audit" 4 5
if ($RunSecurity) {
    . "$PSScriptRoot\Run-SecurityAudit.ps1"
} else {
    Write-Host "  Skipped. Use -RunSecurity to enable." -ForegroundColor Yellow
}

# Step 5
Write-Step "Running Test Suite" 5 5
if ($RunTests) {
    npm test -- --coverage --watchAll=false
} else {
    Write-Host "  Skipped. Use -RunTests to enable." -ForegroundColor Yellow
}

# Done
Write-Host ""
Write-Host ("=" * 50) -ForegroundColor Green
Write-Host "  SETUP COMPLETE" -ForegroundColor Green
Write-Host ("=" * 50) -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  git add .github/ src/health/ src/logging/ scripts/" -ForegroundColor White
Write-Host "  git commit -m 'feat: CI pipeline, health checks, logging, security'" -ForegroundColor White
Write-Host "  git push origin main" -ForegroundColor White
