import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
       // En desarrollo, /api se reenvía a tu backend
      '/api': 'http://localhost:8085'
    }
  }
})

