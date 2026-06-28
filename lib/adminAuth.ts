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
