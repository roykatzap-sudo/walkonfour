import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { LostDogPoster } from '@/components/tools/LostDogPoster'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'מודעת כלב אבד להדפסה ולשיתוף: מחולל מודעות'
const DESC =
  'מכינים מודעת "כלב אבד" או "נמצא כלב" בדקה: תמונה, תיאור וטלפון, ומקבלים מודעה להדפסה ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק. הפרטים נשארים במכשיר שלכם.'
const OG = ogImageUrl({ title: 'מודעת כלב אבד בדקה', subtitle: 'להדפסה ולשיתוף בוואטסאפ ובפייסבוק', tag: 'כלי' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/tools/lost-dog-poster' },
  openGraph: { title: TITLE, description: DESC, url: '/tools/lost-dog-poster', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

const STEPS: { h: string; p: string }[] = [
  { h: 'תמונה אחת ברורה', p: 'תמונה שבה רואים את כל הכלב, באור יום. תמונה אחת טובה עדיפה על קולאז\'.' },
  { h: 'תיאור שאפשר לזהות מרחוק', p: 'גודל, צבע וסימן אחד בולט. מי שרואה כלב ברחוב זוכר קולר אדום, לא שם של גזע.' },
  { h: 'איפה ומתי', p: 'רחוב או נקודת ציון, יום ושעה. זה מה שעוזר לאנשים להבין אם הכלב שראו הוא שלכם.' },
  { h: 'טלפון אחד, גדול', p: 'מספר אחד שעונים בו. המודעה מדגישה אותו כדי שיהיה קריא גם ממכונית.' },
]

export default function LostDogPosterPage() {
  return (
    <main className="page" style={{ maxWidth: 1100 }}>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'דף הבית', path: '/' },
            { name: 'כלים', path: '/tools' },
            { name: 'מודעת כלב אבד', path: '/tools/lost-dog-poster' },
          ]),
        ]}
      />
      <div className="no-print">
        <span className="section-tag">כלי</span>
        <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>מודעת כלב אבד, מוכנה בדקה</h1>
        <p className="page-sub" style={{ maxWidth: 680 }}>
          ממלאים כמה פרטים ומקבלים מודעה להדפסה ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק.
          מתאים גם למי שמצא כלב ומחפש את הבעלים.
        </p>
        <p style={{ fontSize: 16.5, lineHeight: 1.8, color: '#3a3128', maxWidth: 680, margin: '0 0 26px' }}>
          מודעה היא רק חלק מהחיפוש. את הסדר המלא, כולל למי מתקשרים קודם, תמצאו במדריך{' '}
          <Link href="/guides/lost-dog-first-24-hours" className="link">הכלב אבד: מה עושים ב-24 השעות הראשונות</Link>.
        </p>
      </div>

      <LostDogPoster />

      <section className="no-print" style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#2a2018', margin: '0 0 14px' }}>מה הופך מודעה ליעילה?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14 }}>
          {STEPS.map((s) => (
            <div key={s.h} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.25)', borderRadius: 16, padding: '16px 18px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 900, color: '#2a2018' }}>{s.h}</h3>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: '#3a3128' }}>{s.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="no-print"
        style={{ marginTop: 34, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '22px 24px' }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1b2a44', margin: '0 0 8px' }}>ואחרי שהמודעה מוכנה?</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.8, color: '#1b2a44', maxWidth: 640 }}>
          העלו אותה גם לקבוצת הפייסבוק שלנו, עם האזור והשעה. בעלי כלבים מטיילים באותם רחובות כמה פעמים ביום,
          והם אלה שיודעים לזהות כלב שמסתובב לבד.
        </p>
        <GroupLink
          src="poster"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1877f2', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
