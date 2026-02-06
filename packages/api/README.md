# Golden Path Demo API

Cloudflare Workers API for the Golden Path Demo project.

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono (lightweight, fast web framework)
- **Deployment**: Wrangler CLI
- **Testing**: Vitest

## API Endpoints

### Health Check

```bash
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T12:00:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### Get Build Info

```bash
GET /api/build-info
```

Response:
```json
{
  "version": "1.0.0",
  "apiVersion": "1.0.0",
  "environment": "production",
  "buildTime": "2026-02-06T12:00:00.000Z"
}
```

### Get Problems

```bash
GET /api/problems
```

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Problem title",
      "date": "2026-01-31",
      "category": "Cloudflare",
      "description": "Problem description",
      "solution": "Solution description",
      "status": "resolved"
    }
  ],
  "count": 1
}
```

### Create Problem

```bash
POST /api/problems
Content-Type: application/json

{
  "title": "New problem",
  "category": "Frontend",
  "description": "Problem description",
  "solution": "Solution description",
  "status": "resolved"
}
```

Response:
```json
{
  "data": {
    "id": 1234567890,
    "title": "New problem",
    "date": "2026-02-06",
    "category": "Frontend",
    "description": "Problem description",
    "solution": "Solution description",
    "status": "resolved"
  },
  "message": "Problem created successfully"
}
```

## Development

```bash
# Install dependencies (from project root)
npm install

# Start development server
npm run dev:api

# Or from this directory
npm run dev
```

The API will be available at `http://localhost:8787/api/*`

## Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy:api

# Or from this directory
npm run deploy
```

## Configuration

Edit `wrangler.toml` to configure:
- Worker name
- Routes (URL patterns)
- Environment variables
- KV namespaces
- D1 databases

## Environment Variables

Set in `wrangler.toml`:

- `ENVIRONMENT`: Current environment (development/production)
- `API_VERSION`: API version
- `ALLOWED_ORIGINS`: CORS allowed origins

## Testing

```bash
# Run tests
npm run test:api

# Watch mode
npm run test:watch
```

## Logs

View live logs:

```bash
npm run tail
```

## Adding New Endpoints

1. Add route handler in `src/index.js`
2. Add tests if needed
3. Update this README with API documentation
4. Deploy

Example:

```javascript
app.get('/api/new-endpoint', (c) => {
  return c.json({ message: 'Hello from new endpoint' })
})
```
