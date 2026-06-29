import { NextResponse } from 'next/server'
import { waitlistUnsubscribe, waitlistConfigured } from '@/lib/waitlist'
import { withCommunityDb } from '@/lib/community/db'
import { verifyUnsubToken } from '@/lib/community/emailFooter'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * הסרה מדיוור - תומך בשתי דרכים:
 * 1. token חתום (מקליק במייל) - הסרה מיידית בלי טופס
 * 2. email גולמי (טופס באתר) - אימות פורמט, הסרה
 *
 * תמיד מחזיר ok (אנטי-enumeration). מסיר משני מקומות:
 * - waitlist.marketing_consent → false (הדיוור הציבורי)
 * - community_users.notif_marketing → false (אם המשתמש בקהילה)
 */
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:unsub`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!waitlistConfigured()) return NextResponse.json({ ok: false, configured: false })
  const body = await req.json().catch(() => ({}))

  // דרך 1: טוקן חתום
  let email: string | null = null
  if (typeof body?.token === 'string') {
    email = verifyUnsubToken(body.token)
    if (!email) return NextResponse.json({ ok: false, error: 'invalid_token' }, { status: 400 })
  } else {
    // דרך 2: מייל גולמי
    const raw = String(body?.email ?? '').trim().toLowerCase()
    if (!EMAIL_RE.test(raw) || raw.length > 200) {
      return NextResponse.json({ ok: false, error: 'email' }, { status: 400 })
    }
    email = raw
  }

  // הסרה כפולה - גם רשימת המתנה וגם קהילה
  await waitlistUnsubscribe(email)
  await withCommunityDb(async (c) => {
    await c.query(
      'update community_users set notif_marketing = false where lower(email) = lower($1)',
      [email],
    )
  })
  // בטוקן מחזירים גם את המייל (לתצוגה), בלי לחשוף מי לא ברשימה
  return NextResponse.json({ ok: true, ...(body?.token ? { email } : {}) })
}
