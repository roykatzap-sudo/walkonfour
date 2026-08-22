import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, ogImageUrl, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema, faqSchema, placeListSchema } from '@/components/seo/JsonLd'
import { getCityHub, cityHubSlugs, allCityHubs } from '@/lib/cityHubs'
import { buildCitySeo } from '@/lib/citySeo'
import { CityParksList } from '@/components/city/CityParksList'
import { CitySeoBlock } from '@/components/city/CitySeoBlock'
import { SuggestMissing } from '@/components/city/SuggestMissing'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { getGuidesForCity } from '@/lib/relatedContent'
import { RelatedContentBlock } from '@/components/shared/RelatedContentBlock'

export function generateStaticParams() {
  return cityHubSlugs().map((slug) => ({ slug }))
}

/** מרחק מקורב בק״מ (קו ישר). זהה ללוגיקה ב-lib/cityHubs, שאינה מייצאת אותה. */
function distKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  return Math.hypot((aLat - bLat) * 111, (aLng - bLng) * 94)
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) return buildMetadata({ title: 'עיר לא נמצאה', path: `/city/${params.slug}`, noindex: true })
  const { community, parks, walks } = hub
  // ★ SEO title שמתחיל ב"גינות כלבים [עיר]" - המילה הראשונה הכי חזקה לגוגל.
  // הכותרת לא מבטיחה מסלולי טיול כשאין כאלה, והתיאור לא מבטיח חוקים ווטרינרים
  // שלא קיימים על העמוד (מלכודת CTR שמייצרת נטישה).
  const one = parks.length === 1
  const title = one
    ? `גינת כלבים ב${community.name}: כתובת, מפה וכללי רצועה 2026`
    : `גינות כלבים ב${community.name}: ${parks.length} מיקומים מעודכנים 2026`
  const walksClause = walks.length > 0 ? `${walks.length} מסלולי טיול באזור, ` : ''
  const description = `${one ? 'גינת הכלבים' : `רשימת ${parks.length} גינות הכלבים`} ב${community.name} עם כתובת מדויקת וניווט במפה, ${walksClause}וכללי הרצועה והרישוי שחלים בעיר. מתעדכן מדיווחי בעלי כלבים.`
  return buildMetadata({
    title,
    description,
    path: `/city/${community.slug}`,
    image: ogImageUrl({
      title: `גינות כלבים ב${community.name}`,
      subtitle: `${parks.length} מיקומים · ${community.district}`,
      tag: 'מדריך עירוני',
    }),
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

// באדג' צבעוני קריא למאפייני מסלול (קושי / צל / מים) - גדול ומובחן לבני 40+.
function WalkBadge({ label, icon, bg, fg, bd }: { label: string; icon: string; bg: string; fg: string; bd: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: bg,
        color: fg,
        border: `1px solid ${bd}`,
        borderRadius: 999,
        padding: '5px 12px',
        fontSize: 14,
        fontWeight: 800,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      <span aria-hidden="true">{icon}</span> {label}
    </span>
  )
}

const DIFFICULTY_STYLE: Record<string, { bg: string; fg: string; bd: string; icon: string }> = {
  'קל': { bg: 'rgba(76,145,80,.12)', fg: '#2f6a33', bd: 'rgba(76,145,80,.32)', icon: '🟢' },
  'בינוני': { bg: 'rgba(201,154,91,.15)', fg: '#8a5a1e', bd: 'rgba(201,154,91,.4)', icon: '🟡' },
  'מאתגר': { bg: 'rgba(190,80,60,.12)', fg: '#a2402f', bd: 'rgba(190,80,60,.32)', icon: '🔴' },
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const hub = getCityHub(params.slug)
  if (!hub) notFound()
  const { community, parks, walks } = hub
  // ערים שכנות אמיתיות: קודם אותו מחוז, ואז לפי מרחק. המיון הקודם (לפי מספר
  // גינות) גרם לכל 41 העמודים להצביע על אותן שמונה ערים גדולות.
  const others = allCityHubs()
    .filter((h) => h.community.slug !== community.slug)
    .sort((a, b) => {
      const w = (c: typeof community) =>
        (c.district === community.district ? 0 : 1000) + distKm(community.lat, community.lng, c.lat, c.lng)
      return w(a.community) - w(b.community)
    })
    .slice(0, 8)
  const seo = buildCitySeo(community, parks.length, walks.length)

  // רק גינות עם שם אמיתי, ורק החמש שמרונדרות בצד השרת (השאר נכנסות ל-DOM אחרי קליק).
  const namedParks = parks
    .filter((p) => !!p.name && p.name.trim() !== 'גינת כלבים' && p.name.trim() !== 'גן כלבים')
    .slice(0, 5)
    .map((p) => ({
      name: p.name as string,
      address: p.address ?? null,
      city: p.city ?? null,
      lat: p.lat,
      lng: p.lng,
    }))

  // ── Schema graph: CollectionPage + BreadcrumbList + FAQPage (+ ItemList של גינות) ──
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `גינות כלבים ב${community.name}`,
      description: `${parks.length} גינות כלבים ממופות ו-${walks.length} מסלולי טיול ב${community.name}.`,
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
    ...(namedParks.length > 0
      ? [placeListSchema({ name: `גינות כלבים ב${community.name}`, places: namedParks })]
      : []),
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
            {parks.length === 1 ? 'גינה אחת ממופה' : `${parks.length} גינות ממופות`}{walks.length > 0 ? ` ו-${walks.length} ${walks.length === 1 ? 'מסלול טיול' : 'מסלולי טיול'} באזור` : ''} - מעודכן ע"י הקהילה.
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
            🐕 {parks.length} גינות כלבים ממופות ב{community.name}
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
            🥾 מסלולי טיול עם הכלב ליד {community.name}
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12, marginTop: 12 }}>
            {walks.slice(0, 8).map((w) => {
              const diff = DIFFICULTY_STYLE[w.difficulty] ?? DIFFICULTY_STYLE['בינוני']
              return (
                <li key={w.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '15px 18px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 16 }}>{w.name}</div>
                  <div style={{ fontSize: 14, color: '#5b4d3c', marginTop: 4, marginBottom: 10 }}>
                    📍 {w.city} · {w.lengthKm} ק״מ · {Math.round(distKm(community.lat, community.lng, w.lat, w.lng))} ק״מ ממרכז {community.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    <WalkBadge label={w.difficulty} icon={diff.icon} bg={diff.bg} fg={diff.fg} bd={diff.bd} />
                    {w.shade && <WalkBadge label="צל" icon="🌳" bg="rgba(76,145,80,.1)" fg="#2f6a33" bd="rgba(76,145,80,.28)" />}
                    {w.water && <WalkBadge label="מים" icon="💧" bg="rgba(70,130,190,.12)" fg="#245e88" bd="rgba(70,130,190,.32)" />}
                  </div>
                </li>
              )
            })}
          </ul>
          <Link href="/walks" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל מסלולי הטיול →
          </Link>
        </section>
      )}

      {/* אשכול העלויות - עמודי הערים לא קישרו עד היום לאף מדריך מחירון */}
      <RelatedContentBlock
        heading={`כמה עולה להחזיק כלב ב${community.name}`}
        intro="המחירים דומים ברוב הארץ, והפער האמיתי הוא בין רשות לרשות ובין קליניקה לקליניקה."
        items={getGuidesForCity(community.slug)}
      />

      {/* הצעה למשהו חסר - בכל מדריכי הערים */}
      <SuggestMissing city={community.name} />

      {/* ערים נוספות - קישור פנימי */}
      {others.length > 0 && (
        <section style={{ marginTop: 52, paddingTop: 24, borderTop: '1px solid rgba(42,32,24,.1)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>מדריכים לערים נוספות</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {others.map((h) => (
              <Link key={h.community.slug} href={`/city/${h.community.slug}`} className="chip3d" style={{ textDecoration: 'none' }}>
                גינות כלבים ב{h.community.name}
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
