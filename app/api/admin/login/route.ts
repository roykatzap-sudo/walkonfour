import { NextResponse } from 'next/server'
import { checkAdminCredentials } from '@/lib/adminAuth'
import { createAdminSession, ADMIN_COOKIE, adminCookieOpts } from '@/lib/adminSession'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // הגנת brute-force: 5 ניסיונות ל-15 דקות לכל IP
  if (rateLimited(`${clientIp(req)}:admin-login`, 5, 15 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'too_many_attempts' }, { status: 429 })
  }

  const { username, password } = await req.json().catch(() => ({}))
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  // הצלחה: מנפיקים עוגייה חתומה httpOnly (הטוקן הראשי לא עוזב את השרת)
  const session = createAdminSession()
  if (!session) {
    return NextResponse.json({ ok: false, error: 'unconfigured' }, { status: 503 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, session, adminCookieOpts())
  return res
}
