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

export type JsonLdObject = Record<string, unknown>

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
      // הפרופיל החברתי האמיתי - קבוצת הפייסבוק (לא להוסיף פרופילים שלא קיימים)
      'https://www.facebook.com/groups/2421586375002894',
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
 * סכמת שאלות נפוצות (FAQPage) - מקבלת רשימת שאלה/תשובה.
 *
 * לידיעה: גוגל הסירה את התוצאה העשירה של FAQPage לכלל האתרים במאי 2026,
 * ולכן אין לצפות להשפעה על תוצאות החיפוש שלה. הסימון עדיין תקין לפי
 * schema.org ועדיין נקרא על ידי בינג ועל ידי מנועי תשובות וזחלני RAG,
 * ולכן שווה להוסיף אותו לצורך אחזור בבינה מלאכותית - לא לשיפור שיעור
 * ההקלקה. מה שבאמת מנצח שאילתות שאלה הוא בלוק השאלות הגלוי בעמוד.
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
 * סכמת Thing לגזע כלב.
 * schema.org אין סוג Animal/Dog/Breed (issue פתוח מ-2015 לא נסגר),
 * אז משתמשים ב-Thing עם sameAs ל-Wikipedia + Wikidata.
 * הקישור ל-Knowledge Graph של Google הוא הטריק הנדיר - מעט אתרי גזעים עושים.
 */
export function breedThingSchema(input: {
  slug: string
  name: string
  alternateNames: string[]
  description: string
  wikipediaHeSlug?: string
  wikipediaEnSlug?: string
  wikidataId?: string
}): JsonLdObject {
  const sameAs: string[] = []
  if (input.wikipediaHeSlug) sameAs.push(`https://he.wikipedia.org/wiki/${input.wikipediaHeSlug}`)
  if (input.wikipediaEnSlug) sameAs.push(`https://en.wikipedia.org/wiki/${input.wikipediaEnSlug}`)
  if (input.wikidataId) sameAs.push(`https://www.wikidata.org/wiki/${input.wikidataId}`)
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    '@id': `${absoluteUrl(`/breeds/${input.slug}`)}#breed`,
    name: input.name,
    alternateName: input.alternateNames,
    description: input.description,
  }
  if (sameAs.length > 0) schema.sameAs = sameAs
  return schema
}

/**
 * סכמת מדריך-שלבים (HowTo) - לתוכן שהוא באמת רצף פעולות.
 *
 * לידיעה: HowTo אינה מפיקה תוצאה עשירה בגוגל מאז ספטמבר 2023, ולכן
 * הערך שלה הוא הבנת מבנה ואחזור על ידי מנועי תשובות בלבד. אין להחיל
 * אותה על עמודי מחירון: שלבים בשם "תשובה מהירה" בעמוד מחירים הם
 * סימון שאינו תואם את התוכן. להשתמש רק כשהעמוד באמת מתאר שלבים.
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
 * מתארת כלי חינמי ומסייעת למנועי חיפוש ולמנועי תשובות להבין את הכלי.
 *
 * הערה חשובה: תוצאה עשירה של Software App דורשת aggregateRating או review.
 * אין לנו דירוגי משתמשים אמיתיים המוצגים בעמוד, ולכן אסור להוסיף כאן
 * aggregateRating או review. המצאת דירוגים היא הפרה של מדיניות הספאם
 * של גוגל ושל כלל האתר בדבר איסור פברוק ראיות חברתיות.
 */
export function softwareAppSchema(input: {
  name: string
  description: string
  path: string
  category?: string
  /** רשימת יכולות הכלי, למשל ['חישוב גיל כלב', 'המרה לשנות אדם']. */
  featureList?: string[]
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
    isAccessibleForFree: true,
    // ערך טכני קריא-מכונה. נשמר באנגלית לפי המוסכמה של schema.org,
    // ולא מעורבב עם עברית בתוך אותו משפט.
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'ILS' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    ...(input.featureList && input.featureList.length > 0
      ? { featureList: input.featureList }
      : {}),
  }
}

/* ─────────────────── רשימות: מקומות, עמודים, מאגר נתונים ─────────────────── */

export type PlaceListEntry = {
  name: string
  address?: string | null
  city?: string | null
  lat: number
  lng: number
}

/**
 * סכמת רשימת מקומות (ItemList של Place) - לעמודי הערים.
 * הגינות הן הנכס הייחודי של העמוד, ובלי mainEntity הן בלתי נראות למנתחים.
 *
 * במכוון משתמשים ב-Place ולא ב-LocalBusiness: גינות כלבים עירוניות אינן
 * עסקים שבבעלותנו. אין להוסיף כאן aggregateRating, review או openingHours -
 * אין לנו נתוני שעות פתיחה מאומתים, ו-Place אינו מפעיל תוצאה עשירה ולכן
 * אינו נושא חשיפה למדיניות.
 *
 * מערך ריק מחזיר סכמה תקינה עם numberOfItems אפס.
 */
export function placeListSchema(input: {
  name: string
  places: PlaceListEntry[]
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    inLanguage: 'he-IL',
    numberOfItems: input.places.length,
    itemListElement: input.places.map((place, i) => {
      const streetAddress = place.address?.trim()
      const addressLocality = place.city?.trim()

      const item: JsonLdObject = {
        '@type': 'Place',
        name: place.name,
        geo: {
          '@type': 'GeoCoordinates',
          latitude: place.lat,
          longitude: place.lng,
        },
      }

      // לעולם לא פולטים PostalAddress ריק - רק אם יש כתובת או יישוב.
      if (streetAddress || addressLocality) {
        item.address = {
          '@type': 'PostalAddress',
          ...(streetAddress ? { streetAddress } : {}),
          ...(addressLocality ? { addressLocality } : {}),
          addressCountry: 'IL',
        }
      }

      return {
        '@type': 'ListItem',
        position: i + 1,
        item,
      }
    }),
  }
}

export type ItemListEntry = { name: string; path: string; description?: string }

/**
 * סכמת רשימת עמודים גנרית (ItemList של WebPage) - לעמודי מרכז כמו
 * /tools, /guides ו-/cities.
 *
 * הערה מפוכחת: קרוסלת ItemList הקלאסית זמינה רק ל-Recipe/Course/
 * Restaurant/Movie, והקרוסלה בגרסת הבטא מוגבלת לאזור הכלכלי האירופי,
 * טורקיה ודרום אפריקה. ישראל אינה נכללת. הערך כאן הוא בהירות ישויות
 * ואחזור על ידי מנועי תשובות, לא תוצאה עשירה.
 *
 * מערך ריק מחזיר סכמה תקינה עם numberOfItems אפס.
 */
export function itemListSchema(input: {
  name: string
  items: ItemListEntry[]
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: input.name,
    inLanguage: 'he-IL',
    numberOfItems: input.items.length,
    itemListElement: input.items.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'WebPage',
        name: entry.name,
        url: absoluteUrl(entry.path),
        ...(entry.description ? { description: entry.description } : {}),
      },
    })),
  }
}

/**
 * סכמת מאגר נתונים (Dataset) - למפת גינות הכלבים.
 * Dataset נתמך וחי, מזין את Google Dataset Search, ודורש רק שם ותיאור
 * באורך 50 עד 5,000 תווים. התחרות בעברית שם כמעט אפסית.
 *
 * חובת ייחוס: נתוני הגינות נגזרים גם מ-OpenStreetMap ולכן כפופים לרישיון
 * ODbL. אם מעבירים license, הוא חייב להיות כתובת רישיון ה-ODbL, ובנוסף
 * חייב להופיע ייחוס גלוי ל-OpenStreetMap בעמוד המפה עצמו. זו חובת רישוי
 * שאינה תלויה בסכמה.
 */
export function datasetSchema(input: {
  name: string
  description: string
  spatialCoverage?: string
  license?: string
}): JsonLdObject {
  const schema: JsonLdObject = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: input.name,
    description: input.description,
    inLanguage: 'he-IL',
    isAccessibleForFree: true,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  if (input.spatialCoverage) {
    schema.spatialCoverage = { '@type': 'Place', name: input.spatialCoverage }
  }
  if (input.license) schema.license = input.license

  return schema
}
