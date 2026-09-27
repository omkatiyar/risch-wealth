import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // three.js ships as its own lazy chunk for the logo ring (~140 KB gzip),
  // loaded after the page is idle; it never blocks first paint.
  build: { chunkSizeWarningLimit: 600 },
  server: {
    // In dev, the frontend and backend run on different ports (5173 vs
    // 4000), which browsers treat as different origins. Proxying /api
    // here makes fetch('/api/...') work the same way in dev as it does
    // in production, where nginx proxies /api to the backend on the
    // same domain (see be/README.md's nginx example).
    proxy: {
      '/api': {
        target: process.env.VITE_DEV_API_PROXY_TARGET || 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
})
