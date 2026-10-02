import { createHmac, timingSafeEqual } from 'node:crypto'

const COOKIE_NAME = 'ags_admin'
const MAX_AGE_SECONDS = 8 * 60 * 60

function secret(): string {
  const value = process.env.SESSION_SECRET ?? ''
  if (value.length < 16) throw new Error('SESSION_SECRET must be set (at least 16 characters).')
  return value
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function checkPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? ''
  if (!expected) return false
  // Compare HMAC digests so the comparison is constant-time regardless of input length.
  return safeEqual(sign(`pw:${candidate}`), sign(`pw:${expected}`))
}

export function sessionCookie(): string {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 })).toString('base64url')
  const token = `${payload}.${sign(payload)}`
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${MAX_AGE_SECONDS}`
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
}

export function isAuthenticated(request: Request): boolean {
  const cookies = request.headers.get('cookie') ?? ''
  const match = cookies.split(/;\s*/).find((part) => part.startsWith(`${COOKIE_NAME}=`))
  if (!match) return false
  const [payload, signature] = match.slice(COOKIE_NAME.length + 1).split('.')
  if (!payload || !signature) return false
  try {
    if (!safeEqual(signature, sign(payload))) return false
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp: number }
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}
