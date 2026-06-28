import { NextResponse } from 'next/server'
import { reportsConfigured, addParkReport, approvedParkReports } from '@/lib/parkReports'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** ציבורי: גינות מאושרות בלבד - להצגה על המפה. */
export async function GET() {
  const approved = await approvedParkReports()
  return NextResponse.json({ configured: reportsConfigured(), parks: approved })
}

/** ציבורי: שליחת דיווח על גינה חסרה (נשמר כ-pending). */
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:parkreport`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 3000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!reportsConfigured()) {
    return NextResponse.json({ ok: false, configured: false })
  }
  const body = await req.json().catch(() => ({}))
  const name = String(body?.name ?? '').trim()
  if (name.length < 2 || name.length > 120) {
    return NextResponse.json({ ok: false, error: 'name' }, { status: 400 })
  }
  const city = typeof body?.city === 'string' && body.city.trim() ? body.city.trim().slice(0, 60) : null
  const note = typeof body?.note === 'string' && body.note.trim() ? body.note.trim().slice(0, 400) : null
  const lat = typeof body?.lat === 'number' && body.lat > 29 && body.lat < 34 ? body.lat : null
  const lng = typeof body?.lng === 'number' && body.lng > 34 && body.lng < 36 ? body.lng : null
  const ok = await addParkReport({ name, city, note, lat, lng })
  return NextResponse.json({ ok })
}
