#!/usr/bin/env node
/**
 * Generate video content for 八字研究所 using xAI Grok.
 * Run: XAI_API_KEY=xxx node scripts/generate-bazi-videos.mjs
 *      XAI_API_KEY=xxx node scripts/generate-bazi-videos.mjs --slug=fortune-master
 *      XAI_API_KEY=xxx node scripts/generate-bazi-videos.mjs --force
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createXai } from '@ai-sdk/xai';
import { experimental_generateVideo as generateVideo } from 'ai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.XAI_API_KEY;
if (!API_KEY) { console.error('Set XAI_API_KEY env var'); process.exit(1); }

const force = process.argv.includes('--force');
const slugArg = process.argv.find(a => a.startsWith('--slug='));
const targetSlug = slugArg ? slugArg.split('=')[1] : null;

const NO_TEXT = 'Do not include any text, words, letters, numbers, watermarks, or UI elements.';

const VIDEOS = [
  {
    slug: 'divination-master',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    prompt: `A wise Chinese fortune teller (命理師) in traditional scholarly robes, studying a birth chart (八字命盤) written on red paper with golden ink at a rosewood desk. He uses a calligraphy brush to annotate the four pillars. Warm candlelight, incense smoke curls upward. Ancient scrolls and a compass (羅盤) on the desk. Camera slowly pushes in. Traditional Chinese scholarly atmosphere, cinematic lighting. ${NO_TEXT}`,
  },
  {
    slug: 'five-elements-cycle',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    prompt: `The five elements (五行) materializing one by one in a dark void — first a green tree (Wood), then red flames (Fire), golden earth (Earth), white metal sword (Metal), blue flowing water (Water). Each element transforms into the next in a beautiful cycle. Particles of elemental energy drift between them. Ancient Chinese philosophical atmosphere. Slow, contemplative pacing. ${NO_TEXT}`,
  },
];

const xai = createXai({ apiKey: API_KEY });

async function generateStyleVideo(item) {
  fs.mkdirSync(item.outDir, { recursive: true });
  const outPath = path.join(item.outDir, `${item.slug}.mp4`);

  if (!force && fs.existsSync(outPath)) {
    console.log(`SKIP ${item.slug} (exists)`);
    return;
  }

  console.log(`Generating ${item.slug} (takes ~1-2 min)...`);
  const startTime = Date.now();

  const { video } = await generateVideo({
    model: xai.video('grok-imagine-video'),
    prompt: item.prompt,
    providerOptions: {
      xai: { duration: 5 },
    },
  });

  const videoBuffer = Buffer.from(video.uint8Array);
  fs.writeFileSync(outPath, videoBuffer);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const sizeMB = (videoBuffer.length / 1024 / 1024).toFixed(2);
  console.log(`OK ${item.slug} -> ${outPath} (${sizeMB}MB, ${elapsed}s)`);
}

const targets = targetSlug ? VIDEOS.filter(v => v.slug === targetSlug) : VIDEOS;
if (targetSlug && targets.length === 0) {
  console.error(`Unknown slug: ${targetSlug}`);
  process.exit(1);
}

for (const item of targets) {
  try {
    await generateStyleVideo(item);
  } catch (err) {
    console.error(`FAIL ${item.slug}:`, err.message);
  }
  if (targets.indexOf(item) < targets.length - 1) {
    console.log('Waiting 5s...');
    await new Promise(r => setTimeout(r, 5000));
  }
}
console.log('Done.');
