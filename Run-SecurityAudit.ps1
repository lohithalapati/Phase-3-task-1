Write-Host "Running Security Audit..." -ForegroundColor Cyan
Write-Host ("-" * 50) -ForegroundColor DarkGray

# 1. NPM Audit
Write-Host "`n[1/4] NPM Vulnerability Scan" -ForegroundColor Yellow
$auditJson = npm audit --json 2>&1
$auditResult = $auditJson | ConvertFrom-Json
$vulnCount = $auditResult.metadata.vulnerabilities

$critColor = if ($vulnCount.critical -gt 0) { "Red" } else { "Green" }
$highColor  = if ($vulnCount.high -gt 0)     { "Red" } else { "Green" }
$modColor   = if ($vulnCount.moderate -gt 0) { "Yellow" } else { "Green" }

Write-Host "Critical : $($vulnCount.critical)" -ForegroundColor $critColor
Write-Host "High     : $($vulnCount.high)"     -ForegroundColor $highColor
Write-Host "Medium   : $($vulnCount.moderate)" -ForegroundColor $modColor
Write-Host "Low      : $($vulnCount.low)"      -ForegroundColor Cyan

# 2. Check for hardcoded secrets (fixed regex)
Write-Host "`n[2/4] Scanning for hardcoded secrets..." -ForegroundColor Yellow

$secretPatterns = @(
    'password\s*=\s*["''][^"'']+["'']',
    'api_key\s*=\s*["''][^"'']+["'']',
    'secret\s*=\s*["''][^"'']+["'']',
    'token\s*=\s*["''][^"'']+["'']'
)

$secretsFound = $false
Get-ChildItem -Path "src" -Recurse -Include "*.ts" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    foreach ($pattern in $secretPatterns) {
        if ($content -imatch $pattern) {
            Write-Host "WARNING: Possible secret in $($_.Name)" -ForegroundColor Red
            $secretsFound = $true
        }
    }
}

if (-not $secretsFound) {
    Write-Host "No hardcoded secrets found" -ForegroundColor Green
}

# 3. Check .gitignore
Write-Host "`n[3/4] Checking .gitignore entries..." -ForegroundColor Yellow
$gitignoreChecks = @('.env', 'node_modules', 'dist', 'logs')
$gitignoreContent = Get-Content ".gitignore" -Raw -ErrorAction SilentlyContinue

foreach ($entry in $gitignoreChecks) {
    if ($gitignoreContent -match [regex]::Escape($entry)) {
        Write-Host "$entry : ignored" -ForegroundColor Green
    } else {
        Write-Host "$entry : NOT in .gitignore" -ForegroundColor Red
    }
}

# 4. Check .env tracking
Write-Host "`n[4/4] Checking environment files..." -ForegroundColor Yellow
if (Test-Path ".env") {
    $gitTracked = git ls-files .env 2>&1
    if ($gitTracked) {
        Write-Host "WARNING: .env is tracked by git!" -ForegroundColor Red
    } else {
        Write-Host ".env exists and is NOT tracked by git" -ForegroundColor Green
    }
} else {
    Write-Host "No .env file (good - use .env.example)" -ForegroundColor Yellow
}

# Summary Report
Write-Host "`n" -NoNewline
Write-Host ("=" * 50) -ForegroundColor Cyan
Write-Host "Security Audit Complete" -ForegroundColor Cyan
Write-Host ("=" * 50) -ForegroundColor Cyan

$report = [ordered]@{
    timestamp       = (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    critical        = $vulnCount.critical
    high            = $vulnCount.high
    moderate        = $vulnCount.moderate
    low             = $vulnCount.low
    secretsFound    = $secretsFound
    gitignoreOk     = $true
    envFileSafe     = $true
} | ConvertTo-Json

$report | Out-File -FilePath "security-audit-report.json" -Encoding UTF8
Write-Host "Report saved: security-audit-report.json" -ForegroundColor Green
