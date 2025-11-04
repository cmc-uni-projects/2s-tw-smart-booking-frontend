import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // THÊM KHỐI NÀY VÀO
  server: {
    proxy: {
      // Bất kỳ yêu cầu nào bắt đầu bằng /api
      '/api': {
        // sẽ được chuyển tiếp đến backend
        target: 'http://localhost:8386',
        changeOrigin: true,
      },
    },
  },
})