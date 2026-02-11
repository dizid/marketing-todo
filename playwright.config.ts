import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Setup project: authenticate and save session
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Public tests: run without saved session (auth page + onboarding wizard)
    {
      name: 'public',
      testMatch: /(auth|onboarding)\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },

    // Authenticated tests: require login session
    {
      name: 'authenticated',
      testMatch: /(dashboard|mini-apps|premium)\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: './tests/e2e/playwright/.auth/user.json',
      },
    },

    // Mobile viewport tests (subset)
    {
      name: 'mobile',
      testMatch: /dashboard\.spec\.ts/,
      dependencies: ['setup'],
      use: {
        ...devices['Pixel 5'],
        storageState: './tests/e2e/playwright/.auth/user.json',
      },
    },
  ],

  // Start dev server before tests
  webServer: {
    command: 'netlify dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
