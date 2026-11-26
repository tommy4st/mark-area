import { el } from '../utils.ts';
import { insertBlockAction, safeImageUrl, safeUrl, type BlockRenderer } from './core.ts';

const str = (v: string | true | undefined) => (typeof v === 'string' ? v : '');

export const vcardBlock: BlockRenderer = {
  name: 'vcard',
  render(attrs, body, ctx) {
    const card = el('div', { className: 'ma-block ma-vcard h-card' }, 'card');
    card.dataset.block = 'vcard';
    const src = safeImageUrl(str(attrs.photo));
    const photo = src ? el('img', { className: 'u-photo', src, alt: '' }) : null;
    const slot = ctx.imageUpload(el('button', { type: 'button', className: 'ma-vcard-photo', ariaLabel: photo ? ctx.strings.photoReplace : ctx.strings.photoAdd, title: ctx.strings.photoHint }, 'photo'), 'photo');
    // Without uploads the slot stays inert: show the photo only.
    if (slot.classList.contains('ma-upload-target')) {
      slot.append(photo ?? el('span', { textContent: '+', ariaHidden: 'true' }));
      card.append(slot);
    } else if (photo) card.append(photo);
    const info = el('div', { className: 'ma-vcard-info' });
    const line = (cls: string, key: string) => info.append(ctx.editable(el('div', { className: cls, textContent: str(attrs[key]) }), key));
    line('p-name ma-vcard-name', 'name');
    line('p-job-title', 'title');
    line('p-org', 'org');
    const link = (cls: string, key: string, href: (v: string) => string | null) => {
      const v = str(attrs[key]);
      const a = el('a', { className: cls, textContent: v, title: ctx.strings.linkOpenHint });
      const h = v && href(v);
      if (h) a.href = h;
      const row = el('div');
      row.append(ctx.editable(a, key));
      info.append(row);
    };
    link('u-email', 'email', (v) => `mailto:${v}`);
    link('p-tel', 'phone', (v) => `tel:${v.replace(/\s+/g, '')}`);
    link('u-url', 'url', safeUrl);
    info.append(ctx.renderBody(body));
    card.append(info);
    return card;
  },
  action: insertBlockAction(
    'block-vcard',
    ':::vcard{name="Name" email="" phone=""}\nNotes\n:::',
    'M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z',
    'vCard block'
  ),
  styles: /* css */ `
.ma-vcard { display: flex; gap: 0.9em; align-items: center; }
.ma-vcard img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; display: block; }
.ma-vcard-photo { flex: none; width: 56px; height: 56px; padding: 0; border: 1px dashed color-mix(in srgb, currentColor 35%, transparent); border-radius: 50%; background: none; color: inherit; font: inherit; font-size: 1.5em; opacity: 0.8; }
.ma-vcard-photo:has(img) { border: none; opacity: 1; }
.ma-vcard-photo:hover, .ma-vcard-photo:focus-visible { opacity: 1; outline: 2px solid var(--ma-focus-color, currentColor); outline-offset: 2px; }
.ma-vcard-name { font-weight: 600; }
`,
};
