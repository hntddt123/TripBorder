/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './ssl/tripborderfrontend-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './ssl/tripborderfrontend-cert.pem')),
    },
    port: 5173,
    strictPort: true,
    host: true,
  },
  preview: {
    port: 5174,
    strictPort: true,
    host: true,
  },
  build: {
    minify: 'esbuild'
  }
});
