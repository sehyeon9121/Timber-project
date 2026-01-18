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
  },
  resolve: {
    alias: {
      '@': '/src',
      '@content': '/public/content',
    },
  },
})
