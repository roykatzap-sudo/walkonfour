import { NextResponse } from 'next/server'
import { waitlistList } from '@/lib/waitlist'
import { adminTokenSet, checkAdminToken } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!adminTokenSet()) {
    return NextResponse.json({ ok: false, configured: false, error: 'admin_unconfigured' }, { status: 503 })
  }
  const token = req.headers.get('x-admin-token')
  if (!checkAdminToken(token)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  const rows = await waitlistList()
  return NextResponse.json({ ok: true, configured: true, count: rows.length, rows })
}
