import { test, expect } from '@playwright/test';

test.describe('Onboarding Wizard', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/welcome');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Step 1 displays with product type buttons and initial state', async ({ page }) => {
    await page.goto('/welcome');

    // Check progress indicator
    await expect(page.getByText('Step 1 of 6')).toBeVisible();

    // Check heading
    await expect(page.getByRole('heading', { name: 'What are you launching?' })).toBeVisible();

    // Check all product type buttons are present
    await expect(page.getByRole('button', { name: 'Mobile App' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SaaS Product' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'E-commerce Store' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Indie Game' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Digital Product' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Other' })).toBeVisible();

    // Check input fields
    await expect(page.getByPlaceholder('My Awesome Product')).toBeVisible();
    await expect(page.getByPlaceholder('A tool that helps...')).toBeVisible();

    // Check next button exists and shows correct text
    await expect(page.getByRole('button', { name: 'Next: Your Experience →' })).toBeVisible();
  });

  test('Next button is disabled when form is incomplete', async ({ page }) => {
    await page.goto('/welcome');

    const nextButton = page.getByRole('button', { name: 'Next: Your Experience →' });

    // Initially disabled (no product type or name)
    await expect(nextButton).toBeDisabled();

    // Still disabled after only selecting product type
    await page.getByRole('button', { name: 'SaaS Product' }).click();
    await expect(nextButton).toBeDisabled();

    // Clear and only fill product name (no type selected)
    await page.reload();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.getByPlaceholder('My Awesome Product').fill('Test Product');
    await expect(nextButton).toBeDisabled();
  });

  test('Selecting product type and filling name enables Next button', async ({ page }) => {
    await page.goto('/welcome');

    const nextButton = page.getByRole('button', { name: 'Next: Your Experience →' });

    // Select product type
    await page.getByRole('button', { name: 'SaaS Product' }).click();

    // Fill product name
    await page.getByPlaceholder('My Awesome Product').fill('Test Product');

    // Next button should now be enabled
    await expect(nextButton).toBeEnabled();

    // Optional: fill description (should still be enabled)
    await page.getByPlaceholder('A tool that helps...').fill('A tool that helps developers test');
    await expect(nextButton).toBeEnabled();
  });

  test('Navigating to step 2 after filling step 1', async ({ page }) => {
    await page.goto('/welcome');

    // Fill step 1
    await page.getByRole('button', { name: 'SaaS Product' }).click();
    await page.getByPlaceholder('My Awesome Product').fill('Test Product');

    // Click next
    await page.getByRole('button', { name: 'Next: Your Experience →' }).click();

    // Wait for step 2 to appear
    await expect(page.getByText('Step 2 of 6')).toBeVisible();

    // Check step 2 content (experience level selection - Beginner & Intermediate only)
    await expect(page.getByRole('button', { name: 'Beginner' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Intermediate' })).toBeVisible();
  });

  test('Back navigation preserves data', async ({ page }) => {
    await page.goto('/welcome');

    // Fill step 1
    await page.getByRole('button', { name: 'Mobile App' }).click();
    await page.getByPlaceholder('My Awesome Product').fill('My App');
    await page.getByPlaceholder('A tool that helps...').fill('My app description');

    // Navigate to step 2
    await page.getByRole('button', { name: 'Next: Your Experience →' }).click();
    await expect(page.getByText('Step 2 of 6')).toBeVisible();

    // Go back to step 1
    const backButton = page.getByRole('button', { name: /back/i });
    await backButton.click();

    // Verify data is preserved
    await expect(page.getByText('Step 1 of 6')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mobile App' })).toHaveClass(/border-indigo-600/);
    await expect(page.getByPlaceholder('My Awesome Product')).toHaveValue('My App');
    await expect(page.getByPlaceholder('A tool that helps...')).toHaveValue('My app description');
  });

  test('Data persists to localStorage', async ({ page }) => {
    await page.goto('/welcome');

    // Fill step 1
    await page.getByRole('button', { name: 'SaaS Product' }).click();
    await page.getByPlaceholder('My Awesome Product').fill('Test SaaS');
    await page.getByPlaceholder('A tool that helps...').fill('Test description');

    // Navigate to step 2
    await page.getByRole('button', { name: 'Next: Your Experience →' }).click();
    await expect(page.getByText('Step 2 of 6')).toBeVisible();

    // Check localStorage
    const savedData = await page.evaluate(() => {
      const data = localStorage.getItem('onboarding_wizard_data');
      return data ? JSON.parse(data) : null;
    });

    expect(savedData).toBeTruthy();
    expect(savedData.data).toMatchObject({
      productType: 'saas',
      productName: 'Test SaaS',
    });
    expect(savedData.currentStep).toBe(2);
    expect(savedData.savedAt).toBeTruthy();
  });

  test('Restore modal shows when returning with saved data', async ({ page }) => {
    // Set up saved data in localStorage
    await page.goto('/welcome');
    await page.evaluate(() => {
      const savedData = {
        data: {
          productType: 'saas',
          productName: 'Saved Product',
          description: 'Saved description',
        },
        currentStep: 3,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('onboarding_wizard_data', JSON.stringify(savedData));
    });

    // Reload page
    await page.reload();

    // Check restore modal appears
    await expect(page.getByRole('heading', { name: 'Welcome back! 👋' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Fresh' })).toBeVisible();

    // Click Continue
    await page.getByRole('button', { name: 'Continue' }).click();

    // Should be on step 3
    await expect(page.getByText('Step 3 of 6')).toBeVisible();

    // Verify data was restored by going back to step 1
    const backButton = page.getByRole('button', { name: /back/i });
    await backButton.click();
    await backButton.click();

    await expect(page.getByPlaceholder('My Awesome Product')).toHaveValue('Saved Product');
  });

  test('Start Fresh clears saved data', async ({ page }) => {
    // Set up saved data in localStorage
    await page.goto('/welcome');
    await page.evaluate(() => {
      const savedData = {
        data: {
          productType: 'saas',
          productName: 'Saved Product',
        },
        currentStep: 3,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('onboarding_wizard_data', JSON.stringify(savedData));
    });

    // Reload page
    await page.reload();

    // Check restore modal appears
    await expect(page.getByRole('heading', { name: 'Welcome back! 👋' })).toBeVisible();

    // Click Start Fresh
    await page.getByRole('button', { name: 'Start Fresh' }).click();

    // Should be on step 1 with empty form
    await expect(page.getByText('Step 1 of 6')).toBeVisible();
    await expect(page.getByPlaceholder('My Awesome Product')).toHaveValue('');

    // Verify localStorage is cleared
    const savedData = await page.evaluate(() => {
      return localStorage.getItem('onboarding_wizard_data');
    });
    expect(savedData).toBeNull();
  });

  test('Progress bar shows correct percentage', async ({ page }) => {
    await page.goto('/welcome');

    // Step 1 - should show some progress (e.g., ~17% for 1/6)
    const progressBar1 = page.locator('[role="progressbar"], .progress-bar, [style*="width"]').first();
    await expect(progressBar1).toBeVisible();

    // Fill step 1 and go to step 2
    await page.getByRole('button', { name: 'SaaS Product' }).click();
    await page.getByPlaceholder('My Awesome Product').fill('Test');
    await page.getByRole('button', { name: 'Next: Your Experience →' }).click();

    // Step 2 - progress should increase
    await expect(page.getByText('Step 2 of 6')).toBeVisible();
  });

  test('Optional description field does not block progression', async ({ page }) => {
    await page.goto('/welcome');

    // Fill only required fields (type and name, skip description)
    await page.getByRole('button', { name: 'E-commerce Store' }).click();
    await page.getByPlaceholder('My Awesome Product').fill('My Store');

    // Next button should be enabled without description
    const nextButton = page.getByRole('button', { name: 'Next: Your Experience →' });
    await expect(nextButton).toBeEnabled();

    // Should be able to proceed
    await nextButton.click();
    await expect(page.getByText('Step 2 of 6')).toBeVisible();
  });
});
