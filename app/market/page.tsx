'use client'

import { useMemo, useState } from 'react'
import { ListingCard } from '@/components/market/ListingCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { demoListings, CATEGORY_FILTERS } from '@/lib/market'

export default function MarketPage() {
  const [category, setCategory] = useState<string>('הכל')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return demoListings.filter((l) => {
      const matchesCategory = category === 'הכל' || l.category === category
      const matchesQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [category, query])

  // מודעות מקודמות תמיד מופיעות ראשונות (רמז למונטיזציה).
  const ordered = useMemo(
    () => [...filtered].sort((a, b) => Number(b.promoted ?? false) - Number(a.promoted ?? false)),
    [filtered],
  )

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 28,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f6ecd8 0%, #fbf7ef 100%)',
          border: '1px solid rgba(232,200,135,.18)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">יד שנייה</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            ציוד משומש שמחכה לבית חדש
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 580 }}>
            כלוב שהגור גדל ממנו, רתמה שלא התאימה, מיטה שנקנתה במידה לא נכונה. דברים טובים
            של בעלי כלבים מהאזור, בשבריר מהמחיר בחנות. חבל שיתפסו אבק במחסן.
          </p>
          <div style={{ marginTop: 22, display: 'flex', justifyContent: 'center' }}>
            <MagneticButton className="btn btn-dark" href="/market/post-ad">
              פרסום מודעה חינם
            </MagneticButton>
          </div>
        </div>
      </section>

      <DemoBanner />

      {/* ── סרגל חיפוש + סינון ── */}
      <div
        className="glass"
        style={{
          padding: 18,
          borderRadius: 20,
          marginBottom: 24,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <input
          className="input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפשו פריט, עיר או מילה בתיאור…"
          aria-label="חיפוש בשוק יד שנייה"
          style={{ flex: '1 1 260px', minWidth: 220 }}
        />
        <div
          role="group"
          aria-label="סינון לפי קטגוריה"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
        >
          {CATEGORY_FILTERS.map((c) => {
            const active = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={active}
                aria-label={c === 'הכל' ? 'הצגת כל הקטגוריות' : `סינון לקטגוריה ${c}`}
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
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── מונה תוצאות ── */}
      <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
        {ordered.length} מודעות
      </p>

      {/* ── גריד המודעות ── */}
      {ordered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          לא נמצאו מודעות שמתאימות לחיפוש. נסו קטגוריה אחרת או אפסו את הסינון.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {ordered.map((listing, i) => (
            <Reveal3D key={listing.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <ListingCard listing={listing} />
            </Reveal3D>
          ))}
        </div>
      )}

      {/* ── רצועת קריאה לפעולה לפרסום ── */}
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
          marginTop: 32,
        }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
            הכלוב ההוא תופס לכם חצי מהמרפסת?
          </div>
          <div style={{ color: '#d8c9b4', fontSize: 14, marginTop: 4 }}>
            תמונה, מחיר, פרטים - והמודעה באוויר. בחינם. ואם בא לכם שימכרו מהר, אפשר לקפוץ לראש העמוד.
          </div>
        </div>
        <MagneticButton className="btn btn-primary" href="/market/post-ad">
          פרסום מודעה
        </MagneticButton>
      </div>
    </main>
  )
}
