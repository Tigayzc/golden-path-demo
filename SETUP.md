# 🚀 Setup Guide

Quick setup guide for configuring your GitHub information and environment variables.

## 📝 Step 1: Configure Environment Variables

Copy the example environment file and fill in your information:

```bash
cp .env.example .env
```

Then edit `.env` file:

```bash
# Open in your editor
nano .env
# or
code .env
# or
vim .env
```

### Required Configuration

```env
# GitHub Configuration
VITE_GITHUB_USERNAME=your-github-username    # ← Replace with YOUR GitHub username
VITE_GITHUB_REPO=golden-path-demo            # ← Keep this or change if different

# Domain Configuration
VITE_DOMAIN=tiga2000.com                     # ← Replace with YOUR domain

# Application Configuration
VITE_APP_VERSION=1.0.0                       # ← Optional: change version
VITE_APP_NAME=Golden Path Demo               # ← Optional: change app name
```

### Example

```env
# GitHub Configuration
VITE_GITHUB_USERNAME=octocat
VITE_GITHUB_REPO=golden-path-demo

# Domain Configuration
VITE_DOMAIN=example.com

# Application Configuration
VITE_APP_VERSION=1.0.0
VITE_APP_NAME=Golden Path Demo
```

## 🔍 What Gets Configured?

When you set these environment variables, they will be used in:

### 1. App.jsx - Footer Links
```jsx
// Footer GitHub link
<a href="https://github.com/{VITE_GITHUB_USERNAME}/{VITE_GITHUB_REPO}">
  GitHub
</a>

// Domain link
<a href="https://{VITE_DOMAIN}">
  {VITE_DOMAIN}
</a>
```

### 2. App.jsx - CI/CD Badge
```jsx
// GitHub Actions status badge
<img src="https://img.shields.io/github/actions/workflow/status/{VITE_GITHUB_USERNAME}/{VITE_GITHUB_REPO}/deploy.yml" />
```

### 3. BuildInfo.jsx - Commit Links
```jsx
// Link to specific commit on GitHub
<a href="https://github.com/{VITE_GITHUB_USERNAME}/{VITE_GITHUB_REPO}/commit/{commitHash}">
  {commitShort}
</a>
```

## ✅ Step 2: Verify Configuration

After setting up `.env`, test your configuration:

```bash
# Start development server
npm run dev

# Open http://localhost:5173
# Check:
# 1. Footer links point to your GitHub repo
# 2. Domain link shows your domain
# 3. Build info commit link (click ℹ️ button) points to your repo
```

## 🔐 Security Notes

### ⚠️ Important: `.env` is in `.gitignore`

The `.env` file is already excluded from git to protect your configuration:

```bash
# Check .gitignore
cat .gitignore | grep ".env"

# Output should include:
# .env
# .env.local
# .env.*.local
```

### ✅ What to commit:
- ✅ `.env.example` - Template file (no sensitive data)
- ✅ All source code

### ❌ What NOT to commit:
- ❌ `.env` - Your actual configuration
- ❌ Any file with real credentials

## 🚀 Step 3: Deploy to Production

### GitHub Actions (Automatic)

When deploying via GitHub Actions, set the environment variables as **GitHub Secrets**:

1. Go to your GitHub repo
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each variable:

| Secret Name | Value |
|-------------|-------|
| `VITE_GITHUB_USERNAME` | your-github-username |
| `VITE_GITHUB_REPO` | golden-path-demo |
| `VITE_DOMAIN` | tiga2000.com |

5. Update `.github/workflows/deploy.yml`:

```yaml
- name: Build project
  env:
    VITE_GITHUB_USERNAME: ${{ secrets.VITE_GITHUB_USERNAME }}
    VITE_GITHUB_REPO: ${{ secrets.VITE_GITHUB_REPO }}
    VITE_DOMAIN: ${{ secrets.VITE_DOMAIN }}
  run: npm run build
```

### Cloudflare Pages

Set environment variables in Cloudflare Dashboard:

1. Go to **Workers & Pages** → **golden-path-demo**
2. **Settings** → **Environment variables**
3. Add variables for **Production** and **Preview**:
   - `VITE_GITHUB_USERNAME` = your-username
   - `VITE_GITHUB_REPO` = golden-path-demo
   - `VITE_DOMAIN` = tiga2000.com

## 🔧 Advanced: Multiple Environments

### Development (.env)
```env
VITE_GITHUB_USERNAME=your-username
VITE_DOMAIN=localhost:5173
```

### Staging (.env.staging)
```env
VITE_GITHUB_USERNAME=your-username
VITE_DOMAIN=staging.tiga2000.com
```

### Production (.env.production)
```env
VITE_GITHUB_USERNAME=your-username
VITE_DOMAIN=tiga2000.com
```

Build for specific environment:
```bash
# Development (default)
npm run dev

# Staging
vite build --mode staging

# Production
npm run build
```

## 📚 Environment Variable Reference

### Vite Environment Variables

Vite automatically loads environment variables that start with `VITE_`:

| Prefix | Accessible in Code | Exposed to Browser |
|--------|-------------------|-------------------|
| `VITE_*` | ✅ Yes | ✅ Yes |
| Other | ❌ No | ❌ No |

### Accessing in Code

```javascript
// ✅ Correct - Vite prefix
import.meta.env.VITE_GITHUB_USERNAME

// ❌ Wrong - No Vite prefix
import.meta.env.GITHUB_USERNAME  // undefined
```

### Built-in Variables

Vite provides these automatically:

```javascript
import.meta.env.MODE           // 'development' | 'production'
import.meta.env.BASE_URL        // '/'
import.meta.env.PROD            // boolean
import.meta.env.DEV             // boolean
```

## 🐛 Troubleshooting

### Issue: Environment variables not working

**Solution 1**: Restart dev server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**Solution 2**: Check variable name starts with `VITE_`
```bash
# ✅ Correct
VITE_GITHUB_USERNAME=octocat

# ❌ Wrong (missing VITE_ prefix)
GITHUB_USERNAME=octocat
```

**Solution 3**: Check .env file exists
```bash
ls -la .env
# Should show the file
```

### Issue: Links still show "YOUR_USERNAME"

**Cause**: Environment variable not set

**Solution**:
1. Verify `.env` file exists and is filled
2. Restart dev server
3. Check browser console for errors

### Issue: Different values in dev vs production

**Cause**: Different environment files

**Solution**: Check which env file is being used:
```bash
# Development uses .env
npm run dev

# Production uses .env.production (if exists) or .env
npm run build
```

## 📖 Learn More

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Cloudflare Pages Environment Variables](https://developers.cloudflare.com/pages/platform/build-configuration/#environment-variables)

---

**Quick Start**:
```bash
cp .env.example .env
# Edit .env with your info
npm run dev
```
