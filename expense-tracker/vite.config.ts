

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import proxyOptions from './proxyOptions';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080,
    proxy: proxyOptions
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../expense_tracker_app/public/webapp'),
    rollupOptions: {
        output: {
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js',
            assetFileNames: '[name].[ext]',
        },
    },
    emptyOutDir: true,
    target: 'es2015',
    
}

} as UserConfig);