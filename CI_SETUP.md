# 🔄 CI/CD Setup Guide

Complete guide for the Continuous Integration workflow with GitHub Actions.

## 📋 Overview

The CI workflow (`ci.yml`) runs on every **push** and **pull request** to `main` and `develop` branches, performing:

1. ✅ **Linting** - Code style and quality checks
2. 🧪 **Testing** - Unit tests with coverage
3. 🏗️ **Building** - Production build
4. 📦 **Artifacts** - Upload build outputs
5. 📊 **Reports** - Bundle size analysis

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

This installs all required packages including:
- `vitest` - Testing framework
- `@testing-library/react` - React testing utilities
- `eslint` - Code linting
- `@vitest/coverage-v8` - Code coverage

### 2. Available Scripts

Add these to your `package.json` (already added):

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 3. Run Locally

Test the CI steps locally before pushing:

```bash
# Lint
npm run lint

# Test
npm run test

# Build
npm run build
```

## 🔧 Workflow Features

### 1. Dependency Caching

Caches npm dependencies and build artifacts to speed up CI:

```yaml
- name: 📦 Cache dependencies
  uses: actions/cache@v4
  with:
    path: |
      ~/.npm
      node_modules
      .vite
    key: ${{ runner.os }}-node-${{ matrix.node-version }}-${{ hashFiles('**/package-lock.json') }}
```

**Benefits**:
- ⚡ Faster builds (30s → 10s for deps installation)
- 💰 Lower CI costs
- 🔄 Automatic invalidation on `package-lock.json` changes

### 2. Concurrency Control

Cancels old builds when new commits are pushed:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}
  cancel-in-progress: true
```

**Benefits**:
- 🚀 Faster feedback on latest code
- 💰 Saves CI minutes
- 🔄 No queue buildup

### 3. Build Artifacts

Uploads build output for download and inspection:

```yaml
- name: 📤 Upload build artifacts
  uses: actions/upload-artifact@v4
  with:
    name: dist-${{ github.sha }}
    path: dist/
    retention-days: 7
```

**Access**:
1. Go to Actions tab
2. Click on workflow run
3. Scroll to "Artifacts" section
4. Download `dist-{commit-sha}.zip`

### 4. Test Coverage

Uploads coverage reports:

```yaml
- name: 📊 Upload test coverage
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
```

**View Coverage**:
1. Download coverage artifact
2. Open `coverage/index.html` in browser
3. See line-by-line coverage

### 5. Bundle Size Check

Analyzes and comments bundle size on PRs:

```yaml
size-check:
  name: Bundle Size Check
  runs-on: ubuntu-latest
  needs: ci
```

**Features**:
- 📊 Total bundle size
- 📦 Top 3 largest JS files
- 💬 Auto-comments on PRs
- 🔄 Updates existing comment

### 6. Clear Logging

Detailed summaries on success or failure:

**Success**:
```
### ✅ Build Successful

**Build Info:**
- 🔖 Commit: `abc1234`
- 🌿 Branch: `main`
- 👤 Author: Tigayzc
- ⏱️ Node version: 20.x
```

**Failure**:
```
### ❌ Build Failed

**Failed Step:** failure
**Commit:** `abc1234`
**Branch:** `main`

Please check the logs above for detailed error information.
```

## 🧪 Testing Setup

### Test Files

```
src/
├── App.test.jsx                    # App component tests
├── components/
│   └── BuildInfo.test.jsx          # BuildInfo component tests
└── test/
    └── setup.js                    # Test configuration
```

### Writing Tests

Example test file:

```javascript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Run Tests

```bash
# Run once
npm run test

# Watch mode
npm run test:watch

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

### Test Coverage

Coverage reports show:
- **Statements**: % of code statements executed
- **Branches**: % of if/else branches tested
- **Functions**: % of functions called
- **Lines**: % of lines executed

**View Coverage**:
```bash
npm run test:coverage
open coverage/index.html
```

## 🔍 Linting

### ESLint Configuration

Located in `.eslintrc.cjs`:

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
    }],
  },
  globals: {
    __BUILD_INFO__: 'readonly',
  }
}
```

### Run Linter

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Common Fixes

**Unused variables**:
```javascript
// ❌ Error
const unused = 'value'

// ✅ Fix: Remove or prefix with _
const _unused = 'value'
```

**Missing React import** (old React):
```javascript
// ❌ Error (React 16)
function Component() {
  return <div>Hello</div>
}

// ✅ Fix: Import React
import React from 'react'
```

**React 18+ with JSX runtime** (automatic):
```javascript
// ✅ No import needed in React 18+
function Component() {
  return <div>Hello</div>
}
```

## 📊 Workflow Triggers

### Push to Main/Develop

```yaml
on:
  push:
    branches:
      - main
      - develop
```

**What happens**:
1. Run full CI (lint + test + build)
2. Upload artifacts
3. Post summary

### Pull Request

```yaml
on:
  pull_request:
    branches:
      - main
      - develop
```

**What happens**:
1. Run full CI
2. Upload artifacts
3. Run bundle size check
4. Comment bundle size on PR
5. Post summary

## 🔐 Environment Variables

Set in GitHub Actions workflow:

```yaml
env:
  NODE_ENV: production
  VITE_GITHUB_USERNAME: ${{ github.repository_owner }}
  VITE_GITHUB_REPO: ${{ github.event.repository.name }}
  VITE_DOMAIN: tiga2000.com
```

**Automatic variables**:
- `github.repository_owner` - Your GitHub username
- `github.event.repository.name` - Repo name
- `github.sha` - Commit hash
- `github.ref_name` - Branch name

## 🚨 Troubleshooting

### Issue: Tests Fail Locally But Pass in CI

**Cause**: Environment differences

**Solution**:
```bash
# Run tests in CI mode
CI=true npm run test
```

### Issue: Lint Errors

**Common errors**:

1. **Unused variables**:
```bash
npm run lint:fix
```

2. **Import/export syntax**:
```javascript
// ✅ Use ES modules
import { foo } from './bar'
export default Component
```

3. **React hooks rules**:
```javascript
// ✅ Hooks must be at top level
function Component() {
  const [state, setState] = useState()  // ✅ Top level

  if (condition) {
    const [bad] = useState()  // ❌ Conditional
  }
}
```

### Issue: Build Fails in CI

**Check**:
1. Build locally: `npm run build`
2. Check environment variables
3. Verify git is available (for build info)
4. Check node version matches (20.x)

**Debug**:
```bash
# Same environment as CI
docker run -it node:20 bash
npm install
npm run build
```

### Issue: Bundle Size Too Large

**Solutions**:

1. **Code splitting**:
```javascript
// Use dynamic imports
const Component = lazy(() => import('./Component'))
```

2. **Check dependencies**:
```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

3. **Remove unused code**:
```bash
# Check unused exports
npx depcheck
```

## 📈 CI Metrics

Monitor these in Actions tab:

| Metric | Target | Current |
|--------|--------|---------|
| Build Time | < 3 min | Check Actions |
| Test Coverage | > 80% | Run locally |
| Bundle Size | < 500KB | Check PR comment |
| Success Rate | > 95% | Check Actions |

## 🎯 Best Practices

1. **Run CI locally before pushing**:
```bash
npm run lint && npm run test && npm run build
```

2. **Write tests for new features**:
- Minimum 1 test per component
- Test user interactions
- Test edge cases

3. **Keep bundle size small**:
- Code splitting
- Lazy loading
- Tree shaking

4. **Fix lint errors immediately**:
```bash
npm run lint:fix
```

5. **Monitor CI failures**:
- Fix immediately
- Don't accumulate issues

## 🔗 Related Files

- [`.github/workflows/ci.yml`](.github/workflows/ci.yml) - CI workflow
- [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) - Deploy workflow
- [`vitest.config.js`](vitest.config.js) - Test configuration
- [`.eslintrc.cjs`](.eslintrc.cjs) - Lint configuration
- [`package.json`](package.json) - Scripts and dependencies

## 📚 Learn More

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [ESLint Rules](https://eslint.org/docs/latest/rules/)

---

**Quick Commands**:
```bash
npm run lint        # Check code style
npm run test        # Run tests
npm run build       # Build project
git push           # Trigger CI
```
