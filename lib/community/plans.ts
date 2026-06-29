/* ════════════════════════════════════════════════════════════
   תיאומי הגעה לגינות - אנטי-stalking model.

   ★ עקרון בטיחות עיקרי (מתוך הסקירה המשפטית 2026-06-29):
   שמות החברים נחשפים זה לזה רק 15 דקות לפני שעת ההגעה המתוכננת.
   לפני זה - אנונימי לחלוטין: רואים רק "N אנשים תיאמו ל-X" עם
   מאפיינים של הכלבים (גזע/גודל/מזג).

   ★ TTL: תיאום נמחק 30 דק׳ אחרי שעת ההגעה (PLAN_GRACE_MIN).
   ★ Horizon: אי אפשר לתאם יותר מ-24 שעות קדימה (PLAN_HORIZON_HOURS).
   ★ Self-only mode: בלי geolocation, בלי tracking, רק כוונה.
   ════════════════════════════════════════════════════════════ */

import type { Client } from 'pg'
import { PLAN_GRACE_MIN, PLAN_HORIZON_HOURS } from './schema'

export const REVEAL_MIN_BEFORE = 15 // דקות לפני שעת ההגעה - אז השמות נחשפים

export type PlanInput = {
  parkKey: string
  dogId: number
  arrivalAt: Date
}

export type PlanRow = {
  id: number
  user_id: number
  dog_id: number
  park_key: string
  arrival_at: string
  expires_at: string
  cancelled_at: string | null
  created_at: string
}

/** התיאום שלך - מציג מלא */
export type MyPlan = PlanRow & {
  dog: { id: number; name: string; breed: string | null; age_years: number | null; temperament: string | null }
}

/** תיאום של אחר - אנונימי עד 15 דק׳ לפני, אז nickname וכלב מוצגים */
export type OtherPlan = {
  id: number
  arrival_at: string
  // לפני חשיפה: anonymized
  anonymized: boolean
  // מאפייני כלב (גלויים תמיד - לא מזהים אדם)
  dog: { breed: string | null; age_years: number | null; temperament: string | null }
  // נחשפים רק כשמתקרבת השעה
  nickname?: string
  dog_name?: string
}

export function validatePlanInput(input: unknown): { ok: true; data: PlanInput } | { ok: false; field: string } {
  const i = input as Record<string, unknown>
  const parkKey = typeof i?.park_key === 'string' ? i.park_key.trim().slice(0, 120) : ''
  if (!parkKey) return { ok: false, field: 'park_key' }
  const dogId = Number(i?.dog_id)
  if (!Number.isInteger(dogId) || dogId <= 0) return { ok: false, field: 'dog_id' }
  const arrivalRaw = i?.arrival_at
  if (typeof arrivalRaw !== 'string') return { ok: false, field: 'arrival_at' }
  const arrivalAt = new Date(arrivalRaw)
  if (Number.isNaN(arrivalAt.getTime())) return { ok: false, field: 'arrival_at' }
  const now = Date.now()
  // אסור לתאם בעבר (עם 5 דק׳ גרייס) או יותר מ-24 שעות קדימה
  if (arrivalAt.getTime() < now - 5 * 60_000) return { ok: false, field: 'arrival_past' }
  if (arrivalAt.getTime() > now + PLAN_HORIZON_HOURS * 60 * 60_000) return { ok: false, field: 'arrival_too_far' }
  return { ok: true, data: { parkKey, dogId, arrivalAt } }
}

export async function createPlan(client: Client, userId: number, input: PlanInput): Promise<PlanRow | null> {
  // לוודא שהכלב באמת שייך למשתמש
  const dog = await client.query('select id from dogs where id = $1 and user_id = $2 limit 1', [input.dogId, userId])
  if (!dog.rows[0]) return null
  const expiresAt = new Date(input.arrivalAt.getTime() + PLAN_GRACE_MIN * 60_000)
  const res = await client.query(
    `insert into park_plans (user_id, dog_id, park_key, arrival_at, expires_at)
     values ($1, $2, $3, $4, $5)
     returning id, user_id, dog_id, park_key, arrival_at, expires_at, cancelled_at, created_at`,
    [userId, input.dogId, input.parkKey, input.arrivalAt, expiresAt],
  )
  return res.rows[0] as PlanRow
}

/** מבטל תיאום (soft cancel - cancelled_at). */
export async function cancelPlan(client: Client, userId: number, planId: number): Promise<boolean> {
  const res = await client.query(
    'update park_plans set cancelled_at = now() where id = $1 and user_id = $2 and cancelled_at is null',
    [planId, userId],
  )
  return (res.rowCount ?? 0) > 0
}

/** התיאומים שלי לכל הגינות - לעמוד "התיאומים שלי". */
export async function listMyPlans(client: Client, userId: number): Promise<MyPlan[]> {
  const res = await client.query(
    `select p.id, p.user_id, p.dog_id, p.park_key, p.arrival_at, p.expires_at, p.cancelled_at, p.created_at,
            d.name as dog_name, d.breed as dog_breed, d.age_years as dog_age, d.temperament as dog_temperament
     from park_plans p
     join dogs d on d.id = p.dog_id
     where p.user_id = $1
       and p.cancelled_at is null
       and p.expires_at > now()
     order by p.arrival_at asc
     limit 50`,
    [userId],
  )
  return res.rows.map((r) => ({
    id: r.id, user_id: r.user_id, dog_id: r.dog_id, park_key: r.park_key,
    arrival_at: r.arrival_at, expires_at: r.expires_at, cancelled_at: r.cancelled_at, created_at: r.created_at,
    dog: { id: r.dog_id, name: r.dog_name, breed: r.dog_breed, age_years: r.dog_age, temperament: r.dog_temperament },
  }))
}

/** תיאומים של אחרים בגינה מסוימת.
 *  ★ אנטי-stalking: שמות נחשפים רק כש arrival_at קרוב פחות מ-15 דקות. */
export async function listParkPlans(client: Client, parkKey: string, viewerUserId: number): Promise<OtherPlan[]> {
  const res = await client.query(
    `select p.id, p.user_id, p.arrival_at,
            u.nickname as user_nickname,
            d.name as dog_name, d.breed as dog_breed, d.age_years as dog_age, d.temperament as dog_temperament
     from park_plans p
     join community_users u on u.id = p.user_id
     join dogs d on d.id = p.dog_id
     where p.park_key = $1
       and p.cancelled_at is null
       and p.expires_at > now()
       and p.arrival_at > now() - interval '5 minutes'
       and p.user_id not in (select blocked_id from user_blocks where blocker_id = $2)
       and p.user_id not in (select blocker_id from user_blocks where blocked_id = $2)
     order by p.arrival_at asc
     limit 50`,
    [parkKey, viewerUserId],
  )
  const nowMs = Date.now()
  return res.rows.map((r) => {
    const arrMs = new Date(r.arrival_at).getTime()
    const minutesUntil = (arrMs - nowMs) / 60_000
    const isOwn = r.user_id === viewerUserId
    // השם נחשף אם: זה התיאום שלי / נשארו פחות מ-15 דקות
    const reveal = isOwn || minutesUntil <= REVEAL_MIN_BEFORE
    return {
      id: r.id,
      arrival_at: r.arrival_at,
      anonymized: !reveal,
      dog: { breed: r.dog_breed, age_years: r.dog_age, temperament: r.dog_temperament },
      ...(reveal ? { nickname: r.user_nickname, dog_name: r.dog_name } : {}),
    }
  })
}

/** סופר התיאומים הפעילים בגינה - לתצוגה במפה / בכרטיס הגינה. */
export async function countParkPlans(client: Client, parkKey: string): Promise<number> {
  const res = await client.query(
    `select count(*)::int as n from park_plans
     where park_key = $1 and cancelled_at is null and expires_at > now() and arrival_at > now() - interval '5 minutes'`,
    [parkKey],
  )
  return Number(res.rows[0]?.n ?? 0)
}
