import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom|scheduler)[\\/]/.test(id)) {
              return 'vendor-react';
            }
            if (/[\\/]node_modules[\\/]framer-motion[\\/]/.test(id)) {
              return 'vendor-framer-motion';
            }
            if (/[\\/]node_modules[\\/]gsap[\\/]/.test(id)) {
              return 'vendor-gsap';
            }
            if (/[\\/]node_modules[\\/]lenis[\\/]/.test(id)) {
              return 'vendor-lenis';
            }
            if (/[\\/]node_modules[\\/]lucide-react[\\/]/.test(id)) {
              return 'vendor-lucide';
            }
            if (/[\\/]node_modules[\\/]@radix-ui[\\/]/.test(id)) {
              return 'vendor-radix';
            }
            if (/[\\/]node_modules[\\/](@tanstack|react-hook-form|zod)[\\/]/.test(id)) {
              return 'vendor-utils';
            }
          }
        },
      },
    },
  },
}));
