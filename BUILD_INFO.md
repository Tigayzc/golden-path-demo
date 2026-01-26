# 🏗️ Build Information Feature

This document explains the build-time version information feature that displays git commit hash, build time, and environment details.

## 📋 Features

- **Git Commit Hash**: Full and short commit SHA
- **Git Branch**: Current branch name
- **Build Time**: ISO 8601 formatted timestamp
- **Build Age**: Human-readable time since build
- **Environment**: dev/staging/production badge
- **Version**: Semantic version number
- **Interactive UI**: Floating button with expandable panel

## 🎯 How It Works

### 1. Build-Time Injection (Vite Config)

The `vite.config.js` file injects build information at **build time**:

```javascript
// vite.config.js
export default defineConfig(({ mode }) => {
  const buildInfo = getBuildInfo()  // 在构建时执行 git 命令

  return {
    define: {
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
```

**Key Points**:
- Executes `git` commands during build process
- Injects values as compile-time constants
- No runtime dependencies required
- Works in CI/CD environments

### 2. React Component

The `BuildInfo` component displays the information:

```jsx
// src/components/BuildInfo.jsx
const buildInfo = typeof __BUILD_INFO__ !== 'undefined' ? __BUILD_INFO__ : {
  // fallback values for development
}
```

**Features**:
- Floating button in bottom-right corner
- Expandable panel with detailed information
- Environment-specific color badges
- Clickable commit hash linking to GitHub
- Responsive design for mobile

### 3. TypeScript Definitions

Type safety for the global constant:

```typescript
// src/vite-env.d.ts
declare const __BUILD_INFO__: {
  version: string
  gitCommitHash: string
  // ...
}
```

## 🚀 Usage

### Development Mode

When running in development, build info uses fallback values:

```bash
npm run dev
```

**Output**:
- Commit: `dev-local` (or actual git commit if in a repo)
- Environment: `development`
- Build Time: Current timestamp

### Production Build

Build with version information:

```bash
npm run build
```

This will:
1. Execute git commands to get commit info
2. Capture current timestamp
3. Inject values into the bundle
4. Build the production app

### With Build Info Script (Optional)

Generate `build-info.json` file:

```bash
npm run build:info
```

This also creates `public/build-info.json` accessible at runtime.

## 📊 Display Formats

### Compact View (Default)

```
ℹ️ v1.0.0 [production]
```

### Expanded Panel

```
┌─────────────────────────────────┐
│ Build Information            ×  │
├─────────────────────────────────┤
│ Version:        1.0.0            │
│ Environment:    [production]     │
│ Git Commit:     abc1234          │
│ Git Branch:     main             │
│ Build Time:     Jan 27, 2026...  │
│ Build Age:      2 hours ago      │
│ Full Hash:      abc1234def...    │
├─────────────────────────────────┤
│ 🛤️ Built with Golden Path CI/CD │
└─────────────────────────────────┘
```

## 🎨 Environment Badges

| Environment | Color | Use Case |
|-------------|-------|----------|
| `production` | 🟢 Green | Live production builds |
| `staging` | 🟡 Orange | Staging/preview builds |
| `development` | 🔵 Blue | Local development |

## 🔧 Configuration

### Change Version Number

Edit `vite.config.js`:

```javascript
__BUILD_INFO__: JSON.stringify({
  version: '2.0.0',  // ← Change here
  // ...
})
```

Or read from `package.json`:

```javascript
import pkg from './package.json' assert { type: 'json' }

__BUILD_INFO__: JSON.stringify({
  version: pkg.version,  // ← Use package.json version
  // ...
})
```

### Customize GitHub Link

Edit `src/components/BuildInfo.jsx`:

```jsx
<a
  href={`https://github.com/YOUR_USERNAME/golden-path-demo/commit/${buildInfo.gitCommitHash}`}
  // ↑ Replace YOUR_USERNAME
>
  {buildInfo.gitCommitShort}
</a>
```

### Hide in Production

Conditionally render:

```jsx
// App.jsx
{process.env.NODE_ENV !== 'production' && <BuildInfo />}
```

## 🔍 Troubleshooting

### Issue: "git: command not found"

**Solution**: Ensure git is installed and in PATH:

```bash
git --version
```

If not found, the component uses fallback values automatically.

### Issue: Build info shows "dev-local" in production

**Cause**: Git commands failed during build.

**Solution**:
1. Verify you're building from a git repository
2. Check CI/CD has git installed
3. Ensure `.git` directory exists

### Issue: Build time not updating

**Cause**: Vite may cache the build config.

**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

### Issue: TypeScript errors about __BUILD_INFO__

**Solution**: Ensure `src/vite-env.d.ts` is included:

```json
// tsconfig.json
{
  "include": ["src"]
}
```

## 📦 CI/CD Integration

### GitHub Actions

The build automatically captures git info:

```yaml
# .github/workflows/deploy.yml
- name: Build project
  run: npm run build
  # Git info is automatically available in the repo
```

No additional configuration needed!

### Docker Builds

Pass git info as build args:

```dockerfile
ARG GIT_COMMIT
ARG BUILD_TIME

ENV VITE_GIT_COMMIT=$GIT_COMMIT
ENV VITE_BUILD_TIME=$BUILD_TIME
```

```bash
docker build \
  --build-arg GIT_COMMIT=$(git rev-parse HEAD) \
  --build-arg BUILD_TIME=$(date -u +%Y-%m-%dT%H:%M:%SZ) \
  -t app .
```

## 📝 File Structure

```
golden-path-demo/
├── scripts/
│   └── generate-build-info.js    # Optional: Generate JSON file
├── src/
│   ├── components/
│   │   ├── BuildInfo.jsx         # Main component
│   │   └── BuildInfo.css         # Styles
│   └── vite-env.d.ts             # TypeScript definitions
├── vite.config.js                # Build-time injection
└── BUILD_INFO.md                 # This file
```

## 🎓 Best Practices

1. **Use in Footer**: Display version for transparency
2. **Link to Commits**: Help users report bugs with exact version
3. **Show in Dev Tools**: Console log build info on app load
4. **Cache Busting**: Use build timestamp for cache keys
5. **Error Reporting**: Include build info in error reports

### Example: Console Log

```javascript
// App.jsx or main.jsx
if (typeof __BUILD_INFO__ !== 'undefined') {
  console.log('🏗️ Build Info:', __BUILD_INFO__)
}
```

### Example: Error Reporting (Sentry)

```javascript
Sentry.setContext('build', {
  version: __BUILD_INFO__.version,
  commit: __BUILD_INFO__.gitCommitHash,
  buildTime: __BUILD_INFO__.buildTime,
})
```

## 🔗 Related

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Build Optimization Guide](./docs/DEPLOYMENT.md)
- [CI/CD Setup](./.github/workflows/deploy.yml)

---

**Last Updated**: 2026-01-27
**Version**: 1.0.0
