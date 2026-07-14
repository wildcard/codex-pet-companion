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
