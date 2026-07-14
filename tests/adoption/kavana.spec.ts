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
  const sprite = pet.locator('.sprite');
  await expect(sprite).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sprite).toHaveCSS('width', '96px');
  await expect(sprite).toHaveCSS('height', '104px');
  await expect(sprite).toHaveCSS('background-image', /spritesheet\.webp/);
  expect(await pet.getAttribute('style')).toBeNull();
  expect(await sprite.getAttribute('style')).toBeNull();
  await page.getByRole('button', { name: 'Ask the SDK to wave' }).click();
  const zoomies = page.getByRole('button', { name: 'Send Kavana roaming' });
  await zoomies.click();
  await expect(pet).toHaveAttribute('data-page-roaming', '');
  await expect(zoomies).toBeDisabled();
  await expect(zoomies).toBeEnabled({ timeout: 8_000 });
  expect(await pet.getAttribute('data-page-roaming')).toBeNull();
  expect(externalRequests).toEqual([]);
});

test('Kavana publishes modern favicon and install metadata', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-96x96.png');
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute('href', 'favicon.ico');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'site.webmanifest');

  const manifestResponse = await request.get('/site.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.short_name).toBe('Kavana');
  for (const path of ['/favicon.ico', '/favicon-96x96.png', '/apple-touch-icon.png']) {
    expect((await request.get(path)).ok()).toBe(true);
  }
});
