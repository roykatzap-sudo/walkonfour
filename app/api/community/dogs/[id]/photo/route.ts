import { NextResponse } from 'next/server'
import { withCommunityDb, logAudit } from '@/lib/community/db'
import { readCurrentSession } from '@/lib/community/auth'
import { getDog } from '@/lib/community/dogs'
import { processDogImage, uploadDogImage, deleteDogImage, ensureBucket, ACCEPTED_MIMES, MAX_UPLOAD_BYTES } from '@/lib/community/storage'
import { clientIp, rateLimited } from '@/lib/rateLimit'

export const dynamic = 'force-dynamic'
// תמונות גדולות → הקצאת זיכרון/זמן גדולה יותר
export const runtime = 'nodejs'
export const maxDuration = 30

/** POST /api/community/dogs/[id]/photo  multipart/form-data  field: "photo"
 *  מעלה תמונה לכלב. EXIF מוסר, resize ל-1024px, JPEG q=80. */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  if (rateLimited(`${session.userId}:dog-photo`, 8, 5 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'rate' }, { status: 429 })
  }
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })

  // ודא בעלות
  const dog = await withCommunityDb((c) => getDog(c, session.userId, dogId))
  if (!dog) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })

  // קלט multipart
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_form' }, { status: 400 })
  }
  const file = form.get('photo')
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: 'no_file' }, { status: 400 })
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ ok: false, error: 'too_large', max_mb: 8 }, { status: 413 })
  if (file.type && !ACCEPTED_MIMES.includes(file.type)) {
    return NextResponse.json({ ok: false, error: 'bad_type', accepted: ACCEPTED_MIMES }, { status: 415 })
  }

  await ensureBucket()
  const buf = Buffer.from(await file.arrayBuffer())

  // עיבוד: EXIF strip + resize + JPEG
  let processed: Buffer
  try {
    processed = await processDogImage(buf)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'process_failed'
    return NextResponse.json({ ok: false, error: msg }, { status: 400 })
  }

  // העלאה
  const url = await uploadDogImage(session.userId, dogId, processed)
  if (!url) return NextResponse.json({ ok: false, error: 'upload_failed' }, { status: 503 })

  // עדכון DB + מחיקת תמונה קודמת (אם הייתה)
  const oldUrl = dog.photo_url
  const updated = await withCommunityDb(async (c) => {
    const res = await c.query(
      'update dogs set photo_url = $1, updated_at = now() where id = $2 and user_id = $3 returning photo_url',
      [url, dogId, session.userId],
    )
    if (res.rowCount) await logAudit(c, session.userId, 'dog.photo_uploaded', ip, { dog_id: dogId })
    return res.rows[0]
  })
  if (oldUrl && oldUrl !== url) await deleteDogImage(oldUrl)
  return NextResponse.json({ ok: true, photo_url: updated?.photo_url || url })
}

/** DELETE - מסיר את התמונה (לא מוחק את הכלב) */
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const ip = clientIp(req)
  const session = readCurrentSession()
  if (!session) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) return NextResponse.json({ ok: false, error: 'id' }, { status: 400 })
  const dog = await withCommunityDb((c) => getDog(c, session.userId, dogId))
  if (!dog) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 })
  if (dog.photo_url) await deleteDogImage(dog.photo_url)
  await withCommunityDb(async (c) => {
    await c.query('update dogs set photo_url = null, updated_at = now() where id = $1 and user_id = $2', [dogId, session.userId])
    await logAudit(c, session.userId, 'dog.photo_removed', ip, { dog_id: dogId })
  })
  return NextResponse.json({ ok: true })
}
