/**
 * @file vite.config.ts
 * @description Vite bundler configuration for AlphaSelector India.
 * Configures React 19 JSX transformation, Tailwind CSS v4 integration,
 * and relative base paths for seamless deployment across GitHub Pages and static hosts.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  /**
   * Relative base path ensures assets resolve correctly on GitHub Pages subpaths
   * (e.g. https://<username>.github.io/<repo>/) as well as root domains.
   */
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  }
});
