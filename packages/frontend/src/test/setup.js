import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// 每次测试后清理 DOM
afterEach(() => {
  cleanup()
})

// 模拟环境变量
global.import = {
  meta: {
    env: {
      VITE_GITHUB_USERNAME: 'Tigayzc',
      VITE_GITHUB_REPO: 'golden-path-demo',
      VITE_DOMAIN: 'tiga2000.com',
      MODE: 'test',
    }
  }
}
