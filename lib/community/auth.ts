/* ════════════════════════════════════════════════════════════
   עזרי auth לשימוש בעמודים ו-API: קריאת המשתמש המחובר.
   ════════════════════════════════════════════════════════════ */

import { cookies } from 'next/headers'
import { withCommunityDb } from './db'
import { readSession, COMMUNITY_COOKIE, type Session } from './session'

export type CurrentUser = {
  id: number
  email: string
  nickname: string
  consent_version: string
  created_at: string
}

/** קריאת ה-session מה-cookie. null אם לא מחובר/לא תקף. */
export function readCurrentSession(): Session | null {
  const cookieStore = cookies()
  const token = cookieStore.get(COMMUNITY_COOKIE)?.value
  const session = readSession(token)
  if (!session || session.userId === -1) return null
  return session
}

/** קריאת פרטי המשתמש המחובר מה-DB. null אם לא מחובר/לא קיים. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = readCurrentSession()
  if (!session) return null
  const user = await withCommunityDb(async (client) => {
    const res = await client.query(
      'select id, email, nickname, consent_version, created_at from community_users where id = $1 limit 1',
      [session.userId],
    )
    return res.rows[0] || null
  })
  return user as CurrentUser | null
}
