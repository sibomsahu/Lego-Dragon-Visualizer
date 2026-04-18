import { test, expect } from '@playwright/test';

test('check click', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(1000);
  
  // Get initial background
  const initialBg = await page.evaluate(() => document.querySelector('main')?.style.background);
  
  // Click second button
  await page.click('button:nth-of-type(2)');
  await page.waitForTimeout(2000);
  
  // Get new background
  const newBg = await page.evaluate(() => document.querySelector('main')?.style.background);
  
  console.log("Initial BG:", initialBg);
  console.log("New BG:", newBg);
  console.log("Logs:", logs);
});
