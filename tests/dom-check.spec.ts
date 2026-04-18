import { test, expect } from '@playwright/test';

test('check dom', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);
  
  const domInfo = await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    const canvas = document.querySelector('canvas');
    
    const buttonInfo = Array.from(buttons).map(b => {
      const rect = b.getBoundingClientRect();
      const computed = window.getComputedStyle(b);
      return {
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        zIndex: computed.zIndex,
        pointerEvents: computed.pointerEvents
      };
    });
    
    const canvasInfo = canvas ? {
      rect: canvas.getBoundingClientRect(),
      zIndex: window.getComputedStyle(canvas).zIndex,
      pointerEvents: window.getComputedStyle(canvas).pointerEvents
    } : null;
    
    // Check what element is at the center of the first button
    let elementAtPoint = null;
    if (buttons.length > 0) {
      const rect = buttons[0].getBoundingClientRect();
      const el = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      elementAtPoint = el ? el.tagName + (el.className ? '.' + el.className.replace(/ /g, '.') : '') : null;
    }
    
    return { buttonInfo, canvasInfo, elementAtPoint };
  });
  
  console.log("DOM INFO:", JSON.stringify(domInfo, null, 2));
});
