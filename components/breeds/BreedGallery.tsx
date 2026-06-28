'use client'

import { memo, useMemo, useState } from 'react'
import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { FavButton } from '@/components/shared/FavButton'
import { breedFace, BREED_SIZES, type Breed } from '@/lib/breeds'

/** "הכל" + מידות הגזעים - שורת צ'יפים לסינון. */
const SIZE_FILTERS = ['הכל', ...BREED_SIZES] as const

/** רמות אנרגיה לסינון - מיפוי לטווח energy. */
const ENERGY_FILTERS = [
  { key: 'all', label: 'כל האנרגיות' },
  { key: 'calm', label: 'רגוע' },
  { key: 'balanced', label: 'מאוזן' },
  { key: 'active', label: 'אנרגטי' },
] as const
type EnergyKey = (typeof ENERGY_FILTERS)[number]['key']

function matchesEnergy(energy: number, key: EnergyKey): boolean {
  if (key === 'all') return true
  if (key === 'calm') return energy <= 2
  if (key === 'balanced') return energy === 3
  return energy >= 4 // active
}

/** קישור היעד הקנוני לכל גזע - תמיד עמוד הפרופיל (עם מחשבון העלות והנתונים). */
const breedTarget = (slug: string) => `/breeds/${slug}`

export function BreedGallery({ breeds }: { breeds: Breed[] }) {
  const [query, setQuery] = useState('')
  const [size, setSize] = useState<string>('הכל')
  const [energy, setEnergy] = useState<EnergyKey>('all')
  const [kidsOnly, setKidsOnly] = useState(false)
  const [apartmentOnly, setApartmentOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return breeds.filter((b) => {
      const matchesQuery =
        !q || b.name.toLowerCase().includes(q) || b.en.toLowerCase().includes(q)
      const matchesSize = size === 'הכל' || b.size === size
      const matchesKids = !kidsOnly || b.goodWithKids
      const matchesApartment = !apartmentOnly || b.size === 'קטן' || b.size === 'בינוני'
      return (
        matchesQuery &&
        matchesSize &&
        matchesEnergy(b.energy, energy) &&
        matchesKids &&
        matchesApartment
      )
    })
  }, [breeds, query, size, energy, kidsOnly, apartmentOnly])

  const hasActiveFilters =
    !!query || size !== 'הכל' || energy !== 'all' || kidsOnly || apartmentOnly

  const resetAll = () => {
    setQuery('')
    setSize('הכל')
    setEnergy('all')
    setKidsOnly(false)
    setApartmentOnly(false)
  }

  return (
    <div>
      {/* גישת hover-flip רק במכשירים עם עכבר אמיתי - במגע אין hover ולכן הכרטיס לא יתהפך בטעות */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .breed-flip:hover .flip-inner { transform: none; }
            @media (hover: hover) and (pointer: fine) {
              .breed-flip:hover .flip-inner { transform: rotateY(180deg); }
            }
            .breed-flip.flipped .flip-inner { transform: rotateY(180deg) !important; }
            .breed-toggle { display:inline-flex; align-items:center; gap:8px; min-height:44px; padding:8px 16px; border-radius:999px; font-size:14px; font-weight:700; cursor:pointer; transition: all .2s ease; }
          `,
        }}
      />

      {/* ── שורת חיפוש + סינון גודל ── */}
      <div
        className="glass"
        style={{
          padding: 18,
          borderRadius: 20,
          marginBottom: 16,
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

      {/* ── שורת התאמה: אנרגיה · ילדים · דירה ── */}
      <div
        className="glass"
        style={{
          padding: 16,
          borderRadius: 20,
          marginBottom: 28,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: '#6a6155' }}>רמת אנרגיה:</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ENERGY_FILTERS.map((f) => {
              const active = energy === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setEnergy(f.key)}
                  aria-pressed={active}
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
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <button
            type="button"
            onClick={() => setKidsOnly((v) => !v)}
            aria-pressed={kidsOnly}
            className="breed-toggle"
            style={{
              border: kidsOnly ? '1px solid #c99a5b' : '1px solid rgba(201,154,91,.3)',
              background: kidsOnly ? '#c99a5b' : '#fff',
              color: kidsOnly ? '#fff' : '#6a6155',
            }}
          >
            <span aria-hidden>👶</span> מתאים לילדים
          </button>
          <button
            type="button"
            onClick={() => setApartmentOnly((v) => !v)}
            aria-pressed={apartmentOnly}
            className="breed-toggle"
            style={{
              border: apartmentOnly ? '1px solid #c99a5b' : '1px solid rgba(201,154,91,.3)',
              background: apartmentOnly ? '#c99a5b' : '#fff',
              color: apartmentOnly ? '#fff' : '#6a6155',
            }}
          >
            <span aria-hidden>🏠</span> מתאים לדירה
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="breed-toggle"
            style={{
              marginInlineStart: 'auto',
              border: '1px solid rgba(180,80,46,.3)',
              background: '#fff',
              color: '#b4502e',
            }}
          >
            נקה הכל ✕
          </button>
        )}
      </div>

      {/* ── מונה תוצאות ── */}
      <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
        {filtered.length} גזעים
      </p>

      {/* ── גריד כרטיסי-פליפ ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            background: '#fdf6e9',
            border: '1px solid rgba(201,154,91,.22)',
            borderRadius: 20,
            padding: '40px 28px',
            maxWidth: 460,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 40 }} aria-hidden>🐾</div>
          <p style={{ fontSize: 17, fontWeight: 800, color: '#241a12', margin: '10px 0 6px' }}>
            לא מצאנו גזע שמתאים לסינון
          </p>
          <p style={{ fontSize: 15, color: '#6a6155', margin: '0 0 18px', lineHeight: 1.6 }}>
            נסו שם אחר או הרחיבו את הסינון.
          </p>
          <button
            type="button"
            onClick={resetAll}
            className="btn btn-primary"
            style={{ minHeight: 44 }}
          >
            הצגת כל הגזעים
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 18,
          }}
        >
          {filtered.map((breed, i) => (
            <Reveal3D key={breed.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <BreedFlipCard breed={breed} />
            </Reveal3D>
          ))}
        </div>
      )}
    </div>
  )
}

const BreedFlipCard = memo(function BreedFlipCard({ breed }: { breed: Breed }) {
  const isCanaan = breed.slug === 'canaan'
  const [flipped, setFlipped] = useState(false)
  const target = breedTarget(breed.slug)

  return (
    <div className={`flip breed-flip${flipped ? ' flipped' : ''}`}>
      <div className="flip-inner" style={{ height: 320 }}>
        {/* ── פנים קדמית ── */}
        <div
          className="flip-face"
          style={{ boxShadow: '0 14px 36px rgba(42,32,24,.16)' }}
        >
          {/* כל הפנים הקדמית = קישור לפרופיל (יעד עקבי לכל הגזעים) */}
          <Link
            href={target}
            aria-label={`למדריך המלא על ${breed.name}`}
            style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'block' }}
          />

          <img
            loading="lazy"
            decoding="async"
            src={breedFace(breed.photo)}
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
              zIndex: 2,
            }}
          >
            {breed.size}
          </span>

          {/* כפתור הפיכה מפורש - נגיש במגע ובלחיצה */}
          <button
            type="button"
            onClick={() => setFlipped(true)}
            aria-label={`הצגת פרטי ${breed.name}`}
            title="פרטים נוספים"
            style={{
              position: 'absolute',
              // ברירת מחדל: פינה עליונה-סוף. בכנעני שם תג "הגזע הישראלי" - יורדים שורה.
              top: isCanaan ? 58 : 10,
              insetInlineEnd: 10,
              zIndex: 3,
              width: 40,
              height: 40,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,.3)',
              background: 'rgba(42,32,24,.55)',
              backdropFilter: 'blur(6px)',
              color: '#fff',
              fontSize: 18,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            <span aria-hidden>↻</span>
          </button>

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
                zIndex: 2,
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
              pointerEvents: 'none',
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1 }}>
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
            {/* כפתור חזרה לפנים הקדמית */}
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label="חזרה לתמונה"
              title="חזרה"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,.25)',
                background: 'rgba(255,255,255,.08)',
                color: '#fff',
                fontSize: 16,
                cursor: 'pointer',
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              <span aria-hidden>↺</span>
            </button>
          </div>

          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,.82)', overflow: 'hidden' }}>
            {breed.blurb.length > 150 ? breed.blurb.slice(0, 150).trim() + '…' : breed.blurb}
          </p>

          {/* טמפרמנט כצ'יפים */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {breed.temperament.map((t) => (
              <span key={t} className="chip3d-dark" style={{ fontSize: 11, padding: '4px 10px' }}>
                {t}
              </span>
            ))}
          </div>

          {/* אנרגיה כנקודות + מספר גלוי */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,.78)', fontWeight: 600 }}>
              אנרגיה
            </span>
            <span style={{ display: 'flex', gap: 4 }} aria-hidden>
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
            <span style={{ fontSize: 13, color: '#e8c887', fontWeight: 700 }}>
              {breed.energy}/5
            </span>
          </div>

          {/* תוחלת חיים */}
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.72)' }}>
            תוחלת חיים: <strong style={{ color: '#fff' }}>{breed.lifespan} שנים</strong>
          </div>

          {/* לינק לפרופיל */}
          <div style={{ marginTop: 'auto', paddingTop: 6 }}>
            <Link
              href={target}
              aria-label={`למדריך המלא על ${breed.name}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                minHeight: 44,
                fontSize: 14,
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
