/* ════════════════════════════════════════════════════════════
   אחסון תמונות כלבים ב-Supabase Storage.
   - bucket: dog-photos (public read, רק שרת כותב/מוחק)
   - שם קובץ: {user_id}/{dog_id}-{uuid}.jpg (ownership + כתובת לא נחיזה)
   - עיבוד: sharp resize 1024px + JPEG q=80 + EXIF strip חובה
   - גודל מקסימלי לכניסה: 8MB. אחרי resize רוב התמונות = ~120-180KB
   ════════════════════════════════════════════════════════════ */

import sharp from 'sharp'
import { randomUUID } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const BUCKET = 'dog-photos'

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024 // 8MB
export const MAX_DIM = 1024
export const ACCEPTED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']

export function storageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY)
}

function client() {
  return createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } })
}

/** מעבד תמונה גולמית (Buffer) → JPEG מוקטן, EXIF מוסר.
 *  זורק אם הקובץ לא תמונה תקפה / קטן מדי. */
export async function processDogImage(input: Buffer): Promise<Buffer> {
  // .rotate() מיישר לפי EXIF orientation לפני שמסירים את ה-EXIF (אחרת תמונה הפוכה)
  // .jpeg() ללא withMetadata = EXIF / GPS / מזהים אחרים מוסרים
  const img = sharp(input, { failOn: 'error' }).rotate()
  const meta = await img.metadata()
  if (!meta.width || !meta.height || meta.width < 80 || meta.height < 80) {
    throw new Error('image_too_small')
  }
  return await img
    .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer()
}

/** העלאת תמונה אחרי עיבוד. מחזיר URL פומבי. */
export async function uploadDogImage(userId: number, dogId: number, processed: Buffer): Promise<string | null> {
  if (!storageConfigured()) return null
  // סיומת אקראית (UUID) - מונע ניחוש/enumeration של כתובות תמונות ב-bucket הציבורי
  const path = `${userId}/${dogId}-${randomUUID()}.jpg`
  const supa = client()
  const { error } = await supa.storage.from(BUCKET).upload(path, processed, {
    contentType: 'image/jpeg',
    cacheControl: '3600',
    upsert: false,
  })
  if (error) {
    console.error('[storage] upload failed', error)
    return null
  }
  const { data } = supa.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** מחיקת תמונה לפי URL פומבי (לפני העלאת חדשה / מחיקת כלב). */
export async function deleteDogImage(publicUrl: string | null): Promise<void> {
  if (!storageConfigured() || !publicUrl) return
  // מחלץ את ה-path מתוך ה-URL הפומבי
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return
  const path = publicUrl.slice(idx + marker.length)
  try {
    await client().storage.from(BUCKET).remove([path])
  } catch (e) {
    console.error('[storage] delete failed', e)
  }
}

/** וידוא קיום ה-bucket (idempotent - יוצר אם חסר). */
export async function ensureBucket(): Promise<boolean> {
  if (!storageConfigured()) return false
  try {
    const supa = client()
    const { data: buckets } = await supa.storage.listBuckets()
    if (buckets?.some((b) => b.name === BUCKET)) return true
    const { error } = await supa.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_UPLOAD_BYTES,
      allowedMimeTypes: ['image/jpeg'],
    })
    if (error) {
      console.error('[storage] createBucket failed', error)
      return false
    }
    return true
  } catch (e) {
    console.error('[storage] ensureBucket failed', e)
    return false
  }
}
