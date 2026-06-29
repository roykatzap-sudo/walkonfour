/* ════════════════════════════════════════════════════════════
   דירוג גינות - כוכבים 1-5 + תגיות + ביקורת חופשית.
   - אנונימי בתצוגה (אין nickname)
   - user_id נשמר → אדמין/מודרציה רואים מי כתב מה
   - one rating per (user, park) - אפשר לעדכן
   ════════════════════════════════════════════════════════════ */

import type { Client } from 'pg'

export const RATING_TAGS = [
  'shade',        // 🌳 מוצלת
  'water',        // 💧 מים זמינים
  'fenced',       // 🏗️ מגודרת
  'benches',      // 🪑 ספסלים
  'large_dogs',   // 🐕‍🦺 מתאים לגדולים
  'small_dogs',   // 🐩 מתאים לקטנים
  'lit_at_night', // 🌃 מוארת בלילה
  'neglected',    // 🚨 הזנחה/מסוכן
] as const

export type RatingTag = (typeof RATING_TAGS)[number]

export const TAG_LABELS: Record<RatingTag, string> = {
  shade: '🌳 מוצלת',
  water: '💧 מים זמינים',
  fenced: '🏗️ מגודרת',
  benches: '🪑 ספסלים',
  large_dogs: '🐕‍🦺 מתאים לגדולים',
  small_dogs: '🐩 מתאים לקטנים',
  lit_at_night: '🌃 מוארת בלילה',
  neglected: '🚨 הזנחה/מסוכן',
}

export type RatingInput = {
  parkKey: string
  stars: number
  tags: string[]
  note: string | null
}

export type PublicRating = {
  id: number
  stars: number
  tags: string[]
  note: string | null
  created_at: string
  // אנונימי - אין nickname/user_id ב-public
}

export type ParkRatingSummary = {
  avg: number
  count: number
  tags: Record<string, number> // tag → count (לתצוגת תגיות פופולריות)
}

export function validateRating(input: unknown): { ok: true; data: RatingInput } | { ok: false; field: string } {
  const i = input as Record<string, unknown>
  const parkKey = typeof i?.park_key === 'string' ? i.park_key.trim().slice(0, 120) : ''
  if (!parkKey) return { ok: false, field: 'park_key' }
  const stars = Number(i?.stars)
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return { ok: false, field: 'stars' }
  const tagsRaw = Array.isArray(i?.tags) ? i.tags : []
  const tags = tagsRaw
    .filter((t): t is string => typeof t === 'string')
    .filter((t) => (RATING_TAGS as readonly string[]).includes(t))
    .slice(0, 8)
  const note = typeof i?.note === 'string' && i.note.trim()
    ? i.note.trim().slice(0, 300)
    : null
  return { ok: true, data: { parkKey, stars, tags, note } }
}

/** UPSERT: יוצר/מעדכן דירוג למשתמש לגינה. */
export async function upsertRating(client: Client, userId: number, input: RatingInput): Promise<void> {
  await client.query(
    `insert into park_ratings (user_id, park_key, stars, tags, note)
     values ($1, $2, $3, $4, $5)
     on conflict (user_id, park_key) do update set
       stars = excluded.stars,
       tags = excluded.tags,
       note = excluded.note,
       updated_at = now()`,
    [userId, input.parkKey, input.stars, input.tags, input.note],
  )
}

/** הדירוג של המשתמש הספציפי לגינה (אם קיים) - להציג בטופס. */
export async function getMyRating(client: Client, userId: number, parkKey: string): Promise<RatingInput | null> {
  const res = await client.query(
    'select stars, tags, note from park_ratings where user_id = $1 and park_key = $2 limit 1',
    [userId, parkKey],
  )
  if (!res.rows[0]) return null
  return {
    parkKey,
    stars: res.rows[0].stars,
    tags: res.rows[0].tags || [],
    note: res.rows[0].note,
  }
}

/** ביקורות אנונימיות לגינה (לתצוגה). */
export async function listParkRatings(client: Client, parkKey: string, limit = 20): Promise<PublicRating[]> {
  const res = await client.query(
    `select id, stars, tags, note, created_at
     from park_ratings
     where park_key = $1
     order by case when note is not null then 0 else 1 end, created_at desc
     limit $2`,
    [parkKey, limit],
  )
  return res.rows as PublicRating[]
}

/** סיכום: ממוצע + מספר דירוגים + ספירת תגיות. */
export async function getParkRatingSummary(client: Client, parkKey: string): Promise<ParkRatingSummary> {
  const stats = await client.query(
    'select coalesce(avg(stars),0)::float as avg, count(*)::int as count from park_ratings where park_key = $1',
    [parkKey],
  )
  const tagsRes = await client.query(
    `select tag, count(*)::int as n
     from park_ratings, unnest(tags) as tag
     where park_key = $1
     group by tag
     order by n desc`,
    [parkKey],
  )
  const tags: Record<string, number> = {}
  for (const row of tagsRes.rows) tags[row.tag] = row.n
  return {
    avg: Number(stats.rows[0]?.avg ?? 0),
    count: Number(stats.rows[0]?.count ?? 0),
    tags,
  }
}

/** סיכומים בכמות (לכל ה-park_keys שביקשנו) - אופטימיזציה למפה. */
export async function batchParkSummaries(client: Client, parkKeys: string[]): Promise<Record<string, { avg: number; count: number }>> {
  if (!parkKeys.length) return {}
  const res = await client.query(
    `select park_key, avg(stars)::float as avg, count(*)::int as count
     from park_ratings
     where park_key = any($1::text[])
     group by park_key`,
    [parkKeys],
  )
  const out: Record<string, { avg: number; count: number }> = {}
  for (const row of res.rows) {
    out[row.park_key] = { avg: Number(row.avg), count: Number(row.count) }
  }
  return out
}
