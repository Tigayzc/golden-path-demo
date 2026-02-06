terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  # 推荐使用 Terraform Cloud 或 S3 作为后端存储状态
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "golden-path-demo/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Cloudflare Pages Project
# 注意：不配置 source 和 build_config，因为通过 GitHub Actions 手动部署
resource "cloudflare_pages_project" "golden_path_demo" {
  account_id        = var.cloudflare_account_id
  name              = "golden-path-demo"
  production_branch = "main"

  # 不配置 build_config - 构建在 GitHub Actions 中完成
  # 不配置 source - 通过 cloudflare/pages-action 上传构建产物

  deployment_configs {
    production {
      environment_variables = {
        NODE_VERSION = "20"
      }
    }
  }
}

# Custom Domain
resource "cloudflare_pages_domain" "tiga2000_com" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.golden_path_demo.name
  domain       = "tiga2000.com"
}

# Zone for tiga2000.com (如果域名已在 Cloudflare)
data "cloudflare_zone" "tiga2000_com" {
  name = "tiga2000.com"
}

# DNS Records
resource "cloudflare_record" "root" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "@"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo"
}

resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "www"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo WWW"
}

# SSL/TLS Configuration
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

# Workers Route - 暂不通过 Terraform 管理
# Worker 通过 GitHub Actions + wrangler 部署
# Route 需要在 Cloudflare Dashboard 手动配置：
#   1. 进入 Cloudflare Dashboard
#   2. 选择域名 tiga2000.com
#   3. Workers Routes → Add Route
#   4. Route: tiga2000.com/api/*
#   5. Worker: golden-path-demo-api
#
# 如果未来需要 Terraform 管理 Route，取消下面的注释：
#
# resource "cloudflare_workers_route" "api_route" {
#   zone_id     = data.cloudflare_zone.tiga2000_com.id
#   pattern     = "tiga2000.com/api/*"
#   script_name = "golden-path-demo-api"
# }

# Outputs
output "pages_subdomain" {
  value       = cloudflare_pages_project.golden_path_demo.subdomain
  description = "The Cloudflare Pages subdomain"
}

output "custom_domain" {
  value       = cloudflare_pages_domain.tiga2000_com.domain
  description = "The custom domain"
}

output "deployment_url" {
  value       = "https://${cloudflare_pages_domain.tiga2000_com.domain}"
  description = "The production deployment URL"
}

output "api_url" {
  value       = "https://${cloudflare_pages_domain.tiga2000_com.domain}/api"
  description = "The API endpoint URL"
}
