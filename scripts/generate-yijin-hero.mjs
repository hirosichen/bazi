#!/usr/bin/env node
/**
 * Generate hero images for 易經研究所 using Gemini 3 Pro.
 * Run: node scripts/generate-yijin-hero.mjs
 *      node scripts/generate-yijin-hero.mjs --force
 *      node scripts/generate-yijin-hero.mjs --slug=bagua-cosmos
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) { console.error('Set GEMINI_API_KEY env var'); process.exit(1); }

const MODEL = 'gemini-3-pro-image-preview';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

const force = process.argv.includes('--force');
const slugArg = process.argv.find(a => a.startsWith('--slug='));
const targetSlug = slugArg ? slugArg.split('=')[1] : null;

const NO_TEXT = 'Do not include any text, words, letters, numbers, watermarks, logos, or UI elements in the image.';
const CHINESE_STYLE = 'Traditional Chinese painting style (中國風水墨風格), inspired by ancient Chinese philosophy, Book of Changes aesthetics, and yin-yang harmony.';

const IMAGES = [
  // --- Hero/Background Images ---
  {
    slug: 'bagua-cosmos',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    aspectRatio: '16:9',
    imageSize: '2K',
    prompt: `${CHINESE_STYLE} Ancient bagua (八卦) diagram floating in a cosmic void. Eight trigrams arranged in a perfect circle, with a luminous yin-yang (太極) symbol at the center. Golden lines and trigram strokes on a deep indigo background. Ink wash clouds drift around the edges. Ethereal starlight and cosmic energy. Majestic and mystical. ${NO_TEXT}`,
  },
  {
    slug: 'scholar-divination',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    aspectRatio: '16:9',
    imageSize: '2K',
    prompt: `${CHINESE_STYLE} A traditional Chinese scholar performing I Ching divination with yarrow stalks (蓍草) at a rosewood desk. Moonlight streams through a lattice window. Ancient scrolls and bamboo slip manuscripts surround him. Incense smoke curls upward. Warm candlelight illuminates the scene. Contemplative and scholarly atmosphere. Deep indigo and warm gold tones. ${NO_TEXT}`,
  },
  // --- Section Images (homepage) ---
  {
    slug: 'value-instant',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Three ancient Chinese copper coins (銅錢) mid-toss, captured in dynamic motion. Golden glow and energy trails emanate from the spinning coins. Dark background with subtle ink wash clouds. The moment of divination, full of potential and anticipation. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-ai',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A jade oracle disc (玉璧) with hexagram patterns carved into its surface, glowing with modern AI-like light trails and neural network patterns. Fusion of ancient Chinese wisdom and futuristic technology. Golden and cyan light on dark background. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-free',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} An open hand releasing golden light particles that form trigram symbols (☰ ☱ ☲ ☳ ☴ ☵ ☶ ☷) as they float upward. Generous and welcoming gesture. Warm golden glow against dark ink wash background. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-wisdom',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Ancient bamboo slip manuscripts (竹簡) with I Ching text, arranged artfully on a dark rosewood surface. Ink brushes, an inkstone, and a jade brush rest nearby. Warm candlelight illumination. Scholarly and reverent atmosphere. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'tool-divination',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Three ancient Chinese coins resting on a dark divination cloth, with a forming hexagram above them rendered in golden light. Six lines materializing one by one — solid yang lines glowing gold, broken yin lines glowing silver. Mystical and contemplative. Deep indigo and gold. ${NO_TEXT}`,
  },
  {
    slug: 'tool-ai',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} An ancient bronze mirror (銅鏡) reflecting hexagram patterns on its polished surface, with ethereal AI-like neural connections and light trails emanating from the reflection. Fusion of ancient Chinese divination and modern intelligence. Deep indigo, bronze, and cyan tones. ${NO_TEXT}`,
  },
  {
    slug: 'tool-lookup',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A traditional Chinese bookshelf (書架) filled with I Ching commentaries and classical texts. One thread-bound book lies open showing hexagram diagrams and line interpretations. Warm lamplight, scholarly atmosphere. Ink wash mountains visible through a window. Deep indigo and warm amber. ${NO_TEXT}`,
  },
  {
    slug: 'cta-background',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A yin-yang symbol dissolving into an ink wash landscape — mountains and rivers flowing outward from the symbol. Profound Chinese philosophy aesthetic. Mist, flowing water, distant peaks. The boundary between symbol and landscape is seamless. Deep indigo, gold, and ink tones. Contemplative and majestic. ${NO_TEXT}`,
  },
  // --- Article Hero Images ---
  {
    slug: 'article-history',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} An ancient Chinese scroll partially unrolled on a dark surface, revealing Fu Xi (伏羲) era trigram diagrams — the earliest origins of I Ching. A traditional timeline of development implied through layered scrolls from different eras. Ink wash mountains and golden light. Historical and reverent atmosphere. Deep indigo and aged gold. ${NO_TEXT}`,
  },
  {
    slug: 'article-ten-wings',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A classical Chinese study with Confucius-era bamboo manuscripts (竹簡) and commentary texts spread across a rosewood desk. Ten scrolls arranged like wings (十翼). Warm candlelight, inkstone, calligraphy brushes. Scholarly atmosphere of deep philosophical inquiry. Deep indigo and warm amber. ${NO_TEXT}`,
  },
  {
    slug: 'article-qian-kun',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Heaven (天) above and earth (地) below — cosmic duality. Golden yang energy radiates from above as six unbroken lines, silver yin energy rises from below as six broken lines. The two forces interact in the middle with swirling ink wash clouds. Majestic and primordial. Deep indigo, gold, and silver. ${NO_TEXT}`,
  },
  {
    slug: 'article-eight-trigrams',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Eight natural elements arranged in a bagua circle — heaven (天), earth (地), thunder (雷), wind (風), water (水), fire (火), mountain (山), lake (澤). Each element depicted in ink wash style with its corresponding trigram symbol. Golden lines connect them. Deep indigo background with natural colors. ${NO_TEXT}`,
  },
  {
    slug: 'article-read-lines',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Close-up of ancient bamboo slips (竹簡) with I Ching line texts inscribed in elegant calligraphy. Scholarly tools nearby — a calligraphy brush, ink stone, jade brush rest. Warm lamplight. A magnifying jade disc highlights one particular line. Studious and detailed atmosphere. Deep indigo and warm gold. ${NO_TEXT}`,
  },
  {
    slug: 'article-changing-lines',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A dynamic transformation scene — solid yang lines morphing into broken yin lines and vice versa. Golden energy flows between the transforming lines. Particles of light scatter during the change. The concept of 變爻 (changing lines) visualized as metamorphosis. Deep indigo background with golden and silver energy. ${NO_TEXT}`,
  },
  {
    slug: 'article-philosophy',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A luminous yin-yang symbol floating in a philosophical void, surrounded by the five elements (五行) — wood, fire, earth, metal, water — each represented by ink wash imagery. Interconnected cycles of generation and control. Profound and meditative. Deep indigo with elemental colors. ${NO_TEXT}`,
  },
  {
    slug: 'article-yinyang',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} The five elements (五行) — wood (木, green), fire (火, red), earth (土, yellow), metal (金, white), water (水, blue) — arranged in a generating cycle (相生) around a central yin-yang symbol. Each element flows into the next with ink wash energy trails. Philosophical and harmonious. Deep indigo background. ${NO_TEXT}`,
  },
  {
    slug: 'article-three-coins',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Three traditional Chinese copper coins (銅錢) with square holes, arranged on a dark divination cloth, ready for tossing. One coin shows the yang side, two show yin. Subtle golden glow. A bamboo slip with instructions nearby. Intimate and ritualistic atmosphere. Deep indigo and warm bronze. ${NO_TEXT}`,
  },
  {
    slug: 'article-ethics',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A person in meditation pose before an incense-burning altar in a traditional Chinese setting. Incense smoke rises in elegant spirals. A yin-yang symbol hangs on the wall behind. Respectful, contemplative, and ethical atmosphere. Warm candlelight and cool moonlight combine. Deep indigo and warm amber. ${NO_TEXT}`,
  },
  // --- Testimonial Avatars ---
  {
    slug: 'testimonial-woman-taipei',
    outDir: path.join(ROOT, 'public', 'images', 'testimonials'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `Portrait photograph of a professional Asian woman in her early 30s, warm genuine smile, wearing a casual elegant blouse. Soft warm lighting, shallow depth of field with bokeh background of a modern office setting. Natural skin tone, East Asian features. Professional headshot style, approachable and confident expression. ${NO_TEXT}`,
  },
  {
    slug: 'testimonial-man-professor',
    outDir: path.join(ROOT, 'public', 'images', 'testimonials'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `Portrait photograph of a distinguished Asian man in his mid 50s, professorial appearance with reading glasses, warm and wise expression. Wearing a collared shirt. Soft natural lighting, shallow depth of field with blurred bookshelf background. East Asian features, scholarly and kind demeanor. Professional headshot. ${NO_TEXT}`,
  },
  {
    slug: 'testimonial-student',
    outDir: path.join(ROOT, 'public', 'images', 'testimonials'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `Portrait photograph of a young Asian person in their early 20s, student appearance, bright and curious expression, genuine smile. Wearing a casual t-shirt. Soft natural daylight, shallow depth of field with blurred campus background. East Asian features, youthful and eager. Square headshot. ${NO_TEXT}`,
  },
  {
    slug: 'testimonial-woman-freelance',
    outDir: path.join(ROOT, 'public', 'images', 'testimonials'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `Portrait photograph of a creative Asian woman in her late 20s, casual professional style, artistic vibe, warm smile. Wearing a relaxed blazer over a simple top. Soft warm lighting, shallow depth of field with blurred café background. East Asian features, modern and creative appearance. Square headshot. ${NO_TEXT}`,
  },
];

async function generateImage(config) {
  const outPath = path.join(config.outDir, `${config.slug}.webp`);
  if (!force && fs.existsSync(outPath)) {
    console.log(`SKIP ${config.slug} (exists)`);
    return;
  }
  fs.mkdirSync(config.outDir, { recursive: true });

  console.log(`Generating ${config.slug}...`);
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: config.prompt }] }],
      generationConfig: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: {
          aspectRatio: config.aspectRatio,
          imageSize: config.imageSize,
        },
      },
    }),
  });

  if (!res.ok) {
    console.error(`FAIL ${config.slug}: ${res.status} ${await res.text()}`);
    return;
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find(p => p.inlineData);
  if (!imgPart) {
    console.error(`FAIL ${config.slug}: no image in response`);
    return;
  }

  const buf = Buffer.from(imgPart.inlineData.data, 'base64');
  fs.writeFileSync(outPath, buf);
  console.log(`OK ${config.slug} -> ${outPath} (${Math.round(buf.length / 1024)}KB)`);
}

const targets = targetSlug ? IMAGES.filter(i => i.slug === targetSlug) : IMAGES;
if (targetSlug && targets.length === 0) {
  console.error(`Unknown slug: ${targetSlug}`);
  process.exit(1);
}

for (const img of targets) {
  await generateImage(img);
  // 3s delay between API calls to avoid rate limiting
  if (targets.indexOf(img) < targets.length - 1) {
    await new Promise(r => setTimeout(r, 3000));
  }
}
console.log('Done.');
