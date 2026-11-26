import { defineMarkArea } from './src/mark-area.ts';

export * from './index.ts';
export * from './plugin.ts';
export * from './tables.ts';
export * from './blocks.ts';

// An explicit call: a bare `import './define.ts'` is dropped by the bundler (`sideEffects` lists only dist files).
defineMarkArea();
