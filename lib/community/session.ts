/* ════════════════════════════════════════════════════════════
   Session cookie מבוסס JWT (HMAC) - בלי DB lookup פר request.
   ה-payload: userId + email + iat + exp. חתום עם SESSION_SECRET.
   תפוגה: 30 ימים (sliding).
   ════════════════════════════════════════════════════════════ */

import { createHmac, timingSafeEqual } from 'crypto'

const SECRET = process.env.SESSION_SECRET || ''
const COOKIE_NAME = 'kv_community'
const TTL_DAYS = 30

function sign(body: string): string {
  return createHmac('sha256', SECRET).update(body).digest('base64url')
}

export type Session = { userId: number; email: string; iat: number; exp: number }

export function sessionConfigured(): boolean {
  return SECRET.length >= 32
}

export function createSession(userId: number, email: string): string | null {
  if (!sessionConfigured()) return null
  const now = Math.floor(Date.now() / 1000)
  const payload: Session = { userId, email, iat: now, exp: now + TTL_DAYS * 86400 }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const sig = sign(body)
  return `${body}.${sig}`
}

export function readSession(token: string | null | undefined): Session | null {
  if (!token || !sessionConfigured()) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  // constant-time signature check
  const expected = sign(body)
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null
  } catch {
    return null
  }
  try {
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as Session
    if (!decoded.userId || !decoded.email || !decoded.exp) return null
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}

export const COMMUNITY_COOKIE = COOKIE_NAME

export function cookieOpts() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: TTL_DAYS * 86400,
  }
}
