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
  const city = typeof body?.city === 'string' ? body.city.trim().slice(0, 60) : ''
  const type = typeof body?.type === 'string' ? body.type.trim() : ''
  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 80) : ''
  const details = typeof body?.details === 'string' && body.details.trim() ? body.details.trim().slice(0, 500) : null
  if (!city || !name || !(SUGGESTION_TYPES as readonly string[]).includes(type)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  const ok = await addSuggestion({ city, type, name, details })
  return ok
    ? NextResponse.json({ ok: true })
    : NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
}
