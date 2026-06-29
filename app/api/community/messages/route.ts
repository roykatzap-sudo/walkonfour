import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { listMessages, postMessage, userHasPlanForPark, validateMessage } from '@/lib/community/messages'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET ?park_key=...&since=42 → הודעות צ'אט בגינה (חייב להיות לך תיאום פעיל) */
export async function GET(req: Request) {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const parkKey = url.searchParams.get('park_key')?.slice(0, 120)
  if (!parkKey) return NextResponse.json({ ok: false, error: 'park_key' }, { status: 400 })
  const sinceId = Number(url.searchParams.get('since') || 0) || undefined
  const result = await withCommunityDb(async (c) => {
    const allowed = await userHasPlanForPark(c, session.userId, parkKey)
    if (!allowed) return { error: 'no_plan' as const }
    return { messages: await listMessages(c, parkKey, session.userId, sinceId) }
  })
  if (result?.error === 'no_plan') {
    return NextResponse.json({ ok: false, error: 'no_plan', hint: 'דרוש תיאום פעיל לגינה' }, { status: 403 })
  }
  return NextResponse.json({ ok: true, messages: result?.messages || [] })
}

/** POST {park_key, body} → שליחת הודעה לצ'אט הגינה */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:msg-post`, 20, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  const body = await req.json().catch(() => ({}))
  const parkKey = typeof body?.park_key === 'string' ? body.park_key.trim().slice(0, 120) : ''
  if (!parkKey) return NextResponse.json({ ok: false, error: 'park_key' }, { status: 400 })
  const v = validateMessage(body?.body)
  if (!v.ok) return NextResponse.json({ ok: false, error: 'body' }, { status: 400 })
  const result = await withCommunityDb(async (c) => {
    const allowed = await userHasPlanForPark(c, session.userId, parkKey)
    if (!allowed) return { error: 'no_plan' as const }
    const msg = await postMessage(c, session.userId, parkKey, v.text)
    await logAudit(c, session.userId, 'message.sent', ip, { park_key: parkKey, msg_id: msg.id })
    return { message: msg }
  })
  if (result?.error === 'no_plan') {
    return NextResponse.json({ ok: false, error: 'no_plan' }, { status: 403 })
  }
  return NextResponse.json({ ok: true, message: result?.message })
}
