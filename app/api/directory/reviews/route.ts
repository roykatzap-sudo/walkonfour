import { NextResponse } from 'next/server'
import { clientIp, rateLimited } from '@/lib/rateLimit'
import { hashIp } from '@/lib/community/db'
import { addReview, directoryConfigured } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** POST /api/directory/reviews - ביקורת על עסק */
export async function POST(req: Request) {
  const ip = clientIp(req)

  // rate limit כללי: 5 לדקה
  if (rateLimited(`${ip}:dir-review`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!directoryConfigured()) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))

  const business_slug = typeof body?.business_slug === 'string' ? body.business_slug : ''
  const rating = typeof body?.rating === 'number' ? body.rating : NaN
  const author_name = typeof body?.author_name === 'string' ? body.author_name : ''

  if (!business_slug.trim() || !author_name.trim()) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const result = await addReview(
    {
      business_slug,
      rating,
      author_name,
      text: typeof body?.text === 'string' ? body.text : undefined,
    },
    hashIp(ip),
  )

  if (result === 'dup') {
    return NextResponse.json({ ok: false, error: 'dup' }, { status: 400 })
  }
  if (result === 'notfound') {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }
  if (result === 'err') {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, pending: result === 'pending' })
}
