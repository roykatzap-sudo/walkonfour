/* ════════════════════════════════════════════════════════════
   שכבת DB משותפת לקהילה. משתמש באותו pg client כמו waitlist
   ובאותו getDbUrl() (Supabase pooler + sslmode=no-verify).
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'
import { getDbUrl } from '../dbUrl'
import { CREATE_SQLS } from './schema'

const DB = getDbUrl()

export function communityConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

export function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false } })
}

/** הריצו idempotent CREATE לכל הטבלאות. בטוח לקרוא מספר פעמים. */
export async function ensureCommunitySchema(client: Client): Promise<void> {
  for (const sql of CREATE_SQLS) {
    await client.query(sql)
  }
}

/** wrapper נוח: יוצר client, מבטיח schema, מריץ פונקציה, סוגר. */
export async function withCommunityDb<T>(fn: (c: Client) => Promise<T>): Promise<T | null> {
  if (!communityConfigured()) return null
  const client = makeClient()
  try {
    await client.connect()
    await ensureCommunitySchema(client)
    return await fn(client)
  } catch (e) {
    console.error('[community/db]', e)
    return null
  } finally {
    try { await client.end() } catch {}
  }
}

/** רישום audit_log. ip_hash הוא SHA-256 חתוך כדי לא לאחסן IP גולמי. */
import { createHash } from 'crypto'
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null
  return createHash('sha256').update(ip).digest('hex').slice(0, 32)
}

export async function logAudit(
  client: Client,
  userId: number | null,
  event: string,
  ip: string | null,
  details?: Record<string, unknown>,
): Promise<void> {
  try {
    await client.query(
      'insert into community_audit_log (user_id, event, ip_hash, details) values ($1, $2, $3, $4)',
      [userId, event, hashIp(ip), details ? JSON.stringify(details) : null],
    )
  } catch (e) {
    console.error('[audit]', e)
  }
}
