import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { allCityHubs } from '@/lib/cityHubs'

export const metadata = buildMetadata({
  title: 'מדריכי ערים לבעלי כלבים',
  description:
    'מדריך לבעלי כלבים בכל עיר בישראל: גינות כלבים, מקומות דוג-פרנדלי ומסלולי טיול. בחרו את העיר שלכם.',
  path: '/cities',
})

export default function CitiesPage() {
  const hubs = allCityHubs()
  return (
    <main className="page" style={{ maxWidth: 1000 }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 18 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריכי ערים</span>
          <h1 className="page-title" style={{ fontSize: 44 }}>
            כלבים <span className="grad-text">בעיר שלכם</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#5b4d3c', lineHeight: 1.7 }}>
            לכל עיר מדריך משלה: גינות כלבים, מקומות שמקבלים כלבים, ומסלולי טיול באזור. בחרו עיר.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: 14 }}>
        {hubs.map((h) => (
          <Link
            key={h.community.slug}
            href={`/city/${h.community.slug}`}
            className="card"
            style={{ padding: '18px 20px', textDecoration: 'none', color: 'var(--ink)' }}
          >
            <div style={{ fontSize: 21, fontWeight: 900, marginBottom: 8 }}>{h.community.name}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 14.5, color: '#5b4d3c' }}>
              {h.parks.length > 0 && <span>🐕 {h.parks.length} גינות</span>}
              {h.dogFriendly.length > 0 && <span>· ☕ {h.dogFriendly.length} דוג-פרנדלי</span>}
              {h.walks.length > 0 && <span>· 🥾 {h.walks.length} מסלולים</span>}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
