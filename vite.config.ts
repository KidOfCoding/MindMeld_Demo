import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    fs: {
      strict: false
    }
  },
  optimizeDeps: {
    include: ['lucide-react', 'react', 'react-dom', 'framer-motion'],
    force: true
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});