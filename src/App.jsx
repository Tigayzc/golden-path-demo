import React from 'react'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🛤️ Golden Path Demo</h1>
          <p className="subtitle">Modern DevOps Workflow Best Practices</p>
        </div>
      </header>

      <main className="container">
        {/* CI 状态徽章 */}
        <section className="badges">
          <img
            src="https://img.shields.io/github/actions/workflow/status/YOUR_USERNAME/golden-path-demo/deploy.yml?label=CI%2FCD&style=flat-square"
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
            <svg viewBox="0 0 800 400" className="arch-diagram">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                </marker>
              </defs>

              {/* GitHub */}
              <rect x="50" y="150" width="120" height="80" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2"/>
              <text x="110" y="195" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="bold">GitHub</text>
              <text x="110" y="215" textAnchor="middle" fill="#94a3b8" fontSize="12">Source Code</text>

              {/* GitHub Actions */}
              <rect x="240" y="150" width="140" height="80" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2"/>
              <text x="310" y="190" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="bold">GitHub Actions</text>
              <text x="310" y="210" textAnchor="middle" fill="#94a3b8" fontSize="12">CI/CD Pipeline</text>

              {/* Cloudflare Pages */}
              <rect x="450" y="150" width="140" height="80" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2"/>
              <text x="520" y="185" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="bold">Cloudflare</text>
              <text x="520" y="205" textAnchor="middle" fill="#94a3b8" fontSize="12">Pages + CDN</text>
              <text x="520" y="220" textAnchor="middle" fill="#94a3b8" fontSize="11">tiga2000.com</text>

              {/* Terraform */}
              <rect x="240" y="50" width="140" height="60" rx="8" fill="#1e293b" stroke="#7B42BC" strokeWidth="2"/>
              <text x="310" y="80" textAnchor="middle" fill="#f1f5f9" fontSize="16" fontWeight="bold">Terraform</text>
              <text x="310" y="98" textAnchor="middle" fill="#94a3b8" fontSize="12">IaC Config</text>

              {/* Arrows */}
              <line x1="170" y1="190" x2="240" y2="190" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <line x1="380" y1="190" x2="450" y2="190" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)"/>
              <line x1="310" y1="110" x2="520" y2="150" stroke="#7B42BC" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>

              {/* Labels */}
              <text x="205" y="175" textAnchor="middle" fill="#3b82f6" fontSize="11">push</text>
              <text x="415" y="175" textAnchor="middle" fill="#10b981" fontSize="11">deploy</text>
              <text x="380" y="130" textAnchor="middle" fill="#7B42BC" fontSize="11">manage DNS</text>
            </svg>
            <p className="diagram-note">
              Architecture Flow: Code Push → CI Build → Deploy to Cloudflare Pages → Terraform manages DNS
            </p>
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
            <a href="https://github.com/YOUR_USERNAME/golden-path-demo" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {' · '}
            <a href="https://tiga2000.com" target="_blank" rel="noopener noreferrer">
              tiga2000.com
            </a>
            {' · '}
            <a href="/health">Health Check</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
