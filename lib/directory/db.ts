/* ================================================================
   שכבת DB למדריך בעלי מקצוע. מבנה זהה ל-community/db.ts:
   per-request client, idempotent schema, withDirectoryDb wrapper.
   ================================================================ */

import { Client } from 'pg'
import { getDbUrl } from '../dbUrl'

const DB = getDbUrl()

export function directoryConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false } })
}

/** סכמת טבלאות (idempotent) */
const CREATE_SQLS = [
  `CREATE TABLE IF NOT EXISTS directory_businesses (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    city TEXT NOT NULL,
    area TEXT,
    phone TEXT,
    whatsapp TEXT,
    website TEXT,
    pricing TEXT,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'live',
    flag_reason TEXT,
    reports_count INT NOT NULL DEFAULT 0,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS directory_reviews (
    id BIGSERIAL PRIMARY KEY,
    business_id BIGINT NOT NULL REFERENCES directory_businesses(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    author_name TEXT NOT NULL,
    text TEXT,
    status TEXT NOT NULL DEFAULT 'live',
    flag_reason TEXT,
    reports_count INT NOT NULL DEFAULT 0,
    ip_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  // מיגרציה לטבלאות שכבר קיימות בפרודקשן (idempotent)
  `ALTER TABLE directory_businesses ADD COLUMN IF NOT EXISTS pricing TEXT`,
  `ALTER TABLE directory_businesses ADD COLUMN IF NOT EXISTS flag_reason TEXT`,
  `ALTER TABLE directory_reviews ADD COLUMN IF NOT EXISTS flag_reason TEXT`,
  `CREATE INDEX IF NOT EXISTS idx_dir_reviews_biz ON directory_reviews(business_id)`,
  `CREATE INDEX IF NOT EXISTS idx_dir_biz_status ON directory_businesses(status)`,
]

async function ensureSchema(client: Client): Promise<void> {
  for (const sql of CREATE_SQLS) {
    await client.query(sql)
  }
}

/** wrapper: יוצר client, מבטיח schema, מריץ fn, סוגר. null כש-DB לא מוגדר. */
export async function withDirectoryDb<T>(fn: (c: Client) => Promise<T>): Promise<T | null> {
  if (!directoryConfigured()) return null
  const client = makeClient()
  try {
    await client.connect()
    await ensureSchema(client)
    return await fn(client)
  } catch (e) {
    console.error('[directory/db]', e)
    return null
  } finally {
    try { await client.end() } catch { /* ignore */ }
  }
}
