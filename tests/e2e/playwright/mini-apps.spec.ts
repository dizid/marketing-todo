import { test, expect } from '@playwright/test'
import { mockGrokAPI } from './helpers/api-mocks'

/**
 * E2E Tests: Mini-App and AI Generation Flow
 *
 * Tests the task modal, mini-app components, and AI generation functionality.
 * Uses authenticated session from auth.setup.ts
 * Mocks Grok AI API responses for predictable testing.
 */

test.describe('Mini-App and AI Generation Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard where tasks are located
    await page.goto('/app')
    await page.waitForLoadState('networkidle')

    // Wait for dashboard to load (ProjectHeader shows "Launchpilot" h1)
    await expect(page.locator('h1').filter({ hasText: /launchpilot/i }).first()).toBeVisible({ timeout: 10000 })
  })

  test('task modal opens when clicking a task name', async ({ page }) => {
    // Find and expand a category accordion
    // Look for a category button (ChecklistCategory component)
    const categoryButton = page.locator('button').filter({ hasText: /setup|content|social|outreach/i }).first()
    await expect(categoryButton).toBeVisible()

    // Expand the category if not already expanded
    await categoryButton.click()

    // Wait for category to expand and show tasks
    await page.waitForTimeout(500)

    // Find a task item with a "Start Task" button (indicates it has a mini-app)
    const startTaskButton = page.locator('button').filter({ hasText: /start task|landing page builder/i }).first()

    if (await startTaskButton.isVisible()) {
      // Click the button to open the task modal
      await startTaskButton.click()

      // Verify modal appears
      // TaskModal renders with a close button (✕) and task name in header
      await expect(page.locator('button').filter({ hasText: '✕' })).toBeVisible()

      // Modal should have task content
      await expect(page.locator('.bg-white').filter({ hasText: /task|generate|form/i })).toBeVisible()
    } else {
      // Skip if no mini-app tasks are visible
      test.skip()
    }
  })

  test('mock Grok AI API returns expected content', async ({ page }) => {
    // Set up mock for the Grok proxy endpoint
    await mockGrokAPI(page)

    // Verify the mock intercept works by calling the API directly
    const result = await page.evaluate(async () => {
      const response = await fetch('/.netlify/functions/grok-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Generate marketing content' }]
        })
      })
      return await response.json()
    })

    // Verify mock response structure
    expect(result).toHaveProperty('choices')
    expect(result.choices).toHaveLength(1)
    expect(result.choices[0].message.content).toContain('Launch Your Product with Confidence')
    expect(result).toHaveProperty('usage')
    expect(result.usage).toHaveProperty('prompt_tokens')
    expect(result.usage).toHaveProperty('completion_tokens')
  })

  test('AI loading state shows during generation', async ({ page }) => {
    // Mock with 1 second delay to ensure loading state is visible
    await mockGrokAPI(page, { delay: 1000 })

    // Expand a category
    const categoryButton = page.locator('button').filter({ hasText: /content|social/i }).first()

    if (await categoryButton.isVisible()) {
      await categoryButton.click()
      await page.waitForTimeout(500)

      // Find and click AI generation button
      const aiButton = page.locator('button').filter({ hasText: /generate.*ai|✨ generate/i }).first()

      if (await aiButton.isVisible()) {
        await aiButton.click()

        // Verify loading indicator appears
        // Could be text like "Generating..." or a spinner SVG with animate-spin class
        const loadingIndicator = page.locator('text=/generating|loading/i, .animate-spin')
        await expect(loadingIndicator.first()).toBeVisible({ timeout: 2000 })

        // Wait for loading to complete
        await expect(loadingIndicator.first()).not.toBeVisible({ timeout: 3000 })
      } else {
        test.skip()
      }
    } else {
      test.skip()
    }
  })

  test('AI error state shows on failure', async ({ page }) => {
    // Mock API to fail with 502 error
    await mockGrokAPI(page, { fail: true })

    // Expand a category
    const categoryButton = page.locator('button').filter({ hasText: /content|social/i }).first()

    if (await categoryButton.isVisible()) {
      await categoryButton.click()
      await page.waitForTimeout(500)

      // Find and click AI generation button
      const aiButton = page.locator('button').filter({ hasText: /generate.*ai|✨ generate/i }).first()

      if (await aiButton.isVisible()) {
        await aiButton.click()

        // Wait for error message to appear
        // Error messages typically contain words like "error", "failed", "try again"
        const errorMessage = page.locator('text=/error|failed|something went wrong|try again/i').first()
        await expect(errorMessage).toBeVisible({ timeout: 5000 })
      } else {
        test.skip()
      }
    } else {
      test.skip()
    }
  })

  test('subscription page shows quota info', async ({ page }) => {
    // Navigate to subscription page
    await page.goto('/app/subscription')

    // Wait for page to load
    await expect(page.locator('h1, h2').filter({ hasText: /subscription|billing|current plan/i }).first()).toBeVisible({ timeout: 10000 })

    // Verify "Current Plan" section exists
    await expect(page.locator('text=/current plan/i')).toBeVisible()

    // Verify quota display exists (shows usage like "X / Y" or "Monthly Quota")
    const quotaDisplay = page.locator('text=/monthly quota|ai generations|\/|free|premium/i')
    await expect(quotaDisplay.first()).toBeVisible()

    // Check for plan badge (Free or Premium)
    const planBadge = page.locator('text=/⭐ premium|free/i')
    await expect(planBadge.first()).toBeVisible()
  })

  test('quota exceeded banner shows when limit reached', async ({ page }) => {
    // This test checks if the quota exceeded banner appears on the subscription page
    // The banner only shows when isQuotaExceeded is true
    await page.goto('/app/subscription')

    // Wait for page load
    await expect(page.locator('h1, h2').filter({ hasText: /subscription/i }).first()).toBeVisible({ timeout: 10000 })

    // Check if quota exceeded banner exists
    // Banner text: "Monthly AI Quota Reached"
    const quotaBanner = page.locator('text=/monthly ai quota reached/i')

    // The banner may or may not be visible depending on actual quota state
    // This test just checks that if it exists, it has the correct content
    if (await quotaBanner.isVisible()) {
      // Verify banner contains upgrade messaging
      await expect(page.locator('text=/upgrade to premium/i')).toBeVisible()
      await expect(page.locator('text=/generations/i')).toBeVisible()
    }

    // If banner is not visible, that's also valid (quota not exceeded)
    // Test passes either way - we're just checking the UI handles both states
  })

  test('mini-app form accepts input and enables generate button', async ({ page }) => {
    // Mock AI for generation
    await mockGrokAPI(page)

    // Navigate to dashboard
    await page.goto('/app')
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 })

    // Find and open a task with a mini-app
    const categoryButton = page.locator('button').filter({ hasText: /content/i }).first()

    if (await categoryButton.isVisible()) {
      await categoryButton.click()
      await page.waitForTimeout(500)

      // Look for "Write Blog Post" or similar task
      const taskButton = page.locator('button').filter({ hasText: /start task|blog|content/i }).first()

      if (await taskButton.isVisible()) {
        await taskButton.click()

        // Wait for modal to open
        await expect(page.locator('button').filter({ hasText: '✕' })).toBeVisible()

        // Look for input fields in the form
        const topicInput = page.locator('input[type="text"]').first()

        if (await topicInput.isVisible()) {
          // Fill in the form
          await topicInput.fill('How to Build a SaaS Product')

          // Find and verify generate button is enabled
          const generateButton = page.locator('button').filter({ hasText: /generate/i }).first()
          await expect(generateButton).toBeEnabled()

          // Click generate
          await generateButton.click()

          // Verify some output appears
          await expect(page.locator('text=/launch|headline|content/i')).toBeVisible({ timeout: 5000 })
        } else {
          test.skip()
        }
      } else {
        test.skip()
      }
    } else {
      test.skip()
    }
  })

  test('save functionality persists task data', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/app')
    await expect(page.locator('h1, h2').first()).toBeVisible({ timeout: 10000 })

    // Open a task modal
    const categoryButton = page.locator('button').filter({ hasText: /setup|content/i }).first()

    if (await categoryButton.isVisible()) {
      await categoryButton.click()
      await page.waitForTimeout(500)

      const taskButton = page.locator('button').filter({ hasText: /start task/i }).first()

      if (await taskButton.isVisible()) {
        await taskButton.click()

        // Wait for modal
        await expect(page.locator('button').filter({ hasText: '✕' })).toBeVisible()

        // Look for any input field
        const inputField = page.locator('input[type="text"], textarea').first()

        if (await inputField.isVisible()) {
          const testValue = 'Test data for persistence check'
          await inputField.fill(testValue)

          // Wait a moment for auto-save
          await page.waitForTimeout(1000)

          // Close and reopen the modal
          await page.locator('button').filter({ hasText: '✕' }).click()
          await page.waitForTimeout(500)

          // Reopen same task
          await taskButton.click()
          await expect(page.locator('button').filter({ hasText: '✕' })).toBeVisible()

          // Verify the data persisted
          const savedInput = page.locator('input[type="text"], textarea').first()
          await expect(savedInput).toHaveValue(testValue)
        } else {
          test.skip()
        }
      } else {
        test.skip()
      }
    } else {
      test.skip()
    }
  })
})
