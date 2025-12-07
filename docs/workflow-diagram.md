# Complete Automation Workflow Diagram

## Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRACERIGHT PLATFORM                          │
│              Complete Development Workflow                       │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ GitKraken CLI│──────│GitHub Actions│──────│  Firebase    │
│  (Local Dev) │      │   (CI/CD)    │      │  (Deploy)    │
└──────────────┘      └──────────────┘      └──────────────┘
```

## Detailed Flow

### 1. Local Development (GitKraken CLI)

```
┌─────────────────────────────────────────────────────────┐
│ DEVELOPER WORKSTATION                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. gk auth login                                       │
│     └─> Authenticate with GitKraken                     │
│                                                         │
│  2. gk work create "Feature: Add notifications"         │
│     └─> Create work item                                │
│     └─> Automatically adds current directory            │
│                                                         │
│  3. Development Loop:                                   │
│     ┌───────────────────────────────────┐              │
│     │ Edit files                        │              │
│     │ pnpm test:watch                   │              │
│     │ pnpm dev                          │              │
│     └───────────────────────────────────┘              │
│                                                         │
│  4. gk work commit --ai                                 │
│     └─> AI generates commit message                     │
│     └─> Commits to all repos in work item              │
│                                                         │
│  5. gk work push                                        │
│     └─> Pushes all repos                                │
│                                                         │
│  6. gk work pr create --ai                              │
│     └─> AI generates PR title & description             │
│     └─> Creates pull request                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │  PUSH TO GITHUB           │
        └───────────────────────────┘
```

### 2. GitHub Actions Pipeline (Automated)

```
┌─────────────────────────────────────────────────────────────┐
│ GITHUB ACTIONS WORKFLOW                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ╔══════════════════════════════════════════════════════╗  │
│  ║ JOB 1: Setup & Environment Detection                 ║  │
│  ╚══════════════════════════════════════════════════════╝  │
│    │                                                        │
│    ├─> Checkout code                                       │
│    ├─> Detect branch → environment mapping                 │
│    │   • main → production                                 │
│    │   • staging → staging                                 │
│    │   • dev → development                                 │
│    │   • * → development                                   │
│    │                                                        │
│    ├─> Detect changed files                                │
│    │   • client/* → run frontend tests                     │
│    │   • server/* → run backend tests                      │
│    │   • functions/* → run function tests                  │
│    │                                                        │
│    └─> Store environment variables (for next jobs)         │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ PARALLEL EXECUTION                                 │   │
│  ├────────────────────────────────────────────────────┤   │
│  │                                                    │   │
│  │  ╔══════════════════════════════════════════════╗ │   │
│  │  ║ JOB 2: Lint & Type Check                    ║ │   │
│  │  ╚══════════════════════════════════════════════╝ │   │
│  │    ├─> Setup Node.js + pnpm                       │   │
│  │    ├─> Install dependencies                       │   │
│  │    ├─> Run ESLint                                 │   │
│  │    ├─> Run TypeScript check                       │   │
│  │    └─> Check Prettier formatting                  │   │
│  │                                                    │   │
│  │  ╔══════════════════════════════════════════════╗ │   │
│  │  ║ JOB 3: Unit Tests                           ║ │   │
│  │  ╚══════════════════════════════════════════════╝ │   │
│  │    ├─> Setup Node.js + pnpm                       │   │
│  │    ├─> Install dependencies                       │   │
│  │    ├─> Run tests with coverage                    │   │
│  │    └─> Upload to Codecov                          │   │
│  │        (uses secrets.CODECOV_TOKEN)               │   │
│  │                                                    │   │
│  │  ╔══════════════════════════════════════════════╗ │   │
│  │  ║ JOB 4: Security Scan                        ║ │   │
│  │  ╚══════════════════════════════════════════════╝ │   │
│  │    ├─> pnpm audit                                 │   │
│  │    └─> Snyk scan (if token available)            │   │
│  │        (uses secrets.SNYK_TOKEN)                  │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                        │                                   │
│                        ▼                                   │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║ JOB 5: Integration Tests (needs: unit tests)        ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│    │                                                       │
│    ├─> Start PostgreSQL service                           │
│    ├─> Run database migrations                            │
│    └─> Run integration tests                              │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║ JOB 6: Build                                         ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│    │                                                       │
│    ├─> Build application (pnpm build)                     │
│    ├─> Verify build output                                │
│    └─> Upload build artifacts                             │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║ JOB 7: Test Summary                                  ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│    │                                                       │
│    ├─> Collect all test results                           │
│    ├─> Generate GitHub Step Summary                       │
│    └─> Fail if any critical test failed                   │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗ │
│  ║ JOB 8: Deploy (only main/staging, if tests pass)    ║ │
│  ╚══════════════════════════════════════════════════════╝ │
│    │                                                       │
│    ├─> Download build artifacts                           │
│    ├─> Deploy to Firebase                                 │
│    │   (uses secrets.FIREBASE_SERVICE_ACCOUNT)            │
│    │   (uses secrets.FIREBASE_PROJECT_ID)                 │
│    │                                                       │
│    └─> Create deployment summary                          │
│                                                            │
└─────────────────────────────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────┐
        │  DEPLOYED TO FIREBASE     │
        └───────────────────────────┘
```

### 3. Secrets Flow

```
┌─────────────────────────────────────────────────────────┐
│ SECRETS MANAGEMENT                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Local Machine:                                         │
│  ┌──────────────────────────────────────────┐          │
│  │ vertex-key.json (NEVER commit!)          │          │
│  │ .env.local (NEVER commit!)               │          │
│  └──────────────────────────────────────────┘          │
│                │                                        │
│                ▼                                        │
│  Setup Script: ./scripts/setup-secrets.sh              │
│                │                                        │
│                ▼                                        │
│  GitHub Secrets (Encrypted):                           │
│  ┌──────────────────────────────────────────┐          │
│  │ ✓ FIREBASE_SERVICE_ACCOUNT               │          │
│  │ ✓ FIREBASE_PROJECT_ID                    │          │
│  │ ✓ CODECOV_TOKEN (optional)               │          │
│  │ ✓ SNYK_TOKEN (optional)                  │          │
│  │ ✓ GITHUB_TOKEN (auto-provided)           │          │
│  └──────────────────────────────────────────┘          │
│                │                                        │
│                ▼                                        │
│  GitHub Actions Workflow:                              │
│  ┌──────────────────────────────────────────┐          │
│  │ Uses ${{ secrets.FIREBASE_SERVICE_ACCOUNT }} │      │
│  │ Values never exposed in logs             │          │
│  └──────────────────────────────────────────┘          │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 4. Complete Feature Development Timeline

```
Day 1: Start Feature
─────────────────────
09:00 │ gk work create "Feature: User notifications"
09:05 │ Created branch: feature/user-notifications
      │
10:00 │ Writing code...
      │ • client/src/components/NotificationBell.tsx
      │ • server/routers/notifications.ts
      │
12:00 │ pnpm test:watch (running in background)
      │ Tests passing ✓
      │
16:00 │ gk work commit --ai
      │ AI: "feat: add notification bell component with API integration"
      │
16:05 │ gk work push
      │ Pushed to GitHub
      │
16:10 │ gk work pr create --ai
      │ AI: Generated PR description with:
      │   - Feature overview
      │   - Changes made
      │   - Testing done
      │
16:15 │ GitHub Actions triggered
      │ ├─> Linting... ✓
      │ ├─> Unit tests... ✓
      │ ├─> Integration tests... ✓
      │ ├─> Security scan... ✓
      │ └─> Build... ✓
      │
16:30 │ All checks passed ✓
      │ Ready for review
      │
─────────────────────

Day 2: Code Review & Deploy
────────────────────────────
10:00 │ Reviewer approved PR
      │
10:05 │ gh pr merge --auto --squash
      │ Waiting for final CI checks...
      │
10:10 │ Merged to main
      │
10:15 │ GitHub Actions triggered (main branch)
      │ ├─> All tests... ✓
      │ ├─> Build... ✓
      │ └─> Deploy to Firebase... ✓
      │
10:20 │ 🚀 DEPLOYED TO PRODUCTION
      │ https://traceright.app
      │
─────────────────────────────
```

## Command Quick Reference

### Daily Commands

```bash
# Start work
gk work create "Type: Description"

# During development
pnpm dev              # Start dev server
pnpm test:watch       # Run tests in watch mode

# Before committing
pnpm validate         # Run all checks

# Commit and push
gk work commit --ai   # AI commit message
gk work push          # Push changes

# Create PR
gk work pr create --ai  # AI PR description

# Monitor CI
gh run watch          # Watch current run
gh pr checks          # Check PR status
```

### Setup Commands (One-time)

```bash
# Install tools
brew install gitkraken-cli

# Authenticate
gk auth login
gh auth login

# Setup secrets
./scripts/setup-secrets.sh

# Verify setup
gh secret list
gk setup
```

## Key Benefits

✅ **AI-Powered**: GitKraken CLI generates commit messages and PR descriptions
✅ **Automated Testing**: Every push runs full test suite
✅ **Smart Detection**: Only runs relevant tests based on changed files
✅ **Secure**: All secrets encrypted and never exposed
✅ **Multi-Repo**: Work across multiple repositories simultaneously
✅ **Fast Feedback**: Parallel job execution for quick results
✅ **Safe Deployment**: Only deploys if all tests pass
✅ **Comprehensive**: Includes linting, testing, security, and deployment

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     LOCAL DEVELOPMENT                       │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  client  │  │  server  │  │functions │  │ drizzle  │  │
│  │ (Vite)   │  │  (API)   │  │(Firebase)│  │  (DB)    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│        │              │              │              │      │
│        └──────────────┴──────────────┴──────────────┘      │
│                       │                                     │
│              GitKraken CLI (gk)                            │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                     GITHUB REPOSITORY                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              GitHub Actions Workflows                │ │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐   │ │
│  │  │  Lint  │  │ Tests  │  │Security│  │ Build  │   │ │
│  │  └────────┘  └────────┘  └────────┘  └────────┘   │ │
│  └──────────────────────────────────────────────────────┘ │
│                       │                                     │
│              GitHub Secrets (Encrypted)                    │
│                       │                                     │
└───────────────────────┼─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE HOSTING                         │
│                                                             │
│  Production:  https://traceright.app                       │
│  Staging:     https://staging.traceright.app               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Documentation Structure

```
docs/
├── README.md                              # Index (start here)
├── complete-development-workflow.md       # Full workflow guide
├── gitkraken-cli-reference.md            # GitKraken CLI commands
├── github-actions-reference.md           # Workflow patterns
├── secrets-management.md                 # Secrets setup
└── workflow-diagram.md                   # This file

scripts/
└── setup-secrets.sh                      # Automated secret setup

.github/workflows/
├── automated-development-workflow.yml    # Main CI/CD pipeline
└── firebase-deploy.yml                   # Simple Firebase deploy
```

---

**Ready to start?**

1. Read [Complete Development Workflow](./complete-development-workflow.md)
2. Setup secrets: `./scripts/setup-secrets.sh`
3. Start coding: `gk work create "Your feature"`
