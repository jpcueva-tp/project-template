import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './playwright/tests',
  outputDir: './playwright/test-results',
  snapshotPathTemplate: 'playwright/pages-screenshots/{arg}{ext}',
  fullyParallel: process.env.CI ? true : true,
  forbidOnly: !!process.env.CI,
  expect: {
    timeout: process.env.CI ? 60000 : 30000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
    },
  },
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { outputFolder: 'playwright/playwright-report' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: process.env.CI ? 'off' : 'on',
    screenshot: process.env.CI ? 'off' : 'on',
    video: process.env.CI ? 'off' : 'on',
    headless: process.env.CI ? true : false,
    navigationTimeout: process.env.CI ? 60000 : 60000,
    actionTimeout: process.env.CI ? 60000 : 60000,
    viewport: process.env.CI ? { width: 1280, height: 720 } : null,
    launchOptions: {
      args: process.env.CI ? [] : ['--start-maximized']
    }
  },

  /* Run your local dev server before starting the tests */
  webServer: !process.env.BASE_URL || process.env.BASE_URL.includes('localhost') || process.env.BASE_URL.includes('127.0.0.1') ? {
    command: 'npx serve public -l 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  } : undefined,

  projects: [
    /* Test against browsers */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    //{
    //  name: 'firefox',
    //  use: { ...devices['Desktop Firefox'] },
    //},
    //{
    //  name: 'webkit',
    //  use: { ...devices['Desktop Safari'] },
    //},

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
