import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        build: {
    chunkSizeWarningLimit: 1600, // Raises warning threshold from 500kB to 1600kB
  },
        
      },
    },
  },
});
