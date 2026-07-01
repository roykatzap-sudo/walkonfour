import type { Metadata } from 'next'
import { Heebo, Fredoka } from 'next/font/google'
import './globals.css'
import './fx3d.css'
import './homepage.css'
import { Navbar } from '@/components/nav/Navbar'
import { Footer } from '@/components/shared/Footer'
import { ToastProvider } from '@/components/shared/Toast'
import { CursorFX } from '@/components/shared/CursorFX'
import { SkipLink } from '@/components/a11y/SkipLink'
import { AccessibilityMenu } from '@/components/a11y/AccessibilityMenu'
import { ClickBurst } from '@/components/fx/ClickBurst'
import { FacebookCTA } from '@/components/fx/FacebookCTA'
import { GlobalSuggest } from '@/components/fx/GlobalSuggest'
import { RouteProgress } from '@/components/fx/RouteProgress'
import { JsonLd, organizationSchema, websiteSchema } from '@/components/seo/JsonLd'
import { Analytics } from '@vercel/analytics/next'
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_LOCALE,
  DEFAULT_OG_IMAGE,
} from '@/lib/seo'

const heebo = Heebo({
  subsets: ['hebrew', 'latin'],
  weight: ['300', '400', '600', '700', '800', '900'],
  variable: '--font-heebo',
  display: 'swap',
})

// גופן כותרות "בלון" - Fredoka, עגול וכיפי, נותן תחושה חמה ושמנתית
const fredoka = Fredoka({
  subsets: ['hebrew', 'latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    // אייקון יחיד וברור, מספיק גדול (512²) שגוגל יזהה - בלי כפילויות וה-sizes הקטן שבלבל אותו
    icon: [
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/icon.png',
  },
  title: 'קהילה על ארבע - גזעי כלבים, אילוף וקהילת בעלי הכלבים בישראל',
  description:
    'מדריך גזעי כלבים, חידון "איזה כלב מתאים לי", מדריכי אילוף, מחשבונים, מפת גינות כלבים, אימוץ וקהילות לפי עיר - כל מה שבעל כלב בישראל צריך, במקום אחד.',
  keywords: ['גזעי כלבים', 'איזה כלב מתאים לי', 'אילוף כלבים', 'גינות כלבים', 'אימוץ כלבים', 'כלבים בישראל'],
  openGraph: {
    title: `קהילה על ארבע - ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: `קהילה על ארבע - ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `קהילה על ארבע - ${SITE_TAGLINE}`,
    description: SITE_TAGLINE,
    images: [DEFAULT_OG_IMAGE],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${fredoka.variable}`}>
      <head>
        {/* פתיחת חיבור מוקדמת ל-CDN של התמונות (Unsplash) - חוסך DNS+TLS לפני ה-LCP */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className={heebo.className}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <ToastProvider>
          <RouteProgress />
          <SkipLink />
          <CursorFX />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <AccessibilityMenu />
          <ClickBurst />
          <FacebookCTA />
          <GlobalSuggest />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
