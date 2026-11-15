import type { Metadata } from 'next'
import Link from 'next/link'
import { ogImageUrl } from '@/lib/seo'
import { GroupLink } from '@/components/shared/GroupLink'
import { allCityHubs } from '@/lib/cityHubs'

const TITLE = 'ברוכים הבאים לקהילה על ארבע'
const DESC = 'הצטרפתם לקבוצה? הנה חמישה דברים באתר ששווה להכיר: מצבי חירום, הגינה הקרובה, מדריכי הערים, הכלים והמדריכים.'
const OG = ogImageUrl({ title: 'ברוכים הבאים', subtitle: 'חמישה דברים ששווה להכיר באתר', tag: 'קהילה' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/welcome' },
  openGraph: { title: TITLE, description: DESC, url: '/welcome', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

export default function WelcomePage() {
  const cities = allCityHubs().length
  const items: { n: string; h: string; p: string; href: string; cta: string }[] = [
    { n: '1', h: 'שמרו את עמוד החירום', p: 'כלב שאבד, הכשת נחש, שוקולד, מכת חום. תשובה של כמה שורות לכל מצב, ואפשר לשמור אותו לשימוש בלי קליטה.', href: '/emergency', cta: 'לעמוד החירום' },
    { n: '2', h: 'מצאו את הגינה הקרובה', p: 'כפתור אחד, והגינות הקרובות אליכם מופיעות עם מרחק וניווט.', href: '/near-me', cta: 'למציאת גינה' },
    { n: '3', h: 'פתחו את העיר שלכם', p: `מדריכים ל-${cities} ערים: גינות, וטרינרים, חנויות ומסלולים. ואם משהו חסר, אתם אלה שיודעים.`, href: '/cities', cta: 'למדריכי הערים' },
    { n: '4', h: 'הכינו תעודת זהות לכלב', p: 'כרטיס עם תמונה, מספר שבב וטלפון של הווטרינר. לוקח דקה, ושווה זהב ביום שצריך.', href: '/tools/dog-id-card', cta: 'להכנת תעודה' },
    { n: '5', h: 'בדקו כמה אתם מכירים את החוק', p: 'עשר שאלות על רישיון, רצועה ושבב. רוב האנשים מופתעים לפחות פעם אחת.', href: '/quiz', cta: 'לחידון' },
  ]
  return (
    <main className="page page-narrow" style={{ maxWidth: 820 }}>
      <span className="section-tag">ברוכים הבאים</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>טוב שבאתם</h1>
      <p className="page-sub" style={{ maxWidth: 640 }}>
        הקבוצה היא המקום לשאול ולשתף. האתר הוא המקום שבו הדברים נשמרים. הנה חמישה דברים ששווה להכיר.
      </p>

      <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
        {items.map((it) => (
          <li key={it.n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', border: '1px solid rgba(201,154,91,.3)', borderRadius: 18, padding: '18px 20px' }}>
            <span aria-hidden="true" style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: '#241a12', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 900 }}>{it.n}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 900, color: 'var(--ink)' }}>{it.h}</h2>
              <p style={{ margin: '4px 0 8px', fontSize: 16.5, lineHeight: 1.75, color: '#3a3128' }}>{it.p}</p>
              <Link href={it.href} className="link" style={{ fontWeight: 800, fontSize: 16.5 }}>{it.cta}</Link>
            </div>
          </li>
        ))}
      </ol>

      <section style={{ marginTop: 30, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '22px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1b2a44', margin: '0 0 8px' }}>ועכשיו, תציגו את עצמכם</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.8, color: '#1b2a44' }}>
          פוסט קצר בקבוצה: שם הכלב, בן כמה הוא, מאיזו עיר אתם, ותמונה אחת. כך מוצאים חברים לטיול מהשכונה.
        </p>
        <GroupLink
          src="welcome"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          חזרה לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
