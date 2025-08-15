import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/', // Ensure base URL is set correctly
  build: {
    outDir: 'dist', // Make sure output directory matches render.yaml
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    historyApiFallback: true // For local dev server SPA routing
  }
})