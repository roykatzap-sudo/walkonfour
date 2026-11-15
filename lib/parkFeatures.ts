/* ════════════════════════════════════════════════════════════
   "מה יש בגינה?" - בעלי כלבים מסמנים אם בגינה יש צל, מים וגדר.
   כל דיווח נשמר כ-pending ומופיע באתר רק אחרי אישור בפאנל הניהול.
   לא נשמר שום פרט על המדווח. הטבלה נוצרת אוטומטית בדיווח הראשון.
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { getDbUrl } from './dbUrl'

const DB = getDbUrl()

export function parkFeaturesConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 })
}

const CREATE_SQL = `
  create table if not exists park_features (
    id bigint generated always as identity primary key,
    park_id bigint not null,
    park_name text,
    city text not null,
    shade boolean,
    water boolean,
    fence boolean,
    status text not null default 'pending',
    created_at timestamptz default now()
  )`

export type ParkFeatureReport = {
  id: number
  park_id: number
  park_name: string | null
  city: string
  shade: boolean | null
  water: boolean | null
  fence: boolean | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type ParkFeatures = { shade: boolean | null; water: boolean | null; fence: boolean | null }

const tri = (v: unknown): boolean | null => (v === true ? true : v === false ? false : null)

export async function addParkFeatureReport(r: { parkId: number; parkName: string | null; city: string } & Record<'shade' | 'water' | 'fence', unknown>): Promise<boolean> {
  if (!parkFeaturesConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    await client.query(
      'insert into park_features (park_id, park_name, city, shade, water, fence) values ($1, $2, $3, $4, $5, $6)',
      [r.parkId, r.parkName, r.city, tri(r.shade), tri(r.water), tri(r.fence)],
    )
    return true
  } catch (e) {
    console.error('[park-features] add failed', e)
    return false
  } finally {
    try { await client.end() } catch {}
  }
}

/** ציבורי: לכל גינה בעיר, הדיווח המאושר האחרון לכל מאפיין. */
export async function approvedFeaturesForCity(city: string): Promise<Record<string, ParkFeatures>> {
  if (!parkFeaturesConfigured()) return {}
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const res = await client.query(
      "select park_id, shade, water, fence from park_features where city = $1 and status = 'approved' order by created_at asc",
      [city],
    )
    const out: Record<string, ParkFeatures> = {}
    for (const row of res.rows) {
      const cur = out[row.park_id] ?? { shade: null, water: null, fence: null }
      // דיווח מאוחר יותר גובר, אבל "לא יודע" (null) לא מוחק מידע קיים
      out[row.park_id] = {
        shade: row.shade ?? cur.shade,
        water: row.water ?? cur.water,
        fence: row.fence ?? cur.fence,
      }
    }
    return out
  } catch (e) {
    console.error('[park-features] list failed', e)
    return {}
  } finally {
    try { await client.end() } catch {}
  }
}

export async function listParkFeatureReports(status: 'pending' | 'approved' | 'rejected' = 'pending'): Promise<ParkFeatureReport[]> {
  if (!parkFeaturesConfigured()) return []
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const res = await client.query('select * from park_features where status = $1 order by created_at desc limit 300', [status])
    return res.rows
  } catch (e) {
    console.error('[park-features] admin list failed', e)
    return []
  } finally {
    try { await client.end() } catch {}
  }
}

export async function setParkFeatureStatus(id: number, status: 'approved' | 'rejected'): Promise<boolean> {
  if (!parkFeaturesConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    const res = await client.query('update park_features set status = $1 where id = $2', [status, id])
    return (res.rowCount ?? 0) > 0
  } catch (e) {
    console.error('[park-features] status failed', e)
    return false
  } finally {
    try { await client.end() } catch {}
  }
}
