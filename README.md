# 🛤️ Golden Path Demo

[![CI/CD](https://img.shields.io/github/actions/workflow/status/Tigayzc/golden-path-demo/ci.yml?label=CI&style=flat-square)](https://github.com/Tigayzc/golden-path-demo/actions)
[![Deploy](https://img.shields.io/github/actions/workflow/status/Tigayzc/golden-path-demo/deploy.yml?label=Deploy&style=flat-square)](https://github.com/Tigayzc/golden-path-demo/actions)
[![Cloudflare](https://img.shields.io/badge/Cloudflare-Pages%20%2B%20Workers-F38020?style=flat-square&logo=cloudflare)](https://tiga2000.com)
[![Terraform](https://img.shields.io/badge/IaC-Terraform-7B42BC?style=flat-square&logo=terraform)](./terraform)

A complete monorepo example of modern DevOps workflow best practices, demonstrating the Golden Path from code to production with **Cloudflare Pages (Frontend)** and **Cloudflare Workers (API)**.

## 🌟 Features

- **Monorepo Structure**: Frontend + API in a single repository with npm workspaces
- **Automated CI/CD**: GitHub Actions for automatic build, test, and deployment
- **Edge Computing**:
  - Cloudflare Pages for frontend with global CDN
  - Cloudflare Workers for serverless API
- **Infrastructure as Code**: Terraform manages all cloud resources
- **Custom Domain**: `tiga2000.com` with SSL certificate configuration
- **API Routes**: `/api/*` paths served by Cloudflare Workers
- **Health Monitoring**: API health check endpoints
- **Modern Stack**: React + Vite + Hono + Cloudflare

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│              GitHub Repository (Monorepo)                    │
│  ┌──────────────────┐    ┌─────────────────────┐            │
│  │ packages/frontend│    │   packages/api      │            │
│  │  (React + Vite)  │    │  (Hono + Workers)   │            │
│  └──────────────────┘    └─────────────────────┘            │
└────────────┬──────────────────────┬──────────────────────────┘
             │                      │
             ▼                      ▼
     ┌──────────────┐      ┌──────────────┐
     │GitHub Actions│      │GitHub Actions│
     │  (CI + Test) │      │ (API Deploy) │
     └──────┬───────┘      └──────┬───────┘
            │                     │
            ▼                     ▼
     ┌──────────────┐      ┌──────────────┐
     │  Cloudflare  │      │  Cloudflare  │
     │    Pages     │      │   Workers    │
     └──────┬───────┘      └──────┬───────┘
            │                     │
            │                     │
            ▼                     ▼
    ┌────────────┐        ┌─────────────┐
    │tiga2000.com│        │api.tiga2000 │
    │            │        │    .com     │
    │  Frontend  │◄───────┤             │
    │   (SPA)    │  fetch │  REST API   │
    └────────────┘        └─────────────┘
         │                       │
         ├── / (Home)            ├── /health
         ├── /under-the-hood     ├── /problems
         ├── /under-the-hood/problems
         └── /build-info         └── /build-info
                 │
                 ▼
        ┌────────────────┐
        │   Terraform    │
        │  (IaC: DNS,    │
        │   SSL, Routes) │
        └────────────────┘

User Request Flow:
  1. User → https://tiga2000.com (Cloudflare Pages)
  2. Frontend → https://api.tiga2000.com/problems (Cloudflare Workers)
  3. Workers → Return JSON data
  4. Frontend → Render UI
```

## 📦 Project Structure

```
golden-path-demo/
├── packages/
│   ├── frontend/              # Cloudflare Pages (React + Vite)
│   │   ├── src/
│   │   ├── public/
│   │   ├── package.json
│   │   └── vite.config.js
│   └── api/                   # Cloudflare Workers (Hono)
│       ├── src/
│       ├── package.json
│       └── wrangler.toml
├── .github/workflows/
│   ├── ci.yml                 # CI: Lint, Test, Build
│   ├── deploy.yml             # Deploy Frontend to Pages
│   └── deploy-api.yml         # Deploy API to Workers
├── terraform/                 # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── terraform.tfvars.example
├── package.json               # Root workspace config
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 9+

### Local Development

```bash
# Install all dependencies (root + workspaces)
npm install

# Start frontend development server
npm run dev
# Or: npm run dev --workspace=frontend

# Start API development server
npm run dev:api
# Or: npm run dev --workspace=api

# Start both frontend and API
npm run dev:all

# Build all packages
npm run build

# Build specific package
npm run build:frontend
npm run build:api

# Run tests for all packages
npm run test

# Lint all packages
npm run lint
```

### Frontend
Visit [http://localhost:5173](http://localhost:5173)

### API
Visit [http://localhost:8787/api/health](http://localhost:8787/api/health)

### Requirements

- Node.js 20+
- npm or yarn
- Git
- Terraform 1.0+ (optional, for infrastructure management)

## 📦 Deployment

### 1. GitHub Repository Setup

1. Create a new repository `golden-path-demo`
2. Push code to `main` branch

```bash
git init
git add .
git commit -m "Initial commit: Golden Path Demo setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/golden-path-demo.git
git push -u origin main
```

### 2. Cloudflare Pages Configuration

#### Method A: Via Cloudflare Dashboard (Quick Start)

1. Login to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create Application** → **Pages**
3. Connect GitHub repository `golden-path-demo`
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20`
5. Click **Save and Deploy**

#### Method B: Via GitHub Actions (Automated)

1. Configure Secrets in GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token ([How to get](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/))
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

2. GitHub Actions will automatically deploy on every push to `main` branch

### 3. Terraform Infrastructure Setup (Optional)

Use Terraform to manage Cloudflare Pages project, DNS records, and SSL configuration.

```bash
cd terraform

# Copy configuration template
cp terraform.tfvars.example terraform.tfvars

# Edit terraform.tfvars with your credentials
# cloudflare_api_token = "your-token"
# cloudflare_account_id = "your-account-id"
# github_username = "YOUR_USERNAME"

# Initialize Terraform
terraform init

# View execution plan
terraform plan

# Apply configuration
terraform apply
```

### 4. Custom Domain Configuration

1. Add custom domain `tiga2000.com` in Cloudflare Pages project
2. Configure DNS records (Terraform handles this automatically, or configure manually):
   - `CNAME` record: `@` → `golden-path-demo.pages.dev`
   - `CNAME` record: `www` → `golden-path-demo.pages.dev`
3. Enable **Always Use HTTPS** and **Automatic HTTPS Rewrites**

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18 |
| **Build Tool** | Vite 5 |
| **Hosting** | Cloudflare Pages |
| **CI/CD** | GitHub Actions |
| **Infrastructure** | Terraform |
| **DNS & CDN** | Cloudflare |
| **Version Control** | Git + GitHub |

## 📖 Documentation

- [Operations Runbook (RUNBOOK.md)](./docs/RUNBOOK.md) - Troubleshooting, monitoring, and operations
- [Deployment Guide (DEPLOYMENT.md)](./docs/DEPLOYMENT.md) - Detailed deployment steps
- [Terraform Documentation (TERRAFORM.md)](./docs/TERRAFORM.md) - IaC configuration guide

## 🏥 Health Check

Visit [https://tiga2000.com/health](https://tiga2000.com/health) to check system status.

Example response:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-27T00:00:00.000Z",
  "version": "1.0.0",
  "environment": "production",
  "services": {
    "frontend": "operational",
    "cdn": "operational"
  }
}
```

## 📁 Project Structure

```
golden-path-demo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── public/
│   └── health                  # Health check endpoint
├── src/
│   ├── pages/Home.jsx          # Personal homepage (/)
│   ├── pages/UnderTheHood.jsx  # How this site is built (/under-the-hood)
│   ├── pages/Problems.jsx      # Problems & Solutions (/under-the-hood/problems)
│   ├── main.jsx                # Application entry point & routes
│   └── index.css               # Global styles
├── terraform/
│   ├── main.tf                 # Terraform main configuration
│   ├── variables.tf            # Variable definitions
│   ├── terraform.tfvars.example # Configuration example
│   └── .gitignore              # Terraform ignore rules
├── docs/
│   ├── RUNBOOK.md              # Operations runbook
│   ├── DEPLOYMENT.md           # Deployment guide
│   └── TERRAFORM.md            # Terraform documentation
├── index.html                  # HTML template
├── vite.config.js              # Vite configuration
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## 🔧 Troubleshooting

### Build Failure

Check if Node.js version is 20+:
```bash
node -v
```

### Deployment Failure

1. Verify GitHub Secrets configuration is correct
2. Check [GitHub Actions logs](https://github.com/YOUR_USERNAME/golden-path-demo/actions)
3. Validate Cloudflare API Token permissions

### Domain Not Accessible

1. Confirm DNS records have propagated (may take 5-10 minutes)
2. Check Cloudflare SSL/TLS setting is "Full (Strict)"
3. Use `dig tiga2000.com` to verify DNS resolution

## 📝 TODO

- [ ] Add unit tests (Jest + React Testing Library)
- [ ] Integrate performance monitoring (Cloudflare Web Analytics)
- [ ] Implement A/B testing
- [ ] Add Lighthouse CI
- [ ] Configure Dependabot for automatic dependency updates

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

## 🔗 Related Links

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Terraform Cloudflare Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)

---

Made with ❤️ using Golden Path Best Practices
