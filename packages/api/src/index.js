import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import problemsData from '../data/problems.json'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: (origin) => {
    // 允许生产环境和本地开发的所有端口
    const allowed = [
      'https://tiga2000.com',
      'https://api.tiga2000.com'
    ]
    if (allowed.includes(origin)) {
      return origin
    }
    // 允许所有 localhost 端口（用于本地开发）
    if (origin && origin.startsWith('http://localhost:')) {
      return origin
    }
    return null
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}))

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: c.env.API_VERSION || '1.0.0',
    environment: c.env.ENVIRONMENT || 'development',
  })
})

// Get build info
app.get('/build-info', (c) => {
  return c.json({
    version: '1.0.0',
    apiVersion: c.env.API_VERSION || '1.0.0',
    environment: c.env.ENVIRONMENT || 'development',
    buildTime: new Date().toISOString(),
  })
})

// Get problems data from JSON file
app.get('/problems', async (c) => {
  try {
    // problemsData 已经在文件顶部导入
    return c.json({
      data: problemsData,
      count: problemsData.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error loading problems data:', error)
    return c.json({
      error: 'Failed to load problems data',
      message: error.message
    }, 500)
  }
})

// Create a new problem (example POST endpoint)
app.post('/problems', async (c) => {
  try {
    const body = await c.req.json()

    // 验证必需字段
    const required = ['title', 'category', 'description', 'solution', 'status']
    for (const field of required) {
      if (!body[field]) {
        return c.json({ error: `Missing required field: ${field}` }, 400)
      }
    }

    // 这里应该保存到数据库
    const newProblem = {
      id: Date.now(), // 临时 ID，应该从数据库生成
      ...body,
      date: new Date().toISOString().split('T')[0],
    }

    return c.json({ data: newProblem, message: 'Problem created successfully' }, 201)
  } catch (error) {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found', path: c.req.path }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`)
  return c.json({ error: 'Internal Server Error', message: err.message }, 500)
})

export default app
