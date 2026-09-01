// חוזה משותף למדריך בעלי המקצוע (business directory).
// קובץ זה הוא ה-source of truth לצורות הנתונים בין ה-API, ה-DB וה-UI.
// אין לשנות שמות שדות בלי לעדכן את כל הצרכנים.

export type DirectoryStatus = 'live' | 'hidden'

export type DirectoryBusiness = {
  id: number
  slug: string
  name: string
  /** מפתח קטגוריה מתוך BIZ_CATEGORIES ב-lib/businesses.ts */
  category: string
  city: string
  area: string | null
  phone: string | null
  whatsapp: string | null
  website: string | null
  /** מחירון חופשי בטקסט, למשל "ביקור שגרתי 250 ש"ח, חיסון 120 ש"ח" */
  pricing: string | null
  description: string
  status: DirectoryStatus
  reports_count: number
  created_at: string
  /** ממוצע דירוגים חיים, null אם אין ביקורות */
  avg_rating: number | null
  reviews_count: number
}

export type DirectoryReview = {
  id: number
  business_id: number
  rating: number // 1-5
  author_name: string
  text: string | null
  status: DirectoryStatus
  reports_count: number
  created_at: string
}

export type NewBusinessInput = {
  name: string
  category: string
  city: string
  area?: string
  phone?: string
  whatsapp?: string
  website?: string
  /** חובה בהוספה חדשה - קריטי למשתמשים */
  pricing: string
  description: string
}

export type NewReviewInput = {
  business_slug: string
  rating: number
  author_name: string
  text?: string
}

// גבולות ולידציה משותפים (שרת = אוכף, קליינט = מציג)
export const LIMITS = {
  name: 80,
  city: 40,
  area: 60,
  phone: 20,
  website: 200,
  pricing: 200,
  description: 600,
  reviewText: 500,
  authorName: 40,
} as const

/*
API contract:

GET  /api/directory/businesses?category=&city=
  -> { ok: true, configured: boolean, businesses: DirectoryBusiness[] }
     (רק status='live', ממוין: avg_rating יורד nulls-last, ואז created_at יורד)

POST /api/directory/businesses   body: NewBusinessInput
  -> { ok: true, slug: string } | { ok: false, error: 'rate'|'invalid'|'server'|'too_large' }
     rate limit: 3 לשעה לפי IP. slug נגזר מהשם (עברית מותרת), ייחודיות עם סיומת -2, -3...

GET  /api/directory/businesses/[slug]
  -> { ok: true, business: DirectoryBusiness, reviews: DirectoryReview[] } | 404

POST /api/directory/reviews      body: NewReviewInput
  -> { ok: true } | { ok: false, error: 'rate'|'invalid'|'dup'|'server' }
     חסימה: ביקורת אחת לעסק לאותו ip_hash ב-24 שעות ('dup') + rateLimited כללי 5/דקה

POST /api/directory/report       body: { type: 'business'|'review', id: number }
  -> { ok: true } | { ok: false, error: 'rate'|'invalid'|'server' }
     מעלה reports_count ב-1. rate limit 5/דקה לפי IP.

GET  /api/admin/directory        (מוגן isAdminRequest)
  -> { ok: true, businesses: DirectoryBusiness[], reviews: (DirectoryReview & { business_name: string })[] }
     כולל hidden, ממוין לפי reports_count יורד.

POST /api/admin/directory/moderate  (מוגן isAdminRequest)
  body: { type: 'business'|'review', id: number, action: 'hide'|'show'|'delete' }
  -> { ok: true } | { ok: false, error: string }

Server-side store (lib/directory/store.ts) חייב לייצא:
  listLiveBusinesses(filters?: { category?: string; city?: string }): Promise<DirectoryBusiness[] | null>
  getBusinessBySlug(slug: string): Promise<{ business: DirectoryBusiness; reviews: DirectoryReview[] } | null>
  addBusiness(input: NewBusinessInput, ipHash: string | null): Promise<{ slug: string } | 'err'>
  addReview(input: NewReviewInput, ipHash: string | null): Promise<'ok' | 'dup' | 'notfound' | 'err'>
  reportItem(type: 'business' | 'review', id: number): Promise<'ok' | 'err'>
  directoryConfigured(): boolean
(null מוחזר כשה-DB לא מוגדר, כמו withCommunityDb)
*/
