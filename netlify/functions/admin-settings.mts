import type { AdminSettingsUpdate } from '../../src/shared/forms'
import { json, readJson } from '../lib/http'
import { isAuthenticated } from '../lib/session'
import { loadSettings, saveSettings, toAdminView } from '../lib/settings'

export default async (request: Request) => {
  if (!isAuthenticated(request)) return json(401, { ok: false, error: 'Please log in again.' })

  try {
    if (request.method === 'GET') {
      return json(200, { ok: true, settings: toAdminView(await loadSettings()) })
    }
    if (request.method === 'PUT') {
      const update = await readJson<AdminSettingsUpdate>(request)
      if (!update) return json(400, { ok: false, error: 'Invalid settings payload.' })
      const result = await saveSettings(update)
      if (typeof result === 'string') return json(400, { ok: false, error: result })
      return json(200, { ok: true, settings: toAdminView(result) })
    }
    return json(405, { ok: false, error: 'Method not allowed.' })
  } catch (error) {
    console.error('admin-settings failed', error)
    const message = error instanceof Error ? error.message : 'Unexpected error.'
    return json(500, { ok: false, error: message })
  }
}
