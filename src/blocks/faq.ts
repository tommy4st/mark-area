import { el } from '../utils.ts';
import { insertBlockAction, type BlockRenderer } from './core.ts';

export const faqBlock: BlockRenderer = {
    name: 'faq',
    render(attrs, body, ctx) {
        const details = el('details', { className: 'ma-block ma-faq', open: attrs.open !== undefined && attrs.open !== 'false' }, 'card');
        details.dataset.block = 'faq';
        // Edit a span so the <summary> itself keeps its native toggle behavior.
        const question = ctx.editable(el('span', { textContent: typeof attrs.question === 'string' ? attrs.question : '' }), 'question');
        question.addEventListener('click', (e) => e.preventDefault());
        const summary = el('summary');
        summary.append(question);
        details.append(summary, ctx.renderBody(body));
        return details;
    },
    action: insertBlockAction(
        'block-faq',
        ':::faq{question="Question?"}\nAnswer\n:::',
        'M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z',
        'FAQ block'
    ),
    styles: /* css */ `
.ma-faq summary { cursor: pointer; font-weight: 600; }
.ma-faq summary::marker { color: var(--ma-faq-marker, color-mix(in srgb, currentColor 60%, transparent)); }
`,
};
