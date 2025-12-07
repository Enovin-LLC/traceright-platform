# 🔐 Secrets Management Guide

## Quick Setup

Run the automated setup script:

```bash
./scripts/setup-secrets.sh
```

This will guide you through setting up all required secrets.

---

## Manual Setup

### Required Secrets

#### 1. FIREBASE_SERVICE_ACCOUNT

Your Firebase service account JSON (from `vertex-key.json`):

```bash
gh secret set FIREBASE_SERVICE_ACCOUNT < vertex-key.json
```

#### 2. FIREBASE_PROJECT_ID

Your Firebase project ID:

```bash
echo "alldoing" | gh secret set FIREBASE_PROJECT_ID
```

### Optional Secrets

#### CODECOV_TOKEN (for code coverage tracking)

Get from: https://codecov.io

```bash
gh secret set CODECOV_TOKEN
# Paste your token when prompted
```

#### SNYK_TOKEN (for security scanning)

Get from: https://app.snyk.io/account

```bash
gh secret set SNYK_TOKEN
# Paste your token when prompted
```

---

## GitHub UI Method

1. Go to: https://github.com/Enovin-LLC/traceright-platform/settings/secrets/actions
2. Click **New repository secret**
3. Enter name and value
4. Click **Add secret**

---

## Verify Secrets

```bash
# List all secrets (values are hidden)
gh secret list

# Test by running a workflow
gh workflow run "Automated Development Workflow"

# Check the run
gh run list
gh run view <run-id>
```

---

## Security Notes

⚠️ **NEVER commit secrets to the repository!**

The following files should remain in `.gitignore`:
- `vertex-key.json` (Firebase service account)
- `.env.local` (local environment variables)
- Any file containing API keys or tokens

**What's Already Secured:**
- ✅ Fixed `firebase-deploy.yml` to use secrets properly
- ✅ Updated `automated-development-workflow.yml` to use secrets
- ✅ Created automated setup script

**What You Should Do:**
1. Run `./scripts/setup-secrets.sh` to set up secrets
2. Verify no secrets are in committed files:
   ```bash
   git grep -i "private_key\|api_key\|token\|secret" -- ':!*.md' ':!scripts/setup-secrets.sh'
   ```
3. If you find any exposed secrets, rotate them immediately!

---

## Rotating Secrets

If a secret is compromised:

```bash
# 1. Generate new credentials
# (e.g., create new Firebase service account)

# 2. Update the secret
gh secret set FIREBASE_SERVICE_ACCOUNT < new-vertex-key.json

# 3. Verify it works
gh workflow run "Automated Development Workflow"

# 4. Revoke old credentials
# (e.g., delete old Firebase service account)
```

---

## Environment-Specific Secrets

For production vs staging environments:

```bash
# Option 1: Use GitHub Environments
# Set secrets at: Settings → Environments → [environment-name] → Secrets

# Option 2: Use different secret names
gh secret set FIREBASE_SERVICE_ACCOUNT_PROD < prod-key.json
gh secret set FIREBASE_SERVICE_ACCOUNT_STAGING < staging-key.json
```

Then in your workflow:

```yaml
- uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    firebaseServiceAccount: ${{ 
      env.ENVIRONMENT == 'production' 
        && secrets.FIREBASE_SERVICE_ACCOUNT_PROD 
        || secrets.FIREBASE_SERVICE_ACCOUNT_STAGING 
    }}
```

---

## Troubleshooting

### Secret not found error

```bash
# Check if secret exists
gh secret list

# Set it if missing
gh secret set SECRET_NAME
```

### Workflow can't access secret

- Secrets are NOT available in workflows triggered by forks
- Check if the workflow is running from the correct branch
- Verify the secret name matches exactly (case-sensitive)

### Need to view secret value

You cannot view secret values through GitHub. If you've lost a secret:

1. Generate new credentials
2. Update the secret
3. Test the workflow

---

## GITHUB_TOKEN

The `GITHUB_TOKEN` is automatically provided by GitHub Actions. You don't need to set it up.

It has permissions to:
- Read repository contents
- Create pull request comments
- Update check runs
- Upload artifacts

Use it like:

```yaml
- name: Comment on PR
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
  run: gh pr comment $PR_NUMBER --body "Build successful!"
```
