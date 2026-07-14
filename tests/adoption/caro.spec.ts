import { expect, test } from '@playwright/test';

test('caro.sh drives Kavana with the lightweight SDK animator', async ({ page }) => {
  await page.goto('/');
  const companion = page.locator('[data-kavana-companion]');
  const sprite = companion.locator('[data-kavana-sdk-sprite]');
  await expect(companion).toBeVisible();
  await expect(sprite).toHaveAttribute('data-scale', '0.5');
  await expect(sprite).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sprite).toHaveCSS('background-image', /spritesheet\.webp/);

  const firstFrame = await sprite.evaluate((element) => getComputedStyle(element).backgroundPosition);
  await expect.poll(() => sprite.evaluate((element) => getComputedStyle(element).backgroundPosition)).not.toBe(firstFrame);

  await companion.getByRole('button', { name: 'Talk with Kavana' }).dispatchEvent('click');
  await expect(companion.getByRole('heading', { name: "Hi, I'm Kavana." })).toBeVisible();
});
