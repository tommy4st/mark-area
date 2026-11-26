import { tableInlinePlugin, tablePreviewPlugin, tableWysiwygPlugin } from './tables.ts';
import { customBlocksPlugin } from './blocks.ts';

const form = document.getElementById('demo-form');
const output = document.getElementById('output');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  output.hidden = false;
  output.textContent = 'FormData notes:\n' + data.get('notes');
});

const tablePlugins = {
  inline: tableInlinePlugin,
  preview: tablePreviewPlugin,
  wysiwyg: tableWysiwygPlugin,
};
const tableMode = document.getElementById('table-mode');
const tableEditor = document.getElementById('table-editor');
const applyTableMode = () => {
  const make = tablePlugins[tableMode.value];
  tableEditor.plugins = make ? [make()] : [];
};
tableMode.addEventListener('change', applyTableMode);
applyTableMode();

const customUploadEditor = document.getElementById('custom-upload-editor');
customUploadEditor.upload = async (file) => {
  // Example custom upload: replace with `await fetch('/upload', ...)` returning a URL
  return { url: URL.createObjectURL(file), name: file.name };
};

const blocksEditor = document.getElementById('blocks-editor');
blocksEditor.plugins = [customBlocksPlugin()];
// Blob URLs keep the `photo` attribute short; real apps return a server URL.
blocksEditor.upload = async (file) => URL.createObjectURL(file);
