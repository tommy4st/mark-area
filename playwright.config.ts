import { defineConfig } from '@playwright/test';

// End-to-end specs load `dist/standalone.js`; run `bun run build` first. Unit tests live in tests/unit (bun test).
export default defineConfig({ testDir: 'tests', testMatch: '*.spec.ts', reporter: 'line' });
