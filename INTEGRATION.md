# API 和前端集成说明

## 架构概览

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)         │
│  packages/frontend/src/pages/Problems   │
│                                         │
│  useEffect(() => {                      │
│    fetch(API_URL + '/problems')         │
│  })                                     │
└────────────────┬────────────────────────┘
                 │
                 │ HTTP Request
                 │ GET /api/problems
                 ▼
┌─────────────────────────────────────────┐
│      API (Cloudflare Workers + Hono)    │
│     packages/api/src/index.js           │
│                                         │
│  app.get('/api/problems', async (c) => {│
│    const data = import('problems.json') │
│    return c.json({ data })              │
│  })                                     │
└────────────────┬────────────────────────┘
                 │
                 │ Read File
                 ▼
┌─────────────────────────────────────────┐
│         packages/api/data/              │
│         problems.json                   │
│                                         │
│  [ { id, title, description, ... } ]    │
└─────────────────────────────────────────┘
```

## 数据流

### 1. 本地开发环境

- **Frontend**: `http://localhost:5173`
- **API**: `http://api.localhost:8787`
- **Data Source**: `packages/api/data/problems.json`

```javascript
// Frontend 发起请求
const apiUrl = 'http://api.localhost:8787/problems'
const response = await fetch(apiUrl)
const { data } = await response.json()
```

> **注意**: `api.localhost` 会自动解析到 `127.0.0.1`，无需配置 hosts 文件。这样本地开发环境也使用子域名，与生产环境保持一致。

### 2. 生产环境

- **Frontend**: `https://tiga2000.com`
- **API**: `https://api.tiga2000.com`
- **Data Source**: Workers 内嵌的 JSON 数据

```javascript
// Frontend 发起请求
const apiUrl = 'https://api.tiga2000.com/problems'
const response = await fetch(apiUrl)
const { data } = await response.json()
```

## API 端点

### GET /problems

**描述**: 获取所有问题列表

**请求**:
```bash
# 本地开发
curl http://api.localhost:8787/problems

# 生产环境
curl https://api.tiga2000.com/problems
```

**响应**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "问题标题",
      "date": "2026-01-31",
      "category": "分类",
      "description": "问题描述",
      "solution": "解决方案",
      "status": "resolved"
    }
  ],
  "count": 1,
  "timestamp": "2026-02-06T12:00:00.000Z"
}
```

### GET /health

**描述**: 健康检查

**请求**:
```bash
# 本地开发
curl http://api.localhost:8787/health

# 生产环境
curl https://api.tiga2000.com/health
```

**响应**:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

## 前端实现

### Problems.jsx 关键代码

```javascript
// 环境检测
const apiUrl = import.meta.env.PROD
  ? 'https://api.tiga2000.com/problems'
  : 'http://localhost:8787/problems'

// 获取数据
const response = await fetch(apiUrl)
const result = await response.json()
setProblems(result.data || [])

// Fallback 机制
catch (err) {
  // 如果 API 失败，使用本地 JSON
  const fallbackData = await import('../data/problems.json')
  setProblems(fallbackData.default || fallbackData)
}
```

### 状态管理

- **Loading State**: 显示加载中
- **Error State**: 显示错误信息
- **Fallback State**: API 失败时使用本地数据

## CORS 配置

API 已配置 CORS，允许以下来源：

```javascript
const allowed = [
  'https://tiga2000.com',
  'http://localhost:5173'
]
```

## 本地开发步骤

### 1. 启动 API

```bash
# 在项目根目录
npm run dev:api

# 或在 packages/api 目录
cd packages/api
npm run dev
```

API 将在 `http://localhost:8787` 运行

### 2. 启动前端

```bash
# 在项目根目录
npm run dev

# 或在 packages/frontend 目录
cd packages/frontend
npm run dev
```

前端将在 `http://localhost:5173` 运行

### 3. 测试集成

```bash
# 运行集成测试脚本
./test-integration.sh
```

或手动测试：

```bash
# 测试 API
curl http://api.localhost:8787/health
curl http://api.localhost:8787/problems

# 访问前端
open http://localhost:5173/problems
```

## 部署流程

### 1. 前端部署（Cloudflare Pages）

```bash
# CI 会自动构建并部署
git push origin main

# 手动构建
npm run build:frontend

# 构建产物: packages/frontend/dist/
```

### 2. API 部署（Cloudflare Workers）

```bash
# 通过 GitHub Actions 自动部署
git push origin main

# 手动部署
npm run deploy:api

# 或
cd packages/api
npm run deploy
```

## 数据同步

### 问题：如何保持两个 problems.json 同步？

**当前方案**:
- `packages/frontend/src/data/problems.json` - 前端 fallback 数据
- `packages/api/data/problems.json` - API 数据源

**同步脚本** (TODO):

```bash
# 从 frontend 复制到 api
cp packages/frontend/src/data/problems.json packages/api/data/

# 或使用符号链接 (推荐)
ln -s ../../frontend/src/data/problems.json packages/api/data/problems.json
```

**未来改进**:
- 使用 Cloudflare KV 存储数据
- 使用 Cloudflare D1 数据库
- 提供 POST API 让前端添加新问题

## 故障排查

### 问题 1: CORS 错误

**症状**: 浏览器控制台显示 CORS 错误

**解决**:
1. 确认 API 正在运行
2. 检查 API 的 CORS 配置
3. 检查前端请求的 URL 是否正确

### 问题 2: API 404

**症状**: `fetch` 返回 404

**解决**:
1. 确认 API URL 正确
2. 检查 API 路由配置
3. 查看 API 日志: `cd packages/api && npm run tail`

### 问题 3: 数据不同步

**症状**: 前端显示旧数据

**解决**:
1. 清除浏览器缓存
2. 重新部署 API
3. 检查两个 problems.json 文件是否一致

## 监控和日志

### API 日志

```bash
# 查看实时日志
cd packages/api
npm run tail

# 或使用 wrangler
wrangler tail golden-path-demo-api
```

### 前端错误监控

打开浏览器开发者工具 → Console

查看网络请求: Network → Filter: Fetch/XHR

## 性能优化

### 当前状态
- ✅ 前端使用 React.memo 优化组件
- ✅ API 响应包含时间戳
- ✅ Cloudflare Workers 全球分布
- ✅ 前端有 fallback 机制

### 未来优化
- [ ] 添加缓存策略（Cache-Control headers）
- [ ] 使用 SWR 或 React Query 缓存请求
- [ ] API 数据存储到 KV（持久化）
- [ ] 添加分页支持（数据量大时）

## 测试

### 单元测试

```bash
# 测试前端
npm run test:frontend

# 测试 API
npm run test:api
```

### 集成测试

```bash
# 运行集成测试脚本
./test-integration.sh
```

### E2E 测试 (TODO)

使用 Playwright 或 Cypress 测试完整流程

## 环境变量

### Frontend (.env)

```bash
# Development
VITE_API_URL=http://localhost:8787

# Production
VITE_API_URL=https://tiga2000.com/api
```

### API (wrangler.toml)

```toml
[vars]
ENVIRONMENT = "production"
API_VERSION = "1.0.0"
ALLOWED_ORIGINS = "https://tiga2000.com,http://localhost:5173"
```

## 常用命令

```bash
# 同时启动前端和 API
npm run dev:all

# 只启动前端
npm run dev

# 只启动 API
npm run dev:api

# 构建所有包
npm run build

# 部署 API
npm run deploy:api

# 运行测试
npm run test

# Lint 代码
npm run lint
```
