import { NextResponse } from 'next/server'
import { COMMUNITY_COOKIE } from '@/lib/community/session'

export const dynamic = 'force-dynamic'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(COMMUNITY_COOKIE)
  res.cookies.delete(`${COMMUNITY_COOKIE}_pending`)
  return res
}
