#!/bin/bash
# GitHub Pages Deployment Script
# This script helps deploy to GitHub Pages with proper authentication

echo "🚀 GitHub Pages Deployment Script"
echo "=================================="
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "📦 Building the project first..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed. Please fix errors and try again."
        exit 1
    fi
    echo "✅ Build successful!"
    echo ""
fi

# Check authentication method
echo "Checking authentication..."
echo ""

# Test SSH connection
if ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"; then
    echo "✅ SSH authentication is working!"
    echo "Switching to SSH remote..."
    git remote remove origin 2>/dev/null
    git remote add origin git@github.com:mlohr/powerOne.git
    echo ""
    echo "Deploying..."
    npm run deploy
    exit_code=$?

elif [ ! -z "$GITHUB_TOKEN" ]; then
    echo "✅ GitHub token found in environment!"
    echo "Deploying..."
    npm run deploy
    exit_code=$?

else
    echo "⚠️  No authentication configured"
    echo ""
    echo "Please choose an authentication method:"
    echo ""
    echo "Option 1 - SSH Key (Recommended):"
    echo "  1. Add SSH key to agent: ssh-add ~/.ssh/id_rsa"
    echo "  2. Add to GitHub: https://github.com/settings/keys"
    echo "  3. Run this script again"
    echo ""
    echo "Option 2 - Personal Access Token:"
    echo "  1. Create token: https://github.com/settings/tokens/new (with 'repo' scope)"
    echo "  2. Run: export GITHUB_TOKEN=your_token_here"
    echo "  3. Run this script again"
    echo ""
    echo "Option 3 - Manual deploy:"
    echo "  See DEPLOY-GITHUB-PAGES.md for manual deployment instructions"
    echo ""
    exit 1
fi

if [ $exit_code -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "Next steps:"
    echo "  1. Go to: https://github.com/mlohr/powerOne/settings/pages"
    echo "  2. Set Source to: Branch: gh-pages, Folder: / (root)"
    echo "  3. Save and wait 1-2 minutes"
    echo ""
    echo "Your site will be live at:"
    echo "  👉 https://mlohr.github.io/powerOne/"
    echo ""
else
    echo ""
    echo "❌ Deployment failed"
    echo "See DEPLOY-GITHUB-PAGES.md for troubleshooting"
    echo ""
    exit 1
fi
