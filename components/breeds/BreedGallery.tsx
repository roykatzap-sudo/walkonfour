'use client'

import { memo, useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { FavButton } from '@/components/shared/FavButton'
import { breedImg, BREED_SIZES, type Breed } from '@/lib/breeds'

/** "הכל" + מידות הגזעים - שורת צ'יפים לסינון. */
const SIZE_FILTERS = ['הכל', ...BREED_SIZES] as const

export function BreedGallery({ breeds }: { breeds: Breed[] }) {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState<string>('הכל')
  const [flipped, setFlipped] = useState<Record<number, boolean>>({})

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return breeds.filter((b) => {
      const matchesQuery =
        !q || b.name.toLowerCase().includes(q) || b.en.toLowerCase().includes(q)
      const matchesSize = size === 'הכל' || b.size === size
      return matchesQuery && matchesSize
    })
  }, [breeds, query, size])

  const toggleFlip = useCallback((i: number) => {
    setFlipped((prev) => ({ ...prev, [i]: !prev[i] }))
  }, [])

  return (
    <div>
      {/* ── שורת חיפוש + סינון ── */}
      <div
        className="glass"
        style={{
          padding: 18,
          borderRadius: 20,
          marginBottom: 28,
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
          placeholder="חפשו גזע - בעברית או באנגלית…"
          aria-label="חיפוש גזע"
          style={{ flex: '1 1 260px', minWidth: 220 }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SIZE_FILTERS.map((s) => {
            const active = size === s
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                aria-pressed={active}
                aria-label={s === 'הכל' ? 'הצגת כל הגדלים' : `סינון לפי גודל ${s}`}
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
                {s}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── מונה תוצאות ── */}
      <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
        {filtered.length} גזעים
      </p>

      {/* ── גריד כרטיסי-פליפ ── */}
      {filtered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          לא מצאנו גזע שמתאים לחיפוש. נסו שם אחר או אפסו את הסינון.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 12,
          }}
        >
          {filtered.map((breed, i) => (
            <Reveal3D key={breed.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <BreedFlipCard
                breed={breed}
                index={i}
                flipped={!!flipped[i]}
                onToggle={toggleFlip}
              />
            </Reveal3D>
          ))}
        </div>
      )}
    </div>
  )
}

const BreedFlipCard = memo(function BreedFlipCard({
  breed,
  index,
  flipped,
  onToggle,
}: {
  breed: Breed
  index: number
  flipped: boolean
  onToggle: (i: number) => void
}) {
  const isCanaan = breed.slug === 'canaan'

  return (
    <div
      className={`flip${flipped ? ' flipped' : ''}`}
      onClick={() => onToggle(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggle(index)
        } else if (e.key === 'Escape') {
          e.currentTarget.blur()
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `${breed.name} - הצגת התמונה`
          : `${breed.name} - הצגת פרטים נוספים`
      }
      style={{ cursor: 'pointer' }}
    >
      <div className="flip-inner" style={{ height: 320 }}>
        {/* ── פנים קדמית ── */}
        <div
          className="flip-face"
          style={{
            boxShadow: '0 14px 36px rgba(42,32,24,.16)',
          }}
        >
          <img loading="lazy" decoding="async"
            src={breedImg(breed.photo)}
            alt={`כלב מגזע ${breed.name}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              display: 'block',
            }}
          />

          {/* כפתור שמירה למועדפים - פינה תחתונה-התחלה, מעל הגרדיאנט */}
          <FavButton
            type="breed"
            id={breed.slug}
            label={breed.name}
            style={{
              position: 'absolute',
              bottom: 12,
              insetInlineStart: 12,
              zIndex: 3,
            }}
          />

          {/* צ'יפ גודל בפינה */}
          <span
            className="chip3d-dark"
            style={{
              position: 'absolute',
              top: 12,
              insetInlineStart: 12,
              backdropFilter: 'blur(6px)',
              background: 'rgba(42,32,24,.55)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.25)',
            }}
          >
            {breed.size}
          </span>

          {/* תג הגזע הישראלי */}
          {isCanaan && (
            <span
              className="chip3d"
              style={{
                position: 'absolute',
                top: 12,
                insetInlineEnd: 12,
                background: '#fff',
                color: '#c99a5b',
                border: '1px solid #e8c887',
                fontWeight: 800,
              }}
            >
              <span aria-hidden>🇮🇱</span> הגזע הישראלי
            </span>
          )}

          {/* שם על גרדיאנט */}
          <div
            style={{
              position: 'absolute',
              insetInlineStart: 0,
              insetInlineEnd: 0,
              bottom: 0,
              padding: '40px 16px 16px',
              background:
                'linear-gradient(to top, rgba(42,32,24,.92), rgba(42,32,24,.55) 55%, transparent)',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff', fontSize: 20, fontWeight: 800 }}>
              {breed.name}
            </h3>
            <p
              lang="en"
              style={{ margin: '2px 0 0', color: 'rgba(255,255,255,.82)', fontSize: 13 }}
            >
              {breed.en}
            </p>
          </div>
        </div>

        {/* ── פנים אחורית ── */}
        <div
          className="flip-face flip-back"
          style={{
            background: 'linear-gradient(160deg, #2a2018, #3a2c1d)',
            color: '#fff',
            padding: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            boxShadow: '0 14px 36px rgba(42,32,24,.16)',
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#fff' }}>
              {breed.name}
            </h3>
            <p
              lang="en"
              style={{ margin: '2px 0 0', color: '#e8c887', fontSize: 13, fontWeight: 600 }}
            >
              {breed.en}
            </p>
          </div>

          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.82)' }}>
            {breed.blurb}
          </p>

          {/* טמפרמנט כצ'יפים */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {breed.temperament.map((t) => (
              <span key={t} className="chip3d-dark" style={{ fontSize: 11, padding: '4px 10px' }}>
                {t}
              </span>
            ))}
          </div>

          {/* אנרגיה כנקודות */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 600 }}>
              אנרגיה
            </span>
            <span style={{ display: 'flex', gap: 4 }} aria-label={`אנרגיה ${breed.energy} מתוך 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: '50%',
                    background: n <= breed.energy ? '#e8c887' : 'rgba(255,255,255,.18)',
                  }}
                />
              ))}
            </span>
          </div>

          {/* תוחלת חיים */}
          <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)' }}>
            תוחלת חיים: <strong style={{ color: '#fff' }}>{breed.lifespan} שנים</strong>
          </div>

          {/* לינק לפרופיל */}
          <div style={{ marginTop: 'auto', paddingTop: 6 }}>
            <Link
              href={`/breeds/${breed.slug}`}
              onClick={(e) => e.stopPropagation()}
              aria-label={`למדריך המלא על ${breed.name}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                minHeight: 44,
                fontSize: 13.5,
                fontWeight: 700,
                color: '#e8c887',
                textDecoration: 'none',
              }}
            >
              למדריך המלא ←
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})
