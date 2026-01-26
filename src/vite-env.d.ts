/// <reference types="vite/client" />

// 声明全局构建信息类型
declare const __BUILD_INFO__: {
  version: string
  gitCommitHash: string
  gitCommitShort: string
  gitBranch: string
  buildTime: string
  buildTimestamp: number
  environment: string
}
