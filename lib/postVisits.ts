/* ════════════════════════════════════════════════════════════
   ספירת כניסות לאתר מקישורים מתויגים (utm_source / utm_campaign).
   המטרה: לדעת איזה פוסט בפייסבוק באמת הביא אנשים לאתר, ואיזה לא.
   נשמר רק: מקור, שם הקמפיין, נתיב העמוד וזמן. בלי IP, בלי עוגיות,
   בלי שום מזהה של המבקר. הטבלה נוצרת אוטומטית בכניסה הראשונה.
   תצוגה: פאנל /admin, לשונית "כניסות מפוסטים".
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { getDbUrl } from './dbUrl'

const DB = getDbUrl()

export function postVisitsConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 4000 })
}

const CREATE_SQL = `
  create table if not exists post_visits (
    id bigint generated always as identity primary key,
    src text not null,
    campaign text,
    page text,
    created_at timestamptz default now()
  )`

/** מפתח קצר ובטוח: אותיות לטיניות, ספרות, מקף וקו תחתון. */
export function cleanTag(v: unknown): string {
  return typeof v === 'string' ? v.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 60) : ''
}

export async function addPostVisit(src: string, campaign: string | null, page: string | null): Promise<boolean> {
  if (!postVisitsConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    await client.query('insert into post_visits (src, campaign, page) values ($1, $2, $3)', [src, campaign, page])
    return true
  } catch (e) {
    console.error('[post-visits] add failed', e)
    return false
  } finally {
    try { await client.end() } catch {}
  }
}

export type PostVisitStats = {
  total: number
  last7: number
  last30: number
  bySrc: { src: string; visits: number }[]
  byCampaign: { src: string; campaign: string; visits: number }[]
  byPage: { page: string; visits: number }[]
  byDay: { day: string; visits: number }[]
  /** הקלקות על הקישור לקבוצה, לפי הפוסט שממנו הגיע המבקר ("מקור:קמפיין"). */
  groupClicksByVia: { via: string; clicks: number }[]
}

/** אדמין: סיכום 30 הימים האחרונים. */
export async function postVisitStats(): Promise<PostVisitStats> {
  const empty: PostVisitStats = { total: 0, last7: 0, last30: 0, bySrc: [], byCampaign: [], byPage: [], byDay: [], groupClicksByVia: [] }
  if (!postVisitsConfigured()) return empty
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const totals = await client.query(`
      select count(*)::int as total,
             count(*) filter (where created_at > now() - interval '7 days')::int as last7,
             count(*) filter (where created_at > now() - interval '30 days')::int as last30
      from post_visits`)
    const bySrc = await client.query(`
      select src, count(*)::int as visits from post_visits
      where created_at > now() - interval '30 days'
      group by src order by visits desc limit 30`)
    const byCampaign = await client.query(`
      select src, coalesce(campaign, '') as campaign, count(*)::int as visits from post_visits
      where created_at > now() - interval '30 days'
      group by 1, 2 order by visits desc limit 80`)
    const byPage = await client.query(`
      select coalesce(page, '(לא ידוע)') as page, count(*)::int as visits from post_visits
      where created_at > now() - interval '30 days'
      group by 1 order by visits desc limit 40`)
    const byDay = await client.query(`
      select to_char(date_trunc('day', created_at at time zone 'Asia/Jerusalem'), 'YYYY-MM-DD') as day,
             count(*)::int as visits
      from post_visits
      where created_at > now() - interval '30 days'
      group by 1 order by 1 desc`)
    const t = totals.rows[0] ?? { total: 0, last7: 0, last30: 0 }
    // טבלת ההקלקות לקבוצה נוצרת בנפרד, וייתכן שעדיין אין בה עמודת via - לכן בנפרד ובלי להפיל את הדוח.
    let groupClicksByVia: { via: string; clicks: number }[] = []
    try {
      const g = await client.query(`
        select via, count(*)::int as clicks from group_clicks
        where via is not null and created_at > now() - interval '30 days'
        group by via order by clicks desc limit 120`)
      groupClicksByVia = g.rows
    } catch {
      /* אין עדיין נתונים */
    }
    return { total: t.total, last7: t.last7, last30: t.last30, bySrc: bySrc.rows, byCampaign: byCampaign.rows, byPage: byPage.rows, byDay: byDay.rows, groupClicksByVia }
  } catch (e) {
    console.error('[post-visits] stats failed', e)
    return empty
  } finally {
    try { await client.end() } catch {}
  }
}
