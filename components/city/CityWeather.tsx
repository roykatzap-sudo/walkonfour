'use client'

import { useEffect, useState } from 'react'

/* הטמפרטורה היום לפי שעה. מציג נתונים בלבד: בלי ספים ובלי קביעה מה "בטוח",
   כי לכך אין לנו מקור וטרינרי. ההחלטה מתי לצאת נשארת אצל בעל הכלב. */

type Hour = { h: number; t: number }

function nowHourInIsrael(): number {
  const s = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', hour12: false }).format(new Date())
  return Number(s) % 24
}

const hh = (h: number) => `${String(h).padStart(2, '0')}:00`

export function CityWeather({ slug, city }: { slug: string; city: string }) {
  const [hours, setHours] = useState<Hour[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    fetch(`/api/weather/${slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return
        if (d?.ok && Array.isArray(d.hours)) setHours(d.hours)
        else setFailed(true)
      })
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [slug])

  // אם הנתונים לא הגיעו, לא מציגים כלום - זה מידע משלים, לא חלק חיוני מהעמוד
  if (failed) return null

  const now = nowHourInIsrael()
  const day = hours?.filter((x) => x.h >= 6 && x.h <= 21) ?? []
  const upcoming = day.filter((x) => x.h >= now)
  const shown = (upcoming.length >= 3 ? upcoming : day).filter((_, i) => i % 2 === 0 || upcoming.length <= 6)
  const current = hours?.find((x) => x.h === now)
  const pool = upcoming.length ? upcoming : day
  const min = pool.length ? Math.min(...pool.map((x) => x.t)) : null
  const max = pool.length ? Math.max(...pool.map((x) => x.t)) : null
  const coolest = pool.filter((x) => x.t === min).map((x) => hh(x.h))
  const warmest = pool.filter((x) => x.t === max).map((x) => hh(x.h))

  return (
    <section aria-labelledby="cw-h" style={{ marginTop: 16, background: '#fff', border: '1px solid rgba(201,154,91,.3)', borderRadius: 16, padding: '16px 20px' }}>
      <h2 id="cw-h" style={{ margin: '0 0 4px', fontSize: 19, fontWeight: 900, color: 'var(--ink)' }}>
        הטמפרטורה היום ב{city}
      </h2>
      {!hours ? (
        <p style={{ margin: 0, fontSize: 16, color: '#5b4d3c' }}>טוען נתונים...</p>
      ) : (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 16.5, lineHeight: 1.7, color: '#3d342a' }}>
            {current ? <>עכשיו <strong>{current.t}°</strong>. </> : null}
            {min !== null && max !== null && min !== max ? (
              <>
                {upcoming.length ? 'בשעות שנותרו היום' : 'במהלך היום'}: הכי קריר ב-{coolest.slice(0, 2).join(' ו-')} ({min}°), הכי חם ב-{warmest.slice(0, 2).join(' ו-')} ({max}°).
              </>
            ) : null}
          </p>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {shown.map((x) => (
              <li
                key={x.h}
                style={{
                  minWidth: 68, textAlign: 'center', padding: '8px 10px', borderRadius: 12,
                  background: x.h === now ? '#241a12' : '#fbf7ef', color: x.h === now ? '#fff' : '#2a2018',
                  border: '1px solid rgba(201,154,91,.3)',
                }}
              >
                <span style={{ display: 'block', fontSize: 14.5, fontWeight: 700 }}>{hh(x.h)}</span>
                <span style={{ display: 'block', fontSize: 19, fontWeight: 900 }}>{x.t}°</span>
              </li>
            ))}
          </ul>
          <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.6, color: '#5b4d3c' }}>
            בימים חמים המדרכה חמה בהרבה מהאוויר. בודקים אותה עם כף היד לפני שיוצאים. נתוני מזג האוויר:{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="link">Open-Meteo</a>.
          </p>
        </>
      )}
    </section>
  )
}
