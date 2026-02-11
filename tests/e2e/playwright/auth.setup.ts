import { test as setup, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const authFile = 'tests/e2e/playwright/.auth/user.json'

// Read Supabase config from .env files
function getEnvVar(name: string): string {
  for (const file of ['.env.local', '.env']) {
    try {
      const content = readFileSync(resolve(process.cwd(), file), 'utf-8')
      const match = content.match(new RegExp(`^${name}=(.+)$`, 'm'))
      if (match) return match[1].trim()
    } catch { /* file doesn't exist */ }
  }
  return process.env[name] || ''
}

setup('authenticate and seed project', async ({ page }) => {
  // 1. Login
  await page.goto('/auth')
  await page.fill('#email', process.env.TEST_USER_EMAIL || getEnvVar('TEST_USER_EMAIL'))
  await page.fill('#password', process.env.TEST_USER_PASSWORD || getEnvVar('TEST_USER_PASSWORD'))
  await page.click('button[type="submit"]')
  await page.waitForURL('/app', { timeout: 15000 })

  // 2. Check if project exists
  const noProject = page.getByText('No project selected')
  if (await noProject.isVisible({ timeout: 3000 })) {
    // Create project via Supabase Admin API (server-side, no browser needed)
    const supabaseUrl = getEnvVar('VITE_SUPABASE_URL')
    const serviceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY')
    const testEmail = process.env.TEST_USER_EMAIL || getEnvVar('TEST_USER_EMAIL')

    // Get user ID
    const usersRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    })
    const usersData = await usersRes.json()
    const user = usersData.users?.find((u: any) => u.email === testEmail)

    if (user) {
      // Insert project directly
      const anonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')
      await fetch(`${supabaseUrl}/rest/v1/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: user.id,
          name: 'E2E Test Project',
          description: 'Auto-created for Playwright E2E tests',
          status: 'active'
        })
      })

      // Reload to pick up the new project
      await page.reload()
      await page.waitForLoadState('networkidle')
    }
  }

  // 3. Wait for dashboard to have content
  await expect(page.getByText(/Overall Progress|No project/)).toBeVisible({ timeout: 10000 })

  // 4. Save authenticated state
  await page.context().storageState({ path: authFile })
})
