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
import { LivePops } from '@/components/fx/LivePops'
import { ClickBurst } from '@/components/fx/ClickBurst'
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
  alternates: { canonical: SITE_URL },
  icons: { icon: '/icon.png', shortcut: '/icon.png', apple: '/icon.png' },
  title: 'כלבניה - גזעי כלבים, אילוף וקהילת בעלי הכלבים בישראל',
  description:
    'מדריך גזעי כלבים, חידון "איזה כלב מתאים לי", מדריכי אילוף, מחשבונים, מפת גינות כלבים, אימוץ וקהילות לפי עיר - כל מה שבעל כלב בישראל צריך, במקום אחד.',
  keywords: ['גזעי כלבים', 'איזה כלב מתאים לי', 'אילוף כלבים', 'גינות כלבים', 'אימוץ כלבים', 'כלבים בישראל'],
  openGraph: {
    title: 'כלבניה - קהילת בעלי הכלבים הגדולה בישראל',
    description: SITE_TAGLINE,
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        alt: 'כלבניה - קהילת בעלי הכלבים הגדולה בישראל',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'כלבניה - קהילת בעלי הכלבים הגדולה בישראל',
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
          <LivePops />
          <ClickBurst />
        </ToastProvider>
        <Analytics />
      </body>
    </html>
  )
}
