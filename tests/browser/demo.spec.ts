import { expect, test } from '@playwright/test';

test('Kavana loads transparently under a self-only script CSP', async ({ page }) => {
  const externalRequests: string[] = [];
  const origin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4174').origin;
  page.on('request', (request) => { if (new URL(request.url()).origin !== origin) externalRequests.push(request.url()); });
  await page.goto('/');
  const pet = page.locator('#inline-pet');
  await expect(pet).toBeVisible();
  await expect(pet.locator('.name')).toHaveText('Kavana');
  const sprite = pet.locator('.sprite');
  await expect(sprite).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.locator('#wave').click();
  await expect(pet).toHaveAttribute('mode', 'inline');
  expect(externalRequests).toEqual([]);
});

test('floating controls tuck and recall with focus restoration', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const pet = document.createElement('codex-pet-companion');
    pet.id = 'floating-test';
    pet.setAttribute('manifest-url', '/pets/kavana/pet.json');
    pet.setAttribute('atlas-url', '/pets/kavana/spritesheet.webp');
    document.body.append(pet);
  });
  const pet = page.locator('#floating-test');
  await expect(pet.locator('.name')).toHaveText('Kavana');
  await pet.locator('.tuck').click();
  await expect(pet.locator('.recall')).toBeVisible();
  await expect(pet.locator('.recall')).toBeFocused();
  await pet.locator('.recall').click();
  await expect(pet.locator('.pet')).toBeFocused();
});

test('a v1 two-file pet loads and rejects v2-only look playback', async ({ page }) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const pet = document.createElement('codex-pet-companion');
    pet.setAttribute('mode', 'inline');
    pet.setAttribute('manifest-url', '/fixtures/v1/pet.json');
    document.body.append(pet);
    await new Promise((resolve) => pet.addEventListener('codex-pet-ready', resolve, { once: true }));
    const error = new Promise<string>((resolve) => pet.addEventListener('codex-pet-error', (event) => resolve((event as CustomEvent).detail.error.message), { once: true }));
    (pet as HTMLElement & { play: (state: string) => void }).play('look-around');
    return { name: pet.shadowRoot?.querySelector('.name')?.textContent, error: await error };
  });
  expect(result.name).toBe('Kavana v1 fixture');
  expect(result.error).toContain('requires a Codex v2 spritesheet');
});
