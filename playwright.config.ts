import { defineConfig } from '@playwright/test';

// End-to-end specs load `dist/standalone.js`; run `bun run build` first. Unit tests live in tests/unit (bun test).
export default defineConfig({
  testDir: 'tests',
  testMatch: '*.spec.ts',
  reporter: 'line',
  // One retry on CI absorbs timing flakes on loaded runners; a test that only passes on retry is reported as flaky.
  retries: process.env.CI ? 1 : 0,
  projects: ['chromium', 'firefox', 'webkit'].map((name) => ({ name, use: { browserName: name as 'chromium' } })),
});
