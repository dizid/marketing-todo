import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: process.env.VITE_PORT || 3001,
    open: false,
    proxy: {
      '/.netlify/functions': {
        target: 'http://localhost:9999',
        changeOrigin: true,
        timeout: 120000 // 2 minute timeout for AI generation
      }
    }
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        // Code splitting - separate vendor chunks for better caching
        manualChunks: {
          // Vue core - always loaded
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          // Supabase - auth and database
          'supabase': ['@supabase/supabase-js']
        }
      }
    },
    // Increase chunk size warning limit (default 500kb)
    chunkSizeWarningLimit: 600
  }
})
