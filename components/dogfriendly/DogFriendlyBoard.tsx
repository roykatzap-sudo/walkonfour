'use client'

import { useMemo, useState } from 'react'
import {
  dogFriendlyPlaces,
  DF_CATEGORIES,
  REGIONS,
  type DFCategory,
} from '@/lib/dogFriendly'

const CAT_STYLE = Object.fromEntries(DF_CATEGORIES.map((c) => [c.key, c])) as Record<
  DFCategory,
  (typeof DF_CATEGORIES)[number]
>

export function DogFriendlyBoard() {
  // כל הקטגוריות פעילות כברירת מחדל; אפשר להוסיף ולהוריד מהמקרא.
  const [active, setActive] = useState<Set<DFCategory>>(() => new Set(DF_CATEGORIES.map((c) => c.key)))
  const [region, setRegion] = useState<string>('הכל')

  const counts = useMemo(() => {
    const m = new Map<DFCategory, number>()
    for (const p of dogFriendlyPlaces) m.set(p.category, (m.get(p.category) ?? 0) + 1)
    return m
  }, [])

  const filtered = useMemo(
    () =>
      dogFriendlyPlaces.filter(
        (p) => active.has(p.category) && (region === 'הכל' || p.region === region),
      ),
    [active, region],
  )

  function toggle(cat: DFCategory) {
    setActive((prev) => {
      const next = new Set(prev)
      next.has(cat) ? next.delete(cat) : next.add(cat)
      return next
    })
  }

  const allOn = active.size === DF_CATEGORIES.length

  return (
    <div className="df">
      {/* ===== מקרא אינטראקטיבי ===== */}
      <div className="df-legend" role="group" aria-label="סינון לפי קטגוריה">
        {DF_CATEGORIES.map((c) => {
          const on = active.has(c.key)
          return (
            <button
              key={c.key}
              type="button"
              className={`df-chip${on ? ' on' : ''}`}
              aria-pressed={on}
              onClick={() => toggle(c.key)}
              style={on ? { background: c.bg, color: c.fg, borderColor: c.fg } : undefined}
            >
              <span aria-hidden="true">{c.icon}</span>
              {c.key}
              <span className="df-chip-count">{counts.get(c.key) ?? 0}</span>
            </button>
          )
        })}
        <button
          type="button"
          className="df-chip df-chip-all"
          onClick={() => setActive(allOn ? new Set() : new Set(DF_CATEGORIES.map((x) => x.key)))}
        >
          {allOn ? 'נקה הכל' : 'בחר הכל'}
        </button>
      </div>

      {/* ===== סינון אזור ===== */}
      <div className="df-region">
        <label htmlFor="df-region-sel">אזור:</label>
        <select id="df-region-sel" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="הכל">כל הארץ</option>
          {REGIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <span className="df-result-count">{filtered.length} מקומות</span>
      </div>

      {/* ===== כרטיסים ===== */}
      {filtered.length === 0 ? (
        <div className="df-empty">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/breeds-wc/beagle.png" alt="" width={120} height={168} style={{ display: 'block', margin: '0 auto 12px', borderRadius: 16, opacity: 0.9 }} />
          לא נבחרו קטגוריות. הדליקו קטגוריה אחת לפחות במקרא למעלה.
        </div>
      ) : (
        <div className="df-grid">
          {filtered.map((p) => {
            const c = CAT_STYLE[p.category]
            return (
              <article key={p.id} className="df-card" style={{ borderTopColor: c.fg }}>
                <div className="df-card-top">
                  <span className="df-card-cat" style={{ background: c.bg, color: c.fg }}>
                    <span aria-hidden="true">{c.icon}</span> {p.category}
                  </span>
                  <span className="df-card-region">{p.region}</span>
                </div>
                <h3 className="df-card-name">{p.name}</h3>
                <div className="df-card-city">📍 {p.city}</div>
                <p className="df-card-note">{p.note}</p>
              </article>
            )
          })}
        </div>
      )}

      <style jsx>{`
        .df { margin-top: 6px; }
        .df-legend { display: flex; flex-wrap: wrap; gap: 9px; margin-bottom: 16px; }
        .df-chip {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 9px 15px; border-radius: 100px; cursor: pointer; font-family: inherit;
          font-size: 14.5px; font-weight: 700; color: #8a7c66;
          background: #fff; border: 1.5px solid #e3dccd; opacity: 0.55;
          transition: opacity 0.15s, transform 0.15s, border-color 0.15s;
        }
        .df-chip.on { opacity: 1; }
        .df-chip:hover { transform: translateY(-2px); }
        .df-chip-count {
          font-size: 12px; font-weight: 800; background: rgba(0, 0, 0, 0.07);
          border-radius: 100px; padding: 1px 8px; min-width: 20px; text-align: center;
        }
        .df-chip-all { color: #8a5a2b; font-weight: 800; border-style: dashed; opacity: 1; }
        .df-chip-all:hover { border-color: var(--brand); }

        .df-region {
          display: flex; align-items: center; gap: 10px; margin-bottom: 22px;
          font-size: 14.5px; color: var(--ink); font-weight: 700;
        }
        .df-region select {
          font-family: inherit; font-size: 14.5px; font-weight: 700; color: var(--ink);
          background: #fff; border: 1.5px solid #e3dccd; border-radius: 12px; padding: 8px 12px; cursor: pointer;
        }
        .df-result-count { margin-inline-start: auto; color: #8a7c66; font-weight: 700; }

        .df-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;
        }
        .df-card {
          background: #fff; border: 1px solid rgba(42, 32, 24, 0.08); border-top: 3px solid;
          border-radius: 16px; padding: 16px 18px; box-shadow: 0 3px 14px rgba(42, 32, 24, 0.05);
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .df-card:hover { transform: translateY(-3px); box-shadow: 0 10px 26px rgba(42, 32, 24, 0.1); }
        .df-card-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
        .df-card-cat { font-size: 12.5px; font-weight: 800; padding: 4px 11px; border-radius: 100px; }
        .df-card-region { font-size: 12.5px; font-weight: 700; color: #9a8c74; }
        .df-card-name { margin: 0 0 4px; font-size: 17.5px; font-weight: 900; color: var(--ink); line-height: 1.3; }
        .df-card-city { font-size: 13.5px; color: #7a6c58; font-weight: 700; margin-bottom: 8px; }
        .df-card-note { margin: 0; font-size: 14px; line-height: 1.6; color: var(--text-secondary, #5a4d3f); }
        .df-empty { text-align: center; color: #8a7c66; padding: 40px 0; font-size: 16px; font-weight: 600; }

        @media (prefers-reduced-motion: reduce) {
          .df-chip, .df-card { transition: none; }
        }
      `}</style>
    </div>
  )
}
