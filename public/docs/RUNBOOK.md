# 📖 Operations Runbook

This document provides operational guidelines, troubleshooting procedures, and monitoring strategies for the Golden Path Demo.

## 📋 Table of Contents

- [System Overview](#system-overview)
- [Deployment Process](#deployment-process)
- [Monitoring & Alerts](#monitoring--alerts)
- [Troubleshooting](#troubleshooting)
- [Common Issues](#common-issues)
- [Emergency Contacts](#emergency-contacts)

---

## System Overview

### Architecture Components

| Component | Service | Owner | Monitoring Endpoint |
|-----------|---------|-------|---------------------|
| Frontend Application | React + Vite | GitHub Actions | `https://tiga2000.com` |
| Hosting Platform | Cloudflare Pages | Cloudflare | Dashboard |
| CI/CD | GitHub Actions | GitHub | Actions Tab |
| DNS | Cloudflare DNS | Terraform | Dashboard |
| SSL/TLS | Cloudflare | Auto-managed | Auto-renewed |

### Key Metrics

- **Availability Target**: 99.9% (Cloudflare SLA)
- **Deployment Frequency**: On-demand (every push to main)
- **Average Deployment Time**: ~2 minutes
- **Rollback Time**: < 5 minutes

---

## Deployment Process

### Normal Deployment Flow

```bash
# 1. Local development and testing
npm run dev
# Test new features...

# 2. Build verification
npm run build
npm run preview

# 3. Commit code
git add .
git commit -m "feat: your feature description"
git push origin main

# 4. Automatic CI/CD trigger
# GitHub Actions automatically:
# - Runs tests
# - Builds project
# - Deploys to Cloudflare Pages
# - Executes health check

# 5. Verify deployment
curl https://tiga2000.com/health
```

### Rollback Procedure

#### Method 1: Cloudflare Pages Dashboard Rollback

1. Visit [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **golden-path-demo**
3. Click **View builds** → Find the last successful build
4. Click **Rollback to this deployment**

#### Method 2: Git Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or revert to specific commit
git revert <commit-hash>
git push origin main
```

---

## Monitoring & Alerts

### Health Check

**Endpoint**: `https://tiga2000.com/health`

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-27T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "frontend": "operational",
    "cdn": "operational"
  }
}
```

**Monitoring Script**:
```bash
#!/bin/bash
# health-check.sh

HEALTH_URL="https://tiga2000.com/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
  echo "✅ Health check passed"
  exit 0
else
  echo "❌ Health check failed (HTTP $RESPONSE)"
  exit 1
fi
```

### Cloudflare Analytics

View in Cloudflare Dashboard:
- **Request Volume**: Requests per second
- **Bandwidth**: Bandwidth usage
- **Cache Hit Rate**: Cache efficiency
- **Error Rate**: 4xx/5xx errors
- **Geographic Distribution**: Traffic by country

### GitHub Actions Monitoring

Monitor metrics:
- **Build Success Rate**: Actions success rate should be > 95%
- **Build Time**: Average < 3 minutes
- **Failure Notifications**: Via GitHub notifications or email

### Recommended Third-Party Monitoring Tools

1. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com/) - Free 5-minute interval checks
   - [Pingdom](https://www.pingdom.com/)
   - [StatusCake](https://www.statuscake.com/)

2. **Real User Monitoring (RUM)**:
   - Cloudflare Web Analytics (free)
   - Google Analytics
   - Sentry (error tracking)

---

## Troubleshooting

### Scenario 1: Website Unavailable (5xx Errors)

**Symptoms**: Accessing `https://tiga2000.com` returns 500/502/503 errors

**Diagnostic Steps**:

1. **Check Cloudflare Status**:
   ```bash
   curl -I https://tiga2000.com
   ```
   Check `cf-cache-status` and `cf-ray` response headers

2. **View Cloudflare Pages Build Logs**:
   - Visit Cloudflare Dashboard → Pages → golden-path-demo
   - Check recent deployment status

3. **Verify GitHub Actions**:
   - Check recent Actions run status
   - Review build logs for errors

4. **Quick Fix**:
   - If caused by new deployment, immediately rollback (see rollback procedure above)
   - If Cloudflare issue, wait for recovery or contact support

### Scenario 2: Deployment Failure

**Symptoms**: GitHub Actions build fails

**Diagnostic Steps**:

1. **View Actions Logs**:
   ```
   https://github.com/YOUR_USERNAME/golden-path-demo/actions
   ```

2. **Common Errors**:

   **Error**: `npm ci` fails
   ```
   Solution: Check package.json dependencies
   Local test: npm ci
   ```

   **Error**: `npm run build` fails
   ```
   Solution: Test build locally
   npm run build
   Check TypeScript/ESLint errors
   ```

   **Error**: Cloudflare Pages deployment fails
   ```
   Solution: Check GitHub Secrets
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   Verify Token permissions
   ```

3. **Retry Deployment**:
   ```bash
   # Re-run failed GitHub Actions job
   # Or re-push
   git commit --allow-empty -m "chore: retry deployment"
   git push
   ```

### Scenario 3: DNS Resolution Issues

**Symptoms**: `tiga2000.com` doesn't resolve or points to wrong address

**Diagnostic Steps**:

1. **Check DNS Records**:
   ```bash
   dig tiga2000.com
   dig www.tiga2000.com

   # Or use
   nslookup tiga2000.com
   ```

2. **Verify Cloudflare DNS**:
   - Login to Cloudflare Dashboard
   - Check DNS records are correct:
     - `@` CNAME → `golden-path-demo.pages.dev`
     - `www` CNAME → `golden-path-demo.pages.dev`

3. **Check Terraform State**:
   ```bash
   cd terraform
   terraform plan
   # Confirm configuration is in sync
   ```

4. **DNS Propagation**:
   - DNS changes may take 5-60 minutes to propagate
   - Use [DNS Checker](https://dnschecker.org/) to verify global propagation

### Scenario 4: SSL/TLS Certificate Issues

**Symptoms**: HTTPS warnings or certificate errors

**Diagnostic Steps**:

1. **Check SSL Configuration**:
   - Cloudflare Dashboard → SSL/TLS
   - Confirm mode is **Full (Strict)** or **Full**

2. **Verify Certificate**:
   ```bash
   openssl s_client -connect tiga2000.com:443 -servername tiga2000.com
   ```

3. **Force HTTPS**:
   - Cloudflare Dashboard → SSL/TLS → Edge Certificates
   - Enable **Always Use HTTPS**

### Scenario 5: Performance Issues

**Symptoms**: Slow page loading

**Diagnostic Steps**:

1. **Check Cloudflare Cache**:
   ```bash
   curl -I https://tiga2000.com
   # Check cf-cache-status: HIT (cached) or MISS
   ```

2. **Run Performance Tests**:
   ```bash
   # Use Lighthouse
   npx lighthouse https://tiga2000.com --view

   # Or use WebPageTest
   # https://www.webpagetest.org/
   ```

3. **Optimization Recommendations**:
   - Enable Brotli compression (Cloudflare Dashboard → Speed)
   - Check image sizes
   - Use Cloudflare Polish for image optimization

---

## Common Issues

### Q1: How to update dependencies?

```bash
# Check outdated packages
npm outdated

# Update all dependencies
npm update

# Or use npm-check-updates
npx npm-check-updates -u
npm install

# Test and commit
npm run build
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

### Q2: How to add environment variables?

**Method 1: Cloudflare Dashboard**
1. Pages → golden-path-demo → Settings → Environment variables
2. Add variable (Production/Preview)
3. Redeploy to apply changes

**Method 2: GitHub Actions**
```yaml
# .github/workflows/deploy.yml
env:
  NODE_ENV: production
  VITE_API_URL: https://api.example.com
```

### Q3: How to view build logs?

- **Cloudflare Pages**: Dashboard → Builds → Select build → View build log
- **GitHub Actions**: Repository → Actions → Select workflow run → View job logs

### Q4: How to temporarily disable CI/CD?

```yaml
# .github/workflows/deploy.yml
# Add to top of file to temporarily disable
on:
  push:
    branches:
      - main-disabled  # Change to non-existent branch

# Or use workflow_dispatch for manual trigger
on:
  workflow_dispatch:
```

---

## Emergency Contacts

### Service Provider Support

| Service | Support Channel | Response Time |
|---------|----------------|---------------|
| Cloudflare | [Support Center](https://support.cloudflare.com/) | 24-48h (free plan) |
| GitHub | [Support](https://support.github.com/) | 24-48h |

### Internal Contacts

- **Project Owner**: YOUR_NAME
- **Technical Support**: YOUR_EMAIL
- **Emergency Contact**: YOUR_PHONE

### Status Pages

- Cloudflare Status: https://www.cloudflarestatus.com/
- GitHub Status: https://www.githubstatus.com/

---

## Maintenance Log

| Date | Action | Executor | Notes |
|------|--------|----------|-------|
| 2026-01-27 | Initial deployment | YOUR_NAME | Project launch |
| | | | |

---

**Last Updated**: 2026-01-27
**Document Version**: 1.0.0
