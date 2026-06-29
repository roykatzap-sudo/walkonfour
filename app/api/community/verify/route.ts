import { NextResponse } from 'next/server'
import { verifyOtp } from '@/lib/community/otp'
import { createSession, sessionConfigured, COMMUNITY_COOKIE, cookieOpts } from '@/lib/community/session'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/**
 * POST /api/community/verify
 * מאמת קוד OTP. אם משתמש קיים - יוצא עם session. אם isNew - מחזיר flag,
 * הקליינט יעביר ל-onboarding למילוי nickname + הסכמה.
 */
export async function POST(req: Request) {
  const ip = clientIp(req)
  if (rateLimited(`${ip}:otp-verify`, 10, 5 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (!sessionConfigured()) {
    return NextResponse.json({ ok: false, error: 'session_unconfigured' }, { status: 503 })
  }
  const body = await req.json().catch(() => ({}))
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  const code = typeof body?.code === 'string' ? body.code.trim() : ''
  if (!email || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  const result = await verifyOtp(email, code, ip)
  if (!result.ok) {
    const status = result.reason === 'too_many_attempts' ? 429 : 401
    return NextResponse.json({ ok: false, error: result.reason }, { status })
  }
  // משתמש חדש - לא נותנים session עדיין, מחזירים email-token זמני (15 דק׳)
  // שמשמש לקריאת onboarding (יצירת המשתמש בפועל).
  if (result.isNew) {
    const tempSession = createSession(-1, email) // userId=-1 מסמן pending
    const res = NextResponse.json({ ok: true, isNew: true })
    if (tempSession) {
      res.cookies.set(`${COMMUNITY_COOKIE}_pending`, tempSession, { ...cookieOpts(), maxAge: 15 * 60 })
    }
    return res
  }
  // משתמש קיים - session מלא
  const token = createSession(result.userId, email)
  const res = NextResponse.json({ ok: true, isNew: false })
  if (token) res.cookies.set(COMMUNITY_COOKIE, token, cookieOpts())
  return res
}
