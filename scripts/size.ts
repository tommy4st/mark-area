// Fails when `define.ts`, bundled with its dependencies like an app would ship it, exceeds the gzip budget.
// Guards against heavy imports (e.g. `markdown()` from @codemirror/lang-markdown pulls in HTML, CSS and JS grammars).
const BUDGET = 120 * 1024;

const result = await Bun.build({ entrypoints: ['define.ts'], target: 'browser', minify: true });
if (!result.success) throw new AggregateError(result.logs, 'Build failed');
const code = new Uint8Array(await result.outputs[0]!.arrayBuffer());
const size = Bun.gzipSync(code, { level: 9 }).length;
const kb = (n: number) => `${(n / 1024).toFixed(1)} KB`;

console.log(`define.ts bundle: ${kb(code.length)} minified, ${kb(size)} gzip (budget ${kb(BUDGET)})`);
if (size > BUDGET) {
    console.error('Bundle exceeds the size budget.');
    process.exit(1);
}
