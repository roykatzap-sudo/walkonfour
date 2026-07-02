/* ════════════════════════════════════════════════════════════
   Session אדמין מבוסס עוגייה חתומה (HMAC) - httpOnly, Secure, SameSite.
   מחליף את המודל הישן שבו הטוקן הראשי (ADMIN_TOKEN) נשמר ב-localStorage
   וניתן לגניבה ע"י XSS. כאן: הטוקן הראשי נשאר בשרת בלבד, והדפדפן מקבל
   רק עוגייה חתומה עם תפוגה קצרה (12ש) שלא ניתנת לקריאה ע"י JavaScript.
   ════════════════════════════════════════════════════════════ */

import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

const SECRET = process.env.SESSION_SECRET || ''
const COOKIE_NAME = 'kv_admin'
const TTL_HOURS = 12

function sign(body: string): string {
  return createHmac('sha256', SECRET).update(body).digest('base64url')
}

type AdminSession = { role: 'admin'; iat: number; exp: number }

export function adminSessionConfigured(): boolean {
  return SECRET.length >= 32
}

/** יוצר טוקן session אדמין חתום. null אם SESSION_SECRET לא מוגדר. */
export function createAdminSession(): string | null {
  if (!adminSessionConfigured()) return null
  const now = Math.floor(Date.now() / 1000)
  const payload: AdminSession = { role: 'admin', iat: now, exp: now + TTL_HOURS * 3600 }
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${body}.${sign(body)}`
}

function verify(token: string | null | undefined): boolean {
  if (!token || !adminSessionConfigured()) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [body, sig] = parts
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(sign(body))
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false
    const decoded = JSON.parse(Buffer.from(body, 'base64url').toString('utf-8')) as AdminSession
    if (decoded.role !== 'admin' || !decoded.exp) return false
    if (decoded.exp < Math.floor(Date.now() / 1000)) return false
    return true
  } catch {
    return false
  }
}

/** האם הבקשה הנוכחית נושאת עוגיית אדמין תקפה? */
export function isAdminAuthed(): boolean {
  return verify(cookies().get(COOKIE_NAME)?.value)
}

export const ADMIN_COOKIE = COOKIE_NAME

export function adminCookieOpts() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: TTL_HOURS * 3600,
  }
}
