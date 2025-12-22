// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ssenthilnathan3.github.io',
  integrations: [mdx(), sitemap(), svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});