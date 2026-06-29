/* ════════════════════════════════════════════════════════════
   צ'אט פר-גינה - הודעות 24 שעות בלבד, מחיקה קשיחה.

   ★ עקרון בטיחות: צ'אט גלוי רק למי שתיאם הגעה לאותה הגינה
   ב-24 השעות האחרונות. לא לכולם.
   ★ הגנת תוכן: עד 500 תווים, נקוי basic XSS, rate-limit.
   ★ retention: messages > 24h נמחקות אוטומטית ע"י cron (DELETE קשיח).
   ════════════════════════════════════════════════════════════ */

import type { Client } from 'pg'
import { CHAT_TTL_HOURS } from './schema'

export type ChatMessage = {
  id: number
  user_id: number
  park_key: string
  body: string
  created_at: string
  nickname: string
}

export const MESSAGE_MAX_LEN = 500

export function validateMessage(body: unknown): { ok: true; text: string } | { ok: false } {
  if (typeof body !== 'string') return { ok: false }
  const trimmed = body.trim()
  if (!trimmed || trimmed.length > MESSAGE_MAX_LEN) return { ok: false }
  return { ok: true, text: trimmed }
}

/** האם למשתמש יש תיאום פעיל בגינה הזו (ב-24 השעות האחרונות)?
 *  זה תנאי הכניסה לצ'אט. */
export async function userHasPlanForPark(client: Client, userId: number, parkKey: string): Promise<boolean> {
  const res = await client.query(
    `select 1 from park_plans
     where user_id = $1 and park_key = $2 and cancelled_at is null
       and arrival_at >= now() - interval '24 hours'
       and expires_at > now() - interval '24 hours'
     limit 1`,
    [userId, parkKey],
  )
  return (res.rowCount ?? 0) > 0
}

/** רשימת הודעות בגינה - 24 שעות אחרונות. מסנן הודעות מ/אל משתמשים חסומים. */
export async function listMessages(client: Client, parkKey: string, viewerUserId: number, sinceId?: number): Promise<ChatMessage[]> {
  const params: unknown[] = [parkKey, viewerUserId]
  let whereSince = ''
  if (sinceId && Number.isInteger(sinceId)) {
    params.push(sinceId)
    whereSince = ` and m.id > $${params.length}`
  }
  const res = await client.query(
    `select m.id, m.user_id, m.park_key, m.body, m.created_at, u.nickname
     from park_messages m
     join community_users u on u.id = m.user_id
     where m.park_key = $1
       and m.created_at > now() - interval '${CHAT_TTL_HOURS} hours'
       and m.user_id not in (select blocked_id from user_blocks where blocker_id = $2)
       and m.user_id not in (select blocker_id from user_blocks where blocked_id = $2)
       ${whereSince}
     order by m.created_at asc
     limit 200`,
    params,
  )
  return res.rows as ChatMessage[]
}

export async function postMessage(client: Client, userId: number, parkKey: string, text: string): Promise<ChatMessage> {
  const res = await client.query(
    `insert into park_messages (user_id, park_key, body)
     values ($1, $2, $3)
     returning id, user_id, park_key, body, created_at`,
    [userId, parkKey, text],
  )
  const msg = res.rows[0]
  const nick = await client.query('select nickname from community_users where id = $1', [userId])
  return { ...msg, nickname: nick.rows[0]?.nickname || 'משתמש' }
}
