import { defineConfig } from 'vite'

// Configuración minimalista para Vanilla JS
export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
})
