import { NextResponse } from 'next/server'
import { cleanPage, looksLikeBot } from '@/lib/groupClicks'
import { addPostVisit, cleanTag } from '@/lib/postVisits'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** נקרא פעם אחת בכניסה לאתר מקישור מתויג (utm_source). לא שומר שום מזהה של המבקר. */
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:post-visit`, 12, 60_000)) return new NextResponse(null, { status: 204 })
  if (Number(req.headers.get('content-length') || 0) > 600) return new NextResponse(null, { status: 204 })
  if (looksLikeBot(req.headers.get('user-agent'))) return new NextResponse(null, { status: 204 })
  const raw = await req.text().catch(() => '')
  let body: { src?: unknown; campaign?: unknown; page?: unknown } = {}
  try { body = JSON.parse(raw) } catch {}
  const src = cleanTag(body.src)
  if (!src) return new NextResponse(null, { status: 204 })
  const stored = await addPostVisit(src, cleanTag(body.campaign) || null, cleanPage(body.page))
  // 204 = נשמר, 202 = התקבל אבל לא נשמר (מסד נתונים לא מוגדר או שגיאה).
  return new NextResponse(null, { status: stored ? 204 : 202 })
}
