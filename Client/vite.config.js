import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// During development, any request starting with /api is forwarded to the backend.
// This avoids CORS problems and lets us write fetch('/api/rooms') everywhere.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
