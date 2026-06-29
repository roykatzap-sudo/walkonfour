import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET - רשימת מי שחסמתי */
export async function GET() {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const blocks = await withCommunityDb(async (c) => {
    const r = await c.query(
      `select b.blocked_id, u.nickname, b.created_at
       from user_blocks b
       join community_users u on u.id = b.blocked_id
       where b.blocker_id = $1
       order by b.created_at desc`,
      [session.userId],
    )
    return r.rows
  })
  return NextResponse.json({ ok: true, blocks: blocks ?? [] })
}

/** POST - חסימת משתמש. body: { blocked_user_id } */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:block`, 20, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const blockedId = Number(body?.blocked_user_id)
  if (!Number.isInteger(blockedId) || blockedId <= 0 || blockedId === session.userId) {
    return NextResponse.json({ ok: false, error: 'blocked_user_id' }, { status: 400 })
  }
  await withCommunityDb(async (c) => {
    await c.query(
      'insert into user_blocks (blocker_id, blocked_id) values ($1, $2) on conflict (blocker_id, blocked_id) do nothing',
      [session.userId, blockedId],
    )
    await logAudit(c, session.userId, 'user.blocked', ip, { blocked_id: blockedId })
  })
  return NextResponse.json({ ok: true })
}

/** DELETE ?id=... - הסרת חסימה */
export async function DELETE(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const id = Number(new URL(req.url).searchParams.get('id'))
  if (!Number.isInteger(id) || id <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  await withCommunityDb(async (c) => {
    await c.query('delete from user_blocks where blocker_id = $1 and blocked_id = $2', [session.userId, id])
    await logAudit(c, session.userId, 'user.unblocked', ip, { blocked_id: id })
  })
  return NextResponse.json({ ok: true })
}
