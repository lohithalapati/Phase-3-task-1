Write-Host "Setting up GitHub Actions CI Pipeline..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path ".github/workflows" -Force | Out-Null

$ciWorkflow = @"
name: CI Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: `${{ matrix.node-version }}
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Run TypeScript check
        run: npx tsc --noEmit
      - name: Run tests with coverage
        run: npm test -- --coverage --watchAll=false
      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
      - name: Build project
        run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security audit
        run: npm audit --audit-level=high
"@

$ciWorkflow | Out-File -FilePath ".github/workflows/ci.yml" -Encoding UTF8
Write-Host "Created .github/workflows/ci.yml" -ForegroundColor Green
