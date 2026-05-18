import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindv4 from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    platformProxy: {
      enabled: true,
    },
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindv4()],
    build: {
      minify: false,
    },
  },
});
