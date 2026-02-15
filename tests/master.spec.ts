import { test, expect } from '@playwright/test';
import * as data from '../data/testData.json';

test.describe('Professional Automation Suite', () => {

  // TEST 1: API Validation
  test('API Validation: Check backend status', async ({ request }) => {
    console.log('Validating API endpoint:', data.apiEndpoint);
    const response = await request.get(data.apiEndpoint);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBe(1);
  });

  // TEST 2: Dynamic Data Driven Test
  for (const category of data.categories) {
    test(`UI: Verify Category - ${category.name}`, async ({ page }) => {
      await page.goto('https://books.toscrape.com/');
      await page.getByRole('link', { name: category.name, exact: true }).click();
      await expect(page.getByRole('heading', { name: category.name })).toBeVisible();
      const books = page.locator('.product_pod');
      await expect(books).toHaveCount(category.count);
    });
  }

  // TEST 3: Drag and Drop
  test('Advanced: Drag and Drop Interaction', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
    await page.locator('#column-a').dragTo(page.locator('#column-b'));
    await expect(page.locator('#column-b')).toHaveText('A');
  });

  // TEST 4: Alerts (Sequential Handling)
  test('Advanced: Handle JS Alerts', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');

    // 1. Handle Alert
    page.once('dialog', async dialog => {
        console.log(`Alert message: ${dialog.message()}`);
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');

    // 2. Handle Confirm
    page.once('dialog', async dialog => {
        console.log(`Confirm message: ${dialog.message()}`);
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.locator('#result')).toHaveText('You clicked: Ok');

    // 3. Handle Prompt
    const myText = 'Hello Sup!';
    page.once('dialog', async dialog => {
        console.log(`Prompt message: ${dialog.message()}`);
        await dialog.accept(myText);
    });
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.locator('#result')).toHaveText(`You entered: ${myText}`);
  });

});