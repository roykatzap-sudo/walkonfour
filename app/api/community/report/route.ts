import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** POST /api/community/report - דיווח על משתמש אחר.
 *  body: { reported_user_id, context: 'message'|'plan'|'profile', context_ref?, reason } */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:report`, 5, 5 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const reportedId = Number(body?.reported_user_id)
  if (!Number.isInteger(reportedId) || reportedId <= 0 || reportedId === session.userId) {
    return NextResponse.json({ ok: false, error: 'reported_user_id' }, { status: 400 })
  }
  const context = ['message', 'plan', 'profile'].includes(body?.context) ? body.context : 'profile'
  const contextRef = typeof body?.context_ref === 'string' ? body.context_ref.slice(0, 80) : null
  const reason = typeof body?.reason === 'string' ? body.reason.trim().slice(0, 500) : ''
  if (!reason || reason.length < 3) return NextResponse.json({ ok: false, error: 'reason' }, { status: 400 })
  const result = await withCommunityDb(async (c) => {
    await c.query(
      'insert into user_reports (reporter_id, reported_id, context, context_ref, reason) values ($1, $2, $3, $4, $5)',
      [session.userId, reportedId, context, contextRef, reason],
    )
    await logAudit(c, session.userId, 'user.reported', ip, { reported_id: reportedId, context })
    return true
  })
  if (!result) return NextResponse.json({ ok: false, error: 'db' }, { status: 503 })
  return NextResponse.json({ ok: true })
}
