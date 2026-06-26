import type { Metadata } from 'next'

/**
 * עוזרי SEO מרכזיים לכלבניה.
 *
 * אזור ה-SEO מספק כאן helpers וקבועים מרכזיים - עמודים קיימים
 * (וכאלה שייווצרו בעתיד) מייבאים אותם כדי לא לשכפל לוגיקה.
 * ה-layout הראשי כבר צורך מכאן את הקבועים (SITE_URL/SITE_NAME וכו')
 * ומגדיר metadataBase; buildMetadata זמין לאימוץ הדרגתי בשאר העמודים.
 *
 * הפונקציות כאן מחזירות URLs מוחלטים (https://kelvanya.co.il/...) כדי
 * ש-canonical ו-og:url יהיו תקינים גם כשנקראים מחוץ להקשר של metadataBase.
 */

/**
 * בסיס הכתובת של האתר. ללא סלאש בסוף.
 * ניתן להגדרה דרך NEXT_PUBLIC_SITE_URL (למשל כתובת staging/מנהרה),
 * כך ש-canonical, og:url ו-og:image יצביעו לכתובת שבאמת זמינה לסורקים.
 * ברירת מחדל: דומיין הפרודקשן.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kelvanya.co.il').replace(/\/+$/, '')

/** שם המותג - לשימוש בכותרות ובסכמות. */
export const SITE_NAME = 'כלבניה'

/** סלוגן קצר לתיאורי ברירת מחדל. */
export const SITE_TAGLINE = 'קהילת בעלי הכלבים הגדולה בישראל'

/** שפה ולוקאל ל-Open Graph. */
export const SITE_LOCALE = 'he_IL'

/**
 * בונה כתובת לתמונת OG דינמית (מחולל /og) עם כותרת/תת-כותרת/תגית.
 * מחזיר נתיב יחסי - Next יהפוך אותו למוחלט לפי metadataBase.
 */
export function ogImageUrl(opts: { title?: string; subtitle?: string; tag?: string } = {}): string {
  const p = new URLSearchParams()
  if (opts.title) p.set('title', opts.title)
  if (opts.subtitle) p.set('subtitle', opts.subtitle)
  if (opts.tag) p.set('tag', opts.tag)
  const qs = p.toString()
  return qs ? `/og?${qs}` : '/og'
}

/** תמונת שיתוף ברירת מחדל - כרטיס מותג דינמי. */
export const DEFAULT_OG_IMAGE = ogImageUrl()

/**
 * בונה URL מוחלט ומנורמל מנתיב יחסי.
 * - מבטיח סלאש פותח יחיד.
 * - מסיר סלאש סוגר מיותר (פרט לשורש).
 */
export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  const clean = `/${path}`.replace(/\/{2,}/g, '/')
  const trimmed = clean.length > 1 ? clean.replace(/\/+$/, '') : clean
  return `${SITE_URL}${trimmed}`
}

/** קיצוץ תיאור לאורך ידידותי למנועי חיפוש (≈160 תווים), בלי לחתוך מילה. */
export function clampDescription(text: string, max = 160): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  const cut = normalized.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

export type PageMetaInput = {
  /** כותרת העמוד (בלי שם המותג - הוא יתווסף לפי הצורך). */
  title: string
  /** תיאור העמוד. ייחתך ל-160 תווים. */
  description?: string
  /** נתיב יחסי של העמוד, לצורך canonical ו-og:url. */
  path?: string
  /** תמונת שיתוף (יחסית או מוחלטת). ברירת מחדל: תמונת המותג. */
  image?: string
  /** סוג ה-Open Graph. ברירת מחדל: website. */
  type?: 'website' | 'article' | 'profile'
  /** אם true - לא להוסיף את שם המותג לכותרת (כשהוא כבר מוכל בה). */
  rawTitle?: boolean
  /** מניעת אינדוקס (לעמודים פרטיים/טפסים). */
  noindex?: boolean
  /** מטא-דאטה של מאמר (לעמודי תוכן). */
  article?: {
    publishedTime?: string
    modifiedTime?: string
    authors?: string[]
    section?: string
  }
}

/**
 * בונה אובייקט Metadata עשיר ועקבי (title, description, canonical,
 * Open Graph, Twitter, robots) מתוך קלט מינימלי.
 *
 * שימוש לדוגמה בעמוד:
 *   export const metadata = buildMetadata({
 *     title: 'פורום הקהילה',
 *     description: '...',
 *     path: '/forum',
 *   })
 */
export function buildMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    path = '/',
    image,
    type = 'website',
    rawTitle = false,
    noindex = false,
    article,
  } = input

  const fullTitle =
    rawTitle || title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`
  const desc = clampDescription(description ?? SITE_TAGLINE)
  const url = absoluteUrl(path)
  // אם לא סופקה תמונה - מחוללים כרטיס OG דינמי עם כותרת/תיאור העמוד.
  const ogImage = absoluteUrl(
    image ?? ogImageUrl({ title, subtitle: description, tag: article?.section }),
  )

  const meta: Metadata = {
    title: fullTitle,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type,
      images: [{ url: ogImage, alt: fullTitle }],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            authors: article.authors,
            section: article.section,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
  }

  if (noindex) {
    meta.robots = { index: false, follow: false }
  }

  return meta
}
