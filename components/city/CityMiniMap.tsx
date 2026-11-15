'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'

/* מפה קטנה של גינות העיר. נטענת רק אחרי לחיצה, כדי לא להכביד על העמוד.
   כל נקודה נפתחת לחלונית עם שם הגינה וקישור ניווט. */

export type MapPoint = { id: number; t: string; lat: number; lng: number }

export function CityMiniMap({ points, city }: { points: MapPoint[]; city: string }) {
  const [open, setOpen] = useState(false)
  const [failed, setFailed] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || !boxRef.current) return
    let map: import('leaflet').Map | null = null
    let cancelled = false
    import('leaflet')
      .then((mod) => {
        if (cancelled || !boxRef.current) return
        const L = (mod.default ?? mod) as typeof import('leaflet')
        map = L.map(boxRef.current, { scrollWheelZoom: false })
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">תורמי OpenStreetMap</a>',
        }).addTo(map)
        const bounds = L.latLngBounds([])
        for (const p of points) {
          const m = L.circleMarker([p.lat, p.lng], { radius: 9, color: '#241a12', weight: 2, fillColor: '#c99a5b', fillOpacity: 0.95 }).addTo(map)
          const wrap = document.createElement('div')
          wrap.dir = 'rtl'
          const name = document.createElement('strong')
          name.textContent = p.t
          name.style.cssText = 'display:block;font-size:15.5px;margin-bottom:6px'
          const a = document.createElement('a')
          a.href = `https://waze.com/ul?ll=${p.lat},${p.lng}&navigate=yes`
          a.target = '_blank'
          a.rel = 'noopener noreferrer'
          a.textContent = 'ניווט ב-Waze'
          a.style.cssText = 'font-size:15px;font-weight:800'
          wrap.append(name, a)
          m.bindPopup(wrap)
          bounds.extend([p.lat, p.lng])
        }
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [28, 28], maxZoom: 15 })
      })
      .catch(() => setFailed(true))
    return () => {
      cancelled = true
      map?.remove()
    }
  }, [open, points])

  return (
    <div style={{ margin: '0 0 18px' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          display: 'inline-flex', alignItems: 'center', minHeight: 48, padding: '0 22px', borderRadius: 999, cursor: 'pointer',
          font: 'inherit', fontSize: 16, fontWeight: 800, background: '#fff', color: '#7a5a2e', border: '1.5px solid var(--brand)',
        }}
      >
        {open ? 'הסתרת המפה' : `הצגת ${points.length} הגינות על מפה`}
      </button>
      {open && (
        <div style={{ marginTop: 12 }}>
          {failed ? (
            <p style={{ fontSize: 16, color: '#7a2e1e', fontWeight: 700 }}>המפה לא נטענה. הרשימה שלמטה מכילה את כל הגינות, עם כפתורי ניווט.</p>
          ) : (
            <>
              <div
                ref={boxRef}
                role="application"
                aria-label={`מפת גינות הכלבים ב${city}. אותן גינות מופיעות גם ברשימה שמתחת למפה.`}
                style={{ height: 'min(440px, 62vh)', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(201,154,91,.4)', background: '#eee8dc' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: 14.5, color: '#5b4d3c' }}>לחיצה על נקודה פותחת את שם הגינה וקישור ניווט. כל הגינות מופיעות גם ברשימה שלמטה.</p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
