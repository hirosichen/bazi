#!/usr/bin/env node
/**
 * Generate hero images for 八字研究所 using Gemini 3 Pro.
 * Run: node scripts/generate-bazi-hero.mjs
 *      node scripts/generate-bazi-hero.mjs --force
 *      node scripts/generate-bazi-hero.mjs --slug=bagua-cosmos
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
const CHINESE_STYLE = 'Traditional Chinese painting style (中國風水墨風格), inspired by ancient Chinese philosophy, Four Pillars of Destiny (四柱八字) aesthetics, heavenly stems and earthly branches, yin-yang harmony, and five elements theory.';

const IMAGES = [
  // --- Hero/Background Images ---
  {
    slug: 'bagua-cosmos',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    aspectRatio: '16:9',
    imageSize: '2K',
    prompt: `${CHINESE_STYLE} A cosmic scene with the ten heavenly stems (天干) and twelve earthly branches (地支) characters arranged in concentric circles, forming a celestial birth chart (命盤). A luminous yin-yang (太極) symbol at the center radiates golden energy. Five elements (五行) — wood, fire, earth, metal, water — depicted as flowing energy streams in their respective colors. Deep indigo and crimson background with golden accents. Ethereal starlight. Majestic and mystical. ${NO_TEXT}`,
  },
  {
    slug: 'fortune-master',
    outDir: path.join(ROOT, 'public', 'images', 'hero'),
    aspectRatio: '16:9',
    imageSize: '2K',
    prompt: `${CHINESE_STYLE} A traditional Chinese fortune teller (命理師) studying a birth chart at a rosewood desk. Four pillars of destiny (四柱) are written on red paper with golden ink. The master contemplates the arrangement of heavenly stems and earthly branches. Moonlight streams through a lattice window. Ancient scrolls and calligraphy surround him. Incense smoke curls upward. Warm candlelight. Deep indigo, crimson, and gold tones. ${NO_TEXT}`,
  },
  // --- Section Images (homepage) ---
  {
    slug: 'value-instant',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Four red pillars (柱) standing in a mystical void, each inscribed with golden Chinese characters representing heavenly stems and earthly branches. Golden energy connects the four pillars. The four pillars of destiny concept. Dark background with crimson and golden light. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-ai',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A jade disc (玉璧) with the five elements cycle carved into its surface, glowing with modern AI-like light trails and neural network patterns. Fusion of ancient Chinese destiny reading and futuristic technology. Golden, crimson, and cyan light on dark background. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-free',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} An open hand releasing golden light particles that form the ten heavenly stems (甲乙丙丁戊己庚辛壬癸) as they float upward in a circle. Generous and welcoming gesture. Warm golden and crimson glow against dark ink wash background. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'value-wisdom',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '1:1',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Ancient Chinese birth chart (命盤) written on red paper with golden calligraphy, placed on a dark rosewood surface. Ink brushes, an inkstone, and a jade brush rest nearby. A compass (羅盤) sits beside the chart. Warm candlelight illumination. Scholarly atmosphere. Square composition. ${NO_TEXT}`,
  },
  {
    slug: 'tool-chart',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Four vertical pillars of red and gold standing in a mystical void. Each pillar has two Chinese characters glowing — the heavenly stem above and earthly branch below. Between the pillars, the five elements (木火土金水) flow as colored energy streams: green wood, red fire, yellow earth, white metal, blue water. Deep indigo background. ${NO_TEXT}`,
  },
  {
    slug: 'tool-ai',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} An ancient bronze mirror (銅鏡) reflecting a birth chart pattern, with ethereal AI-like neural connections and light trails emanating from the reflection. The five elements cycle is visible in the reflection. Fusion of ancient Chinese destiny reading and modern intelligence. Deep indigo, crimson, and cyan tones. ${NO_TEXT}`,
  },
  {
    slug: 'tool-yearly',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A flowing river of time with twelve earthly branch animals (十二生肖) — rat, ox, tiger, rabbit, dragon, snake, horse, goat, monkey, rooster, dog, pig — arranged along the river banks. Seasonal changes visible along the flow. Cherry blossoms in spring, golden leaves in autumn. The concept of flowing years (流年) and great luck cycles (大運). Deep indigo and warm amber. ${NO_TEXT}`,
  },
  {
    slug: 'cta-background',
    outDir: path.join(ROOT, 'public', 'images', 'sections'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} A yin-yang symbol at the center with the five elements flowing outward — wood grows into fire, fire becomes earth ash, earth bears metal ore, metal condenses water, water nourishes wood. Each element depicted in ink wash style. Mist, flowing water, distant peaks. Deep indigo, gold, and ink tones. Contemplative and majestic. ${NO_TEXT}`,
  },
  // --- Article Hero Images ---
  {
    slug: 'article-what-is-bazi',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Four red ceremonial pillars standing in a mystical temple, representing the Four Pillars of Destiny (四柱). Golden characters on each pillar. A yin-yang symbol floats above. Incense smoke and ethereal light fill the space. The concept of birth chart destiny. Deep indigo and crimson with golden highlights. ${NO_TEXT}`,
  },
  {
    slug: 'article-stems-branches',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} Ten golden heavenly stems (天干) characters arranged in an upper arc, and twelve earthly branch characters arranged in a lower arc, forming a cosmic clock. Each character glows with its element color — green for wood, red for fire, yellow for earth, white for metal, blue for water. Deep indigo background with golden connections between matching pairs. ${NO_TEXT}`,
  },
  {
    slug: 'article-five-elements',
    outDir: path.join(ROOT, 'public', 'articles', 'hero'),
    aspectRatio: '16:9',
    imageSize: '1K',
    prompt: `${CHINESE_STYLE} The five elements (五行) — wood (木, green tree), fire (火, red flames), earth (土, yellow mountain), metal (金, white sword), water (水, blue river) — arranged in a generating cycle (相生) with arrows showing the flow. A controlling cycle (相剋) shown as subtle crossed lines. Balanced and harmonious. Deep indigo background. ${NO_TEXT}`,
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
  if (targets.indexOf(img) < targets.length - 1) {
    await new Promise(r => setTimeout(r, 3000));
  }
}
console.log('Done.');
