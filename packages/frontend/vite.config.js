import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

/**
 * 安全执行 git 命令
 */
function execGitCommand(command, fallback = 'unknown') {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch (error) {
    return fallback
  }
}

/**
 * 获取构建时信息
 */
function getBuildInfo() {
  const commitHash = execGitCommand('git rev-parse HEAD', 'dev-local')
  const commitHashShort = execGitCommand('git rev-parse --short HEAD', 'dev')
  const branch = execGitCommand('git rev-parse --abbrev-ref HEAD', 'main')
  const buildTime = new Date().toISOString()
  const buildTimestamp = Date.now()

  return {
    commitHash,
    commitHashShort,
    branch,
    buildTime,
    buildTimestamp,
  }
}

export default defineConfig(({ mode }) => {
  const buildInfo = getBuildInfo()

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    define: {
      // 注入构建时变量到代码中
      __BUILD_INFO__: JSON.stringify({
        version: '1.0.0',
        gitCommitHash: buildInfo.commitHash,
        gitCommitShort: buildInfo.commitHashShort,
        gitBranch: buildInfo.branch,
        buildTime: buildInfo.buildTime,
        buildTimestamp: buildInfo.buildTimestamp,
        environment: mode,
      })
    }
  }
})
