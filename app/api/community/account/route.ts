import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { COMMUNITY_COOKIE } from '@/lib/community/session'
import { deleteDogImage } from '@/lib/community/storage'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET - פרטי החשבון + העדפות דיוור (כולל מצב marketing_consent מ-waitlist) */
export async function GET() {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const data = await withCommunityDb(async (c) => {
    const u = await c.query(
      'select id, email, nickname, notif_operational, notif_marketing, consent_version, consented_at, created_at from community_users where id = $1',
      [session.userId],
    )
    if (!u.rows[0]) return null
    // mirror את marketing_consent מ-waitlist הקיים (אם נרשם דרך הטופס הציבורי)
    const wl = await c.query('select marketing_consent from waitlist where lower(email) = lower($1)', [u.rows[0].email])
    return {
      ...u.rows[0],
      waitlist_marketing_consent: wl.rows[0]?.marketing_consent ?? null,
    }
  })
  if (!data) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true, account: data })
}

/** PATCH - עדכון העדפות דיוור (התראות תפעוליות / שיווקיות) */
export async function PATCH(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:account-patch`, 10, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const body = await req.json().catch(() => ({}))
  const ops: string[] = []
  const vals: unknown[] = []
  if (typeof body?.notif_operational === 'boolean') {
    vals.push(body.notif_operational); ops.push(`notif_operational = $${vals.length}`)
  }
  if (typeof body?.notif_marketing === 'boolean') {
    vals.push(body.notif_marketing); ops.push(`notif_marketing = $${vals.length}`)
  }
  if (typeof body?.nickname === 'string' && body.nickname.trim().length >= 2) {
    vals.push(body.nickname.trim().slice(0, 40)); ops.push(`nickname = $${vals.length}`)
  }
  if (ops.length === 0) return NextResponse.json({ ok: false, error: 'no_changes' }, { status: 400 })
  vals.push(session.userId)
  const result = await withCommunityDb(async (c) => {
    await c.query(`update community_users set ${ops.join(', ')} where id = $${vals.length}`, vals)
    // mirror marketing → waitlist (חוק 30א: השינוי של המשתמש בקהילה משפיע גם על הדיוור הציבורי)
    if (typeof body?.notif_marketing === 'boolean') {
      await c.query('update waitlist set marketing_consent = $1 where lower(email) = lower((select email from community_users where id = $2))',
        [body.notif_marketing, session.userId])
    }
    await logAudit(c, session.userId, 'account.updated', ip, { fields: Object.keys(body) })
    return true
  })
  if (!result) return NextResponse.json({ ok: false, error: 'db' }, { status: 503 })
  return NextResponse.json({ ok: true })
}

/** DELETE - מחיקת חשבון מלאה (זכות נשכחות - סעיף 14, תיקון 13).
 *  CASCADE על dogs/plans/messages. שומר audit_log עם user_id=null (אנונימיזציה).
 *  ה-cookie מוסר מיד. */
export async function DELETE(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const result = await withCommunityDb(async (c) => {
    // אסוף את כל ה-photo_urls של הכלבים לפני המחיקה (לניקוי storage)
    const photos = await c.query('select photo_url from dogs where user_id = $1 and photo_url is not null', [session.userId])
    const photoUrls = photos.rows.map((r) => r.photo_url as string)
    // אנונימיזציית audit_log (לפי המלצת הסקירה המשפטית - שומרים אירועים בלי מזהה)
    await c.query('update community_audit_log set user_id = null where user_id = $1', [session.userId])
    // CASCADE delete של המשתמש מוחק dogs, park_plans, park_messages
    const del = await c.query('delete from community_users where id = $1', [session.userId])
    await logAudit(c, null, 'account.deleted', ip, { previous_user_id: session.userId, photos_removed: photoUrls.length })
    return { ok: (del.rowCount ?? 0) > 0, photoUrls }
  })
  if (!result?.ok) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  // מחיקת כל התמונות מ-storage. זכות להישכח - חייבים לחכות שהמחיקה תושלם בפועל
  // ולא fire-and-forget, אחרת תמונה עלולה לשרוד ב-bucket ציבורי אחרי מחיקת החשבון.
  await Promise.allSettled(result.photoUrls.map((url) => deleteDogImage(url)))
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COMMUNITY_COOKIE)
  res.cookies.delete(`${COMMUNITY_COOKIE}_pending`)
  return res
}
