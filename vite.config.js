import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `base: './'` + single-file output: the built dist/index.html contains all code,
// styles and fonts, and loads the photos from dist/photos/. It can be opened by
// double-click or uploaded to any static host as-is.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile({ removeViteModuleLoader: true })],
  build: {
    target: ['es2019', 'safari14'],
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    chunkSizeWarningLimit: 4000,
  },
  server: { port: 5173, strictPort: true },
})
