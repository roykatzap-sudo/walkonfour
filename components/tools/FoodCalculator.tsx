'use client'

import { useMemo, useState } from 'react'
import { FEED_MODES, calcFood } from '@/lib/foodCalc'

export function FoodCalculator() {
  const [weight, setWeight] = useState(12)
  const [modeId, setModeId] = useState('adult')
  const [kcal, setKcal] = useState('360') // נשמר כמחרוזת כדי לאפשר מצב ריק בזמן ההקלדה
  const [meals, setMeals] = useState(2)

  const mode = FEED_MODES.find((m) => m.id === modeId) ?? FEED_MODES[1]
  const kcalNum = Number(kcal) > 0 ? Number(kcal) : 360
  const result = useMemo(() => calcFood(weight, mode.factor, kcalNum, meals), [weight, mode, kcalNum, meals])

  return (
    <div className="card" style={{ padding: 28 }}>
      {/* משקל */}
      <div style={{ marginBottom: 22 }}>
        <label htmlFor="fc-weight" style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#3a3128' }}>
          משקל הכלב: <strong style={{ color: '#a87a3e' }}>{weight} ק״ג</strong>
        </label>
        <input
          id="fc-weight"
          type="range"
          min={1}
          max={70}
          step={1}
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#c99a5b', minHeight: 36 }}
          aria-label="משקל בקילוגרמים"
        />
      </div>

      {/* מצב */}
      <div role="group" aria-label="שלב חיים ומצב" style={{ marginBottom: 22 }}>
        <span style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#3a3128' }}>שלב חיים / מצב</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
          {FEED_MODES.map((m) => {
            const on = m.id === modeId
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => setModeId(m.id)}
                style={{
                  textAlign: 'right',
                  background: on ? '#fdf6e9' : '#fff',
                  border: on ? '1.5px solid #c99a5b' : '1.5px solid #e3dccd',
                  borderRadius: 12,
                  padding: '11px 14px',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 700,
                  color: on ? '#8a5a2b' : '#3a3128',
                  cursor: 'pointer',
                  minHeight: 48,
                }}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* פרמטרים נוספים */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 16, marginBottom: 8 }}>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="fc-kcal">אנרגיית המזון (קק״ל ל-100 ג׳)</label>
          <input
            id="fc-kcal"
            className="input"
            type="number"
            min={200}
            max={600}
            value={kcal}
            onChange={(e) => setKcal(e.target.value)}
            onBlur={(e) => {
              const n = Number(e.target.value)
              setKcal(String(n > 0 ? Math.min(600, Math.max(200, n)) : 360))
            }}
            dir="ltr"
          />
          <span className="muted" style={{ fontSize: 13.5 }}>מופיע על שק המזון. ברירת מחדל: 360.</span>
        </div>
        <div className="field" style={{ marginBottom: 0 }}>
          <label htmlFor="fc-meals">ארוחות ביום</label>
          <select id="fc-meals" className="input" value={meals} onChange={(e) => setMeals(Number(e.target.value))}>
            <option value={1}>ארוחה אחת</option>
            <option value={2}>2 ארוחות</option>
            <option value={3}>3 ארוחות</option>
          </select>
        </div>
      </div>

      {/* תוצאה */}
      <div style={{ marginTop: 22, background: 'var(--ink)', borderRadius: 18, padding: '24px', color: '#fff' }} aria-live="polite">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 18, textAlign: 'center', alignItems: 'baseline' }}>
          <div>
            <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1, color: '#e8c887' }}>{result.gramsPerDay}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginTop: 5 }}>גרם ביום</div>
          </div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, color: 'rgba(255,255,255,.92)' }}>{result.gramsPerMeal}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)', marginTop: 5 }}>גרם לארוחה ({result.meals})</div>
          </div>
          <div>
            <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1, color: 'rgba(255,255,255,.92)' }}>{result.dailyKcal}</div>
            <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.7)', marginTop: 5 }}>קק״ל ביום</div>
          </div>
        </div>
        <p style={{ margin: '18px auto 0', maxWidth: 520, fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,.8)', textAlign: 'center' }}>
          {mode.note}
        </p>
      </div>

      <p className="muted" style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, textAlign: 'center' }}>
        הערכה כללית המבוססת על נוסחת RER/MER. הכמות בפועל תלויה בגזע, בחילוף החומרים ובמזון הספציפי -
        עקבו אחר משקל הכלב והתייעצו עם הווטרינר.
      </p>
    </div>
  )
}
