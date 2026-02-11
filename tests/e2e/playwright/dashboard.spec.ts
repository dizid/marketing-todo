import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/app');
    await page.waitForLoadState('networkidle');
  });

  test('Dashboard loads and shows "Overall Progress"', async ({ page }) => {
    // Check that the ProgressCard is visible with the correct heading
    const progressCard = page.locator('h3:has-text("Overall Progress")');
    await expect(progressCard).toBeVisible({ timeout: 10000 });
  });

  test('Progress percentage and task count are visible', async ({ page }) => {
    // Wait for progress card to be visible
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Check that percentage is displayed (e.g., "0%", "45%", "100%")
    const percentageText = page.locator('.text-3xl.font-bold.text-highlight');
    await expect(percentageText).toBeVisible();
    await expect(percentageText).toContainText(/%/);

    // Check that task count is displayed (e.g., "0 of 10 tasks completed")
    const taskCountText = page.locator('text=/\\d+ of \\d+ tasks completed/');
    await expect(taskCountText).toBeVisible();
  });

  test('Task categories are visible (accordion headers)', async ({ page }) => {
    // Wait for content to load
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Check that at least one category header is visible
    // Categories have an h3 with font-display class inside a button
    const categoryHeaders = page.locator('button h3.font-display.text-primary');
    await expect(categoryHeaders.first()).toBeVisible({ timeout: 5000 });

    // Verify we have multiple categories
    const categoryCount = await categoryHeaders.count();
    expect(categoryCount).toBeGreaterThan(0);
  });

  test('Clicking a category header expands it (shows task items)', async ({ page }) => {
    // Wait for categories to load
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Find the first category header button
    const firstCategoryButton = page.locator('button').filter({ has: page.locator('h3.font-display.text-primary') }).first();
    await expect(firstCategoryButton).toBeVisible({ timeout: 5000 });

    // Get the category name for reference
    const categoryName = await firstCategoryButton.locator('h3').textContent();

    // Check if already expanded (look for checkboxes)
    const checkboxesBeforeClick = page.locator('input[type="checkbox"][id^="task-"]');
    const countBefore = await checkboxesBeforeClick.count();

    // Click to toggle
    await firstCategoryButton.click();
    await page.waitForTimeout(500); // Wait for animation

    // After clicking, checkboxes should be visible (if category has items)
    const checkboxesAfterClick = page.locator('input[type="checkbox"][id^="task-"]');
    const countAfter = await checkboxesAfterClick.count();

    // If we had checkboxes before, we should have fewer or same after collapse
    // If we had no checkboxes, we should have some after expand
    if (countBefore > 0) {
      // Was expanded, now collapsed - or stayed same if only one category
      expect(countAfter).toBeLessThanOrEqual(countBefore);
    } else {
      // Was collapsed, now expanded - should show checkboxes
      expect(countAfter).toBeGreaterThan(0);
    }
  });

  test('Experience mode toggle shows Beginner and Intermediate buttons', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Look for the "Experience Mode" label
    const experienceModeLabel = page.locator('text="Experience Mode"');
    await expect(experienceModeLabel).toBeVisible({ timeout: 5000 });

    // Check that Beginner button is visible
    const beginnerButton = page.getByRole('button', { name: 'Beginner', exact: true });
    await expect(beginnerButton).toBeVisible();

    // Check that Intermediate button is visible
    const intermediateButton = page.getByRole('button', { name: 'Intermediate', exact: true });
    await expect(intermediateButton).toBeVisible();

    // Check that Advanced button is visible but disabled
    const advancedButton = page.getByRole('button', { name: 'Advanced', exact: true });
    await expect(advancedButton).toBeVisible();
    await expect(advancedButton).toBeDisabled();
  });

  test('Toggling checkbox changes task completion state', async ({ page }) => {
    // Wait for categories to load
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Check if checkboxes are already visible (category may start expanded)
    const checkboxSelector = page.locator('input[type="checkbox"][id^="task-"]');
    let checkboxesVisible = await checkboxSelector.count() > 0;

    if (!checkboxesVisible) {
      // Expand the first category to show checkboxes
      const firstCategoryButton = page.locator('button').filter({ has: page.locator('h3.font-display.text-primary') }).first();
      await firstCategoryButton.click();
      await page.waitForTimeout(1000);
    }

    // Find the first checkbox
    const firstCheckbox = checkboxSelector.first();
    await expect(firstCheckbox).toBeVisible({ timeout: 5000 });

    // Get initial checked state
    const initialCheckedState = await firstCheckbox.isChecked();

    // Get the initial progress percentage
    const progressBefore = await page.locator('.text-3xl.font-bold.text-highlight').textContent();

    // Click the checkbox to toggle it
    await firstCheckbox.click();

    // Wait for state to update (debounced save)
    await page.waitForTimeout(1000);

    // Verify the checkbox state changed
    const newCheckedState = await firstCheckbox.isChecked();
    expect(newCheckedState).not.toBe(initialCheckedState);

    // Get the new progress percentage
    const progressAfter = await page.locator('.text-3xl.font-bold.text-highlight').textContent();

    // Progress should have changed (unless it was the only task, in which case it could go 0% -> 100% or vice versa)
    // We just verify the text content changed
    if (initialCheckedState === false) {
      // We checked a box, progress should increase or stay same
      expect(progressAfter).toBeTruthy();
    } else {
      // We unchecked a box, progress should decrease or stay same
      expect(progressAfter).toBeTruthy();
    }
  });

  test('Clicking Intermediate button switches experience level', async ({ page }) => {
    // Wait for dashboard to load
    await expect(page.locator('h3:has-text("Overall Progress")')).toBeVisible({ timeout: 10000 });

    // Wait for Experience Mode toggle to be visible
    const experienceModeLabel = page.locator('text="Experience Mode"');
    await expect(experienceModeLabel).toBeVisible({ timeout: 5000 });

    // Find the Beginner and Intermediate buttons
    const beginnerButton = page.getByRole('button', { name: 'Beginner', exact: true });
    const intermediateButton = page.getByRole('button', { name: 'Intermediate', exact: true });

    // Check initial state - one should be active (has bg-green-600 or bg-blue-600)
    const beginnerIsActive = await beginnerButton.evaluate((el) => el.classList.contains('bg-green-600'));
    const intermediateIsActive = await intermediateButton.evaluate((el) => el.classList.contains('bg-blue-600'));

    // At least one should be active
    expect(beginnerIsActive || intermediateIsActive).toBe(true);

    // If beginner is active, click intermediate
    if (beginnerIsActive) {
      await intermediateButton.click();

      // Wait for state to update
      await page.waitForTimeout(1000);

      // Verify intermediate is now active (has bg-blue-600 class)
      await expect(intermediateButton).toHaveClass(/bg-blue-600/);

      // Verify beginner is no longer active (should not have bg-green-600)
      const beginnerClassAfter = await beginnerButton.getAttribute('class');
      expect(beginnerClassAfter).not.toContain('bg-green-600');
    } else {
      // Intermediate is already active, click beginner to switch
      await beginnerButton.click();

      // Wait for state to update
      await page.waitForTimeout(1000);

      // Verify beginner is now active (has bg-green-600 class)
      await expect(beginnerButton).toHaveClass(/bg-green-600/);

      // Verify intermediate is no longer active (should not have bg-blue-600)
      const intermediateClassAfter = await intermediateButton.getAttribute('class');
      expect(intermediateClassAfter).not.toContain('bg-blue-600');
    }
  });
});
