import { defineConfig } from '@playwright/test';

const liveBaseUrl = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL: liveBaseUrl ?? 'http://127.0.0.1:4174', trace: 'retain-on-failure' },
  webServer: liveBaseUrl ? undefined : {
    command: 'pnpm build && pnpm build:docs && node scripts/serve-demo.mjs',
    url: 'http://127.0.0.1:4174',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop-chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chromium', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
