// Post-build: extract Noto Serif TC @font-face from inlined HTML into async-loaded CSS
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const distDir = new URL('../dist', import.meta.url).pathname;
const astroDir = join(distDir, '_astro');

// Regex to match minified Noto Serif TC @font-face blocks
const serifFaceRegex = /@font-face\{font-family:"Noto Serif TC"[^}]*\}/g;

// Process all HTML files recursively
async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true, recursive: true });
  return entries
    .filter(e => e.isFile() && e.name.endsWith('.html'))
    .map(e => join(e.parentPath || e.path, e.name));
}

const htmlFiles = await findHtmlFiles(distDir);
let extractedCss = '';

// Extract serif @font-face from first HTML to get the CSS
for (const htmlFile of htmlFiles) {
  const html = await readFile(htmlFile, 'utf8');
  const matches = html.match(serifFaceRegex);
  if (matches && !extractedCss) {
    extractedCss = matches.join('\n');
    console.log(`Found ${matches.length} Noto Serif TC @font-face declarations`);
    break;
  }
}

if (!extractedCss) {
  console.log('No Noto Serif TC @font-face found in HTML, skipping.');
  process.exit(0);
}

// Write extracted CSS to a hashed file
const hash = createHash('md5').update(extractedCss).digest('hex').slice(0, 8);
const serifCssFile = `noto-serif-tc.${hash}.css`;
await mkdir(astroDir, { recursive: true });
await writeFile(join(astroDir, serifCssFile), extractedCss);
console.log(`Extracted serif font CSS to /_astro/${serifCssFile} (${Math.round(extractedCss.length / 1024)}KB)`);

// Async CSS loader
const asyncLoader = `<link rel="preload" href="/_astro/${serifCssFile}" as="style" onload="this.onload=null;this.rel='stylesheet'"><noscript><link rel="stylesheet" href="/_astro/${serifCssFile}"></noscript>`;

// Remove serif @font-face from HTML and inject async loader
let totalSaved = 0;
for (const htmlFile of htmlFiles) {
  let html = await readFile(htmlFile, 'utf8');
  const before = html.length;
  html = html.replace(serifFaceRegex, '');
  html = html.replace('</head>', asyncLoader + '</head>');
  await writeFile(htmlFile, html);
  totalSaved += (before - html.length);
}

console.log(`Removed ~${Math.round(totalSaved / 1024)}KB of serif CSS from ${htmlFiles.length} HTML files`);
console.log(`Serif font loads async via preload+onload pattern`);

// Add Early Hints in _headers
const headersPath = join(distDir, '_headers');
try {
  const existing = await readFile(headersPath, 'utf8');
  const earlyHints = `# 103 Early Hints — preload serif font CSS
/*
  Link: </_astro/${serifCssFile}>; rel=preload; as=style

`;
  await writeFile(headersPath, earlyHints + existing);
  console.log(`Added Early Hints for /_astro/${serifCssFile}`);
} catch {}
