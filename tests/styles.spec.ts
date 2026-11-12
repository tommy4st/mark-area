import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('--ma-* variables beat the CodeMirror base theme', async ({ page }) => {
    await page.route('http://test.local/**', (route) => {
        const isJs = route.request().url().endsWith('.js');
        route.fulfill({
            contentType: isJs ? 'text/javascript' : 'text/html',
            body: isJs
                ? readFileSync('dist/standalone.js', 'utf8')
                : `<style>mark-area { --ma-padding: 1px 2px; --ma-font: serif; }</style>
                   <mark-area value="plain \`code\` text"></mark-area>
                   <script type="module">import { defineMarkArea } from "/standalone.js"; defineMarkArea();</script>`,
        });
    });
    await page.goto('http://test.local/');
    await page.waitForSelector('mark-area .cm-line');

    const s = await page.evaluate(() => {
        const root = document.querySelector('mark-area')!.shadowRoot!;
        const cs = (sel: string) => getComputedStyle(root.querySelector(sel)!);
        const probe = document.createElement('span');
        probe.style.fontFamily = 'serif';
        document.body.append(probe);
        return {
            serif: getComputedStyle(probe).fontFamily,
            contentPadding: cs('.cm-content').padding,
            linePadding: cs('.cm-line').padding,
            contentFont: cs('.cm-content').fontFamily,
            scrollerFont: cs('.cm-scroller').fontFamily,
            codeFont: cs('.cm-code').fontFamily,
            scrollerPart: root.querySelector('.cm-scroller')!.getAttribute('part'),
            linePart: root.querySelector('.cm-line')!.getAttribute('part'),
        };
    });
    console.log(JSON.stringify(s));
    expect(s.contentPadding).toBe('1px 2px');
    expect(s.linePadding).toBe('0px');
    expect(s.contentFont).toBe(s.serif);
    expect(s.scrollerFont).toBe(s.serif);
    expect(s.codeFont).toContain('monospace');
    expect(s.scrollerPart).toBe('scroller');
    expect(s.linePart).toBe('line');
});
