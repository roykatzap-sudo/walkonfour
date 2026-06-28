/* ════════════════════════════════════════════════════════════
   הצעות משתמשים על משהו חסר במדריך עיר (גינה / מסלול / מקום
   דוג-פרנדלי / אחר). נשמר ב-Postgres על Railway (אותו DATABASE_URL
   של רשימת ההמתנה). הטבלה נוצרת אוטומטית בהצעה הראשונה.
   ניהול בפאנל /admin/suggestions (מוגן ב-ADMIN_TOKEN).
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { SUGGESTION_TYPES, type Suggestion } from './suggestionTypes'

// re-export הטיפוסים/קבועים כדי שאימפורטים קיימים מ-lib/suggestions ימשיכו לעבוד
export * from './suggestionTypes'

import { getDbUrl } from './dbUrl'

// מאתר את ה-DB בכל שם משתנה (Railway / Vercel-Neon / prefix מותאם)
const DB = getDbUrl()

export function suggestionsConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false } })
}

const CREATE_SQL = `
  create table if not exists suggestions (
    id bigint generated always as identity primary key,
    city text not null,
    type text not null,
    name text not null,
    details text,
    status text not null default 'pending',
    created_at timestamptz default now()
  )`

/** מוסיף הצעה. type חייב להיות אחד מ-SUGGESTION_TYPES (נאכף גם כאן). */
export async function addSuggestion(s: {
  city: string
  type: string
  name: string
  details: string | null
}): Promise<boolean> {
  if (!suggestionsConfigured()) return false
  const type = (SUGGESTION_TYPES as readonly string[]).includes(s.type) ? s.type : 'other'
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    await client.query(
      'insert into suggestions (city, type, name, details) values ($1, $2, $3, $4)',
      [s.city, type, s.name, s.details],
    )
    return true
  } catch {
    return false
  } finally {
    try { await client.end() } catch {}
  }
}

/** אדמין: רשימת הצעות. status/city אופציונליים - מסוננים בשאילתה פרמטרית. */
export async function listSuggestions(status?: string, city?: string): Promise<Suggestion[]> {
  if (!suggestionsConfigured()) return []
  const safeStatus = status && ['pending', 'approved', 'rejected'].includes(status) ? status : null
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const where: string[] = []
    const vals: string[] = []
    if (safeStatus) { vals.push(safeStatus); where.push(`status = $${vals.length}`) }
    if (city) { vals.push(city); where.push(`city = $${vals.length}`) }
    const sql = `select id, city, type, name, details, status, created_at from suggestions
                 ${where.length ? 'where ' + where.join(' and ') : ''}
                 order by created_at desc limit 1000`
    const res = await client.query(sql, vals)
    return res.rows as Suggestion[]
  } catch {
    return []
  } finally {
    try { await client.end() } catch {}
  }
}

/** אדמין: עדכון סטטוס הצעה. */
export async function setSuggestionStatus(
  id: number,
  status: 'approved' | 'rejected' | 'pending',
): Promise<boolean> {
  if (!suggestionsConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    const res = await client.query('update suggestions set status = $1 where id = $2', [status, id])
    return (res.rowCount ?? 0) > 0
  } catch {
    return false
  } finally {
    try { await client.end() } catch {}
  }
}
