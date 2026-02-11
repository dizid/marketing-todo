import { Page } from '@playwright/test'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load mock responses from JSON files
const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = join(__dirname, '..', 'fixtures', 'mock-responses')
const grokResponse = JSON.parse(readFileSync(join(fixturesDir, 'grok-ai.json'), 'utf-8'))
const stripeResponse = JSON.parse(readFileSync(join(fixturesDir, 'stripe-subscription.json'), 'utf-8'))
const r2Response = JSON.parse(readFileSync(join(fixturesDir, 'r2-publish.json'), 'utf-8'))

/**
 * Mock the Grok AI proxy endpoint
 * Intercepts calls to /.netlify/functions/grok-proxy
 */
export async function mockGrokAPI(page: Page, options?: { delay?: number; fail?: boolean }) {
  await page.route('**/.netlify/functions/grok-proxy', async (route) => {
    if (options?.fail) {
      return route.fulfill({
        status: 502,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Grok API error: 502' })
      })
    }

    if (options?.delay) {
      await new Promise(r => setTimeout(r, options.delay))
    }

    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(grokResponse)
    })
  })
}

/**
 * Mock all Stripe-related Netlify Functions
 */
export async function mockStripeAPI(page: Page) {
  // Mock subscription creation
  await page.route('**/.netlify/functions/stripe-create-subscription', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(stripeResponse)
    })
  })

  // Mock payment confirmation
  await page.route('**/.netlify/functions/stripe-confirm-payment', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Subscription activated',
        subscription: { tier: 'premium', status: 'active' }
      })
    })
  })

  // Mock cancel subscription
  await page.route('**/.netlify/functions/stripe-cancel-subscription', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Subscription cancelled',
        subscription: { tier: 'free', status: 'cancelled' }
      })
    })
  })

  // Mock Stripe.js external script to prevent loading real Stripe
  await page.route('https://js.stripe.com/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: `
        window.Stripe = function() {
          return {
            elements: function() {
              return {
                create: function() {
                  return {
                    mount: function() {},
                    on: function() {},
                    unmount: function() {},
                    destroy: function() {}
                  }
                }
              }
            },
            confirmPayment: function() {
              return Promise.resolve({ paymentIntent: { status: 'succeeded' } })
            }
          }
        }
      `
    })
  })
}

/**
 * Mock the R2 landing page publish endpoint
 */
export async function mockR2Publish(page: Page, options?: { fail?: boolean }) {
  await page.route('**/.netlify/functions/r2-publish', (route) => {
    if (options?.fail) {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'R2 configuration error' })
      })
    }

    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(r2Response)
    })
  })
}

/**
 * Mock all external APIs at once (convenience helper)
 */
export async function mockAllExternalAPIs(page: Page) {
  await mockGrokAPI(page)
  await mockStripeAPI(page)
  await mockR2Publish(page)
}
