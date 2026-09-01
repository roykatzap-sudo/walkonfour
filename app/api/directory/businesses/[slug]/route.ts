import { NextResponse } from 'next/server'
import { getBusinessBySlug } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** GET /api/directory/businesses/[slug] - עסק בודד + ביקורות חיות */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const data = await getBusinessBySlug(slug)

  if (!data) {
    return NextResponse.json(
      { ok: false, error: 'not_found' },
      { status: 404 },
    )
  }

  return NextResponse.json({
    ok: true,
    business: data.business,
    reviews: data.reviews,
  })
}
