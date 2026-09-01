'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BizCard } from '@/components/businesses/BizCard'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import {
  BIZ_CATEGORIES,
  BIZ_CATEGORY_ICON,
} from '@/lib/businesses'
import type { DirectoryBusiness } from '@/lib/directory/types'

const CAT_FILTERS = ['הכל', ...BIZ_CATEGORIES] as const

export default function BusinessesPage() {
  const [category, setCategory] = useState<string>('הכל')
  const [city, setCity] = useState<string>('הכל')
  const [businesses, setBusinesses] = useState<DirectoryBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/directory/businesses')
        const data = await res.json()
        if (!cancelled && data.ok) {
          setBusinesses(data.businesses ?? [])
        }
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const cities = useMemo(() => {
    return Array.from(new Set(businesses.map((b) => b.city))).sort((a, b) =>
      a.localeCompare(b, 'he'),
    )
  }, [businesses])

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const matchesCat = category === 'הכל' || b.category === category
      const matchesCity = city === 'הכל' || b.city === city
      return matchesCat && matchesCity
    })
  }, [businesses, category, city])

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
          <span className="section-tag">מדריך בעלי מקצוע</span>
          <h1 id="biz-title" className="page-title grad-text" style={{ marginTop: 10 }}>
            וטרינר טוב, לפני שצריך אותו דחוף
          </h1>
          <p className="page-sub" style={{ maxWidth: 620, margin: '12px auto 0' }}>
            וטרינרים, מספרות, מאלפים, פנסיונים וחנויות - הדירוגים מבעלי כלבים אמיתיים, לא מכוכבים שקנו.
          </p>
          <Link
            href="/businesses/apply"
            className="btn btn-primary"
            style={{ marginTop: 20 }}
          >
            הוסיפו את העסק שלכם - בחינם
          </Link>
        </div>
      </section>

      {/* ── באנר הצטרפות ── */}
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
            פרסום חינם, עולה לאתר מיד, ונחשף לכל קהילת בעלי הכלבים שלנו.
          </div>
        </div>
        <Link
          href="/businesses/apply"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap' }}
        >
          הוסיפו את העסק שלכם
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

        {/* סינון עיר */}
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
            {cities.map((c) => (
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

      {/* ── תוכן ── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="kv-skel-card" style={{ height: 220 }}>
              <div className="kv-skel" style={{ height: '100%' }} />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="alert alert-error" style={{ textAlign: 'center' }}>
          לא הצלחנו לטעון את המדריך. נסו לרענן את העמוד.
        </div>
      ) : (
        <>
          {/* ── מונה תוצאות ── */}
          <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
            {filtered.length} עסקים
          </p>

          {/* ── גריד העסקים ── */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 16 }}>
                עדיין אין עסקים כאלה במדריך
              </p>
              <Link href="/businesses/apply" className="btn btn-primary">
                הוסיפו את העסק שלכם - בחינם
              </Link>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 24,
              }}
            >
              {filtered.map((b) => (
                <BizCard key={b.id} business={b} />
              ))}
            </div>
          )}

          {/* ── גילוי נאות ── */}
          <p className="muted" style={{ fontSize: 13, marginTop: 28, textAlign: 'center' }}>
            הפרטים והביקורות במדריך מפורסמים על ידי הגולשים ובעלי העסקים עצמם ומשקפים את דעתם בלבד.
            זהות הכותבים אינה מאומתת. נתקלתם בבעיה? השתמשו בכפתור הדיווח בעמוד העסק.
          </p>
        </>
      )}
    </main>
  )
}
