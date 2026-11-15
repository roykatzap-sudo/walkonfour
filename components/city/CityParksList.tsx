import type { DogPark } from '@/types'

/* רשימת גינות הכלבים של עיר.
   רכיב שרת: כל הגינות נמצאות ב-HTML (גם אלה שמאחורי "עוד גינות"), כך שמנועי
   חיפוש וקוראי מסך רואים את הרשימה המלאה. לכל גינה שני כפתורי ניווט גדולים,
   לפי קואורדינטה מדויקת. */

const GENERIC = new Set(['גינת כלבים', 'גן כלבים', 'גינת הכלבים', ''])

/** ה-CSS של כרטיסי הרשימות בעמוד העיר (גינות, מרפאות, חנויות, מסלולים). מוזרק פעם אחת בעמוד. */
export const CITY_LIST_CSS = `
            .cpl-grid { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
            .cpl-card { background: #fff; border: 1px solid rgba(201,154,91,.25); border-radius: 16px; padding: 16px 16px 14px; box-shadow: var(--shadow-xs); display: flex; flex-direction: column; }
            .cpl-name { margin: 0; font-size: 17.5px; font-weight: 800; color: var(--ink); line-height: 1.35; }
            .cpl-where { margin: 4px 0 0; font-size: 15px; color: #5b4d3c; line-height: 1.5; }
            .cpl-chips { list-style: none; margin: 10px 0 0; padding: 0; display: flex; flex-wrap: wrap; gap: 6px; }
            .cpl-chips:empty { display: none; }
            .cpl-chips li.cpl-no { color: #7a2e1e; background: rgba(190,80,60,.1); border-color: rgba(190,80,60,.3); }
            .cpl-report { margin-top: 10px; min-height: 44px; padding: 0 10px; background: none; border: none; cursor: pointer; font: inherit; font-size: 15px; font-weight: 700; color: #7a5a2e; text-decoration: underline; text-underline-offset: 3px; text-align: start; }
            .cpl-report:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; border-radius: 8px; }
            .cpl-chips li { font-size: 14px; font-weight: 700; color: #2f6a33; background: rgba(76,145,80,.12); border: 1px solid rgba(76,145,80,.3); border-radius: 999px; padding: 3px 11px; }
            .cpl-btns { display: flex; gap: 8px; margin-top: auto; padding-top: 14px; }
            .cpl-btn { flex: 1; display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 12px; border-radius: 12px; font-size: 15.5px; font-weight: 800; text-decoration: none; color: var(--brand-dark, #7a5a2e); background: #fff; border: 1.5px solid rgba(201,154,91,.55); }
            .cpl-btn:hover { background: #fdf6ea; }
            .cpl-btn:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .cpl-waze { background: #241a12; color: #fff; border-color: #241a12; }
            .cpl-waze:hover { background: #3a2c20; }
            .cpl-more { margin-top: 14px; }
            .cpl-more > summary { list-style: none; cursor: pointer; display: inline-flex; align-items: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: #fff; border: 1.5px solid var(--brand); color: var(--brand-dark, #7a5a2e); font-weight: 800; font-size: 16px; }
            .cpl-more > summary::-webkit-details-marker { display: none; }
            .cpl-more > summary:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .cpl-more[open] > summary { margin-bottom: 14px; }
            .cpl-more[open] > summary .cpl-closed, .cpl-more:not([open]) > summary .cpl-open { display: none; }
`

export function isNamedPark(p: DogPark): boolean {
  return !!p.name && !GENERIC.has(p.name.trim())
}

/** שם לתצוגה: השם האמיתי אם יש, אחרת "גינת כלבים ליד <רחוב>". */
export function parkTitle(p: DogPark): string {
  if (isNamedPark(p)) return p.name as string
  if (p.near) return `גינת כלבים ליד ${p.near}`
  if (p.hood) return `גינת כלבים ב${p.hood}`
  return 'גינת כלבים'
}

const waze = (p: DogPark) => `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
const gmaps = (p: DogPark) => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`

function ParkCard({ p, city }: { p: DogPark; city: string }) {
  const title = parkTitle(p)
  const where = [isNamedPark(p) && p.near ? `ליד ${p.near}` : null, p.address ?? null, p.hood ?? null, p.city || city]
    .filter(Boolean)
    .join(' · ')
  const chips = [p.fenced ? 'מגודרת' : null, p.lit ? 'תאורה' : null, p.wheelchair ? 'נגישה לכיסא גלגלים' : null].filter(Boolean) as string[]
  return (
    <li className="cpl-card" data-park-id={p.id}>
      <h3 className="cpl-name">{title}</h3>
      <p className="cpl-where">{where}</p>
      {/* הרשימה תמיד קיימת: מאפיינים שאושרו מדיווחי בעלי כלבים מתווספים אליה בדפדפן (CityParkFeatures) */}
      <ul className="cpl-chips" aria-label="מאפיינים">
        {chips.map((c) => <li key={c}>{c}</li>)}
      </ul>
      <div className="cpl-btns">
        <a href={waze(p)} target="_blank" rel="noopener noreferrer" className="cpl-btn cpl-waze" aria-label={`ניווט ב-Waze אל ${title} (נפתח בחלון חדש)`}>
          ניווט ב-Waze
        </a>
        <a href={gmaps(p)} target="_blank" rel="noopener noreferrer" className="cpl-btn" aria-label={`פתיחה ב-Google Maps: ${title} (נפתח בחלון חדש)`}>
          Google Maps
        </a>
      </div>
      <button type="button" className="cpl-report" data-park-report={p.id} data-park-name={title}>
        הייתם שם? סמנו מה יש בגינה
      </button>
    </li>
  )
}

export function CityParksList({ parks, city, first = 8 }: { parks: DogPark[]; city: string; first?: number }) {
  // גינות עם שם אמיתי קודם, אחר כך אלה שיש להן רחוב קרוב, ובסוף השאר. הסדר הפנימי (קרבה למרכז) נשמר.
  const rank = (p: DogPark) => (isNamedPark(p) ? 0 : p.near ? 1 : 2)
  const sorted = [...parks].sort((a, b) => rank(a) - rank(b))
  const head = sorted.slice(0, first)
  const rest = sorted.slice(first)

  return (
    <div className="cpl">
      <ul className="cpl-grid">
        {head.map((p) => <ParkCard key={p.id} p={p} city={city} />)}
      </ul>
      {rest.length > 0 && (
        <details className="cpl-more">
          <summary>
            <span className="cpl-closed">הצגת עוד {rest.length} גינות ב{city}</span>
            <span className="cpl-open">הסתרת הגינות הנוספות</span>
          </summary>
          <ul className="cpl-grid">
            {rest.map((p) => <ParkCard key={p.id} p={p} city={city} />)}
          </ul>
        </details>
      )}
    </div>
  )
}
