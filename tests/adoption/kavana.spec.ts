import { expect, test } from '@playwright/test';

test('Kavana site embeds the self-hosted SDK without external requests', async ({ page, baseURL }) => {
  const externalRequests: string[] = [];
  const cspErrors: string[] = [];
  const origin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin) externalRequests.push(request.url());
  });
  page.on('console', (message) => { if (message.type() === 'error' && message.text().includes('Content Security Policy')) cspErrors.push(message.text()); });

  await page.goto('/');
  await page.locator('#web-sdk').scrollIntoViewIfNeeded();
  const pet = page.locator('#sdk-kavana');
  await expect(pet).toBeVisible();
  await expect(pet.locator('.name')).toHaveText('Kavana');
  const sprite = pet.locator('.sprite');
  await expect(sprite).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sprite).toHaveCSS('width', '96px');
  await expect(sprite).toHaveCSS('height', '104px');
  await expect(sprite).toHaveCSS('background-image', /spritesheet\.webp/);
  await page.getByRole('button', { name: 'Ask the SDK to wave' }).click();
  expect(externalRequests).toEqual([]);
  expect(cspErrors).toEqual([]);
});
