/* ════════════════════════════════════════════════════════════
   "המדריך הזה עזר?" - כן / לא בסוף כל מדריך.
   נשמר רק: איזה מדריך, כן או לא, ומתי. בלי IP ובלי מזהה של המבקר.
   מטרה: לדעת אילו מדריכים שווה לשפר. מוצג בפאנל הניהול.
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { getDbUrl } from './dbUrl'

const DB = getDbUrl()

export function guideFeedbackConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 })
}

const CREATE_SQL = `
  create table if not exists guide_feedback (
    id bigint generated always as identity primary key,
    slug text not null,
    helpful boolean not null,
    created_at timestamptz default now()
  )`

export async function addGuideFeedback(slug: string, helpful: boolean): Promise<boolean> {
  if (!guideFeedbackConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    await client.query('insert into guide_feedback (slug, helpful) values ($1, $2)', [slug, helpful])
    return true
  } catch (e) {
    console.error('[guide-feedback] add failed', e)
    return false
  } finally {
    try { await client.end() } catch {}
  }
}

export type GuideFeedbackRow = { slug: string; yes: number; no: number }

export async function guideFeedbackSummary(): Promise<GuideFeedbackRow[]> {
  if (!guideFeedbackConfigured()) return []
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL)
    const res = await client.query(`
      select slug,
             count(*) filter (where helpful)::int as yes,
             count(*) filter (where not helpful)::int as no
      from guide_feedback group by slug order by count(*) desc limit 200`)
    return res.rows
  } catch (e) {
    console.error('[guide-feedback] summary failed', e)
    return []
  } finally {
    try { await client.end() } catch {}
  }
}
