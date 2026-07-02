import { NextResponse } from 'next/server'
import { adminConfigured, listParkReports, setParkReportStatus } from '@/lib/parkReports'
import { isAdminRequest } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/** אדמין: רשימת דיווחים (ברירת מחדל - ממתינים). מוגן בטוקן. */
export async function GET(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ configured: false }, { status: 200 })
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const status = url.searchParams.get('status') || undefined
  return NextResponse.json({ configured: true, reports: await listParkReports(status) })
}

/** אדמין: אישור / דחייה של דיווח. מוגן בטוקן. */
export async function PATCH(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ configured: false }, { status: 200 })
  if (!isAdminRequest(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const id = Number(body?.id)
  const status = body?.status
  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  return NextResponse.json({ ok: await setParkReportStatus(id, status) })
}
