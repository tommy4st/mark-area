import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

async function loadPage(page: import('@playwright/test').Page, html: string) {
    await page.route('http://test.local/**', (route) => {
        const isJs = route.request().url().endsWith('.js');
        route.fulfill({
            contentType: isJs ? 'text/javascript' : 'text/html',
            body: isJs ? readFileSync('dist/standalone.js', 'utf8') : html,
        });
    });
    await page.goto('http://test.local/');
    await page.waitForSelector('mark-area .cm-line');
}

test('show-marks keeps all markdown syntax markers visible while preserving styling', async ({ page }) => {
    const md = [
        '## Heading',
        'Text **bold** *italic* ~~strike~~ `code` [link](https://example.com)',
        '- item',
        '',
        '> quote',
        '',
        '![alt](data:image/gif;base64,R0lGODlhAQABAAAAACw=)',
    ].join('\n');

    await loadPage(
        page,
        `<mark-area show-marks></mark-area>
        <script type="module">
            import { defineMarkArea } from "/standalone.js";
            defineMarkArea();
            document.querySelector('mark-area').value = ${JSON.stringify(md)};
        </script>`
    );

    const info = await page.evaluate(() => {
        const el = document.querySelector('mark-area')!;
        const root = el.shadowRoot!;
        const lines = Array.from(root.querySelectorAll('.cm-line')).map((l) => l.textContent ?? '');
        return {
            showMarks: el.showMarks,
            lines,
            hasHeadingClass: root.querySelectorAll('.cm-h2').length === 1,
            hasStrong: root.querySelector('.cm-strong')?.textContent,
            hasEm: root.querySelector('.cm-em')?.textContent,
            hasStrike: root.querySelector('.cm-strike')?.textContent,
            hasCode: root.querySelector('.cm-code')?.textContent,
            hasQuote: root.querySelectorAll('.cm-quote').length === 1,
            bulletWidgets: root.querySelectorAll('.cm-bullet').length,
            imageWidgets: root.querySelectorAll('.cm-image').length,
        };
    });

    expect(info.showMarks).toBe(true);
    expect(info.lines).toEqual(md.split('\n'));
    expect(info.hasHeadingClass).toBe(true);
    expect(info.hasStrong).toBe('**bold**');
    expect(info.hasEm).toBe('*italic*');
    expect(info.hasStrike).toBe('~~strike~~');
    expect(info.hasCode).toBe('`code`');
    expect(info.hasQuote).toBe(true);
    expect(info.bulletWidgets).toBe(0);
    expect(info.imageWidgets).toBe(0);
});

test('toggling showMarks dynamically updates decorations and respects precedence over hideMarks', async ({ page }) => {
    await loadPage(
        page,
        `<mark-area value="**bold** and - item"></mark-area>
        <script type="module">
            import { defineMarkArea } from "/standalone.js";
            defineMarkArea();
        </script>`
    );

    const lineText = () =>
        page.evaluate(() => document.querySelector('mark-area')!.shadowRoot!.querySelector('.cm-line')!.textContent);

    // Default unfocused: marks are hidden
    expect(await lineText()).toBe('bold and - item');

    // Enable showMarks -> marks appear immediately
    await page.evaluate(() => {
        document.querySelector('mark-area')!.showMarks = true;
    });
    expect(await lineText()).toBe('**bold** and - item');

    // Even if hideMarks is also set, showMarks wins
    await page.evaluate(() => {
        document.querySelector('mark-area')!.hideMarks = true;
    });
    expect(await lineText()).toBe('**bold** and - item');

    // Disable showMarks -> falls back to hideMarks
    await page.evaluate(() => {
        document.querySelector('mark-area')!.showMarks = false;
    });
    expect(await lineText()).toBe('bold and - item');
});

test('show-marks works with table plugins', async ({ page }) => {
    const tableMd = '| A | B |\n| --- | --- |\n| **x** | `y` |';
    await loadPage(
        page,
        `<mark-area show-marks></mark-area>
        <script type="module">
            import { defineMarkArea, tablePreviewPlugin, tableWysiwygPlugin } from "/standalone.js";
            defineMarkArea();
            const el = document.querySelector('mark-area');
            el.value = ${JSON.stringify(tableMd)};
            el.plugins = [tablePreviewPlugin()];
            window.__plugins = { tablePreviewPlugin, tableWysiwygPlugin };
        </script>`
    );

    // Preview table stays raw markdown when show-marks is active
    const previewState = await page.evaluate(() => {
        const root = document.querySelector('mark-area')!.shadowRoot!;
        return {
            tableWidgets: root.querySelectorAll('.cm-table-widget').length,
            lines: Array.from(root.querySelectorAll('.cm-line')).map((l) => l.textContent),
        };
    });
    expect(previewState.tableWidgets).toBe(0);
    expect(previewState.lines).toEqual(tableMd.split('\n'));

    // WYSIWYG table renders cells with raw inline marks visible when show-marks is active
    await page.evaluate(() => {
        const el = document.querySelector('mark-area')!;
        el.plugins = [(window as any).__plugins.tableWysiwygPlugin()];
    });
    const wysiwygCells = await page.evaluate(() => {
        const root = document.querySelector('mark-area')!.shadowRoot!;
        return Array.from(root.querySelectorAll('.cm-table td')).map((td) => td.textContent);
    });
    expect(wysiwygCells).toEqual(['**x**', '`y`']);
});
