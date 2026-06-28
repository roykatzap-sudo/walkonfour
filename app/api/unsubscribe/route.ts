import { NextResponse } from 'next/server'
import { waitlistUnsubscribe, waitlistConfigured } from '@/lib/waitlist'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// הסרה מדיוור - חוק הספאם מחייב הסרה קלה. תמיד מחזיר ok (לא חושף אם המייל ברשימה).
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:unsub`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!waitlistConfigured()) return NextResponse.json({ ok: false, configured: false })
  const body = await req.json().catch(() => ({}))
  const email = String(body?.email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'email' }, { status: 400 })
  }
  await waitlistUnsubscribe(email)
  return NextResponse.json({ ok: true })
}
