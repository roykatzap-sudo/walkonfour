import { SITE_NAME, SITE_TAGLINE, SITE_URL, absoluteUrl } from '@/lib/seo'

/**
 * רכיב הזרקת נתונים מובנים (JSON-LD / schema.org).
 *
 * שימוש: מרכיבים אובייקט סכמה עם אחד מה-builders למטה ומעבירים אותו
 * ל-<JsonLd data={...} />. הרכיב מזריק <script type="application/ld+json">
 * נקי. ניתן להעביר גם מערך סכמות.
 *
 * הרכיב הוא Server Component טהור - אין בו state או אפקטים, והוא בטוח
 * לרינדור בכל עמוד. הוא לא מוסיף DOM נראה ולכן אינו משפיע על נגישות
 * או על העיצוב.
 */

type JsonLdObject = Record<string, unknown>

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const payload = Array.isArray(data) ? data : [data]
  return (
    <>
      {payload.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // הנתונים נבנים בצד השרת מתוכן פנימי בלבד; אין קלט משתמש לא מסונן.
          dangerouslySetInnerHTML={{ __html: serialize(schema) }}
        />
      ))}
    </>
  )
}

/** סריאליזציה בטוחה - מונע שבירת תגית </script> בתוך מחרוזות. */
function serialize(schema: JsonLdObject): string {
  return JSON.stringify(schema).replace(/</g, '\\u003c')
}

/* ───────────────────────── Builders ───────────────────────── */

/**
 * סכמת הארגון/האתר - מתאימה לעמוד הבית.
 * מגדירה את קהילה על ארבע כ-Organization ומחברת ל-WebSite עם חיפוש פנימי.
 */
export function organizationSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    logo: absoluteUrl('/icon.png'),
    // E-E-A-T: זיהוי ישות חזק יותר דרך פרופילים חברתיים ואזור שירות.
    sameAs: [
      'https://www.instagram.com/kelvanya',
      'https://www.facebook.com/kelvanya',
    ],
    areaServed: { '@type': 'Country', name: 'ישראל' },
  }
}

export function websiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'he-IL',
    description: SITE_TAGLINE,
  }
}

export type Crumb = { name: string; path: string }

/**
 * סכמת פירורי לחם (BreadcrumbList) - לשיפור הבנת המבנה והצגת
 * פירורים בתוצאות החיפוש. מקבל רשימה מסודרת מהשורש עד העמוד הנוכחי.
 */
export function breadcrumbSchema(crumbs: Crumb[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

export type ArticleSchemaInput = {
  /** כותרת המאמר. */
  title: string
  /** תיאור/תקציר. */
  description: string
  /** נתיב יחסי של המאמר. */
  path: string
  /** תמונת כותרת (יחסית או מוחלטת). */
  image?: string
  /** שם המחבר. ברירת מחדל: מערכת קהילה על ארבע. */
  author?: string
  /** מועד פרסום בפורמט ISO. */
  datePublished?: string
  /** מועד עדכון בפורמט ISO. */
  dateModified?: string
  /** מדור/קטגוריה (למשל "מדריכי גזעים"). */
  section?: string
}

/**
 * סכמת מאמר (Article) - חיונית ל-E-E-A-T ולזיהוי תוכן מומחה.
 * כוללת מחבר, מו"ל, מועדי פרסום ועדכון, ותמונה.
 */
export function articleSchema(input: ArticleSchemaInput): JsonLdObject {
  const {
    title,
    description,
    path,
    image,
    author = `מערכת ${SITE_NAME}`,
    datePublished,
    dateModified,
    section,
  } = input

  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    inLanguage: 'he-IL',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(path) },
    author: { '@type': 'Organization', name: author, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/icon.png') },
    },
  }

  if (image) schema.image = absoluteUrl(image)
  if (datePublished) schema.datePublished = datePublished
  if (dateModified ?? datePublished)
    schema.dateModified = dateModified ?? datePublished
  if (section) schema.articleSection = section

  return schema
}

export type FaqItem = { q: string; a: string }

/**
 * סכמת שאלות נפוצות (FAQPage) - מאפשרת rich snippet של שו"ת
 * בתוצאות החיפוש. מקבל רשימת שאלה/תשובה.
 */
export function faqSchema(items: FaqItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export type HowToStep = { name: string; text: string }

/**
 * סכמת מדריך-שלבים (HowTo) - לפי המלצת מומחי GEO, תוכן how-to עם
 * שלבים מובנים צץ ב-AI Overviews לשאילתות "איך עושים X".
 */
export function howToSchema(input: {
  name: string
  description: string
  path: string
  image?: string
  steps: HowToStep[]
}): JsonLdObject {
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    inLanguage: 'he-IL',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
    step: input.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
  if (input.image) schema.image = absoluteUrl(input.image)
  return schema
}

/**
 * סכמת אפליקציית-ווב (WebApplication) - לכלים והמחשבונים החינמיים.
 * מאחת מחמש סכמות המפתח ל-2026; מסמנת כלי חינמי ומסייעת ל-rich results ול-AI.
 */
export function softwareAppSchema(input: {
  name: string
  description: string
  path: string
  category?: string
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: input.category ?? 'UtilitiesApplication',
    operatingSystem: 'Web',
    inLanguage: 'he-IL',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'ILS' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  }
}
