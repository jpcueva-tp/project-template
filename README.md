# project-template

[![Playwright Tests](https://github.com/jpcueva-tp/project-template/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/jpcueva-tp/project-template/actions/workflows/playwright.yml) [![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://jpcueva-tp.github.io/project-template/)

A Playwright web testing project template with TypeScript, featuring page object model architecture, custom fixtures, and automated local server management.

## Features

- **Automated Dev Server** - Tests automatically start/stop the local server
- **Page Object Model** - Clean, maintainable test architecture
- **Custom Fixtures** - Pre-configured page objects injected into tests
- **Visual Testing** - Screenshot comparison support
- **Multi-Browser Support** - Chromium enabled by default, Firefox/WebKit ready to enable
- **TypeScript** - Full type safety across tests and page objects
- **CI/CD Ready** - GitHub Actions workflow with browser caching and GitHub Pages reports

## Quick Start

```bash
# Install dependencies
npm install

# Run tests (server auto-starts)
npm test

# Start dev server manually
npm run server
```

## Project Structure

```
project-template/
├── playwright/
│   ├── fixtures.ts            # Custom test fixtures
│   ├── pages/                 # Page object models
│   ├── pages-screenshots/     # Visual regression baselines
│   ├── playwright-report/     # HTML test reports
│   ├── test-results/          # Test execution artifacts
│   └── tests/                 # Test specs
├── public/                    # Static HTML/CSS/JS files
├── playwright.config.ts       # Playwright configuration
└── .env                       # Environment variables
```

## Available Commands

```bash
# Development
npm run server         # Start dev server on localhost:3000

# Testing
npm test              # Run all tests (server auto-starts)
npm run test:headed   # Run with visible browser
npm run test:ui       # Interactive UI mode
npm run test:report   # View HTML test report
```

## How It Works

### Automated Server Management

The config includes a `webServer` setting that automatically starts your local server before tests run and stops it when done:

```typescript
webServer: {
  command: 'npx serve public -l 3000',
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
}
```

### Custom Fixtures Pattern

Tests use custom fixtures to inject pre-configured page objects:

```typescript
// playwright/tests/index-page.spec.ts
test('should load page elements', async ({ indexPage }) => {
  await indexPage.goto();
  await indexPage.assertPageElementsLoaded();
});
```

The `indexPage` fixture is defined in `fixtures.ts` and automatically provides an initialized `IndexPage` object.

### Page Object Model

Page objects encapsulate selectors and interactions:

```typescript
// playwright/pages/index-page.ts
export class IndexPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async assertPageElementsLoaded() {
    await expect(this.page).toHaveTitle(/Test Website/);
  }
}
```

## Writing Tests

1. **Create a page object** in `playwright/pages/your-page.ts`
2. **Add fixture** in `playwright/fixtures.ts` if needed
3. **Write test spec** in `playwright/tests/your-page.spec.ts`

Example test structure:

```typescript
import { test } from '../fixtures';

test.describe('Your Page', () => {
  test('should do something', async ({ yourPage }) => {
    await yourPage.goto();
    await yourPage.doAction();
  });
});
```

## Configuration

Key config options in `playwright.config.ts`:

- `testDir: './playwright/tests'` - Test location (relative to config)
- `baseURL: process.env.BASE_URL || 'http://localhost:3000'` - Base URL for tests
- `projects` - Browser configurations (Chromium, Firefox, WebKit)
- `webServer` - Auto-start dev server (only for localhost)

### Environment Variables

Create a `.env` file in the project root to configure the base URL:

```bash
# .env
BASE_URL=https://staging.example.com
```

**Local development:**
```bash
npm test  # Uses http://localhost:3000, starts local server
```

**Test external environments:**
```bash
BASE_URL=https://staging.example.com npm test  # No local server
```

The webServer only starts if BASE_URL is unset or points to localhost/127.0.0.1.

## CI/CD

Tests run automatically via GitHub Actions:

**Triggers:**
- **Push to main/master** - Tests run on every commit
- **Pull Requests** - Tests run when PRs are opened or updated

**Configuration** (`.github/workflows/playwright.yml`):
```yaml
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
```

**Testing against different environments in CI:**

```yaml
# .github/workflows/playwright.yml
- name: Run Playwright tests
  env:
    BASE_URL: ${{ secrets.STAGING_URL }}  # Set in GitHub secrets
  run: npm test
```

**Common CI patterns:**
- Test staging environment on PR
- Test production after deployment
- Run visual regression tests
- Upload test reports as artifacts

### Viewing Test Reports

Test reports are automatically published to GitHub Pages after each run.

**Setup (one-time):**
1. Go to repo Settings → Pages
2. Set Source to "Deploy from a branch"
3. Select branch: `gh-pages`, folder: `/ (root)`
4. Save

**Accessing reports:**
- After setup, reports are available at: `https://jpcueva-tp.github.io/project-template/`
- Updates automatically after each test run
- Shows results from the latest main branch run

**Alternative:** Download reports from Actions tab → Artifacts (30-day retention)

### Browser Configuration

**Current setup:** Chromium only (fastest CI runs)

The workflow caches browser binaries to speed up subsequent runs:

```yaml
- name: Cache Playwright browsers
  uses: actions/cache@v4
  with:
    path: ~/.cache/ms-playwright
    key: playwright-browsers-${{ hashFiles('package-lock.json') }}
```

**Benefits:**
- Saves ~1 minute per CI run by reusing cached browser binaries
- Automatically updates when `package-lock.json` changes
- Uses ~300MB of GitHub's 10GB cache storage

**Adding more browsers:**

1. **Enable in config** (`playwright.config.ts`):
   ```typescript
   projects: [
     { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },  // Uncomment
     { name: 'webkit', use: { ...devices['Desktop Safari'] } },    // Uncomment
   ],
   ```

2. **Update CI workflow** (`.github/workflows/playwright.yml`):
   ```yaml
   - name: Install Playwright Browsers
     run: npx playwright install chromium firefox webkit --with-deps
   ```

3. **Impact:**
   - First run: Downloads all browsers (~800MB, slower)
   - Cached runs: Restores ~800MB (still faster than no cache)
   - More thorough cross-browser testing

## Troubleshooting

**Tests fail with 404 errors:**
- Ensure you're using the npm scripts (`npm test`)
- Manual runs: `npx playwright test`

**Server already running:**
- The config reuses existing servers in dev mode
- In CI, set `CI=true` to force a fresh server

## License

ISC