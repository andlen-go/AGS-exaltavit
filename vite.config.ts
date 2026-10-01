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
const httpsEnv = process.env.VITE_DEV_HTTPS
const httpsDisabled = httpsEnv === 'false' || httpsEnv === '0'
const wantHttps =
  !httpsDisabled && (httpsEnv === 'true' || httpsEnv === '1' || certsPresent)
const usePolling = process.env.VITE_USE_POLLING === 'true'

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
    watch: usePolling ? { usePolling: true, interval: 300 } : undefined,
  },
  preview: {
    host: true,
    port: 5179,
    strictPort: true,
  },
})
