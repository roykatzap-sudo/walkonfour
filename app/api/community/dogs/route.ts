import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { createDog, listUserDogs, validateDogInput } from '@/lib/community/dogs'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

/** GET - רשימת הכלבים של המשתמש המחובר */
export async function GET() {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const dogs = await withCommunityDb((c) => listUserDogs(c, session.userId))
  return NextResponse.json({ ok: true, dogs: dogs ?? [] })
}

/** POST - יצירת כלב חדש */
export async function POST(req: Request) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:dog-create`, 5, 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  if (Number(req.headers.get('content-length') || 0) > 2000) {
    return NextResponse.json({ ok: false, error: 'too_large' }, { status: 413 })
  }
  const body = await req.json().catch(() => ({}))
  const validation = validateDogInput(body)
  if (!validation.ok) return NextResponse.json({ ok: false, error: validation.field }, { status: 400 })
  const dog = await withCommunityDb(async (c) => {
    const d = await createDog(c, session.userId, validation.data)
    await logAudit(c, session.userId, 'dog.created', ip, { dog_id: d.id })
    return d
  })
  if (!dog) return NextResponse.json({ ok: false, error: 'db' }, { status: 503 })
  return NextResponse.json({ ok: true, dog })
}
