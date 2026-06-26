'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BizCard } from '@/components/businesses/BizCard'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { DemoBanner } from '@/components/shared/DemoBanner'
import {
  demoBusinesses,
  BIZ_CATEGORIES,
  BIZ_CITIES,
  BIZ_CATEGORY_ICON,
} from '@/lib/businesses'

const CAT_FILTERS = ['הכל', ...BIZ_CATEGORIES] as const

export default function BusinessesPage() {
  const [category, setCategory] = useState<string>('הכל')
  const [city, setCity] = useState<string>('הכל')

  const filtered = useMemo(() => {
    return demoBusinesses.filter((b) => {
      const matchesCat = category === 'הכל' || b.category === category
      const matchesCity = city === 'הכל' || b.city === city
      return matchesCat && matchesCity
    })
  }, [category, city])

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        aria-labelledby="biz-title"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 32,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">ספריית העסקים</span>
          <h1 id="biz-title" className="page-title grad-text" style={{ marginTop: 10 }}>
            וטרינר טוב, לפני שצריך אותו דחוף
          </h1>
          <p className="page-sub" style={{ maxWidth: 620, margin: '12px auto 0' }}>
            וטרינרים, מספרות, מאלפים, פנסיונים וחנויות - כל אחד פה כי מישהו מהקהילה
            שלח אליו את הכלב שלו וחזר מרוצה. הדירוגים מבעלי כלבים אמיתיים, לא מכוכבים שקנו.
          </p>
        </div>
      </section>

      <DemoBanner />

      {/* ── באנר הצטרפות לספרייה (מנוע ההכנסה) ── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#2a2018',
          borderRadius: 20,
          padding: '22px 26px',
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
            נותנים שירות טוב לכלבים? תנו לנו לספר עליכם
          </div>
          <div style={{ color: '#d8c7b0', fontSize: 14, marginTop: 4, maxWidth: 460 }}>
            4,800 בעלי כלבים מחפשים פה מספרה, מאלף או פנסיון. פרופיל, תג מאומת, וקידום לראש
            הקטגוריה אם בא לכם לבלוט.
          </div>
        </div>
        <Link
          href="/businesses/apply"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap' }}
        >
          רוצים להופיע כאן ←
        </Link>
      </div>

      {/* ── סרגל סינון ── */}
      <div
        className="glass"
        style={{
          padding: 18,
          borderRadius: 20,
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* סינון קטגוריה - צ'יפים */}
        <div>
          <span
            id="cat-label"
            style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#7a6a58', marginBottom: 10 }}
          >
            קטגוריה
          </span>
          <div
            role="group"
            aria-labelledby="cat-label"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
          >
            {CAT_FILTERS.map((c) => {
              const active = category === c
              const icon = c === 'הכל' ? '🐾' : BIZ_CATEGORY_ICON[c]
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  aria-label={c === 'הכל' ? 'הצגת כל הקטגוריות' : `סינון לפי ${c}`}
                  className="chip3d"
                  style={{
                    cursor: 'pointer',
                    minHeight: 44,
                    border: active ? '1px solid #c99a5b' : undefined,
                    background: active ? '#c99a5b' : undefined,
                    color: active ? '#fff' : undefined,
                    transition: 'all .2s ease',
                  }}
                >
                  <span aria-hidden>{icon}</span> {c}
                </button>
              )
            })}
          </div>
        </div>

        {/* סינון עיר - תפריט נבחר */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
          <label htmlFor="city-select" style={{ fontSize: 13, fontWeight: 700, color: '#7a6a58' }}>
            עיר
          </label>
          <select
            id="city-select"
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{ minWidth: 200, cursor: 'pointer' }}
          >
            <option value="הכל">כל הערים</option>
            {BIZ_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {(category !== 'הכל' || city !== 'הכל') && (
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '8px 18px', minHeight: 44, fontSize: 14 }}
              onClick={() => {
                setCategory('הכל')
                setCity('הכל')
              }}
            >
              איפוס סינון
            </button>
          )}
        </div>
      </div>

      {/* ── מונה תוצאות ── */}
      <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
        {filtered.length} עסקים
      </p>

      {/* ── גריד העסקים ── */}
      {filtered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          לא נמצאו עסקים שמתאימים לסינון. נסו קטגוריה או עיר אחרת, או אפסו את הסינון.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((b, i) => (
            <Reveal3D key={b.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <BizCard business={b} />
            </Reveal3D>
          ))}
        </div>
      )}
    </main>
  )
}
