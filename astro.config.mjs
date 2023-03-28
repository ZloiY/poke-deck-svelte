import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import alias from '@rollup/plugin-alias';
import svelteSVG from "vite-plugin-svelte-svg";
import path from 'path';

import vercel from "@astrojs/vercel/edge";

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), tailwind()],
  vite: {
    plugins: [svelteSVG({
      svgoConfig: {}
    }), alias({
      entries: [{
        find: '@icons',
        replacement: path.resolve('./icons')
      }]
    })]
  },
  output: "server",
  adapter: vercel()
});
