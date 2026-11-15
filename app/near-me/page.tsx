import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { NearestParks } from '@/components/parks/NearestParks'
import { allCityHubs } from '@/lib/cityHubs'
import { allDogParks } from '@/lib/dogParksAll'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'גינת כלבים קרובה אליי: מוצאים לפי מיקום'
const DESC =
  'לוחצים על כפתור אחד ורואים את גינות הכלבים הקרובות אליכם, עם מרחק וניווט ב-Waze וב-Google Maps. המיקום נשאר במכשיר ולא נשלח לאתר.'
const OG = ogImageUrl({ title: 'הגינה הקרובה אליי', subtitle: 'לפי המיקום שלכם, עם ניווט', tag: 'כלי' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/near-me' },
  openGraph: { title: TITLE, description: DESC, url: '/near-me', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

export default function NearMePage() {
  const hubs = allCityHubs()
  return (
    <main className="page" style={{ maxWidth: 1000 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'הגינה הקרובה אליי', path: '/near-me' }])]} />
      <span className="section-tag">כלי</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>גינת כלבים קרובה אליי</h1>
      <p className="page-sub" style={{ maxWidth: 660 }}>
        במפה שלנו {allDogParks.length} גינות כלבים. לוחצים על הכפתור, מאשרים שיתוף מיקום, ורואים את הקרובות ביותר עם מרחק וכפתור ניווט.
      </p>

      <NearestParks />

      <section style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>מעדיפים לבחור עיר?</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.7, color: '#5b4d3c' }}>
          בכל עמוד עיר יש את כל הגינות, וטרינרים, חנויות ומסלולי טיול באזור.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {hubs.map((h) => (
            <Link key={h.community.slug} href={`/city/${h.community.slug}`} className="chip3d" style={{ textDecoration: 'none' }}>
              {h.community.name}
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 34, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>הגעתם לגינה? ספרו איך היא</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44', maxWidth: 640 }}>
          צל, מים, גדר, ובאיזו שעה יש חברים לכלב. כתבו בקבוצת הפייסבוק שלנו, וזה יעזור למי שמגיע אחריכם.
        </p>
        <GroupLink
          src="near-me"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
