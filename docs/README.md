# Documentation Index

## Getting Started

1. **[Complete Development Workflow](./complete-development-workflow.md)** - Start here for the full development process
2. **[Secrets Management](./secrets-management.md)** - Set up GitHub secrets (required for CI/CD)

## Reference Guides

- **[GitKraken CLI Reference](./gitkraken-cli-reference.md)** - Commands and workflows for GitKraken CLI
- **[GitHub Actions Reference](./github-actions-reference.md)** - Workflow patterns and examples
- **[Package Scripts](../package.json.scripts.md)** - Available npm/pnpm scripts

## Quick Links

### Setup

```bash
# 1. Install GitKraken CLI
brew install gitkraken-cli

# 2. Authenticate
gk auth login

# 3. Setup GitHub secrets
./scripts/setup-secrets.sh
```

### Daily Workflow

```bash
# Create work item
gk work create "Feature: Your feature name"

# Make changes, then commit with AI
gk work commit --ai

# Push and create PR
gk work push
gk work pr create --ai
```

### Testing & Validation

```bash
# Run tests
pnpm test

# Type check
pnpm type-check

# Lint
pnpm lint

# Full validation
pnpm validate
```

### Monitoring CI/CD

```bash
# Watch workflow runs
gh run list
gh run watch

# View specific run
gh run view <run-id>
```

## Workflows

The project uses two main GitHub Actions workflows:

1. **Automated Development Workflow** (`.github/workflows/automated-development-workflow.yml`)
   - Runs on all branches except main
   - Tests, linting, security scanning
   - Deploys on main/staging

2. **Firebase Deploy** (`.github/workflows/firebase-deploy.yml`)
   - Simple deployment to Firebase
   - Runs on main branch

## Architecture

```
traceright-platform/
├── client/              # Frontend (Vite + React + TypeScript)
├── server/              # Backend API
├── functions/           # Firebase Functions
├── drizzle/            # Database schema & migrations
├── .github/workflows/  # CI/CD workflows
├── scripts/            # Automation scripts
└── docs/               # Documentation (you are here)
```

## Key Technologies

- **GitKraken CLI** - Git workflow automation with AI
- **GitHub Actions** - CI/CD pipeline
- **Vitest** - Testing framework
- **pnpm** - Package manager
- **Firebase** - Hosting & functions
- **Drizzle ORM** - Database
- **Vite** - Build tool
- **TypeScript** - Type safety

## Support

### Troubleshooting

See individual documentation files for troubleshooting sections:
- [Workflow Troubleshooting](./complete-development-workflow.md#troubleshooting)
- [Secrets Troubleshooting](./secrets-management.md#troubleshooting)

### Common Issues

**Tests failing in CI but passing locally:**
```bash
# Match CI environment
NODE_ENV=test pnpm test
```

**GitKraken CLI not working:**
```bash
# Re-authenticate
gk auth logout
gk auth login
```

**Secrets not working:**
```bash
# Verify secrets are set
gh secret list

# Re-run setup
./scripts/setup-secrets.sh
```

## Contributing

1. Create a work item: `gk work create "Type: Description"`
2. Make your changes
3. Run tests: `pnpm test`
4. Commit with AI: `gk work commit --ai`
5. Create PR: `gk work pr create --ai`
6. CI will automatically run all checks

## Best Practices

✅ **DO:**
- Use GitKraken CLI for AI-assisted commits
- Write tests for new features
- Run `pnpm validate` before pushing
- Keep commits focused and atomic
- Use semantic branch names

❌ **DON'T:**
- Commit secrets or API keys
- Skip tests
- Push directly to main
- Create massive PRs with unrelated changes
