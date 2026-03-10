#!/usr/bin/env node
/**
 * Generate video content for 易經研究所 using xAI Grok.
 * Run: XAI_API_KEY=xxx node scripts/generate-yijin-videos.mjs
 *      XAI_API_KEY=xxx node scripts/generate-yijin-videos.mjs --slug=divination-master
 *      XAI_API_KEY=xxx node scripts/generate-yijin-videos.mjs --force
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
    prompt: `A wise Chinese I Ching master (易經大師) in traditional scholarly robes, performing a divination with three ancient coins on a rosewood desk. He tosses the coins gently, watches them land, and thoughtfully records the result on rice paper. Warm candlelight, incense smoke curls upward. Ancient bamboo slip scrolls on shelves behind. Camera slowly pushes in. Traditional Chinese scholarly atmosphere, cinematic lighting. ${NO_TEXT}`,
  },
  {
    slug: 'hexagram-formation',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    prompt: `Golden light forming I Ching hexagram lines one by one from bottom to top in a dark void. Each line materializes with a gentle flash - solid yang lines glow gold, broken yin lines glow silver. After all six lines form, the complete hexagram pulses with ethereal energy. Particles of light drift around it. Ancient Chinese philosophical atmosphere. Slow, contemplative pacing. ${NO_TEXT}`,
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
