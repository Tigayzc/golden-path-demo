# GitHub Actions Workflows

This directory contains the CI/CD workflows for the Golden Path Demo project.

## 📋 Workflows

### 1. CI Workflow (`ci.yml`)

**Trigger**: Push and PR to `main`/`develop`

**Jobs**:
- ✅ Lint code
- 🧪 Run tests
- 🏗️ Build project
- 📦 Upload artifacts
- 📊 Check bundle size (PRs only)

**Usage**:
```bash
# Triggers automatically on:
git push origin main
git push origin develop

# Or when creating/updating PR
```

### 2. Deploy Workflow (`deploy.yml`)

**Trigger**: Push to `main`

**Jobs**:
- 🏗️ Build project
- 🚀 Deploy to Cloudflare Pages
- 🏥 Health check

**Usage**:
```bash
# Triggers automatically on:
git push origin main
```

## 🔧 Required Secrets

Configure in **Settings → Secrets and variables → Actions**:

| Secret Name | Description | Used In |
|-------------|-------------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | `deploy.yml` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | `deploy.yml` |

## 📊 Status Badges

Add to README.md:

```markdown
[![CI](https://github.com/Tigayzc/golden-path-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/Tigayzc/golden-path-demo/actions/workflows/ci.yml)
[![Deploy](https://github.com/Tigayzc/golden-path-demo/actions/workflows/deploy.yml/badge.svg)](https://github.com/Tigayzc/golden-path-demo/actions/workflows/deploy.yml)
```

## 🚀 Quick Commands

```bash
# Test CI locally
npm run lint && npm run test && npm run build

# View CI runs
# Go to: https://github.com/Tigayzc/golden-path-demo/actions

# Download artifacts
# Actions → Select run → Artifacts section
```

## 📚 Documentation

- [CI Setup Guide](../../CI_SETUP.md) - Complete CI/CD documentation
- [Deployment Guide](../../docs/DEPLOYMENT.md) - Deployment instructions
