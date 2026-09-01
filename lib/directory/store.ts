/* ================================================================
   Store functions למדריך בעלי מקצוע.
   חתימות לפי types.ts (ה-contract). SQL parameterized בלבד.
   ================================================================ */

import { withDirectoryDb, directoryConfigured as _dirCfg } from './db'
import { LIMITS } from './types'
import type { DirectoryBusiness, DirectoryReview, NewBusinessInput, NewReviewInput } from './types'
import { BIZ_CATEGORIES } from '../businesses'

export { _dirCfg as directoryConfigured }

/* ────────── helpers ────────── */

/** יוצר slug מהשם: lowercase, עברית+לטינית+ספרות+מקף, ייחודי */
function toBaseSlug(name: string): string {
  let s = name
    .toLowerCase()
    .replace(/\s+/g, '-')        // רווחים -> מקף
    .replace(/-{2,}/g, '-')      // מקפים כפולים -> יחיד
    // שומר: עברית (u0590-u05FF), לטינית, ספרות, מקף
    .replace(/[^\u0590-\u05FF\w-]/g, '')
    .replace(/^-+|-+$/g, '')     // חיתוך מקפים בקצוות
  if (!s) s = 'biz'
  return s
}

function trimOpt(v: string | undefined | null, max: number): string | null {
  if (!v || typeof v !== 'string') return null
  const t = v.trim().slice(0, max)
  return t || null
}

/* ────────── public API ────────── */

export async function listLiveBusinesses(
  filters?: { category?: string; city?: string },
): Promise<DirectoryBusiness[] | null> {
  return withDirectoryDb(async (c) => {
    const params: string[] = []
    const wheres = [`b.status = 'live'`]

    if (filters?.category) {
      params.push(filters.category)
      wheres.push(`b.category = $${params.length}`)
    }
    if (filters?.city) {
      params.push(filters.city)
      wheres.push(`b.city = $${params.length}`)
    }

    const sql = `
      SELECT
        b.id, b.slug, b.name, b.category, b.city, b.area,
        b.phone, b.whatsapp, b.website, b.pricing, b.description,
        b.status, b.reports_count, b.created_at,
        ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
        COUNT(r.id)::int AS reviews_count
      FROM directory_businesses b
      LEFT JOIN directory_reviews r
        ON r.business_id = b.id AND r.status = 'live'
      WHERE ${wheres.join(' AND ')}
      GROUP BY b.id
      ORDER BY avg_rating DESC NULLS LAST, b.created_at DESC
    `
    const { rows } = await c.query(sql, params)
    return rows.map(rowToBusiness)
  })
}

export async function getBusinessBySlug(
  slug: string,
): Promise<{ business: DirectoryBusiness; reviews: DirectoryReview[] } | null> {
  return withDirectoryDb(async (c) => {
    // עסק חי בלבד
    const bizSql = `
      SELECT
        b.id, b.slug, b.name, b.category, b.city, b.area,
        b.phone, b.whatsapp, b.website, b.pricing, b.description,
        b.status, b.reports_count, b.created_at,
        ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
        COUNT(r.id)::int AS reviews_count
      FROM directory_businesses b
      LEFT JOIN directory_reviews r
        ON r.business_id = b.id AND r.status = 'live'
      WHERE b.slug = $1 AND b.status = 'live'
      GROUP BY b.id
    `
    const { rows: bizRows } = await c.query(bizSql, [slug])
    if (bizRows.length === 0) return null

    const business = rowToBusiness(bizRows[0])

    // ביקורות חיות
    const revSql = `
      SELECT id, business_id, rating, author_name, text, status, reports_count, created_at
      FROM directory_reviews
      WHERE business_id = $1 AND status = 'live'
      ORDER BY created_at DESC
    `
    const { rows: revRows } = await c.query(revSql, [business.id])
    const reviews: DirectoryReview[] = revRows.map(rowToReview)

    return { business, reviews }
  })
}

export async function addBusiness(
  input: NewBusinessInput,
  ipHash: string | null,
): Promise<{ slug: string } | 'err'> {
  const name = (input.name ?? '').trim().slice(0, LIMITS.name)
  const category = (input.category ?? '').trim()
  const city = (input.city ?? '').trim().slice(0, LIMITS.city)
  const pricing = (input.pricing ?? '').trim().slice(0, LIMITS.pricing)
  const description = (input.description ?? '').trim().slice(0, LIMITS.description)

  // ולידציות חובה
  if (!name || !city || !pricing || !description) return 'err'
  if (!(BIZ_CATEGORIES as readonly string[]).includes(category)) return 'err'

  const area = trimOpt(input.area, LIMITS.area)
  const phone = trimOpt(input.phone, LIMITS.phone)
  const whatsapp = trimOpt(input.whatsapp, LIMITS.phone)
  const website = trimOpt(input.website, LIMITS.website)

  // website חייב להתחיל ב-http:// או https:// אם ניתן
  if (website && !/^https?:\/\//.test(website)) return 'err'

  const baseSlug = toBaseSlug(name)

  const result = await withDirectoryDb(async (c) => {
    // מציאת slug ייחודי
    const { rows: existing } = await c.query(
      `SELECT slug FROM directory_businesses WHERE slug = $1 OR slug LIKE $2`,
      [baseSlug, `${baseSlug}-%`],
    )
    const taken = new Set(existing.map((r: { slug: string }) => r.slug))
    let slug = baseSlug
    if (taken.has(slug)) {
      let i = 2
      while (taken.has(`${baseSlug}-${i}`)) i++
      slug = `${baseSlug}-${i}`
    }

    await c.query(
      `INSERT INTO directory_businesses (slug, name, category, city, area, phone, whatsapp, website, pricing, description, ip_hash)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [slug, name, category, city, area, phone, whatsapp, website, pricing, description, ipHash],
    )
    return { slug }
  })

  return result ?? 'err'
}

export async function addReview(
  input: NewReviewInput,
  ipHash: string | null,
): Promise<'ok' | 'dup' | 'notfound' | 'err'> {
  const slug = (input.business_slug ?? '').trim()
  const rating = Number(input.rating)
  const authorName = (input.author_name ?? '').trim().slice(0, LIMITS.authorName)
  const text = trimOpt(input.text, LIMITS.reviewText)

  if (!slug || !authorName) return 'err'
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'err'

  const result = await withDirectoryDb(async (c) => {
    // מציאת העסק (חי בלבד)
    const { rows: bizRows } = await c.query(
      `SELECT id FROM directory_businesses WHERE slug = $1 AND status = 'live'`,
      [slug],
    )
    if (bizRows.length === 0) return 'notfound' as const

    const businessId = bizRows[0].id

    // בדיקת כפילות: אותו ip_hash + אותו עסק ב-24 שעות
    if (ipHash) {
      const { rows: dupRows } = await c.query(
        `SELECT id FROM directory_reviews
         WHERE business_id = $1 AND ip_hash = $2
           AND created_at > now() - interval '24 hours'`,
        [businessId, ipHash],
      )
      if (dupRows.length > 0) return 'dup' as const
    }

    await c.query(
      `INSERT INTO directory_reviews (business_id, rating, author_name, text, ip_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [businessId, rating, authorName, text, ipHash],
    )
    return 'ok' as const
  })

  return result ?? 'err'
}

export async function reportItem(
  type: 'business' | 'review',
  id: number,
): Promise<'ok' | 'err'> {
  const table = type === 'business' ? 'directory_businesses' : 'directory_reviews'

  const result = await withDirectoryDb(async (c) => {
    const { rowCount } = await c.query(
      `UPDATE ${table} SET reports_count = reports_count + 1 WHERE id = $1`,
      [id],
    )
    return (rowCount ?? 0) > 0 ? ('ok' as const) : ('err' as const)
  })

  return result ?? 'err'
}

/* ────────── admin helpers ────────── */

export async function adminListAll(): Promise<{
  businesses: DirectoryBusiness[]
  reviews: (DirectoryReview & { business_name: string })[]
} | null> {
  return withDirectoryDb(async (c) => {
    // עסקים כולל hidden, עם aggregates
    const bizSql = `
      SELECT
        b.id, b.slug, b.name, b.category, b.city, b.area,
        b.phone, b.whatsapp, b.website, b.pricing, b.description,
        b.status, b.reports_count, b.created_at,
        ROUND(AVG(r.rating)::numeric, 1) AS avg_rating,
        COUNT(r.id)::int AS reviews_count
      FROM directory_businesses b
      LEFT JOIN directory_reviews r
        ON r.business_id = b.id AND r.status = 'live'
      GROUP BY b.id
      ORDER BY b.reports_count DESC, b.created_at DESC
    `
    const { rows: bizRows } = await c.query(bizSql)

    // ביקורות כולל hidden, עם שם העסק
    const revSql = `
      SELECT
        r.id, r.business_id, r.rating, r.author_name, r.text,
        r.status, r.reports_count, r.created_at,
        b.name AS business_name
      FROM directory_reviews r
      JOIN directory_businesses b ON b.id = r.business_id
      ORDER BY r.reports_count DESC, r.created_at DESC
    `
    const { rows: revRows } = await c.query(revSql)

    return {
      businesses: bizRows.map(rowToBusiness),
      reviews: revRows.map((r) => ({ ...rowToReview(r), business_name: r.business_name })),
    }
  })
}

export async function moderate(
  type: 'business' | 'review',
  id: number,
  action: 'hide' | 'show' | 'delete',
): Promise<'ok' | 'err'> {
  const table = type === 'business' ? 'directory_businesses' : 'directory_reviews'

  const result = await withDirectoryDb(async (c) => {
    if (action === 'delete') {
      const { rowCount } = await c.query(`DELETE FROM ${table} WHERE id = $1`, [id])
      return (rowCount ?? 0) > 0 ? ('ok' as const) : ('err' as const)
    }

    const newStatus = action === 'hide' ? 'hidden' : 'live'
    const { rowCount } = await c.query(
      `UPDATE ${table} SET status = $1 WHERE id = $2`,
      [newStatus, id],
    )
    return (rowCount ?? 0) > 0 ? ('ok' as const) : ('err' as const)
  })

  return result ?? 'err'
}

/* ────────── row mappers ────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToBusiness(r: any): DirectoryBusiness {
  return {
    id: Number(r.id),
    slug: r.slug,
    name: r.name,
    category: r.category,
    city: r.city,
    area: r.area ?? null,
    phone: r.phone ?? null,
    whatsapp: r.whatsapp ?? null,
    website: r.website ?? null,
    pricing: r.pricing ?? null,
    description: r.description,
    status: r.status,
    reports_count: Number(r.reports_count),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    avg_rating: r.avg_rating != null ? Number(r.avg_rating) : null,
    reviews_count: Number(r.reviews_count ?? 0),
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(r: any): DirectoryReview {
  return {
    id: Number(r.id),
    business_id: Number(r.business_id),
    rating: Number(r.rating),
    author_name: r.author_name,
    text: r.text ?? null,
    status: r.status,
    reports_count: Number(r.reports_count),
    created_at: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  }
}
