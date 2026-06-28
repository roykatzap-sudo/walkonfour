'use client'

import { useState } from 'react'
import type { DogPark } from '@/types'

const GENERIC = new Set(['גינת כלבים', 'גן כלבים', ''])

function isNamed(p: DogPark): boolean {
  return !!p.name && !GENERIC.has(p.name.trim())
}

/** קישור Google Maps: לפי כתובת אם יש, אחרת לפי שם+עיר, אחרת לפי הקואורדינטה. */
function gmaps(p: DogPark): string {
  let q: string
  if (p.address) q = encodeURIComponent(`${p.address} ${p.city || ''}`.trim())
  else if (isNamed(p)) q = encodeURIComponent(`${p.name} ${p.city || ''}`.trim())
  else q = `${p.lat},${p.lng}`
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

export function CityParksList({ parks, city }: { parks: DogPark[]; city: string }) {
  const [showAll, setShowAll] = useState(false)
  // גינות עם שם אמיתי קודם, אחר כך הגנריות
  const sorted = [...parks].sort((a, b) => (isNamed(a) ? 0 : 1) - (isNamed(b) ? 0 : 1))
  const visible = showAll ? sorted : sorted.slice(0, 5)
  const rest = sorted.length - 5

  return (
    <div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
        {visible.map((p) => (
          <li key={p.id}>
            <a
              href={gmaps(p)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '13px 15px', textDecoration: 'none', color: 'inherit', height: '100%' }}
            >
              <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15 }}>
                {isNamed(p) ? p.name : 'גינת כלבים'}
              </div>
              {p.address && (
                <div style={{ fontSize: 13, color: '#6a6155', marginTop: 3 }}>{p.address}</div>
              )}
              <div style={{ fontSize: 12.5, color: 'var(--brand)', fontWeight: 700, marginTop: 4 }}>
                📍 {p.city || city} · פתח ב-Google Maps ↗
              </div>
            </a>
          </li>
        ))}
      </ul>

      {!showAll && rest > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          style={{ marginTop: 14, background: '#fff', border: '1.5px solid var(--brand)', color: 'var(--brand)', fontWeight: 800, fontSize: 14.5, padding: '11px 22px', borderRadius: 999, cursor: 'pointer' }}
        >
          הצג עוד {rest} גינות ↓
        </button>
      )}
    </div>
  )
}
