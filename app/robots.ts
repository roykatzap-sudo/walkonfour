import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

/**
 * הנחיות סריקה לרובוטים (Next.js 14 native) - /robots.txt.
 *
 * מאפשר סריקה של כל התוכן הציבורי, חוסם אזורים פרטיים/פעולתיים
 * (התחברות, הרשמה, פרופיל, יצירת אירוע/פוסט), ומפנה למפת האתר.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/auth/',
          '/profile',
          '/forum/new',
          '/events/create',
          '/saved',
          '/market/post-ad',
          '/businesses/apply',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
