/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ✅ Tính toán dirname an toàn (khi dùng ES Modules)
const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],

  // ✅ Proxy API backend (Spring Boot chạy ở cổng 8386)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8386',
        changeOrigin: true,
      },
    },
  },

  // ✅ Alias cho import ngắn gọn
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
});
