'use client'

import { useState } from 'react'
import type { DogPark } from '@/types'

/* "הגינה הקרובה אליי": לוחצים על כפתור, הדפדפן מבקש רשות למיקום, ומוצגות
   הגינות הקרובות עם מרחק וכפתורי ניווט. המיקום נשאר בדפדפן: החישוב נעשה
   כאן, ושום דבר לא נשלח לשרת. רשימת הגינות נטענת רק אחרי הלחיצה. */

const GENERIC = new Set(['גינת כלבים', 'גן כלבים', 'גינת הכלבים', ''])
const named = (p: DogPark) => !!p.name && !GENERIC.has(p.name.trim())
const title = (p: DogPark) => (named(p) ? (p.name as string) : p.near ? `גינת כלבים ליד ${p.near}` : p.hood ? `גינת כלבים ב${p.hood}` : 'גינת כלבים')

/** מרחק בק"מ בין שתי נקודות (נוסחת האברסין). */
function km(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const rad = (d: number) => (d * Math.PI) / 180
  const dLat = rad(bLat - aLat)
  const dLng = rad(bLng - aLng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

function distLabel(d: number): string {
  if (d < 1) return `${Math.max(50, Math.round((d * 1000) / 50) * 50)} מטר`
  return `${d.toFixed(1)} ק"מ`
}

type Found = { p: DogPark; d: number }
type State = 'idle' | 'locating' | 'done' | 'denied' | 'unavailable' | 'far'

export function NearestParks({ count = 6 }: { count?: number }) {
  const [state, setState] = useState<State>('idle')
  const [found, setFound] = useState<Found[]>([])

  function locate() {
    if (!('geolocation' in navigator)) {
      setState('unavailable')
      return
    }
    setState('locating')
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        const { allDogParks } = await import('@/lib/dogParksAll')
        const sorted = allDogParks
          .map((p) => ({ p, d: km(latitude, longitude, p.lat, p.lng) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, count)
        if (!sorted.length || sorted[0]!.d > 60) {
          setFound([])
          setState('far')
          return
        }
        setFound(sorted)
        setState('done')
      },
      (err) => setState(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { enableHighAccuracy: false, timeout: 12000, maximumAge: 5 * 60_000 },
    )
  }

  return (
    <div className="np">
      <button type="button" className="np-go" onClick={locate} disabled={state === 'locating'}>
        {state === 'locating' ? 'מאתר את המיקום...' : state === 'done' ? 'חיפוש מחדש' : 'מצאו את הגינה הקרובה אליי'}
      </button>
      <p className="np-note">המיקום נשאר במכשיר שלכם. הוא משמש רק לחישוב המרחק, ולא נשלח לאתר.</p>

      <div role="status" aria-live="polite">
        {state === 'denied' && (
          <p className="np-msg">לא קיבלנו רשות למיקום. אפשר לאשר בהגדרות הדפדפן ולנסות שוב, או לבחור עיר ברשימה שלמטה.</p>
        )}
        {state === 'unavailable' && <p className="np-msg">לא הצלחנו לקבל את המיקום. נסו שוב, או בחרו עיר ברשימה שלמטה.</p>}
        {state === 'far' && <p className="np-msg">לא מצאנו גינה ממופה ברדיוס של 60 ק&quot;מ. אם אתם מכירים גינה באזור, ספרו לנו ונוסיף.</p>}
        {state === 'done' && <p className="np-ok">{found.length} הגינות הקרובות אליכם, מהקרובה לרחוקה:</p>}
      </div>

      {state === 'done' && (
        <ol className="np-list">
          {found.map(({ p, d }) => (
            <li key={p.id} className="np-card">
              <div className="np-dist">{distLabel(d)}</div>
              <h3 className="np-name">{title(p)}</h3>
              <p className="np-where">{[named(p) && p.near ? `ליד ${p.near}` : null, p.address ?? null, p.hood ?? null, p.city || null].filter(Boolean).join(' · ')}</p>
              <div className="np-btns">
                <a href={`https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer" className="np-btn np-waze" aria-label={`ניווט ב-Waze אל ${title(p)} (נפתח בחלון חדש)`}>
                  ניווט ב-Waze
                </a>
                <a href={`https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`} target="_blank" rel="noopener noreferrer" className="np-btn" aria-label={`פתיחה ב-Google Maps: ${title(p)} (נפתח בחלון חדש)`}>
                  Google Maps
                </a>
              </div>
            </li>
          ))}
        </ol>
      )}

      <style jsx>{`
        .np-go {
          display: inline-flex; align-items: center; justify-content: center; min-height: 58px; padding: 0 30px;
          border-radius: 999px; border: none; cursor: pointer; font: inherit; font-size: 18.5px; font-weight: 900;
          background: #241a12; color: #fff; box-shadow: 0 10px 26px rgba(36, 26, 18, 0.25);
        }
        .np-go:disabled { opacity: 0.7; cursor: default; }
        .np-go:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
        .np-note { margin: 10px 0 0; font-size: 15px; color: #5b4d3c; line-height: 1.6; }
        .np-msg { margin: 14px 0 0; font-size: 16.5px; line-height: 1.7; color: #7a2e1e; font-weight: 700; }
        .np-ok { margin: 16px 0 0; font-size: 17px; font-weight: 800; color: var(--ink); }
        .np-list { list-style: none; margin: 12px 0 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
        .np-card { background: #fff; border: 1px solid rgba(201, 154, 91, 0.3); border-radius: 16px; padding: 16px; display: flex; flex-direction: column; }
        .np-dist { align-self: flex-start; font-size: 15px; font-weight: 900; color: #2f6a33; background: rgba(76, 145, 80, 0.13); border-radius: 999px; padding: 3px 12px; margin-bottom: 8px; }
        .np-name { margin: 0; font-size: 17.5px; font-weight: 800; color: var(--ink); line-height: 1.35; }
        .np-where { margin: 4px 0 0; font-size: 15px; color: #5b4d3c; line-height: 1.5; }
        .np-btns { display: flex; gap: 8px; margin-top: auto; padding-top: 14px; }
        .np-btn {
          flex: 1; display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0 12px;
          border-radius: 12px; font-size: 15.5px; font-weight: 800; text-decoration: none;
          color: #7a5a2e; background: #fff; border: 1.5px solid rgba(201, 154, 91, 0.55);
        }
        .np-btn:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
        .np-waze { background: #241a12; color: #fff; border-color: #241a12; }
      `}</style>
    </div>
  )
}
