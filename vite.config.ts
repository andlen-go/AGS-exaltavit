import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type ServerOptions } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const certDir = path.resolve(rootDir, 'certs')
const keyPath = path.join(certDir, 'dev.exaltavit.com-key.pem')
const certPath = path.join(certDir, 'dev.exaltavit.com.pem')

const certsPresent = fs.existsSync(keyPath) && fs.existsSync(certPath)
const wantHttps =
  process.env.VITE_DEV_HTTPS === 'true' ||
  process.env.VITE_DEV_HTTPS === '1' ||
  certsPresent

function resolveHttps(): ServerOptions['https'] {
  if (!wantHttps) return undefined

  if (!certsPresent) {
    throw new Error(
      [
        'Local HTTPS is enabled (VITE_DEV_HTTPS or expected certs), but mkcert files are missing.',
        `Expected: ${keyPath}`,
        `         ${certPath}`,
        'Generate them with mkcert (see README / local-setup-guide), or unset VITE_DEV_HTTPS.',
      ].join('\n'),
    )
  }

  return {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5179,
    strictPort: true,
    allowedHosts: ['dev.exaltavit.com', 'localhost'],
    https: resolveHttps(),
  },
  preview: {
    host: true,
    port: 5179,
    strictPort: true,
  },
})
