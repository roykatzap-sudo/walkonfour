import { NextResponse } from 'next/server'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'
import { adminListAll } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** GET /api/admin/directory - כל העסקים והביקורות (כולל hidden) */
export async function GET(req: Request) {
  if (!adminTokenSet()) {
    return NextResponse.json({ ok: false, configured: false, error: 'admin_unconfigured' }, { status: 503 })
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const data = await adminListAll()
  if (!data) {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    businesses: data.businesses,
    reviews: data.reviews,
  })
}
