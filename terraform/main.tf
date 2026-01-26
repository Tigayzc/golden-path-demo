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
