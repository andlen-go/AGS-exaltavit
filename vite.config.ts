import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5179,
    strictPort: true,
    allowedHosts: ['dev.exaltavit.com', 'localhost'],
  },
  preview: {
    host: true,
    port: 5179,
    strictPort: true,
  },
})
