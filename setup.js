const fs = require('fs');
const path = require('path');

// 1. Define the folder structure and file contents
const structure = {
  'data': {},
  'tests': {},
};

const files = {
  'package.json': JSON.stringify({
    name: "resume-automation-suite",
    version: "1.0.0",
    description: "Professional Playwright Automation Suite",
    scripts: {
      "test": "npx playwright test",
      "test:headed": "npx playwright test --headed",
      "report": "npx playwright show-report"
    },
    devDependencies: {
      "@playwright/test": "^1.41.0",
      "@types/node": "^20.11.0"
    }
  }, null, 2),

  'playwright.config.ts': `
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'https://books.toscrape.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});`,

  'data/testData.json': JSON.stringify({
    categories: [
      { name: "Travel", count: 11 },
      { name: "Mystery", count: 32 },
      { name: "Historical Fiction", count: 26 }
    ],
    apiEndpoint: "https://jsonplaceholder.typicode.com/posts/1",
    expectedAuthor: "Leanne Graham"
  }, null, 2),

  'tests/masterSuite.spec.ts': `
import { test, expect } from '@playwright/test';
import * as data from '../data/testData.json';

test.describe('Professional Automation Suite', () => {

  // 1. API Validation
  test('API Validation: Check backend status', async ({ request }) => {
    console.log('Validating API endpoint:', data.apiEndpoint);
    const response = await request.get(data.apiEndpoint);
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.id).toBe(1);
  });

  // 2. Dynamic Data Driven Test
  for (const category of data.categories) {
    test(\`UI: Verify Category - \${category.name}\`, async ({ page }) => {
      await page.goto('/');
      await page.getByRole('link', { name: category.name, exact: true }).click();
      await expect(page.getByRole('heading', { name: category.name })).toBeVisible();
      
      const books = page.locator('.product_pod');
      await expect(books).toHaveCount(category.count);
    });
  }

  // 3. Advanced Interactions (Drag and Drop)
  test('Advanced: Drag and Drop Interaction', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/drag_and_drop');
    await page.locator('#column-a').dragTo(page.locator('#column-b'));
    await expect(page.locator('#column-b')).toHaveText('A');
  });

  // 4. Handling Alerts
  test('Advanced: Handle JS Alerts', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    page.on('dialog', async dialog => {
      console.log('Alert message:', dialog.message());
      await dialog.accept();
    });
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    await expect(page.locator('#result')).toHaveText('You successfully clicked an alert');
  });
});`,

  'README.md': `
# Professional Automation Suite

## Overview
This suite demonstrates advanced Playwright capabilities including:
- **Data-Driven Testing** (JSON source)
- **API + UI Hybrid Testing**
- **Complex User Interactions** (Drag & Drop, Alerts)
- **CI/CD Ready Architecture**

## Setup
1. \`npm install\`
2. \`npx playwright test\`
`
};

// 2. Execute Creation
console.log("🚀 Initializing Project...");

// Create Folders
for (const dir of Object.keys(structure)) {
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
      console.log(`📁 Created folder: ${dir}`);
  }
}

// Create Files
for (const [fileName, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, fileName), content);
  console.log(`📄 Created file: ${fileName}`);
}

console.log("\n✅ Setup Complete!");
console.log("👉 RUN THIS NEXT: npm install");
console.log("👉 THEN RUN: npx playwright test");