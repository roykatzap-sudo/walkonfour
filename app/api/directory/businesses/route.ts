import { NextResponse } from 'next/server'
import { clientIp, rateLimited } from '@/lib/rateLimit'
import { hashIp } from '@/lib/community/db'
import { listLiveBusinesses, addBusiness, directoryConfigured } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** GET /api/directory/businesses?category=&city= */
export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category') || undefined
  const city = url.searchParams.get('city') || undefined

  const businesses = await listLiveBusinesses({ category, city })

  return NextResponse.json({
    ok: true,
    configured: directoryConfigured(),
    businesses: businesses ?? [],
  })
}

/** POST /api/directory/businesses - הגשת עסק חדש */
export async function POST(req: Request) {
  const ip = clientIp(req)

  if (rateLimited(`${ip}:dir-biz`, 3, 3_600_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  if (!directoryConfigured()) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))

  // ולידציה בסיסית - השדות קיימים
  const name = typeof body?.name === 'string' ? body.name : ''
  const category = typeof body?.category === 'string' ? body.category : ''
  const city = typeof body?.city === 'string' ? body.city : ''
  const pricing = typeof body?.pricing === 'string' ? body.pricing : ''
  const description = typeof body?.description === 'string' ? body.description : ''

  if (!name.trim() || !category.trim() || !city.trim() || !pricing.trim() || !description.trim()) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const result = await addBusiness(
    {
      name,
      category,
      city,
      pricing,
      description,
      area: typeof body?.area === 'string' ? body.area : undefined,
      phone: typeof body?.phone === 'string' ? body.phone : undefined,
      whatsapp: typeof body?.whatsapp === 'string' ? body.whatsapp : undefined,
      website: typeof body?.website === 'string' ? body.website : undefined,
    },
    hashIp(ip),
  )

  if (result === 'err') {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, slug: result.slug, pending: result.pending })
}
