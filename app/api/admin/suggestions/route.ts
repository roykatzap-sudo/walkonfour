import { NextResponse } from 'next/server'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'
import { listSuggestions, setSuggestionStatus, suggestionsConfigured } from '@/lib/suggestions'

export const dynamic = 'force-dynamic'

/** אדמין: רשימת הצעות (כל הסטטוסים או לפי status/city). מוגן בטוקן. */
export async function GET(req: Request) {
  if (!suggestionsConfigured() || !adminTokenSet()) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const url = new URL(req.url)
  const status = url.searchParams.get('status') || undefined
  const city = url.searchParams.get('city') || undefined
  return NextResponse.json({ configured: true, suggestions: await listSuggestions(status, city) })
}

/** אדמין: אישור / דחייה של הצעה. מוגן בטוקן. */
export async function PATCH(req: Request) {
  if (!suggestionsConfigured() || !adminTokenSet()) {
    return NextResponse.json({ configured: false }, { status: 200 })
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const body = await req.json().catch(() => ({}))
  const id = Number(body?.id)
  const status = body?.status
  if (!id || !['approved', 'rejected', 'pending'].includes(status)) {
    return NextResponse.json({ ok: false, error: 'input' }, { status: 400 })
  }
  return NextResponse.json({ ok: await setSuggestionStatus(id, status) })
}
