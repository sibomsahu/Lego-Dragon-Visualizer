import { test, expect } from '@playwright/test';

test('check for hydration errors', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[pageerror] ${err.message}`));
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  // Click a button
  await page.click('button:nth-of-type(2)');
  await page.waitForTimeout(1000);
  
  console.log("LOGS:", logs);
});
