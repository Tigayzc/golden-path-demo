import React from 'react'
import { Link } from 'react-router-dom'
import './UnderTheHood.css'
import BuildInfo from '../components/BuildInfo'

function UnderTheHood() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div>
              <Link to="/" className="home-link">← Home</Link>
              <h1>🛠️ Under the Hood</h1>
              <p className="subtitle">How this site is built · Golden Path: Modern DevOps Workflow Best Practices</p>
            </div>
            <Link to="/under-the-hood/problems" className="problems-button">
              ⚠️ Problems & Solutions
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        {/* CI 状态徽章 */}
        <section className="badges">
          <img
            src={`https://img.shields.io/github/actions/workflow/status/${import.meta.env.VITE_GITHUB_USERNAME}/${import.meta.env.VITE_GITHUB_REPO}/deploy.yml?label=CI%2FCD&style=flat-square`}
            alt="CI/CD Status"
          />
          <img
            src="https://img.shields.io/badge/Cloudflare-Pages-F38020?style=flat-square&logo=cloudflare"
            alt="Cloudflare Pages"
          />
          <img
            src="https://img.shields.io/badge/IaC-Terraform-7B42BC?style=flat-square&logo=terraform"
            alt="Terraform"
          />
          <img
            src="https://img.shields.io/badge/Health-Check-success?style=flat-square"
            alt="Health Status"
          />
        </section>

        {/* Project Overview */}
        <section className="card">
          <h2>📋 Project Overview</h2>
          <p>
            This project demonstrates a complete modern DevOps workflow, featuring:
          </p>
          <ul className="feature-list">
            <li><strong>Automated Deployment</strong>: GitHub Actions CI/CD for automatic builds and deployments</li>
            <li><strong>Edge Hosting</strong>: Cloudflare Pages with global CDN acceleration</li>
            <li><strong>Infrastructure as Code</strong>: Terraform for DNS and domain management</li>
            <li><strong>Custom Domain</strong>: <code>tiga2000.com</code> with SSL certificate configuration</li>
            <li><strong>Health Monitoring</strong>: <a href="/health">/health</a> endpoint for system status</li>
          </ul>
        </section>

        {/* System Architecture */}
        <section className="card">
          <h2>🏗️ System Architecture</h2>
          <div className="architecture-placeholder">
            <img
              src="/images/SystemArchitecture1.drawio.svg"
              alt="System Architecture Diagram"
              className="arch-diagram"
              style={{ width: '100%', maxWidth: '700px', height: 'auto' }}
            />
            
          </div>
        </section>

        {/* Health Check */}
        <section className="card">
          <h2>🏥 Health Check</h2>
          <div className="health-endpoint">
            <p>Visit the <a href="/health" className="endpoint-link">/health</a> endpoint to check system status</p>
            <div className="health-preview">
              <pre><code>{`{
  "status": "healthy",
  "timestamp": "${new Date().toISOString()}",
  "version": "1.0.0",
  "environment": "production"
}`}</code></pre>
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section className="card">
          <h2>📖 Documentation</h2>
          <div className="runbook-links">
            <a href="/docs/RUNBOOK.md" className="runbook-link">
              <span className="icon">📘</span>
              <div>
                <h3>Operations Runbook</h3>
                <p>Deployment procedures, troubleshooting, and monitoring setup</p>
              </div>
            </a>
            <a href="/docs/DEPLOYMENT.md" className="runbook-link">
              <span className="icon">🚀</span>
              <div>
                <h3>Deployment Guide</h3>
                <p>Complete setup for GitHub Actions + Cloudflare Pages</p>
              </div>
            </a>
            <a href="/docs/TERRAFORM.md" className="runbook-link">
              <span className="icon">🏗️</span>
              <div>
                <h3>Terraform Documentation</h3>
                <p>Infrastructure as Code configuration and management</p>
              </div>
            </a>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="card tech-stack">
          <h2>🛠️ Tech Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>Frontend</strong>
              <span>React + Vite</span>
            </div>
            <div className="tech-item">
              <strong>CI/CD</strong>
              <span>GitHub Actions</span>
            </div>
            <div className="tech-item">
              <strong>Hosting</strong>
              <span>Cloudflare Pages</span>
            </div>
            <div className="tech-item">
              <strong>IaC</strong>
              <span>Terraform</span>
            </div>
            <div className="tech-item">
              <strong>Domain</strong>
              <span>tiga2000.com</span>
            </div>
            <div className="tech-item">
              <strong>Monitoring</strong>
              <span>Health Check API</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>Made with ❤️ using Golden Path Best Practices</p>
          <p className="footer-links">
            <a href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME}/${import.meta.env.VITE_GITHUB_REPO}`} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' · '}
            <a href={`https://${import.meta.env.VITE_DOMAIN}`} target="_blank" rel="noopener noreferrer">
              {import.meta.env.VITE_DOMAIN}
            </a>
            {' · '}
            <a href="/health">Health Check</a>
          </p>
        </div>
      </footer>

      {/* Build Info Component - 右下角版本信息 */}
      <BuildInfo />
    </div>
  )
}

export default UnderTheHood
