# GitHub Actions Reference

## Table of Contents

- [Variable Management](#variable-management)
- [Cross-Job Variable Persistence](#cross-job-variable-persistence)
- [Secrets Management](#secrets-management)
- [Complete Workflow Example](#complete-workflow-example)
- [Common Patterns](#common-patterns)

---

## Variable Management

### Setup Variables Based on Branch

Map branch names to environment-specific variables using `simenandre/setup-variables@v2`:

```yaml
- uses: simenandre/setup-variables@v2
  id: stack
  with:
    key: ${{ env.CI_REF_NAME_SLUG }}
    map: |
      main: prod
      staging: staging
      dev: dev
      '*': dev
```

**How it works:**

- Maps branch names to environment values
- Uses `CI_REF_NAME_SLUG` as the lookup key
- Wildcard `'*'` provides a default fallback
- Access the result via `steps.stack.outputs.value`

**Example usage:**

```yaml
- name: Deploy to environment
  run: echo "Deploying to ${{ steps.stack.outputs.value }}"
```

---

## Cross-Job Variable Persistence

### Store and Retrieve Variables Across Jobs

Use `UnlyEd/github-action-store-variable@v3` to share variables between jobs:

```yaml
jobs:
  compute-data:
    name: Compute data
    runs-on: ubuntu-22.04
    steps:
      - name: Compute resources
        run: |
          MAGIC_NUMBER=42
          echo "Found universal answer: $MAGIC_NUMBER"
          echo "Exporting it as ENV variable..."
          echo "MAGIC_NUMBER=$MAGIC_NUMBER" >> $GITHUB_ENV

      # Export all variables at once at the end of your job
      - name: Export variable MAGIC_NUMBER for next jobs
        uses: UnlyEd/github-action-store-variable@v3
        with:
          variables: |
            MAGIC_NUMBER=${{ env.MAGIC_NUMBER }}

  retrieve-data:
    name: Find & re-use data
    runs-on: ubuntu-22.04
    needs: compute-data
    steps:
      - name: Import variable MAGIC_NUMBER
        uses: UnlyEd/github-action-store-variable@v3
        with:
          variables: |
            MAGIC_NUMBER
            
      - name: Debug output
        run: echo "We have access to $MAGIC_NUMBER"
```

**Key points:**

- Variables are automatically added to `$GITHUB_ENV` when imported
- Use `needs:` to ensure job dependency order
- Best practice: Export all variables at once at the end of a job
- Alternative to using artifacts for simple data sharing

---

## Secrets Management

### Understanding GitHub Secrets

GitHub secrets are encrypted environment variables that you create in a repository. They are never exposed in logs and are only accessible to workflows.

**NEVER hardcode secrets in your workflow files!**

### Setting Up Secrets

#### Via GitHub UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add name and value
5. Click **Add secret**

#### Via GitHub CLI

```bash
# Set a secret
gh secret set SECRET_NAME

# Set from file
gh secret set FIREBASE_SERVICE_ACCOUNT < service-account.json

# Set from stdin
echo "my-secret-value" | gh secret set MY_SECRET

# List all secrets (values are hidden)
gh secret list

# Delete a secret
gh secret delete SECRET_NAME
```

### Required Secrets for TraceRight Platform

```bash
# Firebase deployment
gh secret set FIREBASE_SERVICE_ACCOUNT < vertex-key.json
gh secret set FIREBASE_PROJECT_ID --body "alldoing"

# Code coverage (optional)
gh secret set CODECOV_TOKEN --body "your-codecov-token"

# Security scanning (optional)
gh secret set SNYK_TOKEN --body "your-snyk-token"

# GITHUB_TOKEN is automatically provided by GitHub Actions
```

### Using Secrets in Workflows

```yaml
# Access secrets safely
- name: Deploy to Firebase
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    repoToken: '${{ secrets.GITHUB_TOKEN }}'
    firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'

# Use secrets in environment variables
- name: Run security scan
  run: npm audit
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

# Conditional execution based on secret availability
- name: Run Snyk scan
  if: ${{ secrets.SNYK_TOKEN != '' }}
  run: snyk test
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Security Best Practices

**✅ DO:**
- Store all sensitive data as secrets
- Use `GITHUB_TOKEN` for GitHub API calls (automatically provided)
- Limit secret access to specific environments
- Rotate secrets regularly
- Use organization secrets for shared values

**❌ DON'T:**
- Never hardcode API keys, tokens, or credentials
- Don't log secret values (GitHub redacts them, but be careful)
- Don't use secrets in pull requests from forks (they're not available)
- Don't store non-sensitive config as secrets (use variables instead)

### Environment-Specific Secrets

```yaml
# Use different secrets per environment
deploy:
  runs-on: ubuntu-22.04
  environment: production  # Links to GitHub Environment
  steps:
    - name: Deploy
      run: deploy.sh
      env:
        API_KEY: ${{ secrets.PROD_API_KEY }}
        
# Staging environment
deploy-staging:
  runs-on: ubuntu-22.04
  environment: staging
  steps:
    - name: Deploy
      run: deploy.sh
      env:
        API_KEY: ${{ secrets.STAGING_API_KEY }}
```

---

## Complete Workflow Example

### Full CI/CD Pipeline with Testing & Deployment

This is the complete workflow used in the TraceRight Platform:

```yaml
name: Automated Development Workflow

on:
  push:
    branches-ignore:
      - main
  pull_request:
    branches:
      - main
      - staging
      - dev
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

jobs:
  # Environment detection
  setup:
    name: Setup & Environment Detection
    runs-on: ubuntu-22.04
    outputs:
      environment: ${{ steps.env-setup.outputs.environment }}
      affected-areas: ${{ steps.detect-changes.outputs.affected-areas }}
      run-tests: ${{ steps.detect-changes.outputs.run-tests }}
      run-build: ${{ steps.detect-changes.outputs.run-build }}
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup environment variables
        id: env-setup
        uses: simenandre/setup-variables@v2
        with:
          key: ${{ github.ref_name }}
          map: |
            main: production
            staging: staging
            dev: development
            '*': development

      - name: Detect changed files
        id: detect-changes
        run: |
          # Smart detection logic
          CHANGED_FILES=$(git diff --name-only HEAD~1 HEAD)
          # ... detection logic ...
          echo "run-tests=true" >> $GITHUB_OUTPUT

      - name: Store variables
        uses: UnlyEd/github-action-store-variable@v3
        with:
          variables: |
            ENVIRONMENT=${{ steps.env-setup.outputs.environment }}

  # Linting
  lint:
    name: Lint & Format Check
    runs-on: ubuntu-22.04
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - uses: UnlyEd/github-action-store-variable@v3
        with:
          variables: |
            NODE_VERSION
            PNPM_VERSION
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm exec tsc --noEmit

  # Testing with coverage
  test-unit:
    name: Unit Tests
    runs-on: ubuntu-22.04
    needs: setup
    steps:
      - uses: actions/checkout@v4
      
      - uses: UnlyEd/github-action-store-variable@v3
        with:
          variables: NODE_VERSION PNPM_VERSION
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:coverage
      
      # Upload to Codecov (uses secret)
      - uses: codecov/codecov-action@v3
        if: always()
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/coverage-final.json

  # Integration tests with database
  test-integration:
    name: Integration Tests
    runs-on: ubuntu-22.04
    needs: [setup, test-unit]
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: traceright_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm db:migrate
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/traceright_test
      - run: pnpm test:integration

  # Build
  build:
    name: Build Application
    runs-on: ubuntu-22.04
    needs: setup
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - uses: actions/upload-artifact@v3
        with:
          name: build-${{ github.sha }}
          path: dist/
          retention-days: 7

  # Security scanning
  security-scan:
    name: Security Audit
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm audit --audit-level moderate
        continue-on-error: true
      
      # Only run Snyk if token is available
      - uses: snyk/actions/node@master
        if: ${{ secrets.SNYK_TOKEN != '' }}
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  # Deploy to Firebase
  deploy:
    name: Deploy to Firebase
    runs-on: ubuntu-22.04
    needs: [setup, lint, test-unit, test-integration, build]
    if: |
      github.event_name == 'push' &&
      (github.ref == 'refs/heads/main' || github.ref == 'refs/heads/staging')
    environment:
      name: ${{ needs.setup.outputs.environment }}
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v3
        with:
          name: build-${{ github.sha }}
      
      # Use Firebase action with secrets
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: ${{ secrets.FIREBASE_PROJECT_ID }}
          channelId: live
```

### Workflow Features

**Intelligent Change Detection:**
- Only runs relevant jobs based on changed files
- Detects frontend, backend, or function changes

**Multi-Stage Testing:**
- Linting and type checking
- Unit tests with coverage
- Integration tests with PostgreSQL
- Security scanning

**Safe Secret Handling:**
- Uses GitHub secrets for all sensitive data
- Conditional execution when secrets are available
- Automatic redaction in logs

**Automated Deployment:**
- Deploys to Firebase on main/staging branches
- Environment-specific configuration
- Build artifact caching

---

## Common Patterns

### Environment Selection

```yaml
env:
  ENVIRONMENT: ${{ steps.stack.outputs.value }}
  
- name: Deploy
  run: |
    echo "Deploying to $ENVIRONMENT"
    # Your deployment logic here
```

### Multiple Variable Storage

```yaml
- uses: UnlyEd/github-action-store-variable@v3
  with:
    variables: |
      VAR_ONE=${{ env.VAR_ONE }}
      VAR_TWO=${{ env.VAR_TWO }}
      VAR_THREE=${{ env.VAR_THREE }}
```

### Multiple Variable Retrieval

```yaml
- uses: UnlyEd/github-action-store-variable@v3
  with:
    variables: |
      VAR_ONE
      VAR_TWO
      VAR_THREE
```
