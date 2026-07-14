import { expect, test } from '@playwright/test';

test('Kavana site embeds the self-hosted SDK without external requests', async ({ page, baseURL }) => {
  const externalRequests: string[] = [];
  const origin = new URL(baseURL ?? 'http://127.0.0.1:4173').origin;
  page.on('request', (request) => {
    if (new URL(request.url()).origin !== origin) externalRequests.push(request.url());
  });

  await page.goto('/');
  await page.locator('#web-sdk').scrollIntoViewIfNeeded();
  const pet = page.locator('#sdk-kavana');
  await expect(pet).toBeVisible();
  await expect(pet.locator('.name')).toHaveText('Kavana');
  await expect(pet.locator('.sprite')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.getByRole('button', { name: 'Ask the SDK to wave' }).click();
  expect(externalRequests).toEqual([]);
});
