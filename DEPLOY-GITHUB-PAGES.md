# Deploying to GitHub Pages

Your repository is set up at: https://github.com/mlohr/powerOne

## Authentication Required

To deploy, you need to authenticate with GitHub. Choose **one** of these methods:

---

## Option 1: GitHub Personal Access Token (Recommended)

### Create a token:
1. Go to: https://github.com/settings/tokens/new
2. Set:
   - Note: "Deploy powerOne"
   - Expiration: 90 days (or your preference)
   - Scopes: Select `repo` (full control of private repositories)
3. Click "Generate token"
4. **Copy the token immediately** (you won't see it again)

### Deploy with the token:
```bash
# Set the token as an environment variable (replace YOUR_TOKEN with actual token)
export GITHUB_TOKEN=YOUR_TOKEN

# Deploy
npm run deploy
```

**Or** configure git to use the token:
```bash
git remote remove origin
git remote add origin https://YOUR_TOKEN@github.com/mlohr/powerOne.git
npm run deploy
```

---

## Option 2: SSH Key Authentication

### Add your SSH key to GitHub:
1. Copy your public key:
   ```bash
   cat ~/.ssh/id_rsa.pub
   ```
2. Go to: https://github.com/settings/keys
3. Click "New SSH key"
4. Paste your public key
5. Click "Add SSH key"

### Deploy with SSH:
```bash
# Switch to SSH remote
git remote remove origin
git remote add origin git@github.com:mlohr/powerOne.git

# Add your SSH key to the agent (enter passphrase when prompted)
ssh-add ~/.ssh/id_rsa

# Verify SSH connection
ssh -T git@github.com
# Should see: "Hi mlohr! You've successfully authenticated..."

# Deploy
npm run deploy
```

---

## Option 3: Manual Deploy (No authentication needed locally)

Build locally and push from GitHub's web interface:

```bash
# Build the site
npm run build

# Create gh-pages branch locally
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/* .
rm -rf dist

# Create .nojekyll file (important for GitHub Pages)
touch .nojekyll

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Go back to main branch
git checkout main
```

---

## After First Successful Deploy

Once deployed, configure GitHub Pages:

1. Go to: https://github.com/mlohr/powerOne/settings/pages
2. Under "Source", select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
3. Click "Save"

Your site will be live at: **https://mlohr.github.io/powerOne/**

(GitHub Pages may take 1-2 minutes to build and publish)

---

## Future Deploys

After the first successful deploy, simply run:
```bash
npm run deploy
```

The authentication will be remembered based on your chosen method.
