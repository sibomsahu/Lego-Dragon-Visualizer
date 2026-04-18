import { test, expect } from '@playwright/test';

test('profile performance', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  const profile = await page.evaluate(() => {
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      // Simulate what useFrame does
      const matrix = new THREE.Matrix4();
      matrix.makeTranslation(1, 2, 3);
      // Wait, we can't easily simulate the whole React Three Fiber pipeline.
    }
    return performance.now() - start;
  });
  
  console.log("Profile:", profile);
});
