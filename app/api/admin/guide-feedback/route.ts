import { NextResponse } from 'next/server'
import { guideFeedbackSummary } from '@/lib/guideFeedback'
import { getGuide } from '@/lib/guides'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!adminTokenSet()) return NextResponse.json({ ok: false, error: 'admin_unconfigured' }, { status: 503 })
  if (!isAdminRequest(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const rows = (await guideFeedbackSummary()).map((r) => ({ ...r, title: getGuide(r.slug)?.title ?? r.slug }))
  return NextResponse.json({ ok: true, rows })
}
