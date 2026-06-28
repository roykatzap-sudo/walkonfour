import type { MetadataRoute } from 'next'

/**
 * Web App Manifest (Next.js 14 native) - /manifest.webmanifest.
 *
 * הופך את קהילה על ארבע ל-installable PWA. הצבעים נשמרים בפלטת
 * קרם-לברדור בלבד: רקע קרם (#fbf7ef), theme זהב ראשי (#c99a5b).
 * RTL ועברית מוגדרים מראש כדי לשמור על חוויה תקינה גם כאפליקציה.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'קהילה על ארבע - קהילת בעלי הכלבים בישראל',
    short_name: 'על ארבע',
    description:
      'שיתוף ידע, קבוצות רכישה, אירועים חברתיים, פורום ומפת גינות כלבים - כל מה שבעל כלב צריך, במקום אחד.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    dir: 'rtl',
    lang: 'he',
    orientation: 'portrait',
    background_color: '#fbf7ef',
    theme_color: '#c99a5b',
    categories: ['lifestyle', 'social', 'pets'],
    icons: [
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
