'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { useToast } from '@/components/shared/Toast'
import { FavButton } from '@/components/shared/FavButton'
import {
  ADOPT_SIZES,
  adoptImg,
  sortByUrgency,
  type AdoptDog,
  type AdoptSize,
  type AdoptUrgency,
} from '@/lib/adopt'

/** עיצוב תג הדחיפות לפי סוג - בתוך פלטת הקרם-לברדור בלבד. */
const URGENCY_STYLE: Record<
  AdoptUrgency,
  { bg: string; color: string; border: string; label: string }
> = {
  דחוף: {
    bg: '#2a2018',
    color: '#e8c887',
    border: '1px solid rgba(232,200,135,.45)',
    label: 'דחוף לאימוץ',
  },
  חדש: {
    bg: '#c99a5b',
    color: '#fff',
    border: '1px solid #c99a5b',
    label: 'חדש בלוח',
  },
  רגיל: {
    bg: 'rgba(232,200,135,.18)',
    color: '#a97c46',
    border: '1px solid rgba(201,154,91,.3)',
    label: 'מחפש בית',
  },
}

export function AdoptCard({ dog }: { dog: AdoptDog }) {
  const toast = useToast()
  const urgency = URGENCY_STYLE[dog.urgency]

  return (
    <Tilt3D max={9} glare>
      <div
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
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
            src={adoptImg(dog.photo, 480)}
            alt={`${dog.name} - כלב לאימוץ מ${dog.city}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* תג דחיפות */}
          <span
            style={{
              position: 'absolute',
              top: 12,
              insetInlineStart: 12,
              fontSize: 12,
              fontWeight: 800,
              borderRadius: 'var(--pill-radius)',
              padding: 'var(--chip-lg-pad)',
              backdropFilter: 'blur(6px)',
              background: urgency.bg,
              color: urgency.color,
              border: urgency.border,
            }}
          >
            {urgency.label}
          </span>

          {/* תג גודל */}
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
            {dog.size}
          </span>

          {/* כפתור שמירה למועדפים - מתחת לתג הגודל */}
          <FavButton
            type="adopt"
            id={dog.id}
            label={dog.name}
            style={{ position: 'absolute', top: 54, insetInlineEnd: 12, zIndex: 2 }}
          />

          {/* שם + פרטים על גרדיאנט */}
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
            <h3 style={{ margin: 0, color: '#fff', fontSize: 22, fontWeight: 800 }}>{dog.name}</h3>
            <p style={{ margin: '3px 0 0', color: 'rgba(255,255,255,.85)', fontSize: 14 }}>
              {dog.sex} · {dog.ageLabel} · {dog.breed}
            </p>
          </div>
        </div>

        {/* גוף הכרטיס */}
        <div style={{ padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
          {/* עיר + עמותה */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ color: '#a97c46', fontSize: 14, fontWeight: 700 }} aria-hidden="true">
              ⌖
            </span>
            <span style={{ color: '#2a2018', fontSize: 14, fontWeight: 700 }}>{dog.city}</span>
            <span style={{ color: 'var(--text-soft)', fontSize: 13 }}>· {dog.shelter}</span>
          </div>

          {/* תיאור */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, lineHeight: 1.65, margin: 0, flex: 1 }}>
            {dog.description}
          </p>

          {/* צ'יפים - תכונות + סטטוס חיסון */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {dog.traits.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#a97c46',
                  background: 'rgba(232,200,135,.16)',
                  border: '1px solid rgba(201,154,91,.22)',
                  borderRadius: 'var(--pill-radius)',
                  padding: 'var(--chip-md-pad)',
                }}
              >
                {t}
              </span>
            ))}
            {dog.vaccinated && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#c99a5b',
                  background: 'rgba(232,200,135,.14)',
                  border: '1px solid rgba(232,200,135,.3)',
                  borderRadius: 'var(--pill-radius)',
                  padding: 'var(--chip-md-pad)',
                }}
              >
                ✓ מחוסן ומעוקר
              </span>
            )}
          </div>

          {/* כפתור */}
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
            aria-label={`להביע עניין באימוץ של ${dog.name} מ${dog.city}`}
            onClick={() =>
              toast(`רשמנו שאתם מעוניינים לאמץ את ${dog.name} 🐾 ${dog.shelter} יחזרו אליכם בקרוב`)
            }
          >
            מעוניינים לאמץ את {dog.name}
          </button>
        </div>
      </div>
    </Tilt3D>
  )
}

/**
 * שלד טעינה לכרטיס כלב - מוצג בזמן מעבר בין סינונים כדי שהמשתמש יראה
 * משוב מיידי במקום ממשק "קפוא". הכרטיס דקורטיבי בלבד (aria-hidden),
 * שומר על מבנה וגובה זהים לכרטיס האמיתי כדי שלא יקפוץ הפריסה.
 * האנימציה (shimmer) מבוטלת תחת prefers-reduced-motion (ב-globals).
 */
function SkeletonBlock({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="kv-shimmer"
      style={{
        background: 'linear-gradient(100deg, #f1e9da 30%, #f7f0e3 50%, #f1e9da 70%)',
        backgroundSize: '200% 100%',
        borderRadius: 8,
        ...style,
      }}
    />
  )
}

function SkeletonDogCard() {
  return (
    <div
      aria-hidden
      style={{
        background: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid rgba(42,32,24,.06)',
      }}
    >
      <SkeletonBlock style={{ aspectRatio: '4 / 3', borderRadius: 0 }} />
      <div style={{ padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SkeletonBlock style={{ height: 14, width: '55%' }} />
        <SkeletonBlock style={{ height: 12, width: '100%' }} />
        <SkeletonBlock style={{ height: 12, width: '80%' }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <SkeletonBlock style={{ height: 22, width: 64, borderRadius: 'var(--pill-radius)' }} />
          <SkeletonBlock style={{ height: 22, width: 80, borderRadius: 'var(--pill-radius)' }} />
        </div>
        <SkeletonBlock style={{ height: 44, width: '100%', borderRadius: 12, marginTop: 2 }} />
      </div>
    </div>
  )
}

/** "הכל" + הגדלים - שורת צ'יפים לסינון לפי גודל. */
const SIZE_FILTERS = ['הכל', ...ADOPT_SIZES] as const

/**
 * לוח האימוץ האינטראקטיבי - סינון לפי גודל ולפי עיר, מונה תוצאות
 * ומיון אוטומטי לפי דחיפות. מקבל את הרשימה ואת הערים מהעמוד (שרת),
 * כדי שכל נתוני הדמו יישבו במקום אחד ב-lib/adopt.ts.
 */
export function AdoptBoard({ dogs, cities }: { dogs: AdoptDog[]; cities: string[] }) {
  const [size, setSize] = useState<(typeof SIZE_FILTERS)[number]>('הכל')
  const [city, setCity] = useState<string>('כל הערים')
  const [loading, setLoading] = useState(false)
  const firstRender = useRef(true)

  const filtered = useMemo(() => {
    const byFilters = dogs.filter((d) => {
      const matchesSize = size === 'הכל' || d.size === (size as AdoptSize)
      const matchesCity = city === 'כל הערים' || d.city === city
      return matchesSize && matchesCity
    })
    return sortByUrgency(byFilters)
  }, [dogs, size, city])

  // משוב טעינה קצר בעת מעבר בין סינונים - מציג שלד במקום ממשק קפוא.
  // מדלגים על הטעינה ברינדור הראשון ותחת prefers-reduced-motion.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 280)
    return () => clearTimeout(t)
  }, [size, city])

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
        {/* סינון לפי גודל */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>גודל</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} role="group" aria-label="סינון לפי גודל">
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

        {/* סינון לפי עיר */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 220px', minWidth: 200 }}>
          <label htmlFor="adopt-city" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)' }}>
            עיר
          </label>
          <select
            id="adopt-city"
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
        {loading
          ? 'מסננים…'
          : filtered.length === 1
            ? 'כלב אחד מחכה לבית'
            : `${filtered.length} כלבים מחכים לבית`}
      </p>

      {/* ── שלד טעינה / גריד / מצב ריק ── */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 24,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonDogCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="alert alert-info" style={{ textAlign: 'center' }}>
          לא נמצאו כלבים מתאימים לסינון הנוכחי. נסו גודל אחר או בחרו עיר אחרת.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: 24,
          }}
        >
          {filtered.map((dog, i) => (
            <Reveal3D key={dog.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <AdoptCard dog={dog} />
            </Reveal3D>
          ))}
        </div>
      )}
    </div>
  )
}
