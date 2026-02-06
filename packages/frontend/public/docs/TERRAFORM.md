# 🏗️ Terraform Infrastructure Documentation

This document explains how to use Terraform to manage the Cloudflare infrastructure for the Golden Path Demo.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Resource Details](#resource-details)
- [State Management](#state-management)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Managed Resources

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

### File Structure

```
terraform/
├── main.tf                 # Main configuration (resource definitions)
├── variables.tf            # Variable definitions
├── terraform.tfvars        # Variable values (sensitive data, not in Git)
├── terraform.tfvars.example # Configuration example
├── .gitignore              # Git ignore rules
└── outputs.tf              # Output definitions (optional)
```

---

## Prerequisites

### 1. Install Terraform

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

**Verify Installation**:
```bash
terraform -v
# Terraform v1.7.0 or higher
```

### 2. Get Cloudflare Credentials

#### Cloudflare API Token

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click profile icon → **My Profile**
3. Go to **API Tokens** tab
4. Click **Create Token**
5. Use template: **Edit Cloudflare Workers**
6. Or custom permissions:

| Resource | Permission |
|----------|------------|
| Account → Cloudflare Pages | Edit |
| Zone → DNS | Edit |
| Zone → Zone Settings | Edit |

7. Copy and save Token (only shown once!)

#### Cloudflare Account ID

1. On Dashboard homepage, find **Account ID** in sidebar
2. Or visit: Workers & Pages → View Account ID on right

### 3. Get Zone ID (Optional)

If domain is already in Cloudflare:
1. Dashboard → Websites → Select `tiga2000.com`
2. Overview page, bottom right shows **Zone ID**

---

## Quick Start

### Step 1: Configure Variables

```bash
cd terraform

# Copy configuration template
cp terraform.tfvars.example terraform.tfvars

# Edit configuration
nano terraform.tfvars
```

Fill in your credentials:
```hcl
cloudflare_api_token  = "YOUR_CLOUDFLARE_API_TOKEN"
cloudflare_account_id = "YOUR_CLOUDFLARE_ACCOUNT_ID"
github_username       = "YOUR_GITHUB_USERNAME"
domain_name           = "tiga2000.com"
```

### Step 2: Initialize Terraform

```bash
terraform init
```

Expected output:
```
Initializing the backend...
Initializing provider plugins...
- Finding cloudflare/cloudflare versions matching "~> 4.0"...
- Installing cloudflare/cloudflare v4.x.x...

Terraform has been successfully initialized!
```

### Step 3: Validate Configuration

```bash
# Check syntax
terraform validate

# Format code
terraform fmt

# View execution plan
terraform plan
```

### Step 4: Apply Configuration

```bash
# Preview changes
terraform plan -out=tfplan

# Apply changes
terraform apply tfplan

# Or directly apply (requires confirmation)
terraform apply
```

Type `yes` to confirm, and Terraform will create resources.

### Step 5: View Outputs

```bash
terraform output
```

Example output:
```
custom_domain    = "tiga2000.com"
deployment_url   = "https://tiga2000.com"
pages_subdomain  = "golden-path-demo.pages.dev"
```

---

## Resource Details

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

**Explanation**:
- **name**: Pages project name (globally unique)
- **production_branch**: Production branch (usually `main`)
- **build_config**: Build configuration
  - `build_command`: Build command
  - `destination_dir`: Output directory
- **source**: GitHub integration configuration
- **deployment_configs**: Environment variable configuration

### 2. Custom Domain

```hcl
resource "cloudflare_pages_domain" "tiga2000_com" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.golden_path_demo.name
  domain       = "tiga2000.com"
}
```

**Explanation**:
- Binds custom domain to Pages project
- Cloudflare automatically configures SSL certificate

### 3. DNS Records

```hcl
# Root domain
resource "cloudflare_record" "root" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "@"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo"
}

# www subdomain
resource "cloudflare_record" "www" {
  zone_id = data.cloudflare_zone.tiga2000_com.id
  name    = "www"
  value   = cloudflare_pages_project.golden_path_demo.subdomain
  type    = "CNAME"
  proxied = true
  comment = "Managed by Terraform - Golden Path Demo WWW"
}
```

**Explanation**:
- **zone_id**: Zone ID (obtained via data source)
- **name**: Record name (`@` means root domain)
- **value**: Points to Pages `.pages.dev` domain
- **type**: Record type (CNAME)
- **proxied**: Enable Cloudflare CDN proxy

### 4. SSL/TLS Configuration

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

**Explanation**:
- **ssl**: SSL mode (`strict` most secure)
- **always_use_https**: Force HTTPS redirect
- **min_tls_version**: Minimum TLS version
- **automatic_https_rewrites**: Auto HTTPS rewrite
- **brotli**: Enable Brotli compression

---

## State Management

### Local State (Default)

Terraform stores state in `terraform.tfstate` file by default.

**Pros**:
- Simple, no extra configuration needed

**Cons**:
- Doesn't support team collaboration
- No state locking
- Easy to lose

### Remote State (Recommended)

#### Option 1: Terraform Cloud

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

**Steps**:
1. Register at [Terraform Cloud](https://app.terraform.io/)
2. Create Organization and Workspace
3. Run `terraform login`
4. Update configuration and `terraform init`

#### Option 2: S3 Backend

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

**Steps**:
1. Create S3 bucket and DynamoDB table
2. Configure AWS credentials
3. Run `terraform init`

---

## Best Practices

### 1. Use Variables

**Not Recommended** ❌:
```hcl
resource "cloudflare_pages_project" "demo" {
  account_id = "abc123"  # Hard-coded
}
```

**Recommended** ✅:
```hcl
resource "cloudflare_pages_project" "demo" {
  account_id = var.cloudflare_account_id
}
```

### 2. Use Data Sources

```hcl
# Reference existing Zone
data "cloudflare_zone" "tiga2000_com" {
  name = "tiga2000.com"
}

resource "cloudflare_record" "root" {
  zone_id = data.cloudflare_zone.tiga2000_com.id  # Use data
  # ...
}
```

### 3. Modularization

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

### 4. Use Workspaces

```bash
# Create environments
terraform workspace new staging
terraform workspace new production

# Switch environments
terraform workspace select production

# View current environment
terraform workspace show
```

### 5. Version Constraints

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"  # Allow 4.x versions
    }
  }
}
```

---

## Common Commands

### Basic Operations

```bash
# Initialize project
terraform init

# Validate configuration
terraform validate

# Format code
terraform fmt

# View execution plan
terraform plan

# Apply changes
terraform apply

# Destroy resources
terraform destroy
```

### State Management

```bash
# View state
terraform show

# List resources
terraform state list

# View specific resource
terraform state show cloudflare_pages_project.golden_path_demo

# Remove resource (doesn't delete actual resource)
terraform state rm cloudflare_record.www

# Import existing resource
terraform import cloudflare_pages_project.demo <project-id>
```

### Output Management

```bash
# View all outputs
terraform output

# View specific output
terraform output deployment_url

# Output as JSON
terraform output -json
```

---

## Troubleshooting

### Issue 1: Provider Authentication Failure

**Error**:
```
Error: failed to create Cloudflare client: invalid credentials
```

**Solution**:
1. Check if API Token is correct
2. Verify Token permissions:
   ```bash
   curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
        -H "Authorization: Bearer YOUR_TOKEN"
   ```
3. Confirm `terraform.tfvars` file exists and format is correct

### Issue 2: Resource Already Exists

**Error**:
```
Error: Pages project "golden-path-demo" already exists
```

**Solution**:

**Option A**: Import existing resource
```bash
terraform import cloudflare_pages_project.golden_path_demo <account-id>/<project-name>
```

**Option B**: Change resource name
```hcl
resource "cloudflare_pages_project" "golden_path_demo_v2" {
  name = "golden-path-demo-v2"
  # ...
}
```

### Issue 3: DNS Record Conflict

**Error**:
```
Error: error creating DNS record: DNS record already exists
```

**Solution**:
1. View existing DNS records
2. Delete conflicting records (or import)
3. Re-run `terraform apply`

### Issue 4: State Lock Error

**Error**:
```
Error: Error acquiring the state lock
```

**Solution**:
```bash
# Force unlock (CAUTION! Ensure no one else is operating)
terraform force-unlock <lock-id>
```

---

## Advanced Configuration

### Conditional Resource Creation

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

### Dynamic Blocks

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

### Multi-Environment Configuration

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

## Security Considerations

### 1. Protect Sensitive Data

```bash
# Never commit these files to Git
echo "terraform.tfvars" >> .gitignore
echo "*.tfstate" >> .gitignore
echo ".terraform/" >> .gitignore
```

### 2. Use Environment Variables

```bash
# Alternative to terraform.tfvars
export TF_VAR_cloudflare_api_token="your-token"
export TF_VAR_cloudflare_account_id="your-account-id"

terraform apply
```

### 3. Limit API Token Permissions

Only grant necessary minimum permissions:
- ✅ Account → Cloudflare Pages → Edit
- ✅ Zone → DNS → Edit
- ❌ Don't use Global API Key

---

## Reference Resources

- [Terraform Cloudflare Provider Documentation](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Terraform Official Documentation](https://developer.hashicorp.com/terraform/docs)
- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)

---

**Last Updated**: 2026-01-27
**Document Version**: 1.0.0
