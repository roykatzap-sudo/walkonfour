import { NextResponse } from 'next/server'
import { listParkFeatureReports, parkFeaturesConfigured, setParkFeatureStatus } from '@/lib/parkFeatures'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

function guard(req: Request): NextResponse | null {
  if (!adminTokenSet()) return NextResponse.json({ ok: false, configured: false, error: 'admin_unconfigured' }, { status: 503 })
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  return null
}

export async function GET(req: Request) {
  const bad = guard(req)
  if (bad) return bad
  const rows = await listParkFeatureReports('pending')
  return NextResponse.json({ ok: true, configured: parkFeaturesConfigured(), rows })
}

export async function POST(req: Request) {
  const bad = guard(req)
  if (bad) return bad
  const body = await req.json().catch(() => ({}))
  const id = Number(body?.id)
  const status = body?.status
  if (!Number.isSafeInteger(id) || (status !== 'approved' && status !== 'rejected')) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  const ok = await setParkFeatureStatus(id, status)
  return NextResponse.json({ ok })
}
