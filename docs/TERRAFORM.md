# 🏗️ Terraform 基础设施文档

本文档详细说明如何使用 Terraform 管理 Golden Path Demo 的 Cloudflare 基础设施。

## 📋 目录

- [架构概览](#架构概览)
- [前置准备](#前置准备)
- [快速开始](#快速开始)
- [资源详解](#资源详解)
- [状态管理](#状态管理)
- [最佳实践](#最佳实践)
- [故障排查](#故障排查)

---

## 架构概览

### 管理的资源

```
Terraform
├── Cloudflare Pages Project
│   ├── Build Configuration
│   ├── GitHub Integration
│   └── Environment Variables
├── DNS Records
│   ├── @ (root) → CNAME to Pages
│   └── www → CNAME to Pages
├── Custom Domains
│   └── tiga2000.com
└── SSL/TLS Settings
    ├── Always Use HTTPS
    ├── Minimum TLS 1.2
    └── Automatic HTTPS Rewrites
```

### 文件结构

```
terraform/
├── main.tf                 # 主配置文件（资源定义）
├── variables.tf            # 变量定义
├── terraform.tfvars        # 变量值（敏感数据，不提交 Git）
├── terraform.tfvars.example # 配置示例
├── .gitignore              # Git 忽略规则
└── outputs.tf              # 输出定义（可选）
```

---

## 前置准备

### 1. 安装 Terraform

**macOS**:
```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
```

**Linux (Ubuntu/Debian)**:
```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

**Windows**:
```powershell
choco install terraform
```

**验证安装**:
```bash
terraform -v
# Terraform v1.7.0 或更高版本
```

### 2. 获取 Cloudflare 凭证

#### Cloudflare API Token

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击右上角头像 → **My Profile**
3. 进入 **API Tokens** 标签页
4. 点击 **Create Token**
5. 使用模板: **Edit Cloudflare Workers**
6. 或自定义权限:

| 资源 | 权限 |
|------|------|
| Account → Cloudflare Pages | Edit |
| Zone → DNS | Edit |
| Zone → Zone Settings | Edit |

7. 复制并保存 Token（只显示一次！）

#### Cloudflare Account ID

1. 在 Dashboard 主页，右侧栏找到 **Account ID**
2. 或访问: Workers & Pages → 查看右侧

### 3. 获取 Zone ID（可选）

如果域名已在 Cloudflare:
1. Dashboard → Websites → 选择 `tiga2000.com`
2. Overview 页面右下角显示 **Zone ID**

---

## 快速开始

### 步骤 1: 配置变量

```bash
cd terraform

# 复制配置模板
cp terraform.tfvars.example terraform.tfvars

# 编辑配置
nano terraform.tfvars
```

填入你的凭证:
```hcl
cloudflare_api_token  = "YOUR_CLOUDFLARE_API_TOKEN"
cloudflare_account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
github_username       = "YOUR_GITHUB_USERNAME"
domain_name           = "tiga2000.com"
```

### 步骤 2: 初始化 Terraform

```bash
terraform init
```

预期输出:
```
Initializing the backend...
Initializing provider plugins...
- Finding cloudflare/cloudflare versions matching "~> 4.0"...
- Installing cloudflare/cloudflare v4.x.x...

Terraform has been successfully initialized!
```

### 步骤 3: 验证配置

```bash
# 检查语法
terraform validate

# 格式化代码
terraform fmt

# 查看执行计划
terraform plan
```

### 步骤 4: 应用配置

```bash
# 预览变更
terraform plan -out=tfplan

# 应用变更
terraform apply tfplan

# 或直接应用（需确认）
terraform apply
```

输入 `yes` 确认后，Terraform 会创建资源。

### 步骤 5: 查看输出

```bash
terraform output
```

示例输出:
```
custom_domain    = "tiga2000.com"
deployment_url   = "https://tiga2000.com"
pages_subdomain  = "golden-path-demo.pages.dev"
```

---

## 资源详解

### 1. Cloudflare Pages Project

```hcl
resource "cloudflare_pages_project" "golden_path_demo" {
  account_id        = var.cloudflare_account_id
  name              = "golden-path-demo"
  production_branch = "main"

  build_config {
    build_command   = "npm run build"
    destination_dir = "dist"
  }

  source {
    type = "github"
    config {
      owner                         = var.github_username
      repo_name                     = "golden-path-demo"
      production_branch             = "main"
      pr_comments_enabled           = true
      deployments_enabled           = true
      production_deployment_enabled = true
    }
  }

  deployment_configs {
    production {
      environment_variables = {
        NODE_VERSION = "20"
      }
    }
  }
}
```

**说明**:
- **name**: Pages 项目名称（全局唯一）
- **production_branch**: 生产分支（通常是 `main`）
- **build_config**: 构建配置
  - `build_command`: 构建命令
  - `destination_dir`: 输出目录
- **source**: GitHub 集成配置
- **deployment_configs**: 环境变量配置

### 2. 自定义域名

```hcl
resource "cloudflare_pages_domain" "tiga2000_com" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.golden_path_demo.name
  domain       = "tiga2000.com"
}
```

**说明**:
- 将自定义域名绑定到 Pages 项目
- Cloudflare 自动配置 SSL 证书

### 3. DNS 记录

```hcl
# 根域名
resource "cloudflare_record" "root" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "@"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo"
}

# www 子域名
resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "www"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo WWW"
}
```

**说明**:
- **zone_id**: Zone ID（通过 data source 获取）
- **name**: 记录名称（`@` 表示根域名）
- **value**: 指向 Pages 的 `.pages.dev` 域名
- **type**: 记录类型（CNAME）
- **proxied**: 启用 Cloudflare CDN 代理

### 4. SSL/TLS 配置

```hcl
resource "cloudflare_zone_settings_override" "tiga2000_com_settings" {
  zone_id = data.cloudflare_zone.tiga2000_com.id

  settings {
    ssl                      = "strict"
    always_use_https         = "on"
    min_tls_version          = "1.2"
    automatic_https_rewrites = "on"
    security_level           = "medium"
    brotli                   = "on"
  }
}
```

**说明**:
- **ssl**: SSL 模式（`strict` 最安全）
- **always_use_https**: 强制 HTTPS 重定向
- **min_tls_version**: 最低 TLS 版本
- **automatic_https_rewrites**: 自动 HTTPS 重写
- **brotli**: 启用 Brotli 压缩

---

## 状态管理

### 本地状态（默认）

Terraform 默认将状态保存在 `terraform.tfstate` 文件中。

**优点**:
- 简单，无需额外配置

**缺点**:
- 不支持团队协作
- 无状态锁定
- 容易丢失

### 远程状态（推荐）

#### 方案 1: Terraform Cloud

```hcl
# main.tf
terraform {
  cloud {
    organization = "your-org"
    workspaces {
      name = "golden-path-demo"
    }
  }
}
```

**步骤**:
1. 注册 [Terraform Cloud](https://app.terraform.io/)
2. 创建 Organization 和 Workspace
3. 运行 `terraform login`
4. 更新配置并 `terraform init`

#### 方案 2: S3 后端

```hcl
# main.tf
terraform {
  backend "s3" {
    bucket         = "your-terraform-state-bucket"
    key            = "golden-path-demo/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-lock"
  }
}
```

**步骤**:
1. 创建 S3 bucket 和 DynamoDB 表
2. 配置 AWS 凭证
3. 运行 `terraform init`

---

## 最佳实践

### 1. 使用变量

**不推荐** ❌:
```hcl
resource "cloudflare_pages_project" "demo" {
  account_id = "abc123"  # 硬编码
}
```

**推荐** ✅:
```hcl
resource "cloudflare_pages_project" "demo" {
  account_id = var.cloudflare_account_id
}
```

### 2. 使用 Data Sources

```hcl
# 引用现有 Zone
data "cloudflare_zone" "tiga2000_com" {
  name = "tiga2000.com"
}

resource "cloudflare_record" "root" {
  zone_id = data.cloudflare_zone.tiga2000_com.id  # 使用 data
  # ...
}
```

### 3. 模块化

```
terraform/
├── modules/
│   ├── cloudflare-pages/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── dns/
│       ├── main.tf
│       └── variables.tf
└── main.tf
```

### 4. 使用 Workspaces

```bash
# 创建环境
terraform workspace new staging
terraform workspace new production

# 切换环境
terraform workspace select production

# 查看当前环境
terraform workspace show
```

### 5. 版本约束

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"  # 允许 4.x 版本
    }
  }
}
```

---

## 常用命令

### 基础操作

```bash
# 初始化项目
terraform init

# 验证配置
terraform validate

# 格式化代码
terraform fmt

# 查看执行计划
terraform plan

# 应用变更
terraform apply

# 销毁资源
terraform destroy
```

### 状态管理

```bash
# 查看状态
terraform show

# 列出资源
terraform state list

# 查看特定资源
terraform state show cloudflare_pages_project.golden_path_demo

# 移除资源（不删除实际资源）
terraform state rm cloudflare_record.www

# 导入现有资源
terraform import cloudflare_pages_project.demo <project-id>
```

### 输出管理

```bash
# 查看所有输出
terraform output

# 查看特定输出
terraform output deployment_url

# 输出 JSON 格式
terraform output -json
```

---

## 故障排查

### 问题 1: Provider 认证失败

**错误信息**:
```
Error: failed to create Cloudflare client: invalid credentials
```

**解决方案**:
1. 检查 API Token 是否正确
2. 验证 Token 权限:
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
        -H "Authorization: Bearer YOUR_TOKEN"
   ```
3. 确认 `terraform.tfvars` 文件存在且格式正确

### 问题 2: 资源已存在

**错误信息**:
```
Error: Pages project "golden-path-demo" already exists
```

**解决方案**:

**选项 A**: 导入现有资源
```bash
terraform import cloudflare_pages_project.golden_path_demo <account-id>/<project-name>
```

**选项 B**: 更改资源名称
```hcl
resource "cloudflare_pages_project" "golden_path_demo_v2" {
  name = "golden-path-demo-v2"
  # ...
}
```

### 问题 3: DNS 记录冲突

**错误信息**:
```
Error: error creating DNS record: DNS record already exists
```

**解决方案**:
1. 查看现有 DNS 记录
2. 删除冲突记录（或导入）
3. 重新运行 `terraform apply`

### 问题 4: State Lock 错误

**错误信息**:
```
Error: Error acquiring the state lock
```

**解决方案**:
```bash
# 强制解锁（谨慎！确保没有其他人在操作）
terraform force-unlock <lock-id>
```

---

## 高级配置

### 条件资源创建

```hcl
variable "create_www_record" {
  type    = bool
  default = true
}

resource "cloudflare_record" "www" {
  count   = var.create_www_record ? 1 : 0
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "www"
  # ...
}
```

### 动态块

```hcl
resource "cloudflare_pages_project" "demo" {
  # ...

  dynamic "deployment_configs" {
    for_each = var.environments
    content {
      environment_variables = deployment_configs.value
    }
  }
}
```

### 多环境配置

```hcl
# environments.tf
locals {
  environment = terraform.workspace

  config = {
    production = {
      domain = "tiga2000.com"
    }
    staging = {
      domain = "staging.tiga2000.com"
    }
  }
}

resource "cloudflare_pages_domain" "domain" {
  domain = local.config[local.environment].domain
}
```

---

## 安全注意事项

### 1. 保护敏感数据

```bash
# 永远不要提交这些文件到 Git
echo "terraform.tfvars" >> .gitignore
echo "*.tfstate" >> .gitignore
echo ".terraform/" >> .gitignore
```

### 2. 使用环境变量

```bash
# 替代 terraform.tfvars
export TF_VAR_cloudflare_api_token="your-token"
export TF_VAR_cloudflare_account_id="your-account-id"

terraform apply
```

### 3. 限制 API Token 权限

只授予必要的最小权限:
- ✅ Account → Cloudflare Pages → Edit
- ✅ Zone → DNS → Edit
- ❌ 不要使用 Global API Key

---

## 参考资源

- [Terraform Cloudflare Provider 文档](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Terraform 官方文档](https://developer.hashicorp.com/terraform/docs)
- [Cloudflare API 文档](https://developers.cloudflare.com/api/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

**最后更新**: 2026-01-27
**文档版本**: 1.0.0
