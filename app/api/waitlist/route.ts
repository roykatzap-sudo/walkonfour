import { NextResponse } from 'next/server'
import { waitlistConfigured, waitlistCount, waitlistAdd } from '@/lib/waitlist'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export async function GET() {
  return NextResponse.json({ configured: waitlistConfigured(), count: await waitlistCount() })
}

export async function POST(req: Request) {
  // rate limit + הגבלת גודל body - חלים תמיד, לפני כל לוגיקה (מונע ספאם/הצפה/probing)
  if (rateLimited(`${clientIp(req)}:waitlist`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!waitlistConfigured()) {
    return NextResponse.json({ ok: false, configured: false })
  }
  const body = await req.json().catch(() => ({}))
  const email = String(body?.email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: 'email' }, { status: 400 })
  }
  const city = typeof body?.city === 'string' && body.city.trim() ? body.city.trim().slice(0, 60) : null
  // שם פרטי/כינוי בלבד, אופציונלי, מוגבל ל-40 תווים (לא שם מלא - לפי מדיניות הפרטיות)
  const name = typeof body?.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 40) : null
  // הסכמה מפורשת לדיוור שיווקי (opt-in) - חוק הספאם. ברירת מחדל false.
  const consent = body?.consent === true
  const result = await waitlistAdd(email, name, city, consent)
  if (result === 'err') return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  return NextResponse.json({ ok: true, configured: true, dup: result === 'dup', count: await waitlistCount() })
}
