import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { deleteDog, getDog, updateDog, validateDogInput } from '@/lib/community/dogs'
import { deleteDogImage } from '@/lib/community/storage'
import { clientIp } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  const dog = await withCommunityDb((c) => getDog(c, session.userId, dogId))
  if (!dog) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true, dog })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  const body = await req.json().catch(() => ({}))
  const validation = validateDogInput(body)
  if (!validation.ok) return NextResponse.json({ ok: false, error: validation.field }, { status: 400 })
  const updated = await withCommunityDb(async (c) => {
    const d = await updateDog(c, session.userId, dogId, validation.data)
    if (d) await logAudit(c, session.userId, 'dog.updated', ip, { dog_id: dogId })
    return d
  })
  if (!updated) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  return NextResponse.json({ ok: true, dog: updated })
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  const result = await withCommunityDb(async (c) => {
    const d = await deleteDog(c, session.userId, dogId)
    if (d.ok) await logAudit(c, session.userId, 'dog.deleted', ip, { dog_id: dogId })
    return d
  })
  if (!result?.ok) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  // ניקוי התמונה מ-storage (לא חוסם את ה-response)
  if (result.photoUrl) void deleteDogImage(result.photoUrl)
  return NextResponse.json({ ok: true })
}
