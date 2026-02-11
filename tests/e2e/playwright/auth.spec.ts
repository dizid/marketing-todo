import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('login form renders correctly', async ({ page }) => {
    // Check heading
    await expect(page.locator('h1')).toContainText('Welcome Back');

    // Check form fields exist
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();

    // Check submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toContainText('Sign In');

    // Check toggle button
    const toggleButton = page.getByText('Sign Up', { exact: true });
    await expect(toggleButton).toBeVisible();

    // Check forgot password link
    await expect(page.getByText('Forgot password?')).toBeVisible();
  });

  test('client validation shows error for invalid email', async ({ page }) => {
    // Use "a@b" which passes HTML5 type="email" but fails the custom regex /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    await page.locator('#email').fill('a@b');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Check for error message from custom validation
    const errorMessage = page.locator('.text-red-800');
    await expect(errorMessage).toContainText('Please enter a valid email address');
  });

  test('client validation shows error for short password', async ({ page }) => {
    // Enter valid email but short password
    await page.locator('#email').fill('test@example.com');
    await page.locator('#password').fill('12345');
    await page.locator('button[type="submit"]').click();

    // Check for error message
    const errorMessage = page.locator('.text-red-800');
    await expect(errorMessage).toContainText('Password must be at least 6 characters');
  });

  test('wrong credentials shows error', async ({ page }) => {
    // Mock the API to return an error
    await page.route('**/auth/v1/token?grant_type=password', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid login credentials'
        })
      });
    });

    // Enter wrong credentials
    await page.locator('#email').fill('wrong@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.locator('button[type="submit"]').click();

    // Check for error message
    const errorMessage = page.locator('.text-red-800');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/invalid|credentials|wrong/i);
  });

  test('toggle between login and signup modes', async ({ page }) => {
    // Start in login mode
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');

    // Click Sign Up toggle
    await page.getByText('Sign Up', { exact: true }).click();

    // Check signup mode
    await expect(page.locator('h1')).toContainText('Create Account');
    await expect(page.locator('button[type="submit"]')).toContainText('Create Account');

    // Click Sign In toggle to go back (use the toggle link, not submit button)
    await page.locator('p.text-gray-600 button').filter({ hasText: 'Sign In' }).click();

    // Check back in login mode
    await expect(page.locator('h1')).toContainText('Welcome Back');
    await expect(page.locator('button[type="submit"]')).toContainText('Sign In');
  });

  test('signup flow shows email confirmation needed', async ({ page }) => {
    // Mock the signup API to return no session (needs confirmation)
    await page.route('**/auth/v1/signup', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 'test-user-id',
            email: 'newuser@example.com',
            confirmed_at: null
          },
          session: null
        })
      });
    });

    // Switch to signup mode
    await page.getByText('Sign Up', { exact: true }).click();

    // Fill form
    await page.locator('#email').fill('newuser@example.com');
    await page.locator('#password').fill('password123');
    await page.locator('button[type="submit"]').click();

    // Check for success/confirmation message
    // (This should show some indication that email confirmation is needed)
    await expect(page.locator('.text-green-800, .text-blue-800, .text-yellow-800')).toBeVisible();
  });

  test('forgot password modal opens', async ({ page }) => {
    // Click forgot password link
    await page.getByText('Forgot password?').click();

    // Check modal is visible with correct heading
    const modal = page.locator('h2').filter({ hasText: 'Reset Password' });
    await expect(modal).toBeVisible();
  });

  test('route guard redirects /app to /auth when not authenticated', async ({ page }) => {
    // Clear any existing session storage
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    // Try to access protected route
    await page.goto('/app');

    // Should redirect to auth page
    await expect(page).toHaveURL('/auth');
  });

  test('landing page redirects to /app if authenticated', async ({ page }) => {
    // This test depends on setup project authenticating first
    // Skip in this file since we're testing the unauthenticated flow
    test.skip();
  });
});
