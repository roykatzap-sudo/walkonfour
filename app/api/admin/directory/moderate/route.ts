import { NextResponse } from 'next/server'
import { adminTokenSet, isAdminRequest } from '@/lib/adminAuth'
import { moderate } from '@/lib/directory/store'

export const dynamic = 'force-dynamic'

/** POST /api/admin/directory/moderate - הסתרה/הצגה/מחיקה של עסק או ביקורת */
export async function POST(req: Request) {
  if (!adminTokenSet()) {
    return NextResponse.json({ ok: false, configured: false, error: 'admin_unconfigured' }, { status: 503 })
  }
  if (!isAdminRequest(req)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))

  const type = body?.type
  const id = Number(body?.id)
  const action = body?.action

  if (
    (type !== 'business' && type !== 'review') ||
    !Number.isInteger(id) || id <= 0 ||
    (action !== 'hide' && action !== 'show' && action !== 'delete')
  ) {
    return NextResponse.json({ ok: false, error: 'invalid' }, { status: 400 })
  }

  const result = await moderate(type, id, action)
  if (result === 'err') {
    return NextResponse.json({ ok: false, error: 'server' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
