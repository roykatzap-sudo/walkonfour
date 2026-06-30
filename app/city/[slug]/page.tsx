import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { getCityHub, cityHubSlugs, allCityHubs } from '@/lib/cityHubs'
import { buildCitySeo } from '@/lib/citySeo'
import { CityParksList } from '@/components/city/CityParksList'
import { CitySeoBlock } from '@/components/city/CitySeoBlock'
import { SuggestMissing } from '@/components/city/SuggestMissing'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'

export function generateStaticParams() {
  return cityHubSlugs().map((slug) => ({ slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) return buildMetadata({ title: 'עיר לא נמצאה', path: `/city/${params.slug}`, noindex: true })
  const { community, parks, walks } = hub
  // ★ SEO title שמתחיל ב"גינות כלבים [עיר]" - המילה הראשונה הכי חזקה לגוגל.
  // לפי המחקר: long-tail עם תחרות נמוכה וערך גבוה.
  const title = `גינות כלבים ב${community.name} - ${parks.length} גינות מעודכנות + מסלולי טיול`
  return buildMetadata({
    title,
    description: `${parks.length} גינות כלבים ב${community.name} על מפה אינטראקטיבית, ${walks.length} מסלולי טיול עם הכלב באזור, חוקים, וטרינרים ועוד. מעודכן ע"י הקהילה.`,
    path: `/city/${community.slug}`,
  })
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '12px 18px', background: 'rgba(201,154,91,.08)', borderRadius: 16, minWidth: 96 }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: 'var(--brand)', lineHeight: 1 }}>{n}</div>
      <div style={{ fontSize: 13.5, color: '#5b4d3c', marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) notFound()
  const { community, parks, walks } = hub
  const others = allCityHubs().filter((h) => h.community.slug !== community.slug).slice(0, 8)
  const seo = buildCitySeo(community, parks.length, walks.length)

  // ── Schema graph: CollectionPage + BreadcrumbList + FAQPage ──
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `גינות כלבים ב${community.name}`,
      description: `${parks.length} גינות כלבים ו-${walks.length} מסלולי טיול ב${community.name}.`,
      url: `${SITE_URL}/city/${community.slug}`,
      inLanguage: 'he-IL',
      about: {
        '@type': 'Place',
        name: community.name,
        address: { '@type': 'PostalAddress', addressLocality: community.name, addressCountry: 'IL' },
      },
    },
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'מדריכי ערים', path: '/cities' },
      { name: community.name, path: `/city/${community.slug}` },
    ]),
    faqSchema(seo.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />

      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריך עירוני</span>
          <h1 className="page-title" style={{ fontSize: 44 }}>
            גינות כלבים ב{community.name}
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#5b4d3c', lineHeight: 1.7 }}>
            {parks.length} {parks.length === 1 ? 'גינה' : 'גינות'} פעילות{walks.length > 0 ? ` ו-${walks.length} ${walks.length === 1 ? 'מסלול טיול' : 'מסלולי טיול'} באזור` : ''} - מעודכן ע"י הקהילה.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            {parks.length > 0 && <Stat n={parks.length} label="גינות כלבים" />}
            {walks.length > 0 && <Stat n={walks.length} label="מסלולי טיול" />}
          </div>
        </div>
      </div>

      {/* ★ בלוק SEO - תשובה מהירה + FAQ */}
      <CitySeoBlock city={community.name} seo={seo} />

      {/* גינות כלבים */}
      {parks.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            🐕 {parks.length} גינות כלבים ב{community.name}
          </h2>
          <p style={{ color: '#5b4d3c', fontSize: 15.5, margin: '0 0 16px' }}>
            מקומות לשחרר רצועה ולתת לכלב לרוץ חופשי. הקרובות למרכז {community.name}:
          </p>
          <CityParksList parks={parks} city={community.name} />
          <Link href="/map" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל הגינות על המפה →
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
                <div style={{ fontSize: 14, color: '#5b4d3c', marginTop: 3 }}>
                  📍 {w.city} · {w.lengthKm} ק״מ · {w.difficulty}
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

      {/* הצעה למשהו חסר - בכל מדריכי הערים */}
      <SuggestMissing city={community.name} />

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

      {/* קישור לקהילה המקבילה - מחבר את "מדריך" ל"קהילה" */}
      <JoinCommunityCard tone="parks" />

      {/* CTA */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם?</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל גזעי הכלבים</Link>
      </div>
    </main>
  )
}
