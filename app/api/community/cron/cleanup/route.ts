import { NextResponse } from 'next/server'
import { withCommunityDb } from '@/lib/community/db'
import { CHAT_TTL_HOURS, AUDIT_TTL_MONTHS } from '@/lib/community/schema'

export const dynamic = 'force-dynamic'

/**
 * GET /api/community/cron/cleanup
 * Cron יומי שמוחק נתונים שעברו את ה-TTL שלהם.
 * - park_plans שעברו את expires_at → DELETE קשיח
 * - park_messages מעל CHAT_TTL_HOURS → DELETE קשיח
 * - community_otp שעברו expires_at → DELETE קשיח
 * - community_audit_log מעל AUDIT_TTL_MONTHS → DELETE קשיח
 *
 * אבטחה: מוגן ע"י CRON_SECRET (Vercel automatic injection ב-cron jobs).
 * אם CRON_SECRET לא מוגדר - דוחה הכל. אם header חסר/שגוי - דוחה.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) return NextResponse.json({ ok: false, error: 'cron_unconfigured' }, { status: 503 })
  const auth = req.headers.get('authorization') || ''
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const stats = await withCommunityDb(async (c) => {
    const plans = await c.query('delete from park_plans where expires_at < now()')
    const msgs = await c.query(`delete from park_messages where created_at < now() - interval '${CHAT_TTL_HOURS} hours'`)
    const otps = await c.query('delete from community_otp where expires_at < now() - interval \'1 hour\'')
    const audit = await c.query(`delete from community_audit_log where created_at < now() - interval '${AUDIT_TTL_MONTHS} months'`)
    return {
      plans_deleted: plans.rowCount ?? 0,
      messages_deleted: msgs.rowCount ?? 0,
      otps_deleted: otps.rowCount ?? 0,
      audit_deleted: audit.rowCount ?? 0,
    }
  })
  return NextResponse.json({ ok: true, ...stats, ran_at: new Date().toISOString() })
}
