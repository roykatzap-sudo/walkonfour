'use client'

import { useState } from 'react'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { useToast } from '@/components/shared/Toast'
import { wallImg, type WallPhoto } from '@/lib/wall'

/** יחס גובה-רוחב לכל צורת תמונה - מה שיוצר את מראה ה-masonry. */
const ASPECT: Record<WallPhoto['shape'], string> = {
  tall: '3 / 4',
  wide: '4 / 3',
  square: '1 / 1',
}

/**
 * כרטיס בודד בקיר הכלבים - תמונה, פרטי הכלב, וכפתור "אהבתי" אינטראקטיבי.
 *
 * כל כרטיס מנהל state מקומי משלו: מספר הלבבות והאם המשתמש כבר אהב.
 * אין backend, ולכן הלחיצה מעדכנת את ה-state, מציגה toast, ולא נשמרת
 * בין רענונים - בדיוק כמו שאר הפעולות באתר.
 *
 * נגישות: כפתור "אהבתי" הוא <button> אמיתי עם aria-pressed שמשקף אם
 * אהבתם, ו-aria-label שמתאר את הכלב ואת מספר הלבבות העדכני. הכיתוב
 * והפרטים קריאים, התמונה עם alt תיאורי, והאייקונים תמיד aria-hidden.
 */
export function WallItem({
  photo,
  featured = false,
}: {
  photo: WallPhoto
  featured?: boolean
}) {
  const toast = useToast()
  const [hearts, setHearts] = useState(photo.hearts)
  const [liked, setLiked] = useState(false)

  function toggleLike() {
    if (liked) {
      setLiked(false)
      setHearts((h) => h - 1)
      toast(`הסרתם את הלייק מ${photo.dog}`)
    } else {
      setLiked(true)
      setHearts((h) => h + 1)
      toast(`אהבתם את ${photo.dog} של ${photo.owner} מ${photo.city}!`)
    }
  }

  return (
    <Tilt3D
      max={7}
      glare={false}
      className="sweep"
      style={{ display: 'block', breakInside: 'avoid' }}
    >
      <article
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          border: featured
            ? '1.5px solid var(--brand)'
            : '1px solid rgba(42,32,24,.06)',
          boxShadow: featured
            ? 'var(--shadow-brand-lg)'
            : 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* תמונה + תגים */}
        <div style={{ position: 'relative', aspectRatio: ASPECT[photo.shape], overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={wallImg(photo.photo, 600)}
            alt={`${photo.dog}, ${photo.breed} מ${photo.city}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* תג כלב השבוע */}
          {featured && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                insetInlineStart: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12.5,
                fontWeight: 800,
                borderRadius: 'var(--pill-radius)',
                padding: 'var(--chip-lg-pad)',
                color: 'var(--brand-dark)',
                background: 'linear-gradient(135deg, #e8c887, #c99a5b)',
                border: '1px solid #c99a5b',
                boxShadow: 'var(--shadow-brand-md)',
              }}
            >
              <span aria-hidden>★</span>
              כלב השבוע
            </span>
          )}

          {/* כיתוב מספר הלבבות על גבי התמונה (קריאה בלבד) */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              bottom: 12,
              insetInlineEnd: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              fontWeight: 800,
              borderRadius: 'var(--pill-radius)',
              padding: 'var(--chip-md-pad)',
              color: '#fff',
              background: 'rgba(42,32,24,.62)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <span style={{ color: liked ? '#e8c887' : '#fff' }}>♥</span>
            {hearts.toLocaleString('he-IL')}
          </span>
        </div>

        {/* גוף הכרטיס */}
        <div style={{ padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <strong style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-0.4px', lineHeight: 1.1 }}>
              {photo.dog}
            </strong>
            <span style={{ fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 700 }}>
              {photo.breed}
            </span>
          </div>

          <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.55, color: 'var(--text-soft)' }}>
            {photo.caption}
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
              marginTop: 2,
            }}
          >
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              צילם/ה {photo.owner} · {photo.city}
            </span>

            <button
              type="button"
              onClick={toggleLike}
              aria-pressed={liked}
              aria-label={
                liked
                  ? `הסירו את הלייק מ${photo.dog}. ${hearts.toLocaleString('he-IL')} לבבות`
                  : `אהבתי את ${photo.dog}. ${hearts.toLocaleString('he-IL')} לבבות`
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                minHeight: 42,
                padding: '8px 16px',
                borderRadius: 'var(--pill-radius)',
                fontSize: 14,
                fontWeight: 800,
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all .2s',
                border: liked ? '1.5px solid var(--brand)' : '1.5px solid #e6dcc9',
                background: liked ? 'var(--brand)' : '#fff',
                color: liked ? '#fff' : 'var(--text)',
                boxShadow: liked ? '0 6px 16px rgba(201,154,91,.28)' : 'none',
              }}
            >
              <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>
                {liked ? '♥' : '♡'}
              </span>
              אהבתי
            </button>
          </div>
        </div>
      </article>
    </Tilt3D>
  )
}
