import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { createPlan, listMyPlans, listParkPlans, countParkPlans, validatePlanInput } from '@/lib/community/plans'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET ?park_key=... → תיאומים של אחרים בגינה (אנונימי עד 15 דק׳)
 *  GET ?mine=1 → התיאומים שלי */
export async function GET(req: Request) {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  if (url.searchParams.get('mine') === '1') {
    const plans = await withCommunityDb((c) => listMyPlans(c, session.userId))
    return NextResponse.json({ ok: true, plans: plans ?? [] })
  }
  const parkKey = url.searchParams.get('park_key')?.slice(0, 120)
  if (!parkKey) return NextResponse.json({ ok: false, error: 'park_key' }, { status: 400 })
  const data = await withCommunityDb(async (c) => ({
    plans: await listParkPlans(c, parkKey, session.userId),
    count: await countParkPlans(c, parkKey),
  }))
  return NextResponse.json({ ok: true, ...(data ?? { plans: [], count: 0 }) })
}

/** POST - יצירת תיאום חדש */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:plan-create`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const v = validatePlanInput(body)
  if (!v.ok) return NextResponse.json({ ok: false, error: v.field }, { status: 400 })
  const result = await withCommunityDb(async (c) => {
    const plan = await createPlan(c, session.userId, v.data)
    if (plan) await logAudit(c, session.userId, 'plan.created', ip, { park_key: v.data.parkKey, plan_id: plan.id })
    return plan
  })
  if (!result) return NextResponse.json({ ok: false, error: 'dog_not_found' }, { status: 404 })
  return NextResponse.json({ ok: true, plan: result })
}
