# Custom blocks (`:::name{attrs}`)

A subset of the CommonMark generic-directives proposal (container directives only). Server ports can use `league/commonmark`, `markdown-it-container` or `remark-directive`.

## Fences
- Opening: a line matching `^:{3,}[a-z][\w-]*(\{…\})?\s*$` (no indentation of 4 or more).
- Closing: a line matching `^:{3,}\s*$` with at least as many colons as the opening fence.
- Unclosed fence: the block runs to the end of the document. The editor treats it as plain text (no card) until closed; a server SHOULD render it as a block too, or as plain paragraphs. Pick one and keep it consistent.
- Nesting is unsupported: the first valid closing fence ends the block. Use longer fences (`::::`) for future nesting. `:::` inside code fences is not matched.
- The body is Markdown. The editor preview renders only paragraphs, `**bold**`, `*italic*`, `` `code` `` and `[links](url)`; the server renders full Markdown.

## Attribute grammar (inside `{…}`)
| Form | Result |
| --- | --- |
| `key="value"` / `key='value'` | string; `\"` `\'` `\\` escape the next character |
| `key=bare` | string (no whitespace, quotes or `}`) |
| `key` | boolean `true` |
| `#id` | `id` |
| `.class` | `class` (repeats are space-joined) |

Unknown keys are ignored by renderers. Later duplicates override earlier ones.

## Escaping and URLs
All values are text: HTML-escape them. URL-bearing attributes (`photo`, `url`, links in body) allow only `http`, `https`, relative URLs, and `mailto`/`tel` for email/phone links; otherwise omit the link.

## Canonical HTML
vcard (omit parts whose attribute is absent):
```html
<div class="ma-block ma-vcard h-card" data-block="vcard">
  <img class="u-photo" src="PHOTO" alt="">
  <div class="ma-vcard-info">
    <div class="p-name ma-vcard-name">NAME</div>
    <div class="p-job-title">TITLE</div>
    <div class="p-org">ORG</div>
    <div><a class="u-email" href="mailto:EMAIL">EMAIL</a></div>
    <div><a class="p-tel" href="tel:PHONE-WITHOUT-SPACES">PHONE</a></div>
    <div><a class="u-url" href="URL">URL</a></div>
    BODY-HTML
  </div>
</div>
```
faq (`open` adds the `open` attribute):
```html
<details class="ma-block ma-faq" data-block="faq" open><summary>QUESTION</summary>BODY-HTML</details>
```
Unknown type:
```html
<div class="ma-block" data-block="NAME">BODY-HTML</div>
```
(Editor wraps body in `<div class="ma-block-body">`; servers may omit it.)

## Golden fixtures
```md
:::faq{question="How do refunds work?" open}
Answer in **Markdown**.
:::
```
```html
<details class="ma-block ma-faq" data-block="faq" open><summary>How do refunds work?</summary><p>Answer in <strong>Markdown</strong>.</p></details>
```
```md
:::vcard{name="Ada" email="ada@example.com"}
Mathematician
:::
```
```html
<div class="ma-block ma-vcard h-card" data-block="vcard"><div class="ma-vcard-info"><div class="p-name ma-vcard-name">Ada</div><div><a class="u-email" href="mailto:ada@example.com">ada@example.com</a></div><p>Mathematician</p></div></div>
```
```md
:::note
Hi
:::
```
```html
<div class="ma-block" data-block="note"><p>Hi</p></div>
```
