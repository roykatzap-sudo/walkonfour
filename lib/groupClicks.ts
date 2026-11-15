/* ════════════════════════════════════════════════════════════
   ספירת הקלקות על הקישור לקבוצת הפייסבוק.
   המטרה: לדעת איזה עמוד ואיזה מיקום בעמוד מביאים אנשים לקבוצה.
   נשמר רק: מקור (מיקום הכפתור), נתיב העמוד וזמן. בלי IP, בלי עוגיות,
   בלי שום מזהה של המבקר. הטבלה נוצרת אוטומטית בהקלקה הראשונה.
   תצוגה: פאנל /admin, לשונית "הקלקות לקבוצה".
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { getDbUrl } from './dbUrl'

const DB = getDbUrl()

export function groupClicksConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 4000 })
}

const CREATE_SQL = `
  create table if not exists group_clicks (
    id bigint generated always as identity primary key,
    src text not null,
    page text,
    created_at timestamptz default now()
  )`

/** מנקה ערך חופשי למפתח קצר ובטוח (אותיות לטיניות, ספרות, מקף). */
export function cleanSrc(v: unknown): string {
  const s = typeof v === 'string' ? v.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) : ''
  return s || 'unknown'
}

/** נתיב עמוד: רק path, בלי query ובלי דומיין. */
export function cleanPage(v: unknown): string | null {
  if (typeof v !== 'string' || !v.startsWith('/')) return null
  return v.split('?')[0]!.split('#')[0]!.slice(0, 160)
}

/** בוטים וסורקים לא נספרים. */
export function looksLikeBot(ua: string | null): boolean {
  if (!ua) return true
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|headless|lighthouse|monitor|curl|python|wget/i.test(ua)
}

export async function addGroupClick(src: string, page: string | null): Promise<boolean> {
  if (!groupClicksConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    await client.query('insert into group_clicks (src, page) values ($1, $2)', [src, page])
    return true
  } catch (e) {
    console.error('[group-clicks] add failed', e)
    return false
  } finally {
    try { await client.end() } catch {}
  }
}

export type GroupClickStats = {
  total: number
  last7: number
  last30: number
  bySrc: { src: string; clicks: number }[]
  byPage: { page: string; clicks: number }[]
  byDay: { day: string; clicks: number }[]
}

/** אדמין: סיכום 30 הימים האחרונים. */
export async function groupClickStats(): Promise<GroupClickStats> {
  const empty: GroupClickStats = { total: 0, last7: 0, last30: 0, bySrc: [], byPage: [], byDay: [] }
  if (!groupClicksConfigured()) return empty
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const totals = await client.query(`
      select count(*)::int as total,
             count(*) filter (where created_at > now() - interval '7 days')::int as last7,
             count(*) filter (where created_at > now() - interval '30 days')::int as last30
      from group_clicks`)
    const bySrc = await client.query(`
      select src, count(*)::int as clicks from group_clicks
      where created_at > now() - interval '30 days'
      group by src order by clicks desc limit 30`)
    const byPage = await client.query(`
      select coalesce(page, '(לא ידוע)') as page, count(*)::int as clicks from group_clicks
      where created_at > now() - interval '30 days'
      group by 1 order by clicks desc limit 40`)
    const byDay = await client.query(`
      select to_char(date_trunc('day', created_at at time zone 'Asia/Jerusalem'), 'YYYY-MM-DD') as day,
             count(*)::int as clicks
      from group_clicks
      where created_at > now() - interval '30 days'
      group by 1 order by 1 desc`)
    const t = totals.rows[0] ?? { total: 0, last7: 0, last30: 0 }
    return { total: t.total, last7: t.last7, last30: t.last30, bySrc: bySrc.rows, byPage: byPage.rows, byDay: byDay.rows }
  } catch (e) {
    console.error('[group-clicks] stats failed', e)
    return empty
  } finally {
    try { await client.end() } catch {}
  }
}
