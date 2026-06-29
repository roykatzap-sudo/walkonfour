import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readSession, createSession, COMMUNITY_COOKIE, cookieOpts } from '@/lib/community/session'
import { CURRENT_CONSENT_VERSION } from '@/lib/community/schema'
import { clientIp, rateLimited } from '@/lib/rateLimit'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * POST /api/community/onboard
 * יוצר משתמש חדש אחרי OTP מוצלח + מסך הסכמה. דורש cookie זמני (pending).
 * שדות חובה: nickname, over_18=true. ההסכמה מתועדת ב-DB עם הגרסה הנוכחית.
 */
export async function POST(req: Request) {
  const ip = clientIp(req)
  if (rateLimited(`${ip}:onboard`, 5, 5 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  // ה-pending cookie מהאימות
  const cookieStore = cookies()
  const pendingToken = cookieStore.get(`${COMMUNITY_COOKIE}_pending`)?.value
  const pending = readSession(pendingToken)
  if (!pending || pending.userId !== -1 || !pending.email) {
    return NextResponse.json({ ok: false, error: 'session_expired' }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const nickname = typeof body?.nickname === 'string' ? body.nickname.trim().slice(0, 40) : ''
  const over18 = body?.over_18 === true
  const consentAccepted = body?.consent === true
  if (!nickname || nickname.length < 2) {
    return NextResponse.json({ ok: false, error: 'nickname' }, { status: 400 })
  }
  if (!over18) {
    return NextResponse.json({ ok: false, error: 'must_be_18' }, { status: 400 })
  }
  if (!consentAccepted) {
    return NextResponse.json({ ok: false, error: 'must_consent' }, { status: 400 })
  }
  const result = await withCommunityDb(async (client) => {
    // יצירת המשתמש (idempotent - אם קיים, נחזיר אותו)
    const existing = await client.query(
      'select id from community_users where lower(email) = lower($1) limit 1',
      [pending.email],
    )
    if (existing.rows[0]) {
      // משתמש קיים שאיכשהו הגיע ל-onboarding - מחזירים session רגיל
      const userId = Number(existing.rows[0].id)
      await client.query('update community_users set last_login_at = now() where id = $1', [userId])
      await logAudit(client, userId, 'onboard.already_existed', ip)
      return { userId }
    }
    const inserted = await client.query(
      `insert into community_users (email, nickname, over_18, consent_version, consented_at, last_login_at)
       values ($1, $2, true, $3, now(), now())
       returning id`,
      [pending.email.toLowerCase(), nickname, CURRENT_CONSENT_VERSION],
    )
    const userId = Number(inserted.rows[0].id)
    await logAudit(client, userId, 'onboard.created', ip, { consent_version: CURRENT_CONSENT_VERSION })
    return { userId }
  })
  if (!result) return NextResponse.json({ ok: false, error: 'db' }, { status: 503 })
  // session מלא
  const token = createSession(result.userId, pending.email)
  const res = NextResponse.json({ ok: true })
  if (token) res.cookies.set(COMMUNITY_COOKIE, token, cookieOpts())
  res.cookies.delete(`${COMMUNITY_COOKIE}_pending`)
  return res
}
