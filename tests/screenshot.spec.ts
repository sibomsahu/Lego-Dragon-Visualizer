import { test, expect } from '@playwright/test';
import fs from 'fs';

test('take screenshot', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'screenshot.png' });
  console.log("Screenshot saved to screenshot.png");
});
