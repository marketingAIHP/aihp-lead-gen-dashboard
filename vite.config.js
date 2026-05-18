import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiPort = process.env.DEV_API_PORT || '3101'
const clientPort = Number(process.env.DEV_CLIENT_PORT || '3100')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: clientPort,
    strictPort: true,
    proxy: {
      // Use IPv4 explicitly so the proxy doesn't get routed to a stale IPv6 listener on Windows.
      // DEV_API_PORT keeps the client aligned with the API server started by scripts/dev.js.
      '/api': {
        target: `http://127.0.0.1:${apiPort}`,
        changeOrigin: true,
      },
    },
  },
})
