import { NextResponse } from 'next/server'
import { addGuideFeedback } from '@/lib/guideFeedback'
import { getGuide } from '@/lib/guides'
import { clientIp, rateLimited } from '@/lib/rateLimit'
import { looksLikeBot } from '@/lib/groupClicks'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:guide-feedback`, 10, 60_000)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  if (Number(req.headers.get('content-length') || 0) > 300) return NextResponse.json({ ok: false }, { status: 413 })
  if (looksLikeBot(req.headers.get('user-agent'))) return NextResponse.json({ ok: true })
  const body = await req.json().catch(() => ({}))
  const slug = typeof body?.slug === 'string' ? body.slug : ''
  if (!getGuide(slug) || typeof body?.helpful !== 'boolean') return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  const ok = await addGuideFeedback(slug, body.helpful)
  return NextResponse.json({ ok })
}
