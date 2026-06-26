import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd } from '@/components/seo/JsonLd'
import { getCityHub, cityHubSlugs, allCityHubs } from '@/lib/cityHubs'

export function generateStaticParams() {
  return cityHubSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) return buildMetadata({ title: 'עיר לא נמצאה', path: `/city/${params.slug}`, noindex: true })
  const { community, parks, dogFriendly, walks } = hub
  return buildMetadata({
    title: `כלבים ב${community.name}: גינות, דוג-פרנדלי וטיולים`,
    description: `המדריך לבעלי כלבים ב${community.name}: ${parks.length} גינות כלבים, ${dogFriendly.length} מקומות שמקבלים כלבים, ו-${walks.length} מסלולי טיול באזור. הכול במקום אחד.`,
    path: `/city/${community.slug}`,
  })
}

const DIFF_LABEL: Record<string, string> = { easy: 'קל', moderate: 'בינוני', hard: 'מאתגר' }

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(201,154,91,.08)', borderRadius: 16, minWidth: 96 }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 13, color: '#6a6155', marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) notFound()
  const { community, parks, dogFriendly, walks } = hub
  const others = allCityHubs().filter((h) => h.community.slug !== community.slug).slice(0, 8)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `כלבים ב${community.name}`,
    description: `גינות כלבים, מקומות דוג-פרנדלי ומסלולי טיול ב${community.name}.`,
    url: `${SITE_URL}/city/${community.slug}`,
  }

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריך עירוני</span>
          <h1 className="page-title" style={{ fontSize: 44 }}>
            כלבים ב<span className="grad-text">{community.name}</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#6a6155', lineHeight: 1.7 }}>
            כל מה שבעל כלב ב{community.name} צריך במקום אחד - איפה משחררים רצועה, לאן יוצאים לטייל,
            ואיפה מקבלים אתכם עם הכלב.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            {parks.length > 0 && <Stat n={parks.length} label="גינות כלבים" />}
            {dogFriendly.length > 0 && <Stat n={dogFriendly.length} label="מקומות דוג-פרנדלי" />}
            {walks.length > 0 && <Stat n={walks.length} label="מסלולי טיול" />}
          </div>
        </div>
      </div>

      {/* גינות כלבים */}
      {parks.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            🐕 {parks.length} גינות כלבים ב{community.name}
          </h2>
          <p style={{ color: '#6a6155', fontSize: 15.5, margin: '0 0 16px' }}>
            מקומות לשחרר רצועה ולתת לכלב לרוץ חופשי. הקרובות למרכז {community.name}:
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {parks.slice(0, 12).map((p) => (
              <li key={p.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15 }}>{p.name || 'גינת כלבים'}</div>
                {p.opening_hours && <div style={{ fontSize: 13, color: '#8a7c66', marginTop: 3 }}>🕐 {p.opening_hours}</div>}
              </li>
            ))}
          </ul>
          <Link href="/map" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל הגינות על המפה →
          </Link>
        </section>
      )}

      {/* דוג-פרנדלי */}
      {dogFriendly.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            ☕ מקומות שמקבלים כלבים ב{community.name}
          </h2>
          <p style={{ color: '#6a6155', fontSize: 15.5, margin: '0 0 16px' }}>
            מסעדות, בתי קפה, חופים וחנויות שמזמינים אתכם יחד עם הכלב.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {dogFriendly.slice(0, 14).map((d) => (
              <li key={d.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '13px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15.5 }}>{d.name}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--brand)', fontWeight: 700 }}>{d.category}</span>
                </div>
                {d.note && <div style={{ fontSize: 13.5, color: '#8a7c66', marginTop: 4, lineHeight: 1.5 }}>{d.note}</div>}
              </li>
            ))}
          </ul>
          <Link href="/dog-friendly" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל המקומות הדוג-פרנדלי →
          </Link>
        </section>
      )}

      {/* טיולים */}
      {walks.length > 0 && (
        <section style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            🥾 מסלולי טיול עם הכלב באזור {community.name}
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10, marginTop: 12 }}>
            {walks.slice(0, 8).map((w) => (
              <li key={w.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '13px 16px' }}>
                <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15.5 }}>{w.name}</div>
                <div style={{ fontSize: 13, color: '#8a7c66', marginTop: 3 }}>
                  📍 {w.city} · {w.lengthKm} ק״מ · {DIFF_LABEL[w.difficulty] ?? w.difficulty}
                  {w.shade ? ' · צל' : ''}{w.water ? ' · מים' : ''}
                </div>
              </li>
            ))}
          </ul>
          <Link href="/walks" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל מסלולי הטיול →
          </Link>
        </section>
      )}

      {/* ערים נוספות - קישור פנימי */}
      {others.length > 0 && (
        <section style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid rgba(42,32,24,.1)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>מדריכים לערים נוספות</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {others.map((h) => (
              <Link key={h.community.slug} href={`/city/${h.community.slug}`} className="chip3d" style={{ textDecoration: 'none' }}>
                כלבים ב{h.community.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div style={{ marginTop: 40, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם?</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל גזעי הכלבים</Link>
      </div>
    </main>
  )
}
