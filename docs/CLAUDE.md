# Project Structure Documentation

## Overview
This is a standardized template for testing simple websites with Playwright. The structure is optimized for maintainability, scalability, and ease of use.

---

## Directory Structure

```
project-template/
├── .github/
│   └── workflows/
│       └── playwright.yml          # CI/CD configuration for automated testing
├── docs/
│   └── CLAUDE.md                   # This file - project documentation
├── playwright/
│   ├── fixtures.ts                 # Custom test fixtures (Page Object Model instances)
│   ├── pages/
│   │   └── dashboard-page.ts       # Page Object Model for dashboard
│   ├── pages-screenshots/          # Visual regression test screenshots
│   ├── tests/
│   │   └── dashboard-page.spec.ts  # Test specifications
│   └── playwright.config.ts        # Playwright configuration
├── public/                         # Static website files (served by http-server)
│   ├── assets/                     # Images, fonts, icons, etc.
│   ├── index.html                  # Main HTML file
│   ├── style.css                   # Styles
│   └── script.js                   # JavaScript
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
└── README.md                       # Project readme
```

---

## Key Directories Explained

### `/public/`
- **Purpose**: Contains all static website files
- **Why this name**: Industry standard (used by React, Vue, Vite, Next.js)
- **Contents**: HTML, CSS, JS, and assets
- **Served by**: http-server during local development

### `/playwright/`
- **Purpose**: All test-related code and configuration
- **Structure follows**: Page Object Model (POM) pattern
- **Why separate**: Keeps test code isolated from production code

#### `/playwright/pages/`
- **Purpose**: Page Object Models (POM)
- **Pattern**: Each page/component gets its own class
- **Benefits**:
  - Reusable selectors
  - Maintainable test code
  - Single source of truth for page elements

#### `/playwright/tests/`
- **Purpose**: Test specifications
- **Naming convention**: `{page-name}.spec.ts`
- **Structure**: Uses fixtures for dependency injection

#### `/playwright/pages-screenshots/`
- **Purpose**: Stores visual regression test screenshots
- **Auto-generated**: Created when running `toHaveScreenshot()` tests
- **Committed to git**: Yes, to track visual changes

#### `/playwright/fixtures.ts`
- **Purpose**: Custom test fixtures extending Playwright's base test
- **Why**: Dependency injection for Page Object Models
- **Usage**: `test({ dashboardPage })` instead of manually instantiating

### `/docs/`
- **Purpose**: Project documentation
- **Contents**: Architecture decisions, setup guides, conventions

### `/.github/workflows/`
- **Purpose**: GitHub Actions CI/CD pipelines
- **Contents**: Automated testing on push/PR

---

## Design Patterns

### Page Object Model (POM)
```typescript
// playwright/pages/dashboard-page.ts
export class DashboardPage {
    constructor(private readonly page: Page) { }

    // Locators as class properties
    private readonly heading = page.getByRole('heading', { name: 'Example' })

    // Actions and assertions as methods
    async assertPageElementsLoaded() {
        await expect(this.heading).toBeVisible()
    }
}
```

**Benefits:**
- Centralized selectors
- Reusable across tests
- Easy to update when UI changes

### Fixture Pattern
```typescript
// playwright/fixtures.ts
export const test = base.extend<Pages>({
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
});
```

**Benefits:**
- Automatic setup/teardown
- Dependency injection
- Type-safe fixtures

---

## Naming Conventions

### Files
- **Tests**: `{page-name}.spec.ts` (e.g., `dashboard-page.spec.ts`)
- **Page Objects**: `{page-name}.ts` (e.g., `dashboard-page.ts`)
- **Fixtures**: `fixtures.ts` (plural, as it contains multiple fixture definitions)
- **Config**: `playwright.config.ts`

### Classes
- **Page Objects**: `{PageName}Page` (e.g., `DashboardPage`)
- PascalCase for class names

### Variables
- **Locators**: Descriptive, camelCase (e.g., `pageHeading`, `submitButton`)
- **URLs**: `pageUrl` for relative paths
- **Screenshots**: `pageScreenshotPath` as array

---

## Configuration Notes

### playwright.config.ts
```typescript
{
  testDir: './tests',                                    // Test location
  snapshotPathTemplate: 'pages-screenshots/{arg}{ext}',  // Screenshot storage
  fullyParallel: true,                                   // Run tests in parallel
  forbidOnly: !!process.env.CI,                          // Prevent .only in CI
  retries: process.env.CI ? 2 : 0,                       // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined,               // Single worker in CI
  reporter: 'html',                                      // HTML test report
  use: {
    baseURL: 'http://localhost:3000',                    // Base URL for tests
    trace: 'on-first-retry',                             // Trace on retry
  },
  webServer: {                                           // Auto-start dev server
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  }
}
```

---

## Best Practices

### Testing
1. **One spec file per page** - Keep tests organized
2. **Use Page Objects** - Never write selectors in test files
3. **Visual regression** - Add screenshot tests for critical pages
4. **Descriptive test names** - `should display all dashboard elements correctly`
5. **Avoid hardcoded waits** - Use Playwright's auto-waiting

### File Organization
1. **Keep public/ clean** - Only production files
2. **Assets in /public/assets/** - Images, fonts, icons
3. **One Page Object per file** - Easy to find and maintain
4. **Co-locate tests with what they test** - `dashboard-page.ts` + `dashboard-page.spec.ts`

### Git
1. **Commit screenshots** - Track visual changes
2. **Ignore test results** - `/test-results/`, `/playwright-report/`
3. **Ignore .auth/** - Don't commit authentication state

---

## Common Commands

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Run tests
npm test

# Run tests in UI mode
npm run test:ui

# Run specific test
npx playwright test dashboard-page

# Update screenshots
npx playwright test --update-snapshots

# Show test report
npx playwright show-report
```

---

## Questions & Answers

### Why `fixtures.ts` and not `fixture.ts`?
**Answer**: `fixtures.ts` (plural) is the Playwright convention because:
- It typically contains multiple fixture definitions
- Matches Playwright's official examples and documentation
- More semantically correct (a file containing many fixtures)

### Why `/public/` instead of root?
**Answer**:
- Industry standard across modern frameworks
- Clearly separates production files from config/tooling
- Easier to serve and deploy (just upload /public/)
- Prevents accidental inclusion of config files in builds

### Why Page Object Model?
**Answer**:
- **Maintainability**: Change selector once, updates all tests
- **Readability**: `dashboardPage.clickSubmit()` vs `page.click('#btn-submit')`
- **Reusability**: Same page object across multiple tests
- **Type safety**: TypeScript catches errors at compile time

### Should tests be in `/tests/` or `/playwright/tests/`?
**Answer**: `/playwright/tests/` because:
- Groups all test-related code together
- Separates testing concerns from production code
- Scales better (can add `/cypress/`, `/vitest/` etc.)

---

## Future Enhancements

### To Add:
- [ ] Authentication fixtures (`.auth/` setup)
- [ ] API mocking examples
- [ ] Mobile viewport tests
- [ ] Accessibility tests (axe-core)
- [ ] Performance tests (lighthouse)
- [ ] Component testing setup

### To Document:
- [ ] How to add new pages
- [ ] How to debug failed tests
- [ ] How to run tests in Docker
- [ ] Environment variable management

---

## References

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Test Fixtures](https://playwright.dev/docs/test-fixtures)
- [Visual Comparisons](https://playwright.dev/docs/test-snapshots)

---

*Last updated: 2025-09-30*
