#!/bin/bash
# Setup GitHub Secrets for TraceRight Platform
# Run this script to configure all required secrets for the workflows

set -e

echo "🔐 GitHub Secrets Setup for TraceRight Platform"
echo "================================================"
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it with: brew install gh"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo "🔑 Not authenticated with GitHub CLI"
    echo "Running: gh auth login"
    gh auth login
fi

echo "✅ GitHub CLI is authenticated"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_file=$2
    local secret_description=$3
    
    echo "📝 Setting up: $secret_name"
    echo "   Description: $secret_description"
    
    if [ -f "$secret_file" ]; then
        gh secret set "$secret_name" < "$secret_file"
        echo "   ✅ Set from file: $secret_file"
    else
        echo "   ⚠️  File not found: $secret_file"
        echo "   Please enter the value manually:"
        gh secret set "$secret_name"
    fi
    
    echo ""
}

# Set Firebase Service Account
echo "🔥 Firebase Configuration"
echo "-------------------------"
set_secret "FIREBASE_SERVICE_ACCOUNT" \
    "vertex-key.json" \
    "Firebase service account JSON for deployment"

# Set Firebase Project ID
echo "Setting Firebase Project ID..."
if [ -f "firebase.json" ]; then
    PROJECT_ID=$(grep -o '"projectId": "[^"]*' firebase.json | cut -d'"' -f4)
    if [ -n "$PROJECT_ID" ]; then
        echo "$PROJECT_ID" | gh secret set FIREBASE_PROJECT_ID
        echo "✅ Set FIREBASE_PROJECT_ID to: $PROJECT_ID"
    else
        echo "⚠️  Could not extract project ID from firebase.json"
        echo "Please enter Firebase Project ID:"
        gh secret set FIREBASE_PROJECT_ID
    fi
else
    echo "Please enter Firebase Project ID:"
    gh secret set FIREBASE_PROJECT_ID
fi
echo ""

# Optional secrets
echo "📦 Optional Secrets (for enhanced features)"
echo "-------------------------------------------"

read -p "Do you want to set up Codecov? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Get your token from: https://codecov.io/gh/Enovin-LLC/traceright-platform"
    echo "Please enter Codecov token:"
    gh secret set CODECOV_TOKEN
fi

read -p "Do you want to set up Snyk security scanning? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Get your token from: https://app.snyk.io/account"
    echo "Please enter Snyk token:"
    gh secret set SNYK_TOKEN
fi

# List all secrets
echo ""
echo "📋 Current Secrets"
echo "------------------"
gh secret list

echo ""
echo "✅ Secret setup complete!"
echo ""
echo "Note: Secret values are encrypted and never visible."
echo "To update a secret, run this script again or use:"
echo "  gh secret set SECRET_NAME"
echo ""
echo "To verify secrets are working, push a commit and check:"
echo "  gh run list"
echo "  gh run view <run-id>"
