import { NextResponse } from 'next/server'
import { addParkFeatureReport, approvedFeaturesForCity, parkFeaturesConfigured } from '@/lib/parkFeatures'
import { communities } from '@/lib/communities'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

const isCity = (slug: unknown): slug is string => typeof slug === 'string' && communities.some((c) => c.slug === slug)

/** ציבורי: המאפיינים המאושרים של גינות העיר. */
export async function GET(req: Request) {
  const city = new URL(req.url).searchParams.get('city')
  if (!isCity(city)) return NextResponse.json({ ok: false, error: 'city' }, { status: 400 })
  const features = await approvedFeaturesForCity(city)
  return NextResponse.json({ ok: true, features }, { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } })
}

/** ציבורי: דיווח על מה שיש בגינה. נשמר כ-pending עד אישור. */
export async function POST(req: Request) {
  if (rateLimited(`${clientIp(req)}:park-features`, 8, 60_000)) return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  if (Number(req.headers.get('content-length') || 0) > 1000) return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  if (!parkFeaturesConfigured()) return NextResponse.json({ ok: false, configured: false })
  const body = await req.json().catch(() => ({}))
  const parkId = Number(body?.parkId)
  if (!Number.isSafeInteger(parkId) || parkId <= 0 || !isCity(body?.city)) return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  const answered = ['shade', 'water', 'fence'].some((k) => body?.[k] === true || body?.[k] === false)
  if (!answered) return NextResponse.json({ ok: false, error: 'empty' }, { status: 400 })
  const parkName = typeof body?.parkName === 'string' ? body.parkName.trim().slice(0, 120) : null
  const ok = await addParkFeatureReport({ parkId, parkName, city: body.city, shade: body.shade, water: body.water, fence: body.fence })
  return NextResponse.json({ ok })
}
