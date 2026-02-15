import { test, expect } from '@playwright/test';

test('Visual check: Books homepage', async ({ page }) => {
  // 1. Go to the site
  await page.goto('https://books.toscrape.com/');

  // 2. Wait for images to load (stability is key for visual tests!)
  await page.waitForLoadState('networkidle');

  // 3. The Magic Line: Compare current page to the baseline
  // If it's the first time running, Playwright will just save the "Golden Image"
  await expect(page).toHaveScreenshot('homepage-baseline.png', {
  animations: 'disabled', // Stops moving sliders from breaking the test
  scale: 'css',
    fullPage: true, // Captures the whole scrollable page
    maxDiffPixelRatio: 0.1, // Allows 10% tiny differences (useful for anti-aliasing)
   //  mask: [page.locator('.price_color')],  // Turns prices into purple boxes so they are ignored
  });
 
});