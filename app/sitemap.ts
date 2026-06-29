import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { breeds } from '@/lib/breeds'
import { breedArticles } from '@/lib/articles'
import { guides } from '@/lib/guides'
import { communities } from '@/lib/communities'
import { demoCategories } from '@/lib/demo'
import { cityHubSlugs } from '@/lib/cityHubs'

/**
 * מפת אתר דינמית (Next.js 14 native).
 *
 * נבנית מתוך מקורות התוכן הסטטיים של האתר - גזעים, מאמרים, קהילות
 * וקטגוריות פורום - כדי שמנועי החיפוש יסרקו את כל מבנה האתר ביעילות.
 *
 * עמודים פרטיים/דינמיים שאינם רלוונטיים לאינדוקס (התחברות, הרשמה,
 * פרופיל, יצירת אירוע/פוסט) הושמטו בכוונה.
 */

const join = (path: string) => `${SITE_URL}${path}`

/** תדירות שינוי כפי שהיא מוגדרת בטיפוס של Next, כדי לשמור על הצרה תקינה. */
type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

/** רשומת עמוד סטטי לפני הרחבה ל-URL מלא. */
type StaticEntry = {
  path: string
  priority: number
  changeFrequency: ChangeFrequency
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // עמודים סטטיים מרכזיים, מסודרים לפי חשיבות.
  const staticPages: StaticEntry[] = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    { path: '/breeds', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/articles', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/communities', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/guides', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/vet', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/forum', priority: 0.8, changeFrequency: 'daily' },
    { path: '/events', priority: 0.8, changeFrequency: 'daily' },
    { path: '/groups', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/map', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/petsitting', priority: 0.7, changeFrequency: 'weekly' },
    // כלים חינמיים - מגנטי תנועה חזק (חיפושי llong-tail)
    { path: '/tools', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/match', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/names', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/calculator', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/dog-age', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/food-calculator', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/health', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/walks', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/canaan-dog', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/cities', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/dog-food-prices', priority: 0.8, changeFrequency: 'weekly' },
    // אזורי קהילה ומסחר
    { path: '/lost-found', priority: 0.7, changeFrequency: 'daily' },
    { path: '/adopt', priority: 0.7, changeFrequency: 'daily' },
    { path: '/market', priority: 0.6, changeFrequency: 'daily' },
    { path: '/businesses', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/wall', priority: 0.5, changeFrequency: 'daily' },
    { path: '/premium', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/waitlist', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/start', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.6, changeFrequency: 'monthly' },
    { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/cookies', priority: 0.3, changeFrequency: 'yearly' },
  ]
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((e) => ({
    url: join(e.path),
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  // עמודי גזע - /breeds/[slug]
  const breedEntries: MetadataRoute.Sitemap = breeds.map((b) => ({
    url: join(`/breeds/${b.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // מדריכי גזע (מאמרים) - /articles/[slug]
  const articleEntries: MetadataRoute.Sitemap = breedArticles.map((a) => ({
    url: join(`/articles/${a.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // מדריכי טיפול ואילוף - /guides/[slug]
  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: join(`/guides/${g.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // עמודי קהילה עירונית - /community/[city]
  const communityEntries: MetadataRoute.Sitemap = communities.map((c) => ({
    url: join(`/community/${c.slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // מדריכי ערים - /city/[slug]
  const cityEntries: MetadataRoute.Sitemap = cityHubSlugs().map((slug) => ({
    url: join(`/city/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }))

  // קטגוריות פורום - /forum/[category]
  const forumEntries: MetadataRoute.Sitemap = demoCategories.map((cat) => ({
    url: join(`/forum/${cat.slug}`),
    lastModified: now,
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  return [
    ...staticEntries,
    ...breedEntries,
    ...articleEntries,
    ...guideEntries,
    ...communityEntries,
    ...cityEntries,
    ...forumEntries,
  ]
}
