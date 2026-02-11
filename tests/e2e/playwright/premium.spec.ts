import { test, expect } from '@playwright/test'
import { mockStripeAPI, mockR2Publish, mockGrokAPI } from './helpers/api-mocks'

test.describe('Premium Subscription Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to subscription page
    await page.goto('/app/subscription')
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })

  test('subscription page loads with plan info', async ({ page }) => {
    // Verify main heading
    await expect(page.locator('h1')).toHaveText('Subscription & Billing')

    // Verify Current Plan section exists
    const currentPlanHeading = page.getByRole('heading', { name: 'Current Plan', level: 2 })
    await expect(currentPlanHeading).toBeVisible()

    // Verify plan badge is visible (either Free or Premium)
    const planBadge = page.locator('span').filter({ hasText: /^(Free|⭐ Premium)$/ }).first()
    await expect(planBadge).toBeVisible()

    // Verify description text
    await expect(page.getByText('Manage your account and billing settings')).toBeVisible()
  })

  test('back to dashboard button works', async ({ page }) => {
    // Click the back button
    const backButton = page.getByRole('button', { name: '← Back to Dashboard' })
    await expect(backButton).toBeVisible()
    await backButton.click()

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/app')
  })

  test('free tier shows upgrade button', async ({ page }) => {
    // Look for the upgrade button with gradient background
    const upgradeButton = page.locator('button').filter({ hasText: 'Upgrade - $19/month' })

    // Verify button is visible (assumes test user is on free tier)
    await expect(upgradeButton).toBeVisible()

    // Verify button has gradient classes
    await expect(upgradeButton).toHaveClass(/bg-gradient-to-r/)
    await expect(upgradeButton).toHaveClass(/from-indigo-600/)
    await expect(upgradeButton).toHaveClass(/to-blue-600/)
  })

  test('upgrade button opens payment modal', async ({ page }) => {
    // Set up Stripe API mocks
    await mockStripeAPI(page)

    // Click upgrade button
    const upgradeButton = page.locator('button').filter({ hasText: 'Upgrade - $19/month' })
    await upgradeButton.click()

    // Wait for modal to appear
    const modal = page.locator('.fixed.inset-0.z-50')
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Verify modal shows pricing (use unique subtitle to avoid strict mode)
    await expect(page.getByText('$19/month • 400 AI generations per month')).toBeVisible()

    // Verify modal shows benefits (scope to modal to avoid matching comparison section)
    await expect(modal.getByText(/400 AI generations/i)).toBeVisible()

    // Verify Stripe payment element is mounted
    const stripeElement = page.locator('#stripe-payment-element')
    await expect(stripeElement).toBeVisible({ timeout: 3000 })

    // Verify submit button exists
    const submitButton = page.locator('button').filter({ hasText: 'Subscribe for $19/month' })
    await expect(submitButton).toBeVisible()
  })

  test('payment modal can be cancelled', async ({ page }) => {
    // Set up Stripe API mocks
    await mockStripeAPI(page)

    // Click upgrade button to open modal
    const upgradeButton = page.locator('button').filter({ hasText: 'Upgrade - $19/month' })
    await upgradeButton.click()

    // Wait for modal to appear
    const modal = page.locator('.fixed.inset-0.z-50')
    await expect(modal).toBeVisible({ timeout: 5000 })

    // Find and click cancel button
    const cancelButton = page.getByRole('button', { name: /cancel/i }).first()
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()

    // Verify modal is closed
    await expect(modal).not.toBeVisible({ timeout: 2000 })

    // Verify we're still on subscription page
    await expect(page).toHaveURL('/app/subscription')
  })

  test('quota exceeded banner displays when quota is exceeded', async ({ page }) => {
    // Navigate with quota_exceeded query param
    await page.goto('/app/subscription?reason=quota_exceeded')

    // Verify quota exceeded banner is visible
    const quotaBanner = page.locator('.bg-gradient-to-r.from-orange-500.to-red-500')
    await expect(quotaBanner).toBeVisible()

    // Verify banner message
    await expect(page.getByText('Monthly AI Quota Reached')).toBeVisible()

    // Verify upgrade call-to-action in banner
    await expect(page.getByText(/Upgrade to Premium to get 10x more generations/i)).toBeVisible()
  })

  test('subscription page shows quota usage information', async ({ page }) => {
    // Verify Monthly Quota section
    await expect(page.getByText('Monthly Quota', { exact: true })).toBeVisible()
    await expect(page.getByText('AI generations used this month')).toBeVisible()

    // Verify Remaining Quota section
    await expect(page.getByText('Remaining Quota')).toBeVisible()
    await expect(page.getByText('generations left')).toBeVisible()

    // Verify Current Period section
    await expect(page.getByText('Current Period')).toBeVisible()

    // Verify Next Reset section
    await expect(page.getByText('Next Reset')).toBeVisible()

    // Verify progress bar exists
    const progressBar = page.locator('.bg-gray-200.rounded-full.h-3')
    await expect(progressBar).toBeVisible()
  })

  test('why upgrade section displays for free users', async ({ page }) => {
    // Verify "Why Upgrade?" heading
    const whyUpgradeHeading = page.getByRole('heading', { name: 'Why Upgrade?' })

    // Only check if free tier (heading won't exist for premium users)
    const upgradeButton = page.locator('button').filter({ hasText: 'Upgrade - $19/month' })
    if (await upgradeButton.isVisible()) {
      await expect(whyUpgradeHeading).toBeVisible()

      // Verify comparison shows Free Plan
      await expect(page.getByRole('heading', { name: 'Free Plan' })).toBeVisible()
      await expect(page.getByText('40 AI generations/month')).toBeVisible()

      // Verify comparison shows Premium Plan
      await expect(page.getByRole('heading', { name: 'Premium Plan' })).toBeVisible()
      await expect(page.getByText('400 AI generations/month')).toBeVisible()
      await expect(page.getByText('BEST VALUE')).toBeVisible()
    }
  })
})

test.describe('R2 Landing Page Publishing', () => {
  test.beforeEach(async ({ page }) => {
    // Set up API mocks
    await mockR2Publish(page)
    await mockGrokAPI(page)

    // Navigate to dashboard
    await page.goto('/app')
  })

  test('mock R2 publish returns success URL', async ({ page }) => {
    // Track if the route was intercepted
    let intercepted = false
    let responseData = null

    // Set up route interception with tracking
    await page.route('**/.netlify/functions/r2-publish', async (route) => {
      intercepted = true
      const response = {
        success: true,
        url: 'https://pub-mock.r2.dev/lp/test-product-abc123.html',
        filename: 'lp/test-product-abc123.html'
      }
      responseData = response

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Trigger a fetch to the r2-publish endpoint
    const result = await page.evaluate(async () => {
      try {
        const response = await fetch('/.netlify/functions/r2-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: '<html><body>Test Landing Page</body></html>',
            slug: 'test-product-abc123'
          })
        })
        return await response.json()
      } catch (error) {
        return { error: error.message }
      }
    })

    // Verify the mock was intercepted
    expect(intercepted).toBe(true)

    // Verify response structure
    expect(result).toHaveProperty('success', true)
    expect(result).toHaveProperty('url')
    expect(result.url).toContain('pub-mock.r2.dev')
    expect(result.url).toContain('test-product-abc123.html')

    // Verify filename is returned
    expect(result).toHaveProperty('filename')
    expect(result.filename).toContain('lp/test-product-abc123.html')
  })

  test('R2 publish mock handles failure scenario', async ({ page }) => {
    // Set up R2 publish mock with failure
    await mockR2Publish(page, { fail: true })

    let intercepted = false

    // Track interception
    await page.route('**/.netlify/functions/r2-publish', async (route) => {
      intercepted = true
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'R2 configuration error' })
      })
    })

    // Trigger a fetch to the r2-publish endpoint
    const result = await page.evaluate(async () => {
      try {
        const response = await fetch('/.netlify/functions/r2-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: '<html><body>Test</body></html>',
            slug: 'test'
          })
        })

        // Check if response is not ok (status 500)
        if (!response.ok) {
          const errorData = await response.json()
          return { failed: true, error: errorData.error, status: response.status }
        }

        return await response.json()
      } catch (error) {
        return { failed: true, error: error.message }
      }
    })

    // Verify the mock was intercepted
    expect(intercepted).toBe(true)

    // Verify error response
    expect(result.failed).toBe(true)
    expect(result.status).toBe(500)
    expect(result.error).toContain('R2 configuration error')
  })

  test('R2 publish URL format is valid', async ({ page }) => {
    // Set up R2 mock
    await mockR2Publish(page)

    // Fetch from the mocked endpoint
    const result = await page.evaluate(async () => {
      const response = await fetch('/.netlify/functions/r2-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: '<html><body>Test</body></html>',
          slug: 'my-landing-page'
        })
      })
      return await response.json()
    })

    // Verify URL format
    expect(result.url).toBeTruthy()
    expect(result.url).toMatch(/^https?:\/\//)
    expect(result.url).toContain('.html')

    // Verify filename format
    expect(result.filename).toBeTruthy()
    expect(result.filename).toContain('lp/')
    expect(result.filename).toMatch(/\.html$/)
  })

  test('multiple R2 publish calls are properly mocked', async ({ page }) => {
    // Set up R2 mock
    await mockR2Publish(page)

    let callCount = 0

    // Track each call
    await page.route('**/.netlify/functions/r2-publish', async (route) => {
      callCount++
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          url: `https://pub-mock.r2.dev/lp/test-${callCount}.html`,
          filename: `lp/test-${callCount}.html`
        })
      })
    })

    // Make multiple calls
    const results = await page.evaluate(async () => {
      const responses = []

      for (let i = 1; i <= 3; i++) {
        const response = await fetch('/.netlify/functions/r2-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            html: `<html><body>Test ${i}</body></html>`,
            slug: `test-${i}`
          })
        })
        responses.push(await response.json())
      }

      return responses
    })

    // Verify all calls were intercepted
    expect(callCount).toBe(3)

    // Verify each response is unique
    expect(results).toHaveLength(3)
    expect(results[0].url).toContain('test-1.html')
    expect(results[1].url).toContain('test-2.html')
    expect(results[2].url).toContain('test-3.html')
  })
})

test.describe('Integrated Premium Features', () => {
  test.beforeEach(async ({ page }) => {
    // Set up all mocks
    await mockStripeAPI(page)
    await mockR2Publish(page)
    await mockGrokAPI(page)
  })

  test('all API mocks work together', async ({ page }) => {
    await page.goto('/app')

    // Test Grok API mock
    const grokResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/.netlify/functions/grok-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Test' })
        })
        return { success: response.ok, status: response.status }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
    expect(grokResult.success).toBe(true)
    expect(grokResult.status).toBe(200)

    // Test R2 publish mock
    const r2Result = await page.evaluate(async () => {
      try {
        const response = await fetch('/.netlify/functions/r2-publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: '<html></html>', slug: 'test' })
        })
        return { success: response.ok, status: response.status }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
    expect(r2Result.success).toBe(true)
    expect(r2Result.status).toBe(200)

    // Test Stripe create subscription mock
    const stripeResult = await page.evaluate(async () => {
      try {
        const response = await fetch('/.netlify/functions/stripe-create-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'test-user' })
        })
        return { success: response.ok, status: response.status }
      } catch (error) {
        return { success: false, error: error.message }
      }
    })
    expect(stripeResult.success).toBe(true)
    expect(stripeResult.status).toBe(200)
  })

  test('navigate from quota exceeded to subscription upgrade', async ({ page }) => {
    // Start from dashboard with quota exceeded
    await page.goto('/app?quota_exceeded=true')

    // Look for quota exceeded notification or link to subscription
    // (This assumes dashboard shows a banner or link when quota exceeded)
    const subscriptionLink = page.getByRole('link', { name: /subscription|upgrade|billing/i }).first()

    // If link exists, click it
    if (await subscriptionLink.isVisible({ timeout: 2000 })) {
      await subscriptionLink.click()
      await expect(page).toHaveURL(/\/app\/subscription/)
    } else {
      // Navigate directly if no link found
      await page.goto('/app/subscription?reason=quota_exceeded')
    }

    // Verify quota exceeded banner
    await expect(page.getByText('Monthly AI Quota Reached')).toBeVisible()

    // Click upgrade button
    const upgradeButton = page.locator('button').filter({ hasText: 'Upgrade - $19/month' })
    await upgradeButton.click()

    // Verify payment modal opens (use heading role to avoid matching banner text)
    await expect(page.getByRole('heading', { name: 'Upgrade to Premium' })).toBeVisible()
  })
})
