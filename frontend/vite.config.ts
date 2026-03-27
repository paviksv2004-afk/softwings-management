import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      exportAsDefault: true
    })
  ],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/users': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/clients': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      },
      '/renewals': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  base: './',
  // Environment variables prefix
  envPrefix: 'VITE_'
})