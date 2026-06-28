import { NextResponse } from 'next/server'
import { adminConfigured, checkAdmin, listParkReports, setParkReportStatus } from '@/lib/parkReports'

export const dynamic = 'force-dynamic'

function token(req: Request): string | null {
  return req.headers.get('x-admin-token')
}

/** אדמין: רשימת דיווחים (ברירת מחדל - ממתינים). מוגן בטוקן. */
export async function GET(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ configured: false }, { status: 200 })
  if (!checkAdmin(token(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const url = new URL(req.url)
  const status = url.searchParams.get('status') || undefined
  return NextResponse.json({ configured: true, reports: await listParkReports(status) })
}

/** אדמין: אישור / דחייה של דיווח. מוגן בטוקן. */
export async function PATCH(req: Request) {
  if (!adminConfigured()) return NextResponse.json({ configured: false }, { status: 200 })
  if (!checkAdmin(token(req))) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const id = Number(body?.id)
  const status = body?.status
  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  return NextResponse.json({ ok: await setParkReportStatus(id, status) })
}
