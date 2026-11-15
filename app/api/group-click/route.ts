import { NextResponse } from 'next/server'
import { addGroupClick, cleanPage, cleanSrc, looksLikeBot } from '@/lib/groupClicks'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** נקרא ב-sendBeacon מכל קישור לקבוצת הפייסבוק. לא שומר שום מזהה של המבקר. */
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:group-click`, 12, 60_000)) return new NextResponse(null, { status: 204 })
  if (Number(req.headers.get('content-length') || 0) > 600) return new NextResponse(null, { status: 204 })
  if (looksLikeBot(req.headers.get('user-agent'))) return new NextResponse(null, { status: 204 })
  const raw = await req.text().catch(() => '')
  let body: { src?: unknown; page?: unknown } = {}
  try { body = JSON.parse(raw) } catch {}
  await addGroupClick(cleanSrc(body.src), cleanPage(body.page))
  return new NextResponse(null, { status: 204 })
}
