// @ts-check
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

const websiteRoot = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(websiteRoot, '..');

// https://astro.build/config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        // Helpers live outside website/, so force module resolution through website deps.
        'js-yaml': resolve(websiteRoot, 'node_modules/js-yaml'),
      },
    },
    server: {
      fs: {
        allow: [repoRoot],
      },
    },
  },
});
