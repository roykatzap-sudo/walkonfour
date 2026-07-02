'use client'

import { useMemo, useState } from 'react'
import { FEED_MODES, calcFood } from '@/lib/foodCalc'
import { useCountUp } from './useCountUp'

export function FoodCalculator() {
  const [weight, setWeight] = useState(12)
  const [modeId, setModeId] = useState('adult')
  const [kcal, setKcal] = useState('360') // נשמר כמחרוזת כדי לאפשר מצב ריק בזמן ההקלדה
  const [meals, setMeals] = useState(2)

  const mode = FEED_MODES.find((m) => m.id === modeId) ?? FEED_MODES[1]
  const kcalNum = Number(kcal) > 0 ? Number(kcal) : 360
  const result = useMemo(() => calcFood(weight, mode.factor, kcalNum, meals), [weight, mode, kcalNum, meals])

  // המספרים בכרטיס ה"פרס" מתגלגלים לערך החדש בכל שינוי (מכבד reduced-motion).
  const gramsPerDay = useCountUp(result.gramsPerDay)
  const gramsPerMeal = useCountUp(result.gramsPerMeal)
  const dailyKcal = useCountUp(result.dailyKcal)

  // מיקום ידית הסליידר באחוזים - לחישוב הבועה הצפה עם הערך.
  const weightPct = ((weight - 1) / (70 - 1)) * 100

  return (
    <div className="card fc-card" style={{ padding: 28 }}>
      {/* משקל */}
      <div style={{ marginBottom: 26 }}>
        <label htmlFor="fc-weight" style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#3a3128', fontSize: 16 }}>
          משקל הכלב: <strong style={{ color: '#a87a3e' }}>{weight} ק״ג</strong>
        </label>
        <div className="fc-slider-wrap">
          <input
            id="fc-weight"
            type="range"
            min={1}
            max={70}
            step={1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="fc-range"
            aria-label="משקל בקילוגרמים"
          />
          {/* בועת ערך צפה מעל הידית - משוב מיידי וברור */}
          <span
            className="fc-bubble"
            aria-hidden="true"
            style={{ insetInlineStart: `calc(${weightPct}% )`, transform: `translateX(${weightPct > 50 ? '' : '-'}50%)` }}
          >
            {weight}
          </span>
        </div>
        <div className="fc-scale" aria-hidden="true">
          <span>קטן</span>
          <span>בינוני</span>
          <span>גדול</span>
        </div>
      </div>

      {/* מצב */}
      <div role="group" aria-label="שלב חיים ומצב" style={{ marginBottom: 24 }}>
        <span style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#3a3128', fontSize: 16 }}>שלב חיים / מצב</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
          {FEED_MODES.map((m) => {
            const on = m.id === modeId
            return (
              <button
                key={m.id}
                type="button"
                aria-pressed={on}
                onClick={() => setModeId(m.id)}
                className={`fc-mode${on ? ' on' : ''}`}
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

      {/* תוצאה - כרטיס "פרס" */}
      <div className="fc-prize" aria-live="polite">
        <span className="fc-prize-tag" aria-hidden="true">🦴 המנה היומית שלכם</span>
        <div className="fc-prize-grid">
          <div className="fc-prize-hero">
            <div className="fc-prize-num">{gramsPerDay}</div>
            <div className="fc-prize-unit">גרם ביום</div>
          </div>
          <div className="fc-prize-side">
            <div className="fc-prize-num-sm">{gramsPerMeal}</div>
            <div className="fc-prize-unit-sm">גרם לארוחה ({result.meals})</div>
          </div>
          <div className="fc-prize-side">
            <div className="fc-prize-num-sm">{dailyKcal}</div>
            <div className="fc-prize-unit-sm">קק״ל ביום</div>
          </div>
        </div>
        <p className="fc-prize-note">{mode.note}</p>
      </div>

      <p className="muted" style={{ marginTop: 16, fontSize: 14, lineHeight: 1.6, textAlign: 'center' }}>
        הערכה כללית המבוססת על נוסחת RER/MER. הכמות בפועל תלויה בגזע, בחילוף החומרים ובמזון הספציפי -
        עקבו אחר משקל הכלב והתייעצו עם הווטרינר.
      </p>

      <style jsx>{`
        /* ---- סליידר ידידותי וגדול ---- */
        .fc-slider-wrap {
          position: relative;
          padding-top: 4px;
        }
        .fc-range {
          width: 100%;
          appearance: none;
          -webkit-appearance: none;
          height: 12px;
          border-radius: 100px;
          background: linear-gradient(90deg, #e8c887, #c99a5b);
          background-color: #efe7d6;
          cursor: pointer;
          direction: ltr;
          min-height: 44px;
        }
        .fc-range::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 100px;
        }
        .fc-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 30px;
          height: 30px;
          margin-top: -9px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid var(--brand);
          box-shadow: 0 3px 10px rgba(201, 154, 91, 0.5);
          cursor: grab;
          transition: transform 0.15s ease;
        }
        .fc-range::-webkit-slider-thumb:active {
          transform: scale(1.14);
          cursor: grabbing;
        }
        .fc-range::-moz-range-thumb {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid var(--brand);
          box-shadow: 0 3px 10px rgba(201, 154, 91, 0.5);
          cursor: grab;
        }
        .fc-range::-moz-range-track {
          height: 12px;
          border-radius: 100px;
          background: #efe7d6;
        }
        .fc-range:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 4px;
        }
        .fc-bubble {
          position: absolute;
          top: -6px;
          direction: ltr;
          background: var(--ink);
          color: #fff;
          font-weight: 900;
          font-size: 13px;
          min-width: 30px;
          text-align: center;
          padding: 3px 7px;
          border-radius: 9px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(42, 32, 24, 0.28);
        }
        .fc-scale {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #9a8c74;
        }

        /* ---- כפתורי מצב ---- */
        .fc-mode {
          text-align: right;
          background: #fff;
          border: 1.5px solid #e3dccd;
          border-radius: 14px;
          padding: 13px 16px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 700;
          color: #3a3128;
          cursor: pointer;
          min-height: 52px;
          transition: border-color 0.18s, background 0.18s, transform 0.18s, box-shadow 0.18s;
        }
        .fc-mode:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
        }
        .fc-mode.on {
          background: #fdf6e9;
          border-color: var(--brand);
          color: #8a5a2b;
          box-shadow: 0 8px 22px rgba(201, 154, 91, 0.18);
        }

        /* ---- כרטיס פרס ---- */
        .fc-prize {
          position: relative;
          overflow: hidden;
          margin-top: 24px;
          background: linear-gradient(155deg, #2f2419, #241a12);
          border-radius: 22px;
          padding: 28px 24px 26px;
          color: #fff;
          box-shadow: 0 18px 44px rgba(42, 32, 24, 0.32);
        }
        /* ברק עדין שחולף פעם אחת כשהכרטיס נכנס - תחושת "פרס" */
        .fc-prize::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(232, 200, 135, 0.16) 48%, transparent 66%);
          transform: translateX(-120%);
          animation: fc-shine 1.5s ease 0.25s 1;
          pointer-events: none;
        }
        @keyframes fc-shine {
          to {
            transform: translateX(120%);
          }
        }
        .fc-prize-tag {
          display: inline-block;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #e8c887;
          margin-bottom: 14px;
        }
        .fc-prize-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 18px;
          text-align: center;
          align-items: baseline;
        }
        .fc-prize-hero .fc-prize-num {
          font-size: 58px;
          font-weight: 900;
          line-height: 1;
          color: #e8c887;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 4px 18px rgba(232, 200, 135, 0.28);
        }
        .fc-prize-unit {
          font-size: 15px;
          font-weight: 700;
          margin-top: 6px;
        }
        .fc-prize-num-sm {
          font-size: 36px;
          font-weight: 800;
          line-height: 1;
          color: rgba(255, 255, 255, 0.94);
          font-variant-numeric: tabular-nums;
        }
        .fc-prize-unit-sm {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.72);
          margin-top: 6px;
        }
        .fc-prize-note {
          margin: 20px auto 0;
          max-width: 520px;
          font-size: 14.5px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.82);
          text-align: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .fc-mode,
          .fc-range::-webkit-slider-thumb {
            transition: none;
          }
          .fc-prize::before {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
