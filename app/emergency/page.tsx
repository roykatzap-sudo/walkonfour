import { EMERGENCY_CASES } from '@/lib/emergencyCases'
import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { getGuide } from '@/lib/guides'
import { GroupLink } from '@/components/shared/GroupLink'
import { OfflineSave } from '@/components/emergency/OfflineSave'

const TITLE = 'כלב במצב חירום: מה עושים עכשיו'
const DESC =
  'תשובות קצרות למצבי חירום עם כלב בישראל: כלב שאבד, הכשת נחש, חשש לכלבת, שוקולד, הקאות, מכת חום ואזעקות. לכל מצב תשובה של כמה שורות וקישור למדריך המלא.'
const OG = ogImageUrl({ title: 'כלב במצב חירום', subtitle: 'מה עושים עכשיו, בכמה שורות', tag: 'חירום' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/emergency' },
  openGraph: { title: TITLE, description: DESC, url: '/emergency', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

const CASES = EMERGENCY_CASES

export default function EmergencyPage() {
  const items = CASES.map((c) => ({ ...c, guide: getGuide(c.slug) })).filter((c) => c.guide?.quickAnswer)

  return (
    <main className="page page-narrow" style={{ maxWidth: 860 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'מצבי חירום', path: '/emergency' }])]} />
      <span className="section-tag">מצבי חירום</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>כלב במצב חירום: מה עושים עכשיו</h1>
      <p className="page-sub" style={{ maxWidth: 660 }}>
        לכל מצב יש כאן תשובה של כמה שורות, וקישור למדריך המלא עם המקורות. כדאי לשמור את העמוד בטלפון.
      </p>

      <div
        role="note"
        style={{ background: '#fff4f2', border: '1px solid rgba(198,40,40,.35)', borderInlineStart: '5px solid #c62828', borderRadius: 14, padding: '16px 20px', margin: '0 0 26px' }}
      >
        <p style={{ margin: 0, fontSize: 17, lineHeight: 1.75, color: '#3a1a16', fontWeight: 700 }}>
          במצב חירום רפואי מתקשרים קודם כול לווטרינר או למרפאת חירום וטרינרית. העמוד הזה הוא מידע כללי, והוא לא מחליף אותם.
        </p>
      </div>

      <OfflineSave />

      <nav aria-label="קפיצה למצב" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '0 0 30px' }}>
        {items.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, padding: '8px 16px', borderRadius: 999, background: '#fff', border: '1.5px solid rgba(201,154,91,.45)', color: '#5a4d3c', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}
          >
            {c.q.split('.')[0]}
          </a>
        ))}
      </nav>

      {items.map((c) => (
        <section key={c.slug} id={c.slug} style={{ marginBottom: 26, scrollMarginTop: 96 }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#2a2018', margin: '0 0 8px' }}>{c.q}</h2>
          <p style={{ margin: '0 0 8px', fontSize: 17, lineHeight: 1.85, color: '#3a3128' }}>{c.guide!.quickAnswer!.replace(/\*\*/g, '')}</p>
          <Link href={`/guides/${c.slug}`} className="link" style={{ fontWeight: 800, fontSize: 16 }}>
            למדריך המלא: {c.guide!.title}
          </Link>
        </section>
      ))}

      <section style={{ marginTop: 34, background: '#fdf6e9', border: '1px solid rgba(201,154,91,.3)', borderRadius: 18, padding: '22px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#2a2018', margin: '0 0 8px' }}>הכלב אבד? מודעה מוכנה בדקה</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.8, color: '#3a3128' }}>
          מחולל המודעות שלנו מכין מודעת &quot;כלב אבד&quot; להדפסה ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק.
        </p>
        <Link href="/tools/lost-dog-poster" className="link" style={{ fontWeight: 800, fontSize: 16.5 }}>להכנת מודעה</Link>
      </section>

      <section style={{ marginTop: 22, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '22px 24px' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1b2a44', margin: '0 0 8px' }}>אחרי שהכול נרגע</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.8, color: '#1b2a44' }}>
          ספרו בקבוצת הפייסבוק שלנו מה קרה ומה עזר. הסיפור שלכם הוא מה שיעזור לבעל הכלב הבא לזהות את הסימנים בזמן.
        </p>
        <GroupLink
          src="emergency"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
