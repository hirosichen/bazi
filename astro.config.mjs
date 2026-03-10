import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

function serifFontOptimizer() {
  return {
    name: 'serif-font-optimizer',
    transform(code, id) {
      if (!id.endsWith('.css') || !code.includes('Noto Serif TC')) return;
      const result = code.replace(
        /(font-family:\s*['"]?Noto Serif TC['"]?[^}]*?)font-display:\s*swap/g,
        '$1font-display: optional'
      );
      if (result !== code) return result;
    },
  };
}

export default defineConfig({
  site: 'https://starkami.com',
  adapter: cloudflare(),

  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },

  prefetch: {
    defaultStrategy: 'hover',
  },

  vite: {
    plugins: [serifFontOptimizer()],
  },

  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
