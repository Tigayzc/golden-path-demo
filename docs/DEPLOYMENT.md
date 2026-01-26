# 🚀 部署指南

本文档详细说明如何从零开始部署 Golden Path Demo 项目到 Cloudflare Pages，并配置自定义域名。

## 📋 前置准备

### 必需账户

- [x] GitHub 账户
- [x] Cloudflare 账户（免费版即可）
- [x] 域名 `tiga2000.com`（需已添加到 Cloudflare）

### 必需工具

```bash
# Node.js 20+
node -v  # v20.x.x

# Git
git --version

# Terraform (可选)
terraform -v  # v1.0+
```

---

## 🎯 部署方式对比

| 方式 | 优势 | 劣势 | 推荐场景 |
|------|------|------|----------|
| **Cloudflare Dashboard** | 快速上手，可视化配置 | 手动操作多 | 快速验证 |
| **GitHub Actions** | 全自动化，零人工介入 | 需配置 Secrets | 生产环境 (推荐) |
| **Terraform** | 代码化管理，版本控制 | 学习曲线陡 | 企业级基础设施 |

---

## 方案一：Cloudflare Dashboard 部署 (推荐新手)

### 步骤 1: 推送代码到 GitHub

```bash
# 在项目根目录
git init
git add .
git commit -m "Initial commit: Golden Path Demo"

# 创建 GitHub 仓库后
git remote add origin https://github.com/YOUR_USERNAME/golden-path-demo.git
git branch -M main
git push -u origin main
```

### 步骤 2: 创建 Cloudflare Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签页
5. 点击 **Connect to Git**

### 步骤 3: 连接 GitHub 仓库

1. 选择 **GitHub** 作为 Git 提供商
2. 授权 Cloudflare 访问你的 GitHub 账户
3. 选择 `golden-path-demo` 仓库
4. 点击 **Begin setup**

### 步骤 4: 配置构建设置

填写以下配置:

| 字段 | 值 |
|------|-----|
| **Project name** | `golden-path-demo` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` (自动检测) |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |

**环境变量** (可选):
```
NODE_VERSION = 20
```

点击 **Save and Deploy**

### 步骤 5: 等待首次部署

- 构建时间: 约 1-2 分钟
- 部署成功后会显示 `.pages.dev` 域名
- 例如: `https://golden-path-demo.pages.dev`

### 步骤 6: 配置自定义域名

1. 在 Cloudflare Pages 项目页面，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入 `tiga2000.com`
4. 点击 **Continue**
5. Cloudflare 会自动:
   - 创建 CNAME 记录
   - 配置 SSL 证书
   - 启用 CDN 缓存

6. (可选) 添加 `www.tiga2000.com`:
   - 重复上述步骤
   - 输入 `www.tiga2000.com`

### 步骤 7: 验证部署

```bash
# 检查主域名
curl -I https://tiga2000.com

# 检查健康端点
curl https://tiga2000.com/health
```

---

## 方案二：GitHub Actions 自动化部署 (推荐生产)

### 步骤 1: 获取 Cloudflare API Token

1. 访问 [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
2. 点击 **Create Token**
3. 使用模板: **Edit Cloudflare Workers**
4. 或自定义权限:
   - `Account` → `Cloudflare Pages` → `Edit`
   - `Zone` → `DNS` → `Edit`
5. 保存 Token（只显示一次！）

### 步骤 2: 获取 Cloudflare Account ID

1. 在 Cloudflare Dashboard 右侧栏找到 **Account ID**
2. 或访问: Workers & Pages → 右侧显示 Account ID

### 步骤 3: 配置 GitHub Secrets

1. 进入 GitHub 仓库
2. 点击 **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**

添加以下 Secrets:

| Name | Value | 说明 |
|------|-------|------|
| `CLOUDFLARE_API_TOKEN` | `your-token-here` | 步骤 1 获取的 Token |
| `CLOUDFLARE_ACCOUNT_ID` | `your-account-id` | 步骤 2 获取的 Account ID |

### 步骤 4: 启用 GitHub Actions

项目已包含 `.github/workflows/deploy.yml`，推送代码后自动触发:

```bash
git add .
git commit -m "Enable GitHub Actions deployment"
git push origin main
```

### 步骤 5: 监控部署

1. 进入 GitHub 仓库
2. 点击 **Actions** 标签页
3. 查看 "Deploy to Cloudflare Pages" workflow
4. 等待构建完成（约 2-3 分钟）

### 步骤 6: 验证自动化流程

```bash
# 修改代码
echo "console.log('test')" >> src/App.jsx

# 提交并推送
git add .
git commit -m "test: verify CI/CD"
git push

# 查看 Actions 自动触发
# https://github.com/YOUR_USERNAME/golden-path-demo/actions
```

---

## 方案三：Terraform 基础设施管理 (企业级)

### 步骤 1: 安装 Terraform

```bash
# macOS
brew install terraform

# Linux
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Windows
choco install terraform

# 验证安装
terraform -v
```

### 步骤 2: 配置 Terraform 变量

```bash
cd terraform

# 复制配置模板
cp terraform.tfvars.example terraform.tfvars

# 编辑配置文件
nano terraform.tfvars
```

填入以下内容:
```hcl
cloudflare_api_token  = "YOUR_CLOUDFLARE_API_TOKEN"
cloudflare_account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
github_username       = "YOUR_GITHUB_USERNAME"
domain_name           = "tiga2000.com"
```

### 步骤 3: 初始化 Terraform

```bash
# 初始化 provider
terraform init

# 验证配置
terraform validate

# 查看执行计划
terraform plan
```

预期输出:
```
Plan: 5 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + custom_domain    = "tiga2000.com"
  + deployment_url   = "https://tiga2000.com"
  + pages_subdomain  = "golden-path-demo.pages.dev"
```

### 步骤 4: 应用配置

```bash
# 应用 Terraform 配置
terraform apply

# 输入 yes 确认
```

Terraform 会自动创建:
- Cloudflare Pages 项目
- DNS CNAME 记录 (`@` 和 `www`)
- SSL/TLS 配置
- 自定义域名绑定

### 步骤 5: 验证基础设施

```bash
# 查看 Terraform 输出
terraform output

# 检查 DNS 记录
dig tiga2000.com

# 测试网站
curl https://tiga2000.com/health
```

### 步骤 6: 管理基础设施

```bash
# 查看当前状态
terraform show

# 更新配置后重新应用
terraform apply

# 销毁所有资源（谨慎！）
terraform destroy
```

---

## 🔧 高级配置

### 配置环境变量

**Cloudflare Dashboard**:
1. Pages → golden-path-demo → Settings
2. Environment variables → Add variable
3. 选择 Production/Preview 环境
4. 重新部署触发生效

**GitHub Actions**:
```yaml
# .github/workflows/deploy.yml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  VITE_ANALYTICS_ID: ${{ secrets.ANALYTICS_ID }}
```

### 配置预览部署

Cloudflare Pages 自动为每个 PR 创建预览环境:

```
https://abc123.golden-path-demo.pages.dev
```

在 PR 中会显示部署链接，方便测试。

### 配置缓存策略

创建 `public/_headers` 文件:
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

### 配置重定向

创建 `public/_redirects` 文件:
```
# 强制 HTTPS
http://tiga2000.com/* https://tiga2000.com/:splat 301!

# www 重定向到根域名
https://www.tiga2000.com/* https://tiga2000.com/:splat 301!

# SPA 路由支持
/* /index.html 200
```

---

## 🔍 故障排查

### 问题 1: 构建失败

**错误信息**: `npm ci` 失败

**解决方案**:
```bash
# 本地验证
npm ci
npm run build

# 检查 Node 版本
node -v  # 确保 20+

# 清理缓存
rm -rf node_modules package-lock.json
npm install
```

### 问题 2: 部署成功但网站 404

**原因**: 构建输出目录配置错误

**解决方案**:
1. 确认 `vite.config.js` 中 `build.outDir = 'dist'`
2. 确认 Cloudflare Pages 配置 `Build output directory = dist`
3. 重新部署

### 问题 3: 自定义域名 SSL 错误

**解决方案**:
1. Cloudflare Dashboard → SSL/TLS
2. 设置为 **Full (Strict)** 模式
3. 等待 5-10 分钟 SSL 证书自动配置
4. 清除浏览器缓存

### 问题 4: GitHub Actions 权限错误

**错误信息**: `Error: Cloudflare Pages deploy failed`

**解决方案**:
1. 检查 API Token 权限:
   - Account → Cloudflare Pages → Edit
2. 重新生成 Token
3. 更新 GitHub Secret `CLOUDFLARE_API_TOKEN`

---

## 📊 部署检查清单

部署前检查:

- [ ] 代码已推送到 GitHub `main` 分支
- [ ] `package.json` 依赖版本正确
- [ ] `npm run build` 本地构建成功
- [ ] GitHub Secrets 已配置
- [ ] Cloudflare API Token 权限正确

部署后验证:

- [ ] GitHub Actions workflow 运行成功
- [ ] Cloudflare Pages 显示 "Deployed"
- [ ] `https://tiga2000.com` 可访问
- [ ] `https://tiga2000.com/health` 返回 200
- [ ] SSL 证书有效（浏览器无警告）
- [ ] DNS 解析正确（`dig tiga2000.com`）

---

## 🎓 最佳实践

1. **使用 Git 标签标记版本**:
   ```bash
   git tag -a v1.0.0 -m "Release v1.0.0"
   git push origin v1.0.0
   ```

2. **分支保护规则**:
   - GitHub → Settings → Branches
   - 添加 `main` 分支保护
   - 要求 PR review 才能合并

3. **环境分离**:
   - `main` 分支 → Production
   - `staging` 分支 → Preview
   - Feature branches → PR Previews

4. **监控部署**:
   - 配置 GitHub Actions 通知
   - 使用 UptimeRobot 监控可用性
   - 启用 Cloudflare Web Analytics

5. **文档更新**:
   - 每次重大变更更新 README
   - 维护 CHANGELOG.md
   - 记录部署日志

---

## 📚 参考资源

- [Cloudflare Pages 官方文档](https://developers.cloudflare.com/pages/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vite 构建优化](https://vitejs.dev/guide/build.html)
- [Terraform Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)

---

**最后更新**: 2026-01-27
**文档版本**: 1.0.0
