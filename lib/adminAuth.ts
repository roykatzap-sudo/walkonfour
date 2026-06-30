/* ════════════════════════════════════════════════════════════
   אימות אדמין משותף - השוואת constant-time (timingSafeEqual),
   דורש ADMIN_TOKEN של 32+ תווים. עצמאי מכל DB.
   ════════════════════════════════════════════════════════════ */

import { timingSafeEqual } from 'crypto'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN

/** האם הוגדר טוקן אדמין חזק (32+ תווים)? */
export function adminTokenSet(): boolean {
  return Boolean(ADMIN_TOKEN && ADMIN_TOKEN.length >= 32)
}

/** השוואת טוקן constant-time - נכשל מיד באורך שונה. */
export function checkAdminToken(token: string | null | undefined): boolean {
  if (!adminTokenSet() || !token) return false
  const a = Buffer.from(token)
  const b = Buffer.from(ADMIN_TOKEN!)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** אימות שם משתמש + סיסמה מול ADMIN_USERNAME / ADMIN_PASSWORD ב-env. */
export function checkAdminCredentials(username: string, password: string): boolean {
  const expectedUser = process.env.ADMIN_USERNAME
  const expectedPass = process.env.ADMIN_PASSWORD
  if (!expectedUser || !expectedPass || !adminTokenSet()) return false

  const uOk = Buffer.from(username).length === Buffer.from(expectedUser).length &&
    timingSafeEqual(Buffer.from(username), Buffer.from(expectedUser))
  const pOk = Buffer.from(password).length === Buffer.from(expectedPass).length &&
    timingSafeEqual(Buffer.from(password), Buffer.from(expectedPass))
  return uOk && pOk
}
