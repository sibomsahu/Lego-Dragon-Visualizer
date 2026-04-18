import { test, expect } from '@playwright/test';

test('check fps', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  const fps = await page.evaluate(() => {
    return new Promise((resolve) => {
      let frames = 0;
      let startTime = performance.now();
      
      function loop() {
        frames++;
        if (performance.now() - startTime < 1000) {
          requestAnimationFrame(loop);
        } else {
          resolve(frames);
        }
      }
      
      requestAnimationFrame(loop);
    });
  });
  
  console.log("FPS:", fps);
});
