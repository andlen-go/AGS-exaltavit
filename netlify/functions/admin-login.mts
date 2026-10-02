import { json, readJson } from '../lib/http'
import { checkPassword, sessionCookie } from '../lib/session'

export default async (request: Request) => {
  if (request.method !== 'POST') return json(405, { ok: false, error: 'Method not allowed.' })
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return json(503, { ok: false, error: 'Admin login is not set up. Add ADMIN_PASSWORD and SESSION_SECRET in Netlify.' })
  }
  const body = await readJson<{ password?: string }>(request)
  if (!body?.password || !checkPassword(body.password)) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return json(401, { ok: false, error: 'Incorrect password.' })
  }
  return json(200, { ok: true }, { 'set-cookie': sessionCookie() })
}
