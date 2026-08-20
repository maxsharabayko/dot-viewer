import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/' for local dev, '/dot-viewer/' for GitHub Pages.
// Override with VITE_BASE_PATH env var in CI.
const base = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  plugins: [react()],
  base,
  optimizeDeps: {
    exclude: ['@hpcc-js/wasm'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Only bundle the graphviz sub-package; exclude the rest
          graphviz: ['@hpcc-js/wasm'],
        },
      },
    },
    // Suppress the size warning — graphviz WASM is expected to be large
    chunkSizeWarningLimit: 900,
  },
})
