# 🚀 Deployment Guide

This document provides detailed instructions for deploying the Golden Path Demo to Cloudflare Pages from scratch, including custom domain configuration.

## 📋 Prerequisites

### Required Accounts

- [x] GitHub account
- [x] Cloudflare account (free plan works)
- [x] Domain `tiga2000.com` (added to Cloudflare)

### Required Tools

```bash
# Node.js 20+
node -v  # v20.x.x

# Git
git --version

# Terraform (optional)
terraform -v  # v1.0+
```

---

## 🎯 Deployment Methods Comparison

| Method | Advantages | Disadvantages | Recommended For |
|--------|-----------|---------------|-----------------|
| **Cloudflare Dashboard** | Quick setup, visual interface | Manual steps required | Quick validation |
| **GitHub Actions** | Fully automated, zero manual intervention | Requires Secrets configuration | Production (Recommended) |
| **Terraform** | Infrastructure as Code, version controlled | Steeper learning curve | Enterprise infrastructure |

---

## Method 1: Cloudflare Dashboard Deployment (Beginner-Friendly)

### Step 1: Push Code to GitHub

```bash
# In project root directory
git init
git add .
git commit -m "Initial commit: Golden Path Demo"

# After creating GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/golden-path-demo.git
git branch -M main
git push -u origin main
```

### Step 2: Create Cloudflare Pages Project

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click **Workers & Pages**
3. Click **Create application**
4. Select **Pages** tab
5. Click **Connect to Git**

### Step 3: Connect GitHub Repository

1. Select **GitHub** as Git provider
2. Authorize Cloudflare to access your GitHub account
3. Select `golden-path-demo` repository
4. Click **Begin setup**

### Step 4: Configure Build Settings

Fill in the following configuration:

| Field | Value |
|-------|-------|
| **Project name** | `golden-path-demo` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` (auto-detected) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

**Environment variables** (optional):
```
NODE_VERSION = 20
```

Click **Save and Deploy**

### Step 5: Wait for Initial Deployment

- Build time: ~1-2 minutes
- After successful deployment, you'll get a `.pages.dev` domain
- Example: `https://golden-path-demo.pages.dev`

### Step 6: Configure Custom Domain

1. On Cloudflare Pages project page, click **Custom domains**
2. Click **Set up a custom domain**
3. Enter `tiga2000.com`
4. Click **Continue**
5. Cloudflare will automatically:
   - Create CNAME records
   - Configure SSL certificate
   - Enable CDN caching

6. (Optional) Add `www.tiga2000.com`:
   - Repeat above steps
   - Enter `www.tiga2000.com`

### Step 7: Verify Deployment

```bash
# Check main domain
curl -I https://tiga2000.com

# Check health endpoint
curl https://tiga2000.com/health
```

---

## Method 2: GitHub Actions Automated Deployment (Recommended for Production)

### Step 1: Get Cloudflare API Token

1. Visit [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. Click **Create Token**
3. Use template: **Edit Cloudflare Workers**
4. Or custom permissions:
   - `Account` → `Cloudflare Pages` → `Edit`
   - `Zone` → `DNS` → `Edit`
5. Save Token (only shown once!)

### Step 2: Get Cloudflare Account ID

1. Find **Account ID** in Cloudflare Dashboard sidebar
2. Or visit: Workers & Pages → Account ID displayed on right

### Step 3: Configure GitHub Secrets

1. Go to GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add the following Secrets:

| Name | Value | Description |
|------|-------|-------------|
| `CLOUDFLARE_API_TOKEN` | `your-token-here` | Token from Step 1 |
| `CLOUDFLARE_ACCOUNT_ID` | `your-account-id` | Account ID from Step 2 |

### Step 4: Enable GitHub Actions

The project already includes `.github/workflows/deploy.yml`, which triggers automatically on push:

```bash
git add .
git commit -m "Enable GitHub Actions deployment"
git push origin main
```

### Step 5: Monitor Deployment

1. Go to GitHub repository
2. Click **Actions** tab
3. View "Deploy to Cloudflare Pages" workflow
4. Wait for build completion (~2-3 minutes)

### Step 6: Verify Automation

```bash
# Make a code change
echo "console.log('test')" >> src/App.jsx

# Commit and push
git add .
git commit -m "test: verify CI/CD"
git push

# Watch Actions automatically trigger
# https://github.com/YOUR_USERNAME/golden-path-demo/actions
```

---

## Method 3: Terraform Infrastructure Management (Enterprise-Grade)

### Step 1: Install Terraform

```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Windows
choco install terraform

# Verify installation
terraform -v
```

### Step 2: Configure Terraform Variables

```bash
cd terraform

# Copy configuration template
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars
```

Fill in the following:
```hcl
cloudflare_api_token  = "YOUR_CLOUDFLARE_API_TOKEN"
cloudflare_account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
github_username       = "YOUR_GITHUB_USERNAME"
domain_name           = "tiga2000.com"
```

### Step 3: Initialize Terraform

```bash
# Initialize provider
terraform init

# Validate configuration
terraform validate

# View execution plan
terraform plan
```

Expected output:
```
Plan: 5 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + custom_domain    = "tiga2000.com"
  + deployment_url   = "https://tiga2000.com"
  + pages_subdomain  = "golden-path-demo.pages.dev"
```

### Step 4: Apply Configuration

```bash
# Apply Terraform configuration
terraform apply

# Type yes to confirm
```

Terraform will automatically create:
- Cloudflare Pages project
- DNS CNAME records (`@` and `www`)
- SSL/TLS configuration
- Custom domain binding

### Step 5: Verify Infrastructure

```bash
# View Terraform outputs
terraform output

# Check DNS records
dig tiga2000.com

# Test website
curl https://tiga2000.com/health
```

### Step 6: Manage Infrastructure

```bash
# View current state
terraform show

# Re-apply after configuration changes
terraform apply

# Destroy all resources (CAUTION!)
terraform destroy
```

---

## 🔧 Advanced Configuration

### Configure Environment Variables

**Cloudflare Dashboard**:
1. Pages → golden-path-demo → Settings
2. Environment variables → Add variable
3. Select Production/Preview environment
4. Redeploy to apply

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
```

### Configure Preview Deployments

Cloudflare Pages automatically creates preview environments for each PR:

```
https://abc123.golden-path-demo.pages.dev
```

Preview links appear in PR comments for easy testing.

### Configure Cache Strategy

Create `public/_headers` file:
```
/*
  Cache-Control: public, max-age=3600, s-maxage=86400

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.css
  Cache-Control: public, max-age=31536000, immutable

/health
  Cache-Control: no-cache, no-store, must-revalidate
```

### Configure Redirects

Create `public/_redirects` file:
```
# Force HTTPS
http://tiga2000.com/* https://tiga2000.com/:splat 301!

# www to non-www redirect
https://www.tiga2000.com/* https://tiga2000.com/:splat 301!

# SPA routing support
/* /index.html 200
```

---

## 🔍 Troubleshooting

### Issue 1: Build Failure

**Error**: `npm ci` fails

**Solution**:
```bash
# Verify locally
npm ci
npm run build

# Check Node version
node -v  # Ensure 20+

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Deployment Success but 404

**Cause**: Build output directory configuration error

**Solution**:
1. Confirm `vite.config.js` has `build.outDir = 'dist'`
2. Confirm Cloudflare Pages config has `Build output directory = dist`
3. Redeploy

### Issue 3: Custom Domain SSL Error

**Solution**:
1. Cloudflare Dashboard → SSL/TLS
2. Set to **Full (Strict)** mode
3. Wait 5-10 minutes for SSL certificate auto-configuration
4. Clear browser cache

### Issue 4: GitHub Actions Permission Error

**Error**: `Error: Cloudflare Pages deploy failed`

**Solution**:
1. Check API Token permissions:
   - Account → Cloudflare Pages → Edit
2. Regenerate Token
3. Update GitHub Secret `CLOUDFLARE_API_TOKEN`

---

## 📊 Deployment Checklist

Pre-deployment checks:

- [ ] Code pushed to GitHub `main` branch
- [ ] `package.json` dependencies correct
- [ ] `npm run build` succeeds locally
- [ ] GitHub Secrets configured
- [ ] Cloudflare API Token has correct permissions

Post-deployment verification:

- [ ] GitHub Actions workflow runs successfully
- [ ] Cloudflare Pages shows "Deployed"
- [ ] `https://tiga2000.com` accessible
- [ ] `https://tiga2000.com/health` returns 200
- [ ] SSL certificate valid (no browser warnings)
- [ ] DNS resolution correct (`dig tiga2000.com`)

---

## 🎓 Best Practices

1. **Use Git Tags for Versioning**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **Branch Protection Rules**:
   - GitHub → Settings → Branches
   - Add `main` branch protection
   - Require PR review before merge

3. **Environment Separation**:
   - `main` branch → Production
   - `staging` branch → Preview
   - Feature branches → PR Previews

4. **Monitor Deployments**:
   - Configure GitHub Actions notifications
   - Use UptimeRobot for availability monitoring
   - Enable Cloudflare Web Analytics

5. **Documentation Updates**:
   - Update README on major changes
   - Maintain CHANGELOG.md
   - Log deployment records

---

## 📚 Reference Resources

- [Cloudflare Pages Official Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Build Optimization](https://vitejs.dev/guide/build.html)
- [Terraform Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)

---

**Last Updated**: 2026-01-27
**Document Version**: 1.0.0
