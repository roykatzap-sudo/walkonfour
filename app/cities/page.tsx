import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { allCityHubs } from '@/lib/cityHubs'

export const metadata = buildMetadata({
  title: 'מדריכי ערים לבעלי כלבים',
  description:
    'מדריך לבעלי כלבים בכל עיר בישראל: גינות כלבים ומסלולי טיול. בחרו את העיר שלכם.',
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
            כלבים בעיר שלכם
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#5b4d3c', lineHeight: 1.7 }}>
            גינות, בתי קפה שמקבלים כלבים ומסלולי טיול - לכל עיר מדריך משלה. בחרו עיר.
          </p>
        </div>
      </div>

      <style>{`
        .city-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
        .city-card {
          position: relative;
          padding: 20px 22px;
          text-decoration: none;
          color: var(--ink);
          overflow: hidden;
          transition: transform .28s cubic-bezier(.2,.8,.2,1), box-shadow .28s cubic-bezier(.2,.8,.2,1), border-color .28s;
        }
        .city-card::before {
          content: '';
          position: absolute;
          inset-block-start: 0;
          inset-inline: 0;
          height: 3px;
          background: linear-gradient(90deg, rgba(201,154,91,.85), rgba(232,200,135,.55));
          transform: scaleX(0);
          transform-origin: inline-end;
          transition: transform .3s cubic-bezier(.2,.8,.2,1);
        }
        .city-card:hover, .city-card:focus-visible {
          transform: translateY(-4px);
          box-shadow: 0 16px 34px rgba(201,154,91,.22);
          border-color: rgba(201,154,91,.5);
        }
        .city-card:hover::before, .city-card:focus-visible::before { transform: scaleX(1); }
        .city-card .city-name { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .city-card .city-go {
          color: var(--brand);
          font-weight: 900;
          opacity: 0;
          transform: translateX(6px);
          transition: opacity .28s, transform .28s;
        }
        .city-card:hover .city-go, .city-card:focus-visible .city-go { opacity: 1; transform: translateX(0); }
        @media (prefers-reduced-motion: reduce) {
          .city-card, .city-card::before, .city-card .city-go { transition: none; }
          .city-card:hover, .city-card:focus-visible { transform: none; }
        }
      `}</style>
      <div className="city-grid">
        {hubs.map((h) => (
          <Link
            key={h.community.slug}
            href={`/city/${h.community.slug}`}
            className="card city-card"
          >
            <div className="city-name" style={{ marginBottom: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 900 }}>{h.community.name}</span>
              <span className="city-go" aria-hidden="true">←</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 15, color: '#5b4d3c' }}>
              {h.parks.length > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(201,154,91,.1)', borderRadius: 999, padding: '4px 11px', fontWeight: 700 }}>
                  🐕 {h.parks.length} גינות
                </span>
              )}
              {h.walks.length > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(90,140,80,.1)', borderRadius: 999, padding: '4px 11px', fontWeight: 700 }}>
                  🥾 {h.walks.length} מסלולים
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
