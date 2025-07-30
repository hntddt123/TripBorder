/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

const KEY = './ssl/tripborderfrontend-key.pem';
const CERT = './ssl/tripborderfrontend-cert.pem';

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, KEY)),
      cert: fs.readFileSync(path.resolve(__dirname, CERT)),
    },
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 5174,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://localhost',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    minify: 'esbuild'
  }
});
