import { NextResponse } from 'next/server'
import { requestOtp } from '@/lib/community/otp'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/**
 * POST /api/community/otp
 * שולח קוד OTP למייל. אנטי-enumeration: גם אם המייל לא ברשימת ההמתנה,
 * תגובה זהה - כדי לא לחשוף מי רשום ומי לא.
 */
export async function POST(req: Request) {
  const ip = clientIp(req)
  // הגנה: 6 בקשות OTP פר דקה פר IP - מספיק טוב כדי לעצור botim,
  // וגם סבלני לטעויות הקלדה של משתמש אמיתי שעושה typo במייל.
  if (rateLimited(`${ip}:otp-req`, 6, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 500) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  const body = await req.json().catch(() => ({}))
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'email' }, { status: 400 })
  }
  const result = await requestOtp(email, ip)
  // תמיד אותה תגובה למשתמש (אנטי-enumeration). הסיבה רק ב-audit log.
  if (result.ok || result.reason === 'not_on_waitlist') {
    return NextResponse.json({ ok: true })
  }
  return NextResponse.json({ ok: false, error: 'server' }, { status: 503 })
}
