import React, { useState } from 'react'
import './BuildInfo.css'

/**
 * BuildInfo 组件 - 显示构建版本信息
 * 包含 git commit hash、构建时间、环境等信息
 */
function BuildInfo() {
  const [isExpanded, setIsExpanded] = useState(false)

  // 从 Vite 注入的构建信息中获取数据
  const buildInfo = typeof __BUILD_INFO__ !== 'undefined' ? __BUILD_INFO__ : {
    version: '1.0.0',
    gitCommitHash: 'dev-local',
    gitCommitShort: 'dev',
    gitBranch: 'main',
    buildTime: new Date().toISOString(),
    buildTimestamp: Date.now(),
    environment: 'development',
  }

  // 格式化构建时间
  const formatBuildTime = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    })
  }

  // 计算构建距今时间
  const getTimeSinceBuild = () => {
    const now = Date.now()
    const diff = now - buildInfo.buildTimestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    return 'just now'
  }

  // 环境标签样式
  const getEnvBadgeClass = () => {
    switch (buildInfo.environment) {
      case 'production':
        return 'env-badge env-prod'
      case 'staging':
        return 'env-badge env-staging'
      default:
        return 'env-badge env-dev'
    }
  }

  return (
    <div className="build-info-container">
      <button
        className="build-info-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label="Toggle build information"
        title="Click to view build details"
      >
        <span className="build-info-icon">ℹ️</span>
        <span className="build-info-version">v{buildInfo.version}</span>
        <span className={getEnvBadgeClass()}>
          {buildInfo.environment}
        </span>
      </button>

      {isExpanded && (
        <div className="build-info-panel">
          <div className="build-info-header">
            <h3>Build Information</h3>
            <button
              className="build-info-close"
              onClick={() => setIsExpanded(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="build-info-content">
            <div className="build-info-row">
              <span className="build-info-label">Version:</span>
              <span className="build-info-value">{buildInfo.version}</span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Environment:</span>
              <span className="build-info-value">
                <span className={getEnvBadgeClass()}>
                  {buildInfo.environment}
                </span>
              </span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Git Commit:</span>
              <span className="build-info-value build-info-mono">
                <a
                  href={`https://github.com/${import.meta.env.VITE_GITHUB_USERNAME}/${import.meta.env.VITE_GITHUB_REPO}/commit/${buildInfo.gitCommitHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="commit-link"
                  title={`View commit ${buildInfo.gitCommitHash}`}
                >
                  {buildInfo.gitCommitShort}
                </a>
              </span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Git Branch:</span>
              <span className="build-info-value build-info-mono">
                {buildInfo.gitBranch}
              </span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Build Time:</span>
              <span className="build-info-value">
                {formatBuildTime(buildInfo.buildTime)}
              </span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Build Age:</span>
              <span className="build-info-value">
                {getTimeSinceBuild()}
              </span>
            </div>

            <div className="build-info-row">
              <span className="build-info-label">Full Commit Hash:</span>
              <span className="build-info-value build-info-mono build-info-small">
                {buildInfo.gitCommitHash}
              </span>
            </div>
          </div>

          <div className="build-info-footer">
            <small>🛤️ Built with Golden Path CI/CD</small>
          </div>
        </div>
      )}
    </div>
  )
}

export default BuildInfo
