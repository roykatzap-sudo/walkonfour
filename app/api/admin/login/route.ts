import { NextResponse } from 'next/server'
import { checkAdminCredentials } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}))
  if (!username || !password) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }
  if (!checkAdminCredentials(username, password)) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({ ok: true, token: process.env.ADMIN_TOKEN })
}
