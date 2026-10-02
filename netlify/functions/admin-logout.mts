import { json } from '../lib/http'
import { clearSessionCookie } from '../lib/session'

export default async (request: Request) => {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })
  return json(200, { ok: true }, { 'set-cookie': clearSessionCookie() })
}
