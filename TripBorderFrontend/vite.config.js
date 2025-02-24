import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.MODE || '.env.development'}` });

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
      key: fs.readFileSync(path.resolve(__dirname, './ssl/tripborderfrontendkey.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './ssl/tripborderfrontendcert.pem')),
    },
    port: 5173,
    strictPort: true,
    host: true
  },
  define: {
    'process.env.MODE': JSON.stringify(process.env.MODE),
    'process.env.MAPBOX_API_KEY': JSON.stringify(process.env.MAPBOX_API_KEY),
    'process.env.FOURSQUARE_API_KEY': JSON.stringify(process.env.FOURSQUARE_API_KEY),
    'process.env.VERSION_NUMBER': JSON.stringify(process.env.VERSION_NUMBER),
    'process.env.BACKEND_DOMAIN': JSON.stringify(process.env.BACKEND_DOMAIN),
  },
});
