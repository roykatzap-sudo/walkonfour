import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { cancelPlan } from '@/lib/community/plans'
import { clientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** DELETE - ביטול תיאום (soft cancel) */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const planId = Number(params.id)
  if (!Number.isInteger(planId) || planId <= 0) {
    return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  }
  const ok = await withCommunityDb(async (c) => {
    const cancelled = await cancelPlan(c, session.userId, planId)
    if (cancelled) await logAudit(c, session.userId, 'plan.cancelled', ip, { plan_id: planId })
    return cancelled
  })
  if (!ok) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true })
}
