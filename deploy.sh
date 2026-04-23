#!/bin/bash
# ─── Carter Digitals Dashboard - GitHub + Vercel Deployment Script ───
# Run this script to push to GitHub and deploy to Vercel

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  Carter Digitals Dashboard — Deploy to GitHub + Vercel"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ─── Step 1: GitHub Setup ──────────────────────────────────────────
echo "📡 Step 1: GitHub Setup"
echo "───────────────────────────────────────────────────────────────"

# Check if gh CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo "⚠️  GitHub CLI not authenticated. Let's fix that..."
    echo ""
    echo "Option 1: Paste your GitHub Personal Access Token (PAT)"
    echo "  → Create one at: https://github.com/settings/tokens"
    echo "  → Scopes needed: repo, read:org"
    echo ""
    read -p "Enter your GitHub PAT (or press Enter to use browser login): " GH_TOKEN

    if [ -n "$GH_TOKEN" ]; then
        echo "$GH_TOKEN" | gh auth login --with-token
        echo "✅ Authenticated with token"
    else
        echo "Opening browser login..."
        gh auth login -p https -h github.com -w
    fi
fi

echo ""
read -p "GitHub repo name [carter-digitals-dashboard]: " REPO_NAME
REPO_NAME=${REPO_NAME:-carter-digitals-dashboard}

read -p "GitHub username or org [$(gh api user --jq .login 2>/dev/null || echo 'your-username')]: " GH_USER
GH_USER=${GH_USER:-$(gh api user --jq .login 2>/dev/null)}

FULL_REPO="${GH_USER}/${REPO_NAME}"
echo "Creating repo: ${FULL_REPO}..."

# Create GitHub repo
gh repo create "${FULL_REPO}" \
    --public \
    --description "Carter Digitals — Lead Monitoring & Conversion Dashboard | Built Different. Built African. Built to Win." \
    --source=. \
    --push 2>/dev/null || {
    # If repo already exists, just add remote and push
    echo "Repo might already exist. Adding remote and pushing..."
    git remote remove origin 2>/dev/null || true
    git remote add origin "https://github.com/${FULL_REPO}.git"
    git push -u origin main --force
}

echo ""
echo "✅ GitHub repo created: https://github.com/${FULL_REPO}"

# ─── Step 2: Vercel Deployment ────────────────────────────────────
echo ""
echo "🚀 Step 2: Vercel Deployment"
echo "───────────────────────────────────────────────────────────────"

# Check if Vercel CLI is authenticated
if ! vercel whoami &>/dev/null; then
    echo "⚠️  Vercel CLI not authenticated."
    echo "Opening browser login..."
    vercel login
fi

echo ""
echo "Deploying to Vercel..."
echo "Note: The app uses fallback seed data, so no DATABASE_URL is needed for the demo."
echo ""

# Deploy (non-interactive defaults)
vercel deploy --yes --prod

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  🎉 Deployment Complete!"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "  GitHub:   https://github.com/${FULL_REPO}"
echo "  Vercel:   Check the URL above"
echo ""
echo "  Next steps:"
echo "  1. For persistent data, add a Turso database and set DATABASE_URL"
echo "  2. For AI email generation, ensure z-ai-web-dev-sdk is configured"
echo "═══════════════════════════════════════════════════════════════"
