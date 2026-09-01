import { NextResponse } from 'next/server'
import { clientIp, rateLimited } from '@/lib/rateLimit'
import { reportItem, directoryConfigured } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** POST /api/directory/report - דיווח על עסק או ביקורת */
export async function POST(req: Request) {
  const ip = clientIp(req)

  if (rateLimited(`${ip}:dir-report`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!directoryConfigured()) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))

  const type = body?.type
  const id = Number(body?.id)

  if ((type !== 'business' && type !== 'review') || !Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const result = await reportItem(type, id)
  if (result === 'err') {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
