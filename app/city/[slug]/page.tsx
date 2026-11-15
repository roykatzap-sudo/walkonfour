import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, ogImageUrl, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema, faqSchema, placeListSchema } from '@/components/seo/JsonLd'
import { getCityHub, cityHubSlugs, allCityHubs } from '@/lib/cityHubs'
import { buildCitySeo } from '@/lib/citySeo'
import { CityParksList, isNamedPark, parkTitle, CITY_LIST_CSS } from '@/components/city/CityParksList'
import { CityMiniMap } from '@/components/city/CityMiniMap'
import { CityWeather } from '@/components/city/CityWeather'
import { CityParkFeatures } from '@/components/city/CityParkFeatures'
import { CityQuickAnswer, CityFaqBlock } from '@/components/city/CitySeoBlock'
import { CityPlacesList } from '@/components/city/CityPlacesList'
import { GroupLink } from '@/components/shared/GroupLink'
import { OSM_DATA_DATE } from '@/lib/cityPlaces'
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
  const { community, parks, walks, vets } = hub
  // ★ SEO title שמתחיל ב"גינות כלבים [עיר]" - המילה הראשונה הכי חזקה לגוגל.
  // הכותרת לא מבטיחה מסלולי טיול כשאין כאלה, והתיאור לא מבטיח חוקים ווטרינרים
  // שלא קיימים על העמוד (מלכודת CTR שמייצרת נטישה).
  const one = parks.length === 1
  const title = one
    ? `גינת כלבים ב${community.name}: מיקום, ניווט וכללי רצועה 2026`
    : `גינות כלבים ב${community.name}: ${parks.length} מיקומים בעיר ובסביבה 2026`
  const walksClause = walks.length > 0 ? `${walks.length} מסלולי טיול באזור, ` : ''
  const vetsClause = vets.length > 0 ? `${vets.length === 1 ? 'מרפאה וטרינרית' : `${vets.length} מרפאות וטרינריות`} באזור, ` : ''
  const description = `${one ? 'גינת הכלבים' : `רשימת ${parks.length} גינות הכלבים`} ב${community.name} עם ניווט ישיר ב-Waze וב-Google Maps, ${vetsClause}${walksClause}וכללי הרצועה והרישוי שחלים בעיר.`
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
  const { community, parks, walks, vets, petShops } = hub
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
  const seo = buildCitySeo(community, {
    parks: parks.length,
    fenced: parks.filter((p) => p.fenced).length,
    walks: walks.length,
    vets: vets.length,
    petShops: petShops.length,
  })
  // קישורי קפיצה בתוך העמוד - רק לחלקים שבאמת קיימים בעיר הזאת
  const jumps = [
    parks.length > 0 ? { href: '#parks', label: 'גינות כלבים' } : null,
    vets.length > 0 ? { href: '#vets', label: 'וטרינרים' } : null,
    petShops.length > 0 ? { href: '#shops', label: 'חנויות' } : null,
    walks.length > 0 ? { href: '#walks', label: 'אטרקציות וטיולים' } : null,
    { href: '#faq', label: 'שאלות נפוצות' },
  ].filter(Boolean) as { href: string; label: string }[]

  // רק גינות עם שם אמיתי נכנסות לסכמה (כל הרשימה מרונדרת בצד השרת).
  const namedParks = parks
    .filter((p) => isNamedPark(p))
    .slice(0, 10)
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
      description: `${parks.length} גינות כלבים ממופות ב${community.name}${vets.length > 0 ? `, ${vets.length} מרפאות וטרינריות` : ''}${walks.length > 0 ? ` ו-${walks.length} מסלולי טיול באזור` : ''}.`,
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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            ${CITY_LIST_CSS}
            .city-jumps { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; }
            .city-jumps a { display: inline-flex; align-items: center; min-height: 44px; padding: 8px 15px; border-radius: 999px; background: #fff; border: 1.5px solid rgba(201,154,91,.5); color: #5a4d3c; font-weight: 800; font-size: 15px; text-decoration: none; }
            .city-jumps a:hover { background: #fdf6ea; }
            .city-jumps a:focus-visible, .city-fb:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .city-fb { display: flex; align-items: center; gap: 14px; text-decoration: none; margin-top: 16px; background: #eef4ff; border: 1px solid rgba(24,119,242,.3); border-radius: 16px; padding: 16px 20px; }
            .city-fb-ico { flex-shrink: 0; width: 44px; height: 44px; border-radius: 50%; background: #1877f2; display: grid; place-items: center; }
            .city-fb-text { font-size: 16.5px; line-height: 1.65; color: #1b2a44; }
            .city-fb-go { color: #0f5fcc; font-weight: 800; white-space: nowrap; }
            .city-faq { background: #fff; border: 1px solid rgba(201,154,91,.25); border-radius: 14px; padding: 14px 18px; }
            .city-faq summary { cursor: pointer; font-size: 17px; font-weight: 800; color: var(--ink); line-height: 1.5; }
            .city-faq summary:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; border-radius: 6px; }
            .city-faq p { margin: 10px 0 2px; font-size: 16.5px; line-height: 1.8; color: #3d342a; }
          `,
        }}
      />

      {/* HERO */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '34px 28px',
          marginBottom: 22,
          background:
            'radial-gradient(560px 280px at 50% 0%, rgba(232,200,135,.22), transparent 70%), linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.14)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריך עירוני</span>
          <h1 className="page-title" style={{ fontSize: 44 }}>
            גינות כלבים ב{community.name}
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#5b4d3c', lineHeight: 1.7 }}>
            {parks.length === 1 ? 'גינה אחת ממופה' : `${parks.length} גינות ממופות`}{walks.length > 0 ? ` ו-${walks.length} ${walks.length === 1 ? 'מסלול טיול' : 'מסלולי טיול'} באזור` : ''}, עם ניווט ישיר לכל אחת.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
            {parks.length > 0 && <Stat n={parks.length} label="גינות כלבים" />}
            {vets.length > 0 && <Stat n={vets.length} label="וטרינרים" />}
            {petShops.length > 0 && <Stat n={petShops.length} label="חנויות" />}
            {walks.length > 0 && <Stat n={walks.length} label="מסלולי טיול" />}
          </div>
          <nav aria-label="קפיצה לחלק בעמוד" className="city-jumps">
            {jumps.map((j) => (
              <a key={j.href} href={j.href}>{j.label}</a>
            ))}
          </nav>
        </div>
      </div>

      {/* תשובה קצרה בראש העמוד */}
      <CityQuickAnswer seo={seo} />

      {/* הזמנה לקבוצת הפייסבוק שמותאמת לעיר - בשליש הראשון של העמוד */}
      <GroupLink src="city-inline" className="kv-press city-fb">
        <span aria-hidden="true" className="city-fb-ico">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94z" /></svg>
        </span>
        <span className="city-fb-text">
          <strong>גרים ב{community.name}?</strong> ספרו בקבוצת הפייסבוק שלנו איזו גינה הכי שווה, באיזו שעה יש שם חברים לכלב, ומה כדאי לדעת לפני שמגיעים.{' '}
          <span className="city-fb-go">לקבוצת הפייסבוק ←</span>
        </span>
      </GroupLink>

      {/* הטמפרטורה היום לפי שעה - עוזר להחליט מתי לצאת */}
      <CityWeather slug={community.slug} city={community.name} />

      {/* גינות כלבים */}
      {parks.length > 0 && (
        <section id="parks" style={{ marginTop: 36, scrollMarginTop: 96 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            {parks.length === 1 ? `גינת כלבים אחת ממופה ב${community.name}` : `${parks.length} גינות כלבים ממופות ב${community.name} ובסביבה`}
          </h2>
          <p style={{ color: '#5b4d3c', fontSize: 16, lineHeight: 1.7, margin: '0 0 16px' }}>
            הרשימה כוללת גם גינות ביישובים הצמודים, ולכן ליד כל גינה מופיעים העיר והשכונה שלה. לוחצים על כפתור הניווט ומגיעים למקום. הרחוב שמופיע הוא הרחוב הקרוב לגינה, לצורך התמצאות.
          </p>
          <CityMiniMap city={community.name} points={parks.map((p) => ({ id: p.id, t: parkTitle(p), lat: p.lat, lng: p.lng }))} />
          <CityParksList parks={parks} city={community.name} />
          <CityParkFeatures citySlug={community.slug} />
          <Link href="/map" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל הגינות על המפה
          </Link>
        </section>
      )}

      {/* וטרינרים */}
      {vets.length > 0 && (
        <section id="vets" style={{ marginTop: 48, scrollMarginTop: 96 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            מרפאות וטרינריות ב{community.name} ובסביבה
          </h2>
          <p style={{ color: '#5b4d3c', fontSize: 16, lineHeight: 1.7, margin: '0 0 16px' }}>
            {vets.length === 1 ? 'מרפאה אחת שמופיעה' : `${vets.length} מרפאות שמופיעות`} במפת OpenStreetMap, מהקרובה למרכז העיר. הרשימה לא מלאה,
            לא בדקנו כל מרפאה בעצמנו, והיא אינה המלצה. כדאי להתקשר לפני שמגיעים.
          </p>
          <CityPlacesList places={vets} moreLabel="עוד מרפאות" />
        </section>
      )}

      {/* חנויות */}
      {petShops.length > 0 && (
        <section id="shops" style={{ marginTop: 48, scrollMarginTop: 96 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            חנויות לחיות מחמד ב{community.name} ובסביבה
          </h2>
          <p style={{ color: '#5b4d3c', fontSize: 16, lineHeight: 1.7, margin: '0 0 16px' }}>
            {petShops.length === 1 ? 'חנות אחת שמופיעה' : `${petShops.length} חנויות שמופיעות`} במפת OpenStreetMap. גם הרשימה הזאת חלקית ואינה המלצה.
          </p>
          <CityPlacesList places={petShops} moreLabel="עוד חנויות" />
        </section>
      )}

      {/* טיולים */}
      {walks.length > 0 && (
        <section id="walks" style={{ marginTop: 48, scrollMarginTop: 96 }}>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>
            אטרקציות ומסלולי טיול עם הכלב ליד {community.name}
          </h2>
          <p style={{ color: '#5b4d3c', fontSize: 16, lineHeight: 1.7, margin: '0 0 4px' }}>
            מקומות שמתירים כניסה עם כלבים, מהקרוב לרחוק. בשמורות ובגנים לאומיים הכלב ברצועה, וכדאי לבדוק שעות ומדיניות לפני שיוצאים.
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12, marginTop: 12 }}>
            {walks.slice(0, 8).map((w) => {
              const diff = DIFFICULTY_STYLE[w.difficulty] ?? DIFFICULTY_STYLE['בינוני']
              return (
                <li key={w.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '15px 18px', boxShadow: 'var(--shadow-xs)' }}>
                  <h3 style={{ margin: 0, fontWeight: 800, color: 'var(--ink)', fontSize: 17.5 }}>{w.name}</h3>
                  <div style={{ fontSize: 15, color: '#5b4d3c', marginTop: 4, marginBottom: 10 }}>
                    {w.city} · {w.lengthKm} ק״מ · {Math.round(distKm(community.lat, community.lng, w.lat, w.lng))} ק״מ ממרכז {community.name}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                    <WalkBadge label={w.difficulty} icon={diff.icon} bg={diff.bg} fg={diff.fg} bd={diff.bd} />
                    {w.shade && <WalkBadge label="צל" icon="🌳" bg="rgba(76,145,80,.1)" fg="#2f6a33" bd="rgba(76,145,80,.28)" />}
                    {w.water && <WalkBadge label="מים" icon="💧" bg="rgba(70,130,190,.12)" fg="#245e88" bd="rgba(70,130,190,.32)" />}
                    {w.fenced && <WalkBadge label="מקטע מגודר" icon="🚧" bg="rgba(201,154,91,.15)" fg="#8a5a1e" bd="rgba(201,154,91,.4)" />}
                  </div>
                  <p style={{ margin: '10px 0 0', fontSize: 16, lineHeight: 1.7, color: '#3d342a' }}>{w.description}</p>
                  <div className="cpl-btns" style={{ maxWidth: 420 }}>
                    <a href={`https://waze.com/ul?ll=${w.lat},${w.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="cpl-btn cpl-waze" aria-label={`ניווט ב-Waze אל ${w.name} (נפתח בחלון חדש)`}>
                      ניווט ב-Waze
                    </a>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${w.lat},${w.lng}`} target="_blank" rel="noopener noreferrer" className="cpl-btn" aria-label={`פתיחה ב-Google Maps: ${w.name} (נפתח בחלון חדש)`}>
                      Google Maps
                    </a>
                  </div>
                </li>
              )
            })}
          </ul>
          <Link href="/walks" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-block' }}>
            לכל מסלולי הטיול
          </Link>
        </section>
      )}

      {/* שאלות נפוצות - אחרי הרשימות, לא לפניהן */}
      <CityFaqBlock city={community.name} seo={seo} />

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

      <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, marginTop: 8 }}>
        מיקומי הגינות, המרפאות והחנויות: ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="link">תורמי OpenStreetMap</a>
        , נכון ל-{OSM_DATA_DATE.split('-').reverse().join('.')}, בתוספת רשימות עירוניות. מצאתם טעות? הטופס שלמעלה מגיע אלינו.
      </p>

      {/* CTA */}
      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם?</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל גזעי הכלבים</Link>
      </div>
    </main>
  )
}
