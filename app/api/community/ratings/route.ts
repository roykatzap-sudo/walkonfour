import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { listParkRatings, getParkRatingSummary, getMyRating, upsertRating, validateRating, batchParkSummaries } from '@/lib/community/ratings'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET ?park_key=... → summary + ratings + my rating
 *  GET ?park_keys=a,b,c → batch summaries (לתצוגה במפה) */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const batchParam = url.searchParams.get('park_keys')
  if (batchParam) {
    const keys = batchParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 200)
    const map = await withCommunityDb((c) => batchParkSummaries(c, keys))
    return NextResponse.json({ ok: true, summaries: map ?? {} })
  }
  const parkKey = url.searchParams.get('park_key')?.slice(0, 120)
  if (!parkKey) return NextResponse.json({ ok: false, error: 'park_key' }, { status: 400 })
  const session = readCurrentSession()
  const data = await withCommunityDb(async (c) => ({
    summary: await getParkRatingSummary(c, parkKey),
    ratings: await listParkRatings(c, parkKey),
    my: session ? await getMyRating(c, session.userId, parkKey) : null,
  }))
  return NextResponse.json({ ok: true, ...(data ?? { summary: { avg: 0, count: 0, tags: {} }, ratings: [], my: null }) })
}

/** POST - יצירת/עדכון דירוג */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:rating`, 20, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const v = validateRating(body)
  if (!v.ok) return NextResponse.json({ ok: false, error: v.field }, { status: 400 })
  await withCommunityDb(async (c) => {
    await upsertRating(c, session.userId, v.data)
    await logAudit(c, session.userId, 'rating.upserted', ip, { park_key: v.data.parkKey, stars: v.data.stars })
  })
  return NextResponse.json({ ok: true })
}
