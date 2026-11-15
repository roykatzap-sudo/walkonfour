import type { CityPlace } from '@/lib/cityPlaces'

/* רשימת מרפאות וטרינריות או חנויות לחיות מחמד ליד עיר.
   הנתונים מ-OpenStreetMap: שם ומיקום תמיד, טלפון ושעות רק כשהוזנו שם. */

const waze = (p: CityPlace) => `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

export function CityPlacesList({ places, first = 6, moreLabel }: { places: CityPlace[]; first?: number; moreLabel: string }) {
  const head = places.slice(0, first)
  const rest = places.slice(first)

  const Card = ({ p }: { p: CityPlace }) => (
    <li className="cpl-card">
      <h3 className="cpl-name">{p.name}</h3>
      <p className="cpl-where">{[p.street, p.city].filter(Boolean).join(' · ') || 'המיקום המדויק בכפתור הניווט'}</p>
      {p.hours && <p className="cpl-where">שעות: {p.hours}</p>}
      <div className="cpl-btns">
        {p.phone && (
          <a href={telHref(p.phone)} className="cpl-btn cpl-waze" aria-label={`חיוג אל ${p.name}: ${p.phone}`}>
            <bdi dir="ltr">{p.phone}</bdi>
          </a>
        )}
        <a href={waze(p)} target="_blank" rel="noopener noreferrer" className="cpl-btn" aria-label={`ניווט ב-Waze אל ${p.name} (נפתח בחלון חדש)`}>
          ניווט ב-Waze
        </a>
      </div>
    </li>
  )

  return (
    <div>
      <ul className="cpl-grid">
        {head.map((p) => <Card key={p.id} p={p} />)}
      </ul>
      {rest.length > 0 && (
        <details className="cpl-more">
          <summary>
            <span className="cpl-closed">{moreLabel} ({rest.length})</span>
            <span className="cpl-open">הסתרה</span>
          </summary>
          <ul className="cpl-grid">
            {rest.map((p) => <Card key={p.id} p={p} />)}
          </ul>
        </details>
      )}
    </div>
  )
}
