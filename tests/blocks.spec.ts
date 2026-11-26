import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

const open = async (page: Page, value: string, attrs = '') => {
    await page.route('http://test.local/**', (route) => {
        const isJs = route.request().url().endsWith('.js');
        route.fulfill({
            contentType: isJs ? 'text/javascript' : 'text/html',
            body: isJs
                ? readFileSync('dist/standalone.js', 'utf8')
                : `<mark-area id="e" ${attrs}></mark-area>
                   <script type="module">import { defineMarkArea, customBlocksPlugin } from "/standalone.js"; defineMarkArea();
                   const e = document.getElementById('e'); e.plugins = [customBlocksPlugin()]; e.value = ${JSON.stringify(value)};</script>`,
        });
    });
    await page.goto('http://test.local/');
    await page.waitForSelector('mark-area .cm-line');
};

const FAQ = 'Intro\n\n:::faq{question="Why?" open}\nBecause **so**.\n:::\n\nOutro';

test('card renders when cursor is outside; raw when inside', async ({ page }) => {
    await open(page, FAQ);
    await expect(page.locator('mark-area .ma-faq summary')).toHaveText('Why?');
    await page.locator('mark-area .ma-faq').click({ position: { x: 3, y: 3 } });
    await expect(page.locator('mark-area .ma-faq')).toHaveCount(0);
    await expect(page.locator('mark-area .cm-block-line')).toHaveCount(3);
});

test('FAQ toggle and form value stay unchanged', async ({ page }) => {
    await open(page, FAQ);
    await page.locator('mark-area .ma-faq summary').click();
    await expect(page.locator('mark-area .ma-faq')).toBeVisible();
    expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe(FAQ);
});

test('unclosed fence keeps the editor usable', async ({ page }) => {
    await open(page, ':::faq{question="Q"}\nno end');
    await expect(page.locator('mark-area .ma-faq')).toHaveCount(0);
    await page.locator('mark-area .cm-content').click();
    await page.keyboard.type('x');
    expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toContain('x');
});

test('attribute values render as text, not HTML', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="<img src=x onerror=alert(1)>" url="javascript:alert(1)"}\n:::\n');
    await expect(page.locator('mark-area .ma-vcard .p-name')).toHaveText('<img src=x onerror=alert(1)>');
    await expect(page.locator('mark-area .ma-vcard img')).toHaveCount(0);
    await expect(page.locator('mark-area .ma-vcard a[href]')).toHaveCount(0);
});

test('editing a card field writes back to the opening line', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="Ada" email="a@b.c"}\nNotes\n:::\n');
    const name = page.locator('mark-area .ma-vcard .p-name');
    await name.click();
    await page.keyboard.press('End');
    await page.keyboard.type(' Lovelace "x"');
    await page.keyboard.press('Enter');
    expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe(
        'Hi\n\n:::vcard{name="Ada Lovelace \\"x\\"" email="a@b.c"}\nNotes\n:::\n'
    );
});

test('phone, url and body are editable', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="Ada"}\nNotes\n:::\n');
    await page.locator('mark-area .p-tel').click();
    await page.keyboard.type('123');
    await page.keyboard.press('Enter');
    await page.locator('mark-area .ma-block-body').click();
    await page.keyboard.type(' more');
    await page.keyboard.press('Escape');
    expect(await page.evaluate(() => (document.getElementById('e') as any).value)).toBe(
        'Hi\n\n:::vcard{name="Ada" phone="123"}\nNotes more\n:::\n'
    );
});

test('source toggle reveals the raw block', async ({ page }) => {
    await open(page, FAQ);
    await page.locator('mark-area .cm-block-widget').hover();
    await page.locator('mark-area .ma-block-source').click();
    await expect(page.locator('mark-area .ma-faq')).toHaveCount(0);
    await expect(page.locator('mark-area .cm-block-line')).toHaveCount(3);
});

const value = (page: Page) => page.evaluate(() => (document.getElementById('e') as any).value);

test('indented fence renders and edits keep the indent', async ({ page }) => {
    const src = 'Hi\n\n  :::vcard{name="Ada"}\nNotes\n:::\n';
    await open(page, src);
    await page.locator('mark-area .p-name').click();
    await page.keyboard.press('End');
    await page.keyboard.type('!');
    await page.keyboard.press('Enter');
    expect(await value(page)).toBe('Hi\n\n  :::vcard{name="Ada!"}\nNotes\n:::\n');
});

test('focusing and leaving fields does not change the value', async ({ page }) => {
    const src = 'Hi\n\n:::vcard{name="Ada"}\n\nNotes\n\n:::\n';
    await open(page, src);
    for (const sel of ['.u-email', '.p-tel', '.ma-block-body']) {
        await page.locator(`mark-area ${sel}`).click();
        await page.keyboard.press('Escape');
    }
    expect(await value(page)).toBe(src);
});

test('fence inside a blockquote stays raw and editable', async ({ page }) => {
    await open(page, '> :::faq{question="Q"}\n> A\n> :::\n\nEnd');
    await expect(page.locator('mark-area .ma-faq')).toHaveCount(0);
    await page.locator('mark-area .cm-content').click();
    await page.keyboard.type('x');
    expect(await value(page)).toContain('x');
});

test('fields expose accessible names', async ({ page }) => {
    await open(page, FAQ);
    await expect(page.locator('mark-area .ma-faq summary [role="textbox"]')).toHaveAttribute('aria-label', 'Question');
    await expect(page.locator('mark-area .ma-block-body')).toHaveAttribute('aria-multiline', 'true');
});

test('vcard photo uploads on click and writes the photo attribute', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="Ada"}\nNotes\n:::\n', 'uploads');
    await page.evaluate(() => ((document.getElementById('e') as any).upload = async () => 'https://cdn.test/ada.png'));
    const chooser = page.waitForEvent('filechooser');
    await page.locator('mark-area .ma-vcard-photo').click();
    await (await chooser).setFiles({ name: 'ada.png', mimeType: 'image/png', buffer: Buffer.from('x') });
    await expect.poll(() => value(page)).toBe('Hi\n\n:::vcard{name="Ada" photo="https://cdn.test/ada.png"}\nNotes\n:::\n');
    await expect(page.locator('mark-area .ma-vcard-photo img')).toHaveAttribute('src', 'https://cdn.test/ada.png');
});

test('vcard photo slot is hidden without uploads', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="Ada"}\n:::\n');
    await expect(page.locator('mark-area .ma-vcard-photo')).toHaveCount(0);
});

test('body re-renders on unchanged blur, renders ~~strike~~, and widens fences when body has :::', async ({ page }) => {
    await open(page, 'Hi\n\n:::faq{question="Q" open}\nKeep **bold** and ~~strike~~.\n:::\n');
    await expect(page.locator('mark-area .ma-block-body s')).toHaveText('strike');

    // Focus and blur without edits in auto mode re-renders HTML instead of staying raw text
    const body = page.locator('mark-area .ma-block-body');
    await body.click();
    await page.keyboard.press('Escape');
    await expect(page.locator('mark-area .ma-block-body strong')).toHaveText('bold');
    await expect(page.locator('mark-area .ma-block-body s')).toHaveText('strike');

    // Typing a closing fence inside the body widens outer fences so block stays valid
    await body.click();
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type(':::');
    await page.keyboard.press('Escape');
    expect(await value(page)).toContain('::::faq{question="Q" open}');
    expect(await value(page)).toContain('\n::::\n');
    await expect(page.locator('mark-area .ma-faq')).toHaveCount(1);
});

test('toggling uploads/readOnly rebuilds cards and attribute fields block main-doc toolbar edits', async ({ page }) => {
    await open(page, 'Hi\n\n:::vcard{name="Ada"}\nNotes\n:::\n');
    await expect(page.locator('mark-area .ma-vcard-photo')).toHaveCount(0);

    // Dynamic uploads toggle reveals photo slot
    await page.evaluate(() => ((document.getElementById('e') as any).uploads = true));
    await expect(page.locator('mark-area .ma-vcard-photo')).toHaveCount(1);

    // Toolbar action while editing single-line attribute field does not mutate main doc
    await page.locator('mark-area .p-name').click();
    await page.evaluate(() => (document.getElementById('e') as any).exec('bold'));
    expect(await value(page)).toBe('Hi\n\n:::vcard{name="Ada"}\nNotes\n:::\n');

    // Dynamic readOnly disables card editing
    await page.evaluate(() => ((document.getElementById('e') as any).readOnly = true));
    await expect(page.locator('mark-area .p-name')).not.toHaveAttribute('contenteditable');
});

test('rich block body toggles bold/italic/strike/code without execCommand and passes undo through', async ({ page }) => {
    await open(page, 'Hi\n\n:::faq{question="Q" open}\nhello world\n:::\n', 'marks="hide"');
    const body = page.locator('mark-area .ma-block-body');
    await body.click();
    await page.evaluate(() => {
        const e = document.getElementById('e') as any;
        const p = e.shadowRoot!.querySelector('.ma-block-body p')!;
        const sel = e.shadowRoot!.getSelection();
        sel.collapse(p.firstChild, 2); // inside "hello"
        e.exec('bold');
        e.exec('italic');
        e.exec('strike');
        e.exec('code');
    });
    await page.keyboard.press('Escape');
    expect(await value(page)).toBe('Hi\n\n:::faq{question="Q" open}\n***~~`hello`~~*** world\n:::\n');
    await body.click();
    await page.evaluate(() => (document.getElementById('e') as any).exec('undo'));
    expect(await value(page)).toBe('Hi\n\n:::faq{question="Q" open}\nhello world\n:::\n');
});
