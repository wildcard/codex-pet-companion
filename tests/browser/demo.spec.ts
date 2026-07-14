import { expect, test } from '@playwright/test';

test('publishes modern favicon and install metadata', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'favicon-96x96.png');
  await expect(page.locator('link[rel="shortcut icon"]')).toHaveAttribute('href', 'favicon.ico');
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('sizes', '180x180');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', 'site.webmanifest');

  const manifestResponse = await request.get('/site.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/web-app-manifest-192x192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/web-app-manifest-512x512.png', sizes: '512x512' }),
  ]));
  for (const path of ['/favicon.ico', '/favicon-96x96.png', '/apple-touch-icon.png']) {
    expect((await request.get(path)).ok()).toBe(true);
  }
});

test('Kavana loads transparently under a self-only script CSP', async ({ page }) => {
  const externalRequests: string[] = [];
  const cspErrors: string[] = [];
  const origin = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4174').origin;
  page.on('request', (request) => { if (new URL(request.url()).origin !== origin) externalRequests.push(request.url()); });
  page.on('console', (message) => { if (message.type() === 'error' && message.text().includes('Content Security Policy')) cspErrors.push(message.text()); });
  await page.goto('/');
  const pet = page.locator('#inline-pet');
  await expect(pet).toBeVisible();
  await expect(pet.locator('.name')).toHaveText('Kavana');
  const sprite = pet.locator('.sprite');
  await expect(sprite).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await expect(sprite).toHaveCSS('width', '96px');
  await expect(sprite).toHaveCSS('height', '104px');
  await expect(sprite).toHaveCSS('background-image', /spritesheet\.webp/);
  await page.locator('#wave').click();
  await expect(pet).toHaveAttribute('mode', 'inline');
  expect(externalRequests).toEqual([]);
  expect(cspErrors).toEqual([]);
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

test('the live control starts one persistent route and then removes itself', async ({ page }) => {
  test.setTimeout(15_000);
  const requests: string[] = [];
  page.on('request', (request) => {
    if (/pet\.json|spritesheet\.webp/.test(request.url())) requests.push(request.url());
  });
  await page.goto('/');
  const pet = page.locator('#inline-pet');
  await expect(pet.locator('.name')).toHaveText('Kavana');
  await page.evaluate(() => {
    const pet = document.querySelector('#inline-pet')!;
    (window as typeof window & { roamStarts?: number }).roamStarts = 0;
    pet.addEventListener('codex-pet-roam-start', () => (window as typeof window & { roamStarts: number }).roamStarts += 1);
  });
  const button = page.getByRole('button', { name: 'Let Kavana roam' });
  await button.click();
  await expect(pet).toHaveAttribute('data-page-roaming', '');
  await expect(button).toHaveCount(0);
  expect(await pet.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('2.5s');
  expect(await pet.evaluate((element: HTMLElement & { startRoaming: () => Promise<boolean> }) => element.startRoaming())).toBe(true);
  expect(await page.evaluate(() => (window as typeof window & { roamStarts: number }).roamStarts)).toBe(1);
  await page.waitForTimeout(7_000);
  await expect(pet).toHaveAttribute('data-page-roaming', '');
  expect(requests).toHaveLength(2);
  expect(await page.locator('codex-pet-companion').count()).toBe(1);
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
