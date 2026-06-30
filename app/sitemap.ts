import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { breeds } from '@/lib/breeds'
import { breedArticles } from '@/lib/articles'
import { guides } from '@/lib/guides'
import { cityHubSlugs } from '@/lib/cityHubs'

/**
 * מפת אתר דינמית (Next.js 14 native).
 *
 * רק עמודים שבאמת חיים ונגישים לציבור - לא עמודי קהילה סגורה (noindex),
 * לא עמודי "בקרוב" שמופנים ל-/soon ע"י ה-middleware, ולא עמודים פרטיים.
 * שולח לגוגל סיגנל נקי ועקבי כדי לקבל crawl budget מקסימלי לעמודים החשובים.
 */

const join = (path: string) => `${SITE_URL}${path}`

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>

type StaticEntry = {
  path: string
  priority: number
  changeFrequency: ChangeFrequency
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // רק עמודים שעובדים בפועל. הוסרו: forum/events/groups/petsitting/lost-found/adopt/market/businesses/wall/premium/start/dog-age (חסומים ב-middleware), communities/vet (לא קיים), cookies/faq (לא קיים).
  const staticPages: StaticEntry[] = [
    { path: '/', priority: 1.0, changeFrequency: 'daily' },
    // תוכן ראשי
    { path: '/breeds', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/articles', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/guides', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/cities', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/walks', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/map', priority: 0.85, changeFrequency: 'monthly' },
    // הגזע הלאומי - דף עם תכולה ייחודית
    { path: '/canaan-dog', priority: 0.85, changeFrequency: 'monthly' },
    // כלים חינמיים - long-tail SEO
    { path: '/tools', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/match', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/names', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/calculator', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/food-calculator', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/health', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/dog-food-prices', priority: 0.85, changeFrequency: 'weekly' },
    // הצטרפות
    { path: '/waitlist', priority: 0.8, changeFrequency: 'weekly' },
    // אינפו
    { path: '/about', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ]
  const staticEntries: MetadataRoute.Sitemap = staticPages.map((e) => ({
    url: join(e.path),
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))

  // עמודי גזע - /breeds/[slug] (~30 דפים)
  const breedEntries: MetadataRoute.Sitemap = breeds.map((b) => ({
    url: join(`/breeds/${b.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  // מדריכי גזע (מאמרים) - /articles/[slug]
  const articleEntries: MetadataRoute.Sitemap = breedArticles.map((a) => ({
    url: join(`/articles/${a.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }))

  // מדריכי טיפול ואילוף - /guides/[slug]
  const guideEntries: MetadataRoute.Sitemap = guides.map((g) => ({
    url: join(`/guides/${g.slug}`),
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // מדריכי ערים - /city/[slug] (~43 דפים עם תכולה אמיתית)
  const cityEntries: MetadataRoute.Sitemap = cityHubSlugs().map((slug) => ({
    url: join(`/city/${slug}`),
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    ...staticEntries,
    ...breedEntries,
    ...articleEntries,
    ...guideEntries,
    ...cityEntries,
  ]
}
