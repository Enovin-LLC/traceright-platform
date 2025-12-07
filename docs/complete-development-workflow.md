# Complete Development Workflow Guide

This guide covers the end-to-end development workflow combining GitKraken CLI, GitHub Actions, testing, and automation.

## 🎯 Table of Contents

- [Overview](#overview)
- [Local Development Workflow](#local-development-workflow)
- [GitKraken CLI Workflow](#gitkraken-cli-workflow)
- [Automated CI/CD Pipeline](#automated-cicd-pipeline)
- [Testing Strategy](#testing-strategy)
- [Best Practices](#best-practices)

---

## Overview

This workflow integrates:
- **GitKraken CLI** for local git operations and work management
- **GitHub Actions** for automated testing, building, and deployment
- **Vitest** for unit and integration testing
- **TypeScript** for type safety
- **pnpm** for dependency management

---

## Local Development Workflow

### 1. Initial Setup

```bash
# Authenticate with GitKraken
gk auth login

# Navigate to your project
cd /Users/coryn.cates/Documents/GitHub/Enovin-LLC/traceright-platform-1

# Create a new work item for your feature
gk work create "Add user authentication feature"
```

### 2. Development Cycle

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Run type checking
pnpm type-check
```

### 3. Pre-Commit Checks

Before committing, ensure quality:

```bash
# Run all tests
pnpm test

# Run linting
pnpm lint

# Check types
pnpm exec tsc --noEmit

# Format code
pnpm format

# Run full validation
pnpm validate  # If you have this script
```

### 4. Commit & Push with GitKraken CLI

```bash
# Let AI generate a commit message based on your changes
gk work commit --ai

# Push changes
gk work push

# Create a pull request with AI-generated description
gk work pr create --ai
```

---

## GitKraken CLI Workflow

### Feature Development Workflow

```bash
# 1. Start new feature work
gk work create "Feature: Add data export functionality"

# 2. Add multiple repos if working across services
gk work add ./client
gk work add ./server
gk work add ./functions

# 3. Make your changes across repos
# ... edit files ...

# 4. Check status across all repos in work item
gk status

# 5. Stage and commit with AI assistance
gk work commit --ai

# 6. Push all repos
gk work push

# 7. Create PRs for all affected repos
gk work pr create --ai

# 8. View work items
gk work list
```

### Bug Fix Workflow

```bash
# 1. Link to an existing issue
gk work create "Fix: Database connection timeout" --issue 123

# 2. Navigate to the problematic area
cd server

# 3. Make fixes and add tests
# ... edit server/db.ts ...
# ... edit server/db.test.ts ...

# 4. Run tests
pnpm test server/db.test.ts

# 5. Commit with context
gk work commit --ai

# 6. Push and create PR
gk work push
gk work pr create --ai --draft  # Create as draft initially
```

### Multi-Repo Workflow

```bash
# Working across client and server simultaneously
gk work create "Feature: Real-time notifications"

# Add both repos
gk work add ./client
gk work add ./server

# Make changes in client
cd client/src/components
# ... create NotificationBell.tsx ...

# Make changes in server
cd ../../../server
# ... create notification router ...

# Commit both repos atomically
gk work commit --ai

# Create coordinated PRs
gk work pr create --ai
```

---

## Automated CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/automated-development-workflow.yml`) runs automatically on:
- Push to any branch (except main)
- Pull requests to main, staging, or dev
- Manual trigger via workflow_dispatch

### Pipeline Stages

#### 1. Setup & Environment Detection
- Detects target environment based on branch
- Identifies affected code areas (frontend, backend, functions)
- Determines which jobs to run

#### 2. Code Quality & Linting
- ESLint checks
- TypeScript compilation
- Prettier formatting validation

#### 3. Testing Suite
- **Unit Tests**: Fast, isolated tests
- **Integration Tests**: Database and API tests with PostgreSQL
- **Coverage Reports**: Uploaded to Codecov

#### 4. Build & Validation
- Production build
- Build verification script
- Artifact upload for deployment

#### 5. Security Scanning
- pnpm audit for dependency vulnerabilities
- Snyk security analysis

#### 6. Performance Analysis
- Bundle size tracking
- Performance regression detection

#### 7. Summary & Reporting
- Consolidated test results
- GitHub Step Summary
- Failure detection and reporting

#### 8. Deployment
- Automatic deployment to Firebase (main/staging only)
- Environment-specific configuration

---

## Testing Strategy

### Unit Tests

```bash
# Run all unit tests
pnpm test

# Run specific test file
pnpm test path/to/test.test.ts

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Integration Tests

```bash
# Run integration tests
pnpm test:integration

# With database
pnpm db:test:setup    # Setup test database
pnpm test:integration
```

### Test Structure

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './utils';

describe('calculateTotal', () => {
  it('should sum numbers correctly', () => {
    expect(calculateTotal([1, 2, 3])).toBe(6);
  });

  it('should handle empty array', () => {
    expect(calculateTotal([])).toBe(0);
  });
});
```

```typescript
// Example integration test
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../server/db';

describe('User API Integration', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should create and retrieve user', async () => {
    const user = await createUser({ email: 'test@example.com' });
    const retrieved = await getUser(user.id);
    expect(retrieved.email).toBe('test@example.com');
  });
});
```

---

## Best Practices

### 1. Commit Practices

```bash
# ✅ Good: Small, focused commits with AI assistance
gk work commit --ai

# ✅ Good: Atomic commits per logical change
git add client/src/components/Button.tsx client/src/components/Button.test.tsx
gk work commit --ai

# ❌ Bad: Massive commits with unrelated changes
git add .
git commit -m "fixes"
```

### 2. Branch Naming

```bash
# Features
git checkout -b feature/user-authentication
git checkout -b feature/data-export

# Bug fixes
git checkout -b fix/database-timeout
git checkout -b fix/login-error

# Improvements
git checkout -b improve/performance-optimization
git checkout -b improve/ui-polish
```

### 3. Pull Request Workflow

```bash
# Create draft PR for early feedback
gk work pr create --ai --draft

# Add reviewers and labels via GitHub CLI
gh pr edit --add-reviewer @teammate --add-label "frontend"

# Mark ready for review
gh pr ready

# Auto-merge when approved (if tests pass)
gh pr merge --auto --squash
```

### 4. Testing Best Practices

- **Write tests first** (TDD approach when possible)
- **Test behavior, not implementation**
- **Keep tests fast** - unit tests should be < 100ms
- **Mock external dependencies** in unit tests
- **Use real database** for integration tests
- **Aim for 80%+ coverage** on critical paths

### 5. Pre-Push Checklist

```bash
# Automated pre-push validation script
#!/bin/bash
set -e

echo "🔍 Running pre-push checks..."

echo "📝 Type checking..."
pnpm exec tsc --noEmit

echo "🧪 Running tests..."
pnpm test

echo "🎨 Checking formatting..."
pnpm exec prettier --check "**/*.{ts,tsx,js,jsx}"

echo "🔧 Linting..."
pnpm lint

echo "✅ All checks passed! Safe to push."
```

### 6. Working with Multiple Repos

```bash
# Create workspace for related repos
gk workspace create "TraceRight Platform"
gk workspace add-repo ./traceright-platform-1
gk workspace add-repo ./traceright-api
gk workspace add-repo ./traceright-mobile

# Work across workspace
gk work create "Feature: Cross-platform sync"
gk work add --workspace "TraceRight Platform"
```

---

## Complete Example: Feature Development

Let's walk through developing a complete feature:

### Scenario: Add Export to CSV Feature

```bash
# 1. Create work item
gk work create "Feature: Export data to CSV"

# 2. Create feature branch
git checkout -b feature/csv-export

# 3. Start development server
pnpm dev &

# 4. Create the export utility (TDD approach)
# First, write the test
cat > server/csvExport.test.ts << 'EOF'
import { describe, it, expect } from 'vitest';
import { exportToCSV } from './csvExport';

describe('exportToCSV', () => {
  it('should convert array of objects to CSV', () => {
    const data = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 }
    ];
    const csv = exportToCSV(data);
    expect(csv).toContain('name,age');
    expect(csv).toContain('John,30');
    expect(csv).toContain('Jane,25');
  });
});
EOF

# 5. Run test (it should fail)
pnpm test server/csvExport.test.ts

# 6. Implement the feature
cat > server/csvExport.ts << 'EOF'
export function exportToCSV(data: Record<string, any>[]): string {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const rows = data.map(row => 
    headers.map(header => row[header]).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}
EOF

# 7. Run test again (should pass)
pnpm test server/csvExport.test.ts

# 8. Add UI component
# ... create client/src/components/ExportButton.tsx ...

# 9. Add component test
# ... create client/src/components/ExportButton.test.tsx ...

# 10. Run all tests
pnpm test

# 11. Check types
pnpm exec tsc --noEmit

# 12. Commit with AI
gk work commit --ai

# 13. Push
gk work push

# 14. Create PR
gk work pr create --ai

# 15. Monitor CI/CD pipeline
gh pr checks --watch

# 16. Once approved and CI passes, merge
gh pr merge --auto --squash
```

---

## Troubleshooting

### Tests Failing in CI but Passing Locally

```bash
# Ensure you're using the same Node version
node --version  # Should match NODE_VERSION in workflow

# Clear caches
pnpm store prune
rm -rf node_modules
pnpm install --frozen-lockfile

# Run tests with same env as CI
NODE_ENV=test pnpm test
```

### Build Failing

```bash
# Check build locally
pnpm build

# Verify build output
node scripts/verify-build.js

# Check environment variables
cat .env.example  # Make sure all required vars are set
```

### GitKraken CLI Issues

```bash
# Re-authenticate
gk auth logout
gk auth login

# Check configuration
gk setup

# View help
gk work --help
```

---

## Advanced Workflows

### Parallel Development on Multiple Features

```bash
# Feature 1: Authentication
gk work create "Auth: Add OAuth support"
git checkout -b feature/oauth
# ... work on auth ...
gk work commit --ai
gk work push

# Switch to Feature 2: Export
gk work create "Export: Add PDF export"
git checkout -b feature/pdf-export
# ... work on export ...
gk work commit --ai
gk work push

# List all your active work items
gk work list
```

### Hotfix Workflow

```bash
# Critical bug in production
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Make minimal fix
# ... edit files ...

# Test thoroughly
pnpm test
pnpm build

# Fast-track commit and PR
gk work create "Hotfix: Security vulnerability patch"
gk work commit --ai
gk work push
gk work pr create --ai --label "hotfix" --label "security"

# Request immediate review
gh pr edit --add-reviewer @security-team

# Monitor CI
gh pr checks --watch

# Merge immediately when approved
gh pr merge --admin --squash
```

---

## Monitoring & Analytics

### View Workflow Runs

```bash
# List recent workflow runs
gh run list

# View specific run
gh run view <run-id>

# Watch current run
gh run watch

# Download logs
gh run download <run-id>
```

### Test Coverage Tracking

```bash
# Generate coverage report
pnpm test:coverage

# View coverage in browser
open coverage/index.html

# Track coverage over time
# Coverage is automatically uploaded to Codecov in CI
```

---

## Summary

This workflow provides:

✅ **Automated Testing** - Every push triggers comprehensive tests

✅ **Smart Environment Detection** - Automatic environment configuration

✅ **AI-Assisted Commits & PRs** - GitKraken CLI generates meaningful messages

✅ **Multi-Repo Support** - Work across client, server, functions simultaneously

✅ **Security Scanning** - Automatic vulnerability detection

✅ **Performance Monitoring** - Bundle size tracking

✅ **Automatic Deployment** - Push to main/staging triggers deployment

✅ **Comprehensive Reporting** - GitHub Step Summaries for every run

✅ **Secure Secrets Management** - All sensitive data properly encrypted

By following this workflow, you maintain high code quality, rapid iteration, and safe deployments.

---

## Quick Start

### 1. Setup Secrets

```bash
# Automated setup
./scripts/setup-secrets.sh

# Or manually
gh secret set FIREBASE_SERVICE_ACCOUNT < vertex-key.json
gh secret set FIREBASE_PROJECT_ID --body "alldoing"
```

### 2. Start Developing

```bash
# Authenticate with GitKraken
gk auth login

# Create work item
gk work create "Feature: Add notifications"

# Make changes...

# Commit with AI
gk work commit --ai

# Create PR with AI
gk work pr create --ai
```

### 3. Let CI/CD Handle the Rest

The automated workflow will:
- Run all tests
- Check code quality
- Scan for security issues
- Build the application
- Deploy to Firebase (if on main/staging)

Monitor progress:

```bash
gh run list
gh run watch
```

---

## Related Documentation

- [GitHub Actions Reference](./github-actions-reference.md) - Detailed workflow syntax and patterns
- [GitKraken CLI Reference](./gitkraken-cli-reference.md) - CLI commands and workflows
- [Secrets Management](./secrets-management.md) - How to securely manage secrets
- [Package Scripts](../package.json.scripts.md) - Available npm/pnpm scripts
