'use client'

import { useMemo, useState } from 'react'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import {
  WALK_DIFFICULTIES,
  walkImg,
  walkNavUrl,
  type Walk,
  type WalkDifficulty,
} from '@/lib/walks'

/** עיצוב תג רמת הקושי - בתוך פלטת הקרם-לברדור בלבד. */
const DIFFICULTY_STYLE: Record<
  WalkDifficulty,
  { bg: string; color: string; border: string }
> = {
  קל: {
    bg: 'rgba(232,200,135,.2)',
    color: '#a97c46',
    border: '1px solid rgba(201,154,91,.32)',
  },
  בינוני: {
    bg: '#c99a5b',
    color: '#fff',
    border: '1px solid #c99a5b',
  },
  מאתגר: {
    bg: '#2a2018',
    color: '#e8c887',
    border: '1px solid rgba(232,200,135,.45)',
  },
}

/** שורת מאפיין עם סימון כן/לא - צל / מים / מגודר. */
function FactBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontSize: 12.5,
        fontWeight: 700,
        borderRadius: 100,
        padding: '5px 12px',
        background: active ? 'rgba(232,200,135,.16)' : 'rgba(42,32,24,.05)',
        color: active ? '#a97c46' : '#9a8c7c',
        border: active ? '1px solid rgba(201,154,91,.24)' : '1px solid rgba(42,32,24,.08)',
      }}
    >
      <span aria-hidden="true" style={{ fontWeight: 800 }}>
        {active ? '✓' : '-'}
      </span>
      {label}
    </span>
  )
}

export function WalkCard({ walk }: { walk: Walk }) {
  const diff = DIFFICULTY_STYLE[walk.difficulty]

  return (
    <Tilt3D max={9} glare>
      <div
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(42,32,24,.08)',
          border: '1px solid rgba(42,32,24,.06)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* תמונה + תגים */}
        <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={walkImg(walk.photo, 480)}
            alt={`מסלול ${walk.name} ב${walk.city}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* תג רמת קושי */}
          <span
            style={{
              position: 'absolute',
              top: 12,
              insetInlineStart: 12,
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 100,
              padding: '5px 13px',
              backdropFilter: 'blur(6px)',
              background: diff.bg,
              color: diff.color,
              border: diff.border,
            }}
          >
            {walk.difficulty}
          </span>

          {/* תג אורך המסלול */}
          <span
            className="chip3d-dark"
            style={{
              position: 'absolute',
              top: 12,
              insetInlineEnd: 12,
              backdropFilter: 'blur(6px)',
              background: 'rgba(42,32,24,.55)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.25)',
            }}
          >
            {walk.lengthKm} ק״מ
          </span>

          {/* שם + מיקום על גרדיאנט */}
          <div
            style={{
              position: 'absolute',
              insetInlineStart: 0,
              insetInlineEnd: 0,
              bottom: 0,
              padding: '40px 16px 14px',
              background:
                'linear-gradient(to top, rgba(42,32,24,.92), rgba(42,32,24,.5) 55%, transparent)',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 800 }}>{walk.name}</h3>
            <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,.85)', fontSize: 14 }}>
              {walk.city} · {walk.region}
            </p>
          </div>
        </div>

        {/* גוף הכרטיס */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {/* תיאור */}
          <p style={{ color: '#5a4c3e', fontSize: 14.5, lineHeight: 1.65, margin: 0, flex: 1 }}>
            {walk.description}
          </p>

          {/* מאפייני המסלול - צל / מים / מגודר */}
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            role="group"
            aria-label="מאפייני המסלול"
          >
            <FactBadge label="צל" active={walk.shade} />
            <FactBadge label="מים בדרך" active={walk.water} />
            <FactBadge label="מקטע מגודר" active={walk.fenced} />
          </div>

          {/* צ'יפים - מאפיינים נוספים */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {walk.traits.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#a97c46',
                  background: 'rgba(232,200,135,.16)',
                  border: '1px solid rgba(201,154,91,.22)',
                  borderRadius: 100,
                  padding: '5px 12px',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* כפתור ניווט ל-Google Maps */}
          <a
            href={walkNavUrl(walk)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              marginTop: 2,
              textDecoration: 'none',
            }}
            aria-label={`ניווט בגוגל מפות אל נקודת ההתחלה של מסלול ${walk.name} ב${walk.city}`}
          >
            <span aria-hidden="true" style={{ marginInlineEnd: 8 }}>
              ⌖
            </span>
            נווט לנקודת ההתחלה
          </a>
        </div>
      </div>
    </Tilt3D>
  )
}

/** "הכל" + רמות הקושי - שורת צ'יפים לסינון לפי קושי. */
const DIFFICULTY_FILTERS = ['הכל', ...WALK_DIFFICULTIES] as const

/**
 * לוח המסלולים האינטראקטיבי - סינון לפי עיר ולפי רמת קושי, עם מונה
 * תוצאות ומצב ריק. מקבל את הרשימה ואת הערים מהעמוד (שרת), כדי שכל
 * נתוני הדמו יישבו במקום אחד ב-lib/walks.ts.
 */
export function WalkBoard({ walks, cities }: { walks: Walk[]; cities: string[] }) {
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTY_FILTERS)[number]>('הכל')
  const [city, setCity] = useState<string>('כל הערים')

  const filtered = useMemo(
    () =>
      walks.filter((w) => {
        const matchesDifficulty =
          difficulty === 'הכל' || w.difficulty === (difficulty as WalkDifficulty)
        const matchesCity = city === 'כל הערים' || w.city === city
        return matchesDifficulty && matchesCity
      }),
    [walks, difficulty, city],
  )

  return (
    <div>
      {/* ── שורת סינון ── */}
      <div
        className="glass"
        style={{
          padding: 18,
          borderRadius: 20,
          marginBottom: 26,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}
      >
        {/* סינון לפי רמת קושי */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#7a6a58' }}>רמת קושי</span>
          <div
            style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}
            role="group"
            aria-label="סינון לפי רמת קושי"
          >
            {DIFFICULTY_FILTERS.map((d) => {
              const active = difficulty === d
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  aria-pressed={active}
                  aria-label={d === 'הכל' ? 'הצגת כל רמות הקושי' : `סינון לפי רמת קושי ${d}`}
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
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* סינון לפי עיר */}
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 220px', minWidth: 200 }}
        >
          <label htmlFor="walk-city" style={{ fontSize: 13, fontWeight: 700, color: '#7a6a58' }}>
            עיר
          </label>
          <select
            id="walk-city"
            className="input"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            aria-label="סינון לפי עיר"
            style={{ minHeight: 44 }}
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── מונה תוצאות ── */}
      <p className="muted" style={{ marginBottom: 18, fontWeight: 600 }} aria-live="polite">
        {filtered.length === 1 ? 'מסלול אחד תואם' : `${filtered.length} מסלולים תואמים`}
      </p>

      {/* ── גריד / מצב ריק ── */}
      {filtered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          לא נמצאו מסלולים מתאימים לסינון הנוכחי. נסו רמת קושי אחרת או בחרו עיר אחרת.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((walk, i) => (
            <Reveal3D key={walk.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <WalkCard walk={walk} />
            </Reveal3D>
          ))}
        </div>
      )}
    </div>
  )
}
