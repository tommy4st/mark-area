import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

/** Serves `body` plus a module script; `/standalone.js` is imported without calling `defineMarkArea()`. */
const serve = async (page: Page, body: string, script = '') => {
  await page.route('http://test.local/**', (route) => {
    const isJs = route.request().url().endsWith('.js');
    route.fulfill({
      contentType: isJs ? 'text/javascript' : 'text/html',
      body: isJs ? readFileSync('dist/standalone.js', 'utf8') : `${body}<script type="module">import * as ma from "/standalone.js"; ${script}</script>`,
    });
  });
  await page.goto('http://test.local/');
  await page.waitForSelector('mark-area .cm-line');
};

const value = (page: Page) => page.evaluate(() => (document.getElementById('e') as any).value as string);

test('the standalone bundle registers the element on import; slotted toolbar text is not content', async ({ page }) => {
  await serve(page, '<mark-area id="e"><div slot="toolbar"><button data-action="bold">Bold</button></div>Hi</mark-area>');
  expect(await value(page)).toBe('Hi');
});

test('re-enabling a disabled fieldset re-enables the editor', async ({ page }) => {
  await serve(page, '<form><fieldset id="f" disabled><mark-area id="e" value="x"></mark-area></fieldset></form>');
  expect(await page.evaluate(() => (document.getElementById('e') as any).disabled)).toBe(true);
  await page.evaluate(() => ((document.getElementById('f') as HTMLFieldSetElement).disabled = false));
  expect(await page.evaluate(() => (document.getElementById('e') as any).disabled)).toBe(false);
  expect(await page.evaluate(() => document.getElementById('e')!.hasAttribute('disabled'))).toBe(false);
});

test('change fires only when the value changed since the last change', async ({ page }) => {
  await serve(page, '<mark-area id="e" value="a"></mark-area><input id="o">', `
    window.changes = 0; document.getElementById('e').addEventListener('change', () => window.changes++);`);
  const changes = () => page.evaluate(() => (window as any).changes as number);
  await page.locator('mark-area .cm-content').click();
  await page.locator('#o').click();
  // The editor notices blur asynchronously; `ma-touched` is set in the same step as `change`.
  await expect(page.locator('mark-area')).toHaveClass(/ma-touched/);
  expect(await changes()).toBe(0);
  await page.locator('mark-area .cm-content').click();
  await page.keyboard.type('b');
  await page.locator('#o').click();
  await expect.poll(changes).toBe(1);
});

test('Tab in an already formatted table moves without editing the document', async ({ page }) => {
  await serve(page, '<mark-area id="e"></mark-area>', `
    const e = document.getElementById('e'); e.plugins = [ma.tableInlinePlugin()];
    e.value = '| a   | b   |\\n| --- | --- |\\n| c   | d   |';
    window.inputs = 0; e.addEventListener('input', () => window.inputs++);`);
  await page.locator('mark-area .cm-line').first().click();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => (window as any).inputs)).toBe(0);
});

test('uploaded file names cannot escape the link text', async ({ page }) => {
  await serve(page, '<mark-area id="e" uploads></mark-area>', `
    document.getElementById('e').upload = async () => ({ url: 'http://x/y', name: 'a\\\\' });`);
  await page.evaluate(() => (document.getElementById('e') as any).uploadFiles([new File(['x'], 'f.txt')]));
  expect(await value(page)).toBe('[a](http://x/y)');
});

test('preview images need a safe image URL', async ({ page }) => {
  await serve(page, '<mark-area id="e" value="![a](ftp://x/a.png) ![b](b.png)"></mark-area>');
  await expect(page.locator('mark-area .cm-image')).toHaveCount(1);
});

test('a custom block at the start of the document renders as a card until the editor is focused', async ({ page }) => {
  await serve(page, '<mark-area id="e"></mark-area>', `
    const e = document.getElementById('e'); e.plugins = [ma.customBlocksPlugin()]; e.value = ':::faq{question="Q"}\\nA\\n:::\\n\\nx';`);
  await expect(page.locator('mark-area .ma-faq')).toHaveCount(1);
});

test('WYSIWYG card bodies that do not round-trip are edited as raw Markdown', async ({ page }) => {
  await serve(page, '<mark-area id="e" marks="hide"></mark-area>', `
    const e = document.getElementById('e'); e.plugins = [ma.customBlocksPlugin()];
    e.value = ':::faq{question="Q"}\\nSimple **body**\\n:::\\n\\n:::faq{question="R"}\\n- one\\n- two\\n:::';`);
  await expect(page.locator('mark-area .ma-editable-body')).toHaveCount(2);
  await expect(page.locator('mark-area .ma-editable-body.ma-rich')).toHaveCount(1);
});

test('the toolbar is one Tab stop with arrow-key navigation; label clicks focus the text', async ({ page }) => {
  await serve(page, '<input id="o"><label for="e">Notes</label><mark-area id="e" toolbar="bold italic link"></mark-area>');
  const active = () => page.evaluate(() => {
    const a = document.getElementById('e')!.shadowRoot!.activeElement as HTMLElement | null;
    return a?.dataset.action ?? a?.className ?? null;
  });
  await page.locator('#o').focus();
  await page.keyboard.press('Tab');
  expect(await active()).toBe('bold');
  await page.keyboard.press('ArrowLeft');
  expect(await active()).toBe('link');
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  expect(await active()).toBe('italic');
  await page.keyboard.press('Tab');
  expect(await active()).toContain('cm-content');
  await page.locator('#o').focus();
  await page.keyboard.press('Tab');
  expect(await active()).toBe('italic');
  await page.locator('label').click();
  expect(await active()).toContain('cm-content');
});

test('pasting rich text that carries a picture pastes the text instead of uploading', async ({ page }) => {
  test.skip(test.info().project.name === 'firefox', 'Firefox drops clipboardData from synthetic paste events');
  await serve(page, '<mark-area id="e" uploads></mark-area>', `
    document.getElementById('e').upload = async () => 'http://x/pic.png';`);
  await page.locator('mark-area .cm-content').click();
  await page.evaluate(() => {
    const dt = new DataTransfer();
    dt.setData('text/plain', 'cells');
    dt.setData('text/html', '<table><td>cells</td></table>');
    dt.items.add(new File(['x'], 'pic.png', { type: 'image/png' }));
    document.getElementById('e')!.shadowRoot!.querySelector('.cm-content')!.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true })
    );
  });
  await page.waitForTimeout(100);
  expect(await value(page)).toBe('cells');
});

test('setting a URL on a reference-style link makes it an inline link', async ({ page }) => {
  await serve(page, '<mark-area id="e" marks="hide" value="see [text] here"></mark-area>');
  await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    e.addEventListener('ma-link-prompt', (ev: any) => (ev.preventDefault(), ev.detail.apply('http://u')));
    e.view.dispatch({ selection: { anchor: 6 } });
    e.exec('link');
  });
  expect(await value(page)).toBe('see [text](http://u) here');
});

test('typing fires one input event per keystroke; form reset restores the default', async ({ page }) => {
  await serve(page, '<form><mark-area id="e" name="notes" value="hi"></mark-area></form>', `
    window.inputs = 0; document.getElementById('e').addEventListener('input', () => window.inputs++);`);
  await page.locator('mark-area .cm-content').click();
  await page.keyboard.press('End');
  await page.keyboard.type('!');
  expect(await page.evaluate(() => (window as any).inputs)).toBe(1);
  expect(await page.evaluate(() => new FormData(document.querySelector('form')!).get('notes'))).toBe('hi!');
  await page.evaluate(() => document.querySelector('form')!.reset());
  expect(await value(page)).toBe('hi');
});

test('editor labels translate table toolbar buttons', async ({ page }) => {
  await serve(page, '<mark-area id="e"></mark-area>', `
    const e = document.getElementById('e'); e.plugins = [ma.tableWysiwygPlugin({ labels: { 'row-add': { label: 'Option' } } })];
    e.value = '| a |\\n| - |\\n| b |';`);
  const rowAdd = page.locator('mark-area [data-table-action="row-add"]');
  await expect(rowAdd).toHaveText('Option');
  await page.evaluate(() => ((document.getElementById('e') as any).labels = { 'row-add': { label: 'Zeile', title: 'Zeile hinzufügen' } }));
  await expect(rowAdd).toHaveText('Zeile');
  await expect(rowAdd).toHaveAttribute('title', 'Zeile hinzufügen');
});
