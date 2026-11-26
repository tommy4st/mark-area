import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const open = async (page: Page, attrs = '', inner = '') => {
  await page.route('http://test.local/**', (route) => {
    const isJs = route.request().url().endsWith('.js');
    route.fulfill({
      contentType: isJs ? 'text/javascript' : 'text/html',
      body: isJs
        ? readFileSync('dist/standalone.js', 'utf8')
        : `<mark-area id="e" ${attrs}>${inner}</mark-area>
           <script type="module">import { defineMarkArea } from "/standalone.js"; defineMarkArea();</script>`,
    });
  });
  await page.goto('http://test.local/');
  await page.waitForSelector('mark-area .cm-line');
};

const marksShown = (page: Page) =>
  page.evaluate(() => document.getElementById('e')!.shadowRoot!.querySelector('.cm-content')!.textContent!.includes('**'));

test('marks attribute and property switch the mode; legacy attributes still work', async ({ page }) => {
  await open(page, 'marks="show" value="a **b** c" toolbar="bold mode"');
  expect(await marksShown(page)).toBe(true);
  expect(await page.evaluate(() => ((document.getElementById('e') as any).marks = 'hide'))).toBe('hide');
  expect(await marksShown(page)).toBe(false);
  await expect(page.locator('mark-area [data-action="mode"]')).toHaveAttribute('title', /WYSIWYG only/);
  await page.evaluate(() => {
    const e = document.getElementById('e')!;
    e.removeAttribute('marks');
    e.setAttribute('show-marks', '');
  });
  expect(await page.evaluate(() => (document.getElementById('e') as any).marks)).toBe('show');
  expect(await marksShown(page)).toBe(true);
});

test('removing the element destroys the view; re-adding restores value and applies changes made meanwhile', async ({ page }) => {
  await open(page, 'value="one"');
  const r = await page.evaluate(async () => {
    const e = document.getElementById('e') as any;
    const parent = e.parentNode!;
    const first = e.view;
    // A move within one task keeps the live view.
    parent.append(e);
    await Promise.resolve();
    const kept = e.view === first;
    e.remove();
    await Promise.resolve();
    const destroyed = e.view === undefined;
    const detachedValue = e.value;
    e.value = 'two';
    e.readOnly = true;
    parent.append(e);
    return { kept, destroyed, detachedValue, value: e.value, fresh: e.view !== first, readOnly: e.view.state.readOnly };
  });
  expect(r).toEqual({ kept: true, destroyed: true, detachedValue: 'one', value: 'two', fresh: true, readOnly: true });
});

test('typing fires input; setting value does not and clears the undo history', async ({ page }) => {
  await open(page);
  await page.evaluate(() => {
    (window as any).inputs = 0;
    document.getElementById('e')!.addEventListener('input', () => (window as any).inputs++);
  });
  await page.locator('mark-area .cm-content').click();
  await page.keyboard.type('abc');
  expect(await page.evaluate(() => (window as any).inputs)).toBe(3);
  const r = await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    e.value = 'replaced';
    const undone = e.exec('undo');
    return { inputs: (window as any).inputs, value: e.value, undone };
  });
  expect(r.inputs).toBe(3);
  expect(r.value).toBe('replaced');
  // Undo works again for edits made after the replacement.
  await page.keyboard.type('!');
  await page.evaluate(() => (document.getElementById('e') as any).exec('undo'));
  expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe('replaced');
});

test('a child textarea is adopted: attributes the host lacks, value, and removal so it is not submitted twice', async ({ page }) => {
  await open(page, 'rows="3"', '<textarea name="body" rows="9" required class="x" placeholder="P">a **b**</textarea>');
  const r = await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    const form = document.createElement('form');
    e.before(form);
    form.append(e);
    return {
      value: e.value,
      attrs: ['name', 'rows', 'required', 'placeholder', 'class'].map((a) => e.getAttribute(a)),
      textareas: e.querySelectorAll('textarea').length,
      submitted: [...new FormData(form).entries()],
    };
  });
  expect(r).toEqual({
    value: 'a **b**',
    attrs: ['body', '3', '', 'P', null],
    textareas: 0,
    submitted: [['body', 'a **b**']],
  });
});

test('Enter continues list markup and Backspace removes the marker', async ({ page }) => {
  await open(page, 'value="- a"');
  await page.locator('mark-area .cm-content').click();
  await page.keyboard.press('End');
  await page.keyboard.press('Enter');
  expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe('- a\n- ');
  // Backspace turns the marker into continuation indent.
  await page.keyboard.press('Backspace');
  expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe('- a\n  ');
});

test('strings override the validation message; uploads toggle the upload actions', async ({ page }) => {
  await open(page, 'required');
  const r = await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    const has = () => !!e.shadowRoot.querySelector('[data-action="image"]');
    const before = e.validationMessage;
    e.strings = { required: 'Pflichtfeld' };
    const off = has();
    e.uploads = true;
    return { before, after: e.validationMessage, off, on: has(), exec: e.exec('nope') };
  });
  expect(r).toEqual({ before: 'Please fill out this field.', after: 'Pflichtfeld', off: false, on: true, exec: false });
});

test('an upload lands where it started, even when the user keeps typing', async ({ page }) => {
  await open(page, 'uploads value="start end"');
  await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    e.upload = () => new Promise((resolve) => ((window as any).finish = () => resolve('/img.png')));
    e.view.dispatch({ selection: { anchor: 6 } });
    (window as any).done = e.uploadFiles([new File(['x'], 'p.png', { type: 'image/png' })]);
    // The user moves to the end and types while the upload runs.
    e.view.dispatch({ changes: { from: 9, insert: '!' }, selection: { anchor: 10 } });
    e.view.dispatch({ changes: { from: 0, insert: '> ' } });
  });
  const r = await page.evaluate(async () => {
    const e = document.getElementById('e') as any;
    (window as any).finish();
    await (window as any).done;
    return { value: e.value, head: e.view.state.selection.main.head };
  });
  // The cursor stays after the "!" the user typed.
  expect(r).toEqual({ value: '> start ![p.png](/img.png)end!', head: 30 });
});

test('disabled and readOnly gate exec; mode still works in readOnly', async ({ page }) => {
  await open(page, 'value="hello" toolbar="bold mode"');
  const r = await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    e.view.dispatch({ selection: { anchor: 0, head: 5 } });
    e.readOnly = true;
    const roBold = e.exec('bold');
    const roMode = e.exec('mode');
    const roMarks = e.marks;
    e.readOnly = false;
    e.disabled = true;
    const disBold = e.exec('bold');
    const disMode = e.exec('mode');
    const disStateRo = e.view.state.readOnly;
    return { value: e.value, roBold, roMode, roMarks, disBold, disMode, disStateRo };
  });
  expect(r).toEqual({
    value: 'hello',
    roBold: false,
    roMode: true,
    roMarks: 'hide',
    disBold: false,
    disMode: false,
    disStateRo: true,
  });
});

test('italic inside **bold** wraps instead of stripping bold, and >hello keeps its first letter', async ({ page }) => {
  await open(page, 'value="**bold**\n>hello"');
  const line2Before = await page.evaluate(
    () => document.getElementById('e')!.shadowRoot!.querySelectorAll('.cm-line')[1]!.textContent
  );
  expect(line2Before).toBe('hello');

  const afterItalic = await page.evaluate(() => {
    const e = document.getElementById('e') as any;
    e.view.dispatch({ selection: { anchor: 2, head: 6 } });
    e.exec('italic');
    return e.value;
  });
  expect(afterItalic).toBe('***bold***\n>hello');
});

test('concurrent uploads keep uploading attribute and sanitize filenames/URLs', async ({ page }) => {
  await open(page, 'uploads value=""');
  const r = await page.evaluate(async () => {
    const e = document.getElementById('e') as any;
    const resolvers: Array<(v: string) => void> = [];
    e.upload = () => new Promise<string>((resolve) => resolvers.push(resolve));
    const p1 = e.uploadFiles([new File(['a'], 'a\n[b].png', { type: 'image/png' })]);
    const p2 = e.uploadFiles([new File(['b'], 'c.png', { type: 'image/png' })]);
    const duringBoth = e.hasAttribute('uploading');
    resolvers[0]!('https://cdn.test/a )b.png');
    await p1;
    const afterFirst = e.hasAttribute('uploading');
    resolvers[1]!('https://cdn.test/c.png');
    await p2;
    const afterBoth = e.hasAttribute('uploading');
    return { duringBoth, afterFirst, afterBoth, value: e.value };
  });
  expect(r.duringBoth).toBe(true);
  expect(r.afterFirst).toBe(true);
  expect(r.afterBoth).toBe(false);
  expect(r.value).toContain('![a b .png](https://cdn.test/a%20%29b.png)');
  expect(r.value).toContain('![c.png](https://cdn.test/c.png)');
});

test('WYSIWYG tables block javascript: links, avoid pipe double-escaping, and focus the right table', async ({ page }) => {
  const md = '| A | B |\n| --- | --- |\n| [xss](javascript:alert(1)) | a\\|b |\n\n| C | D |\n| --- | --- |\n| 1 | 2 |';
  await page.route('http://test.local/**', (route) => {
    const isJs = route.request().url().endsWith('.js');
    route.fulfill({
      contentType: isJs ? 'text/javascript' : 'text/html',
      body: isJs
        ? readFileSync('dist/standalone.js', 'utf8')
        : `<mark-area id="e"></mark-area>
           <script type="module">import { defineMarkArea, tableWysiwygPlugin } from "/standalone.js"; defineMarkArea();
           const e = document.getElementById('e'); e.plugins = [tableWysiwygPlugin()]; e.value = ${JSON.stringify(md)};</script>`,
    });
  });
  await page.goto('http://test.local/');
  await page.waitForSelector('mark-area .cm-table-wysiwyg');

  // No javascript: href rendered
  await expect(page.locator('mark-area .cm-table-wysiwyg a[href]')).toHaveCount(0);

  // Editing cell with escaped pipe does not double-escape it
  const pipeCell = page.locator('mark-area .cm-table-wysiwyg').nth(0).locator('[data-row="1"][data-col="1"]');
  await pipeCell.click();
  await page.keyboard.press('End');
  await page.keyboard.type('c');
  await page.keyboard.press('Escape');
  const val = await page.evaluate(() => (document.getElementById('e') as any).value as string);
  expect(val).toContain('a\\|bc');
  expect(val).not.toContain('a\\\\|');

  // Adding a row in the 2nd table focuses a cell in the 2nd table (not the 1st)
  const table2 = page.locator('mark-area .cm-table-wysiwyg').nth(1);
  await table2.locator('[data-row="1"][data-col="0"]').click();
  await table2.locator('[data-table-action="row-add"]').click();
  await page.waitForTimeout(50);
  const focusedInSecond = await page.evaluate(() => {
    const root = document.getElementById('e')!.shadowRoot!;
    const tables = root.querySelectorAll('.cm-table-wysiwyg');
    return tables[1]!.contains(root.activeElement);
  });
  expect(focusedInSecond).toBe(true);

  // Toggling readOnly updates contentEditable on table cells
  await page.evaluate(() => ((document.getElementById('e') as any).readOnly = true));
  await expect(table2.locator('[data-row="0"][data-col="0"]')).toHaveAttribute('contenteditable', 'false');
});
