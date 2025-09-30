# project-template

A Playwright web testing project template with TypeScript, featuring page object model architecture and custom fixtures.

## Features

- **Playwright Test Framework** - Modern end-to-end testing
- **TypeScript** - Type-safe test development
- **Page Object Model** - Maintainable test architecture
- **Custom Fixtures** - Reusable test setup and teardown
- **Screenshot Support** - Visual documentation and debugging

## Project Structure

```
project-template/
├── playwright/
│   ├── fixtures.ts           # Custom test fixtures
│   ├── pages/                 # Page object models
│   ├── pages-screenshots/     # Page screenshots
│   ├── playwright.config.ts   # Playwright configuration
│   └── tests/                 # Test specs
├── public/                    # Static assets
├── docs/                      # Documentation
└── test-results/             # Test execution results
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npx playwright test

# Run tests in headed mode
npx playwright test --headed

# Run specific test file
npx playwright test tests/example.spec.ts

# Run tests in debug mode
npx playwright test --debug
```

### View Test Results

```bash
# Show last test report
npx playwright show-report
```

## Configuration

Playwright configuration is located in `playwright/playwright.config.ts`. Customize:
- Browser settings
- Test timeout
- Retries
- Reporters
- Base URL

## Writing Tests

Tests use the page object model pattern:

1. Create page objects in `playwright/pages/`
2. Write test specs in `playwright/tests/`
3. Use custom fixtures from `playwright/fixtures.ts`

## License

ISC