import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import yaml from '@modyfi/vite-plugin-yaml'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), yaml()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': `http://127.0.0.1:${process.env.AUTH_PORT || 3001}`,
    },
  },
  resolve: {
    alias: {
      '@': '/src',
      '@content': '/src/content',
    },
  },
})
