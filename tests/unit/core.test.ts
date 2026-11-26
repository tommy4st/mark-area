import { expect, test } from 'bun:test';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { Table } from '@lezer/markdown';
import { strings } from '../../src/host.ts';
import { parseImageUrl } from '../../src/preview.ts';
import { blockAt, customBlockConfig, formatAttrs, parseAttrs, safeImageUrl, safeUrl } from '../../src/blocks/core.ts';
import { formatMarkdownTable, nextCell, tableAt } from '../../src/table/core.ts';

const state = (doc: string) => EditorState.create({ doc, extensions: markdown({ extensions: [Table, customBlockConfig] }) });

test('parseImageUrl splits the width fragment', () => {
    expect(parseImageUrl('a.png#w=300')).toEqual({ src: 'a.png', width: '300' });
    expect(parseImageUrl('a.png#w=50%')).toEqual({ src: 'a.png', width: '50%' });
    expect(parseImageUrl('a.png#top')).toEqual({ src: 'a.png#top', width: '' });
});

test('parseAttrs reads every attribute form', () => {
    expect(parseAttrs(`#main .a .b open name="A \\"B\\"" x='y' n=1`)).toEqual({
        id: 'main',
        class: 'a b',
        open: true,
        name: 'A "B"',
        x: 'y',
        n: '1',
    });
});

test('formatAttrs round-trips through parseAttrs', () => {
    const attrs = { id: 'main', class: 'a b', open: true as const, name: 'A "B" \\ c', empty: '' };
    expect(parseAttrs(formatAttrs(attrs))).toEqual(attrs);
});

test('safeUrl allows only harmless schemes', () => {
    expect(safeUrl(' https://a.b ')).toBe('https://a.b');
    expect(safeUrl('/relative')).toBe('/relative');
    expect(safeUrl('mailto:a@b.c')).toBe('mailto:a@b.c');
    expect(safeUrl('javascript:alert(1)')).toBeNull();
    expect(safeUrl('data:text/html,x')).toBeNull();
    expect(safeImageUrl('data:image/png;base64,AA')).toBe('data:image/png;base64,AA');
    expect(safeImageUrl('data:text/html,x')).toBeNull();
});

test('blockAt parses a closed custom block', () => {
    const doc = 'Intro\n\n:::faq{question="Why?" open}\nBecause.\n:::\n\nOutro';
    const b = blockAt(state(doc), doc.indexOf('Because'));
    expect(b).toMatchObject({ name: 'faq', attrs: { question: 'Why?', open: true }, body: 'Because.', closed: true, nested: false });
    expect(blockAt(state(doc), 0)).toBeNull();
});

test('blockAt reports an unclosed fence', () => {
    expect(blockAt(state(':::faq{question="Q"}\nno end'), 3)?.closed).toBe(false);
});

test('tables parse and format back unchanged', () => {
    const doc = '| Name | Qty |\n| :--- | --: |\n| a\\|b |   1 |\n| c    |  22 |';
    const t = tableAt(state(doc), 2)!;
    expect(t.headers).toEqual(['Name', 'Qty']);
    expect(t.aligns).toEqual(['left', 'right']);
    expect(t.rows).toEqual([['a\\|b', '1'], ['c', '22']]);
    expect(formatMarkdownTable(t)).toBe(doc);
});

test('formatMarkdownTable pads ragged rows to the header width', () => {
    expect(formatMarkdownTable({ headers: ['A', 'B'], aligns: [null, 'center'], rows: [['long cell']] })).toBe(
        '| A         |  B  |\n| --------- | :-: |\n| long cell |     |'
    );
});

test('nextCell wraps rows and appends one past the end', () => {
    const rows = [['', '']];
    expect(nextCell(rows, 2, 0, 1, 1)).toEqual({ r: 1, c: 0 });
    expect(nextCell(rows, 2, 0, 0, -1)).toEqual({ r: 0, c: 0 });
    expect(nextCell(rows, 2, 1, 1, 1)).toEqual({ r: 2, c: 0 });
    expect(rows.length).toBe(2);
});

test('strings facet: element overrides beat plugin defaults, which extend the built-ins', () => {
    const s = EditorState.create({ extensions: [strings.of({ linkPrompt: 'URL', custom: 'host' }), strings.of({ custom: 'plugin', other: 'x' })] }).facet(strings);
    expect(s).toMatchObject({ linkPrompt: 'URL', custom: 'host', other: 'x', required: 'Please fill out this field.' });
});

test('safeUrl and safeImageUrl reject control-char/whitespace bypasses and non-image schemes', () => {
    expect(safeUrl('java\tscript:alert(1)')).toBeNull();
    expect(safeUrl('java\nscript:alert(1)')).toBeNull();
    expect(safeUrl('\u0001javascript:alert(1)')).toBeNull();
    expect(safeUrl('java script:alert(1)')).toBeNull();
    expect(safeImageUrl('mailto:a@b.c')).toBeNull();
    expect(safeImageUrl('tel:+123')).toBeNull();
    expect(safeImageUrl('blob:https://a.b/1')).toBe('blob:https://a.b/1');
    expect(safeImageUrl('data:image/png;base64,AA\n')).toBe('data:image/png;base64,AA');
});

test('parseAttrs ignores prototype-polluting keys', () => {
    const attrs = parseAttrs('__proto__="x" constructor="y" prototype="z" name="ok"');
    expect(Object.keys(attrs)).toEqual(['name']);
    expect(attrs.name).toBe('ok');
});

test('blockAt checks closing fence length and detects list-nested blocks', () => {
    const unclosed = '::::note\n:::\n';
    expect(blockAt(state(unclosed), 2)?.closed).toBe(false);
    const inList = '- item\n\n  :::faq{question="Q"}\n  A\n  :::';
    expect(blockAt(state(inList), inList.indexOf(':::faq'))?.nested).toBe(true);
});

test('table splitRow handles escaped backslashes before real pipes', () => {
    const doc = '| a\\\\|b |\n| --- | --- |';
    const t = tableAt(state(doc), 2)!;
    expect(t.headers).toEqual(['a\\\\', 'b']);
});
