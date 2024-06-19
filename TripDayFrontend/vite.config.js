import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [react()],
  preview: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './ssl/tripdaykey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './ssl/tripdaycert.pem')),
    },
    port: 5173,
    strictPort: true,
    host: true
  },
});
