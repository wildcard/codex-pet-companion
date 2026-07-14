import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/adoption',
  testMatch: 'caro.spec.ts',
  use: {
    baseURL: process.env.CARO_SITE_URL ?? 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop-chromium', use: { browserName: 'chromium', viewport: { width: 1280, height: 800 } } },
    { name: 'mobile-chromium', use: { browserName: 'chromium', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
