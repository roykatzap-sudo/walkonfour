import { NextResponse } from 'next/server'
import { postVisitStats, postVisitsConfigured } from '@/lib/postVisits'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!adminTokenSet()) {
    return NextResponse.json({ ok: false, configured: false, error: 'admin_unconfigured' }, { status: 503 })
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const stats = await postVisitStats()
  return NextResponse.json({ ok: true, configured: postVisitsConfigured(), stats })
}
