/* ════════════════════════════════════════════════════════════
   גרסת Edge-compatible של אימות session.
   המידלוור רץ ב-Edge runtime - אין שם Node Buffer / node:crypto.
   כאן משתמשים ב-Web Crypto API + atob/btoa בלבד.
   הסכמת payload + שיטת חתימה זהה ל-sessionEdge ↔ session.ts.
   ════════════════════════════════════════════════════════════ */

const SECRET = process.env.SESSION_SECRET || ''
export const COMMUNITY_COOKIE = 'kv_community'

export type Session = { userId: number; email: string; iat: number; exp: number }

const enc = new TextEncoder()

// base64url ↔ Uint8Array (אין Buffer ב-Edge)
function b64urlToBytes(s: string): Uint8Array {
  const norm = s.replace(/-/g, '+').replace(/_/g, '/').padEnd(s.length + ((4 - (s.length % 4)) % 4), '=')
  const bin = atob(norm)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}
function bytesToB64url(b: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < b.length; i++) bin += String.fromCharCode(b[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function signEdge(body: string): Promise<string> {
  if (!SECRET) return ''
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(body))
  return bytesToB64url(new Uint8Array(sig))
}

/** מאמת session ב-Edge (constant-time, Web Crypto). */
export async function readSessionEdge(token: string | null | undefined): Promise<Session | null> {
  if (!token || !SECRET || SECRET.length < 32) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [body, sig] = parts
  const expected = await signEdge(body)
  if (!expected) return null
  // constant-time string compare (אורך זהה - יוצא מיד אחרת)
  if (sig.length !== expected.length) return null
  let diff = 0
  for (let i = 0; i < sig.length; i++) diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
  if (diff !== 0) return null
  try {
    const bytes = b64urlToBytes(body)
    const txt = new TextDecoder().decode(bytes)
    const decoded = JSON.parse(txt) as Session
    if (!decoded.userId || !decoded.email || !decoded.exp) return null
    if (decoded.exp < Math.floor(Date.now() / 1000)) return null
    return decoded
  } catch {
    return null
  }
}
