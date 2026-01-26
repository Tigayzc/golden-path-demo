# 📖 运维手册 (Runbook)

本文档提供 Golden Path Demo 的日常运维指南、故障排查流程和监控方案。

## 📋 目录

- [系统概览](#系统概览)
- [部署流程](#部署流程)
- [监控与告警](#监控与告警)
- [故障排查](#故障排查)
- [常见问题](#常见问题)
- [紧急联系](#紧急联系)

---

## 系统概览

### 架构组件

| 组件 | 服务 | 责任方 | 监控端点 |
|------|------|--------|----------|
| 前端应用 | React + Vite | GitHub Actions | `https://tiga2000.com` |
| 托管平台 | Cloudflare Pages | Cloudflare | Dashboard |
| CI/CD | GitHub Actions | GitHub | Actions Tab |
| DNS | Cloudflare DNS | Terraform | Dashboard |
| SSL/TLS | Cloudflare | 自动管理 | Auto-renewed |

### 关键指标

- **可用性目标**: 99.9% (Cloudflare SLA)
- **部署频率**: 按需部署 (每次 push 到 main)
- **平均部署时间**: ~2 分钟
- **回滚时间**: < 5 分钟

---

## 部署流程

### 正常部署流程

```bash
# 1. 本地开发和测试
npm run dev
# 测试新功能...

# 2. 构建验证
npm run build
npm run preview

# 3. 提交代码
git add .
git commit -m "feat: your feature description"
git push origin main

# 4. 自动触发 CI/CD
# GitHub Actions 自动:
# - 运行测试
# - 构建项目
# - 部署到 Cloudflare Pages
# - 执行健康检查

# 5. 验证部署
curl https://tiga2000.com/health
```

### 回滚流程

#### 方法 1: Cloudflare Pages Dashboard 回滚

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **golden-path-demo**
3. 点击 **View builds** → 找到上一个成功的构建
4. 点击 **Rollback to this deployment**

#### 方法 2: Git 回滚

```bash
# 回滚到上一个提交
git revert HEAD
git push origin main

# 或回滚到特定提交
git revert <commit-hash>
git push origin main
```

---

## 监控与告警

### 健康检查

**端点**: `https://tiga2000.com/health`

**预期响应**:
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

**监控脚本**:
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

在 Cloudflare Dashboard 中查看:
- **请求量**: Requests per second
- **带宽**: Bandwidth usage
- **缓存命中率**: Cache hit ratio
- **错误率**: 4xx/5xx errors
- **地理分布**: Traffic by country

### GitHub Actions 监控

监控指标:
- **构建成功率**: Actions 成功率应 > 95%
- **构建时间**: 平均 < 3 分钟
- **失败通知**: 通过 GitHub 通知或邮件

### 推荐的第三方监控工具

1. **Uptime Monitoring**:
   - [UptimeRobot](https://uptimerobot.com/) - 免费 5 分钟间隔
   - [Pingdom](https://www.pingdom.com/)
   - [StatusCake](https://www.statuscake.com/)

2. **Real User Monitoring (RUM)**:
   - Cloudflare Web Analytics (免费)
   - Google Analytics
   - Sentry (错误追踪)

---

## 故障排查

### 场景 1: 网站无法访问 (5xx 错误)

**症状**: 访问 `https://tiga2000.com` 返回 500/502/503 错误

**排查步骤**:

1. **检查 Cloudflare 状态**:
   ```bash
   curl -I https://tiga2000.com
   ```
   查看 `cf-cache-status` 和 `cf-ray` 响应头

2. **查看 Cloudflare Pages 构建日志**:
   - 访问 Cloudflare Dashboard → Pages → golden-path-demo
   - 检查最近的部署状态

3. **验证 GitHub Actions**:
   - 检查最近的 Actions 运行状态
   - 查看构建日志是否有错误

4. **快速修复**:
   - 如果是新部署导致，立即回滚 (见上方回滚流程)
   - 如果是 Cloudflare 问题，等待恢复或联系支持

### 场景 2: 部署失败

**症状**: GitHub Actions 构建失败

**排查步骤**:

1. **查看 Actions 日志**:
   ```
   https://github.com/YOUR_USERNAME/golden-path-demo/actions
   ```

2. **常见错误**:

   **错误**: `npm ci` 失败
   ```
   解决: 检查 package.json 依赖版本
   本地运行: npm ci
   ```

   **错误**: `npm run build` 失败
   ```
   解决: 本地测试构建
   npm run build
   检查 TypeScript/ESLint 错误
   ```

   **错误**: Cloudflare Pages 部署失败
   ```
   解决: 检查 GitHub Secrets
   - CLOUDFLARE_API_TOKEN
   - CLOUDFLARE_ACCOUNT_ID
   验证 Token 权限
   ```

3. **重试部署**:
   ```bash
   # Re-run failed GitHub Actions job
   # 或重新推送
   git commit --allow-empty -m "chore: retry deployment"
   git push
   ```

### 场景 3: 域名解析问题

**症状**: `tiga2000.com` 无法解析或指向错误地址

**排查步骤**:

1. **检查 DNS 记录**:
   ```bash
   dig tiga2000.com
   dig www.tiga2000.com

   # 或使用
   nslookup tiga2000.com
   ```

2. **验证 Cloudflare DNS**:
   - 登录 Cloudflare Dashboard
   - 检查 DNS 记录是否正确:
     - `@` CNAME → `golden-path-demo.pages.dev`
     - `www` CNAME → `golden-path-demo.pages.dev`

3. **检查 Terraform 状态**:
   ```bash
   cd terraform
   terraform plan
   # 确认配置是否同步
   ```

4. **DNS 传播**:
   - DNS 更改可能需要 5-60 分钟生效
   - 使用 [DNS Checker](https://dnschecker.org/) 验证全球传播

### 场景 4: SSL/TLS 证书问题

**症状**: HTTPS 警告或证书错误

**排查步骤**:

1. **检查 SSL 配置**:
   - Cloudflare Dashboard → SSL/TLS
   - 确认模式为 **Full (Strict)** 或 **Full**

2. **验证证书**:
   ```bash
   openssl s_client -connect tiga2000.com:443 -servername tiga2000.com
   ```

3. **强制 HTTPS**:
   - Cloudflare Dashboard → SSL/TLS → Edge Certificates
   - 启用 **Always Use HTTPS**

### 场景 5: 性能问题

**症状**: 页面加载缓慢

**排查步骤**:

1. **检查 Cloudflare 缓存**:
   ```bash
   curl -I https://tiga2000.com
   # 查看 cf-cache-status: HIT (缓存命中) 或 MISS
   ```

2. **运行性能测试**:
   ```bash
   # 使用 Lighthouse
   npx lighthouse https://tiga2000.com --view

   # 或使用 WebPageTest
   # https://www.webpagetest.org/
   ```

3. **优化建议**:
   - 启用 Brotli 压缩 (Cloudflare Dashboard → Speed)
   - 检查图片是否过大
   - 使用 Cloudflare Polish 图片优化

---

## 常见问题

### Q1: 如何更新依赖？

```bash
# 检查过期依赖
npm outdated

# 更新所有依赖
npm update

# 或使用 npm-check-updates
npx npm-check-updates -u
npm install

# 测试后提交
npm run build
git add package.json package-lock.json
git commit -m "chore: update dependencies"
git push
```

### Q2: 如何添加环境变量？

**方法 1: Cloudflare Dashboard**
1. Pages → golden-path-demo → Settings → Environment variables
2. 添加变量 (Production/Preview)
3. 重新部署触发生效

**方法 2: GitHub Actions**
```yaml
# .github/workflows/deploy.yml
env:
  NODE_ENV: production
  VITE_API_URL: https://api.example.com
```

### Q3: 如何查看构建日志？

- **Cloudflare Pages**: Dashboard → Builds → 选择构建 → View build log
- **GitHub Actions**: Repository → Actions → 选择 workflow run → 查看 job logs

### Q4: 如何临时禁用 CI/CD？

```yaml
# .github/workflows/deploy.yml
# 添加到文件顶部临时禁用
on:
  push:
    branches:
      - main-disabled  # 改为不存在的分支名

# 或使用 workflow_dispatch 手动触发
on:
  workflow_dispatch:
```

---

## 紧急联系

### 服务提供商支持

| 服务 | 支持渠道 | 响应时间 |
|------|----------|----------|
| Cloudflare | [支持中心](https://support.cloudflare.com/) | 24-48h (免费版) |
| GitHub | [支持](https://support.github.com/) | 24-48h |

### 内部联系

- **项目负责人**: YOUR_NAME
- **技术支持**: YOUR_EMAIL
- **紧急联系**: YOUR_PHONE

### 状态页面

- Cloudflare Status: https://www.cloudflarestatus.com/
- GitHub Status: https://www.githubstatus.com/

---

## 维护日志

| 日期 | 操作 | 执行人 | 备注 |
|------|------|--------|------|
| 2026-01-27 | 初始部署 | YOUR_NAME | 项目上线 |
| | | | |

---

**最后更新**: 2026-01-27
**文档版本**: 1.0.0
