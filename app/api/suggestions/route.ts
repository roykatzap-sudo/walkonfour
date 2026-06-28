import { NextResponse } from 'next/server'
import { addSuggestion, suggestionsConfigured, SUGGESTION_TYPES } from '@/lib/suggestions'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // rate-limit + הגבלת גודל - חלים תמיד
  if (rateLimited(`${clientIp(req)}:suggest`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 3000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!suggestionsConfigured()) {
    return NextResponse.json({ ok: false, configured: false })
  }
  const body = await req.json().catch(() => ({}))
  const page = typeof body?.page === 'string' && body.page.trim() ? body.page.trim().slice(0, 120) : null
  const city = typeof body?.city === 'string' && body.city.trim() ? body.city.trim().slice(0, 60) : null
  const type = typeof body?.type === 'string' && (SUGGESTION_TYPES as readonly string[]).includes(body.type.trim()) ? body.type.trim() : 'general'
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : ''
  const details = typeof body?.details === 'string' && body.details.trim() ? body.details.trim().slice(0, 500) : null
  // חובה: שם + הקשר (עמוד או עיר). הסוג נופל ל-general אם לא תקין.
  if (!name || (!page && !city)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  const ok = await addSuggestion({ page, city, type, name, details })
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
}
