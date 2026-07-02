'use client'

import { useMemo, useState } from 'react'
import { DOG_SIZES, SIZE_LABEL, dogToHuman, lifeStage, type DogSize } from '@/lib/dogAge'
import { useCountUp } from './useCountUp'

export function DogAgeCalculator() {
  const [years, setYears] = useState(3)
  const [months, setMonths] = useState(0)
  const [size, setSize] = useState<DogSize>('medium')

  const dogYears = years + months / 12
  const human = useMemo(() => dogToHuman(dogYears, size), [dogYears, size])
  const stage = useMemo(() => lifeStage(human), [human])

  // גיל האדם מתגלגל למספר החדש בכל שינוי (מכבד reduced-motion).
  const humanAnimated = useCountUp(human)

  const yearsPct = (years / 20) * 100

  return (
    <div className="card da-card" style={{ padding: 28 }}>
      <div style={{ display: 'grid', gap: 22, gridTemplateColumns: '1fr', marginBottom: 8 }}>
        {/* גיל */}
        <div>
          <label htmlFor="dog-years" style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#3a3128', fontSize: 16 }}>
            גיל הכלב: <strong style={{ color: '#a87a3e' }}>{years} שנים {months > 0 ? `ו-${months} חודשים` : ''}</strong>
          </label>
          <div className="da-slider-wrap">
            <input
              id="dog-years"
              type="range"
              min={0}
              max={20}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="da-range"
              aria-label="שנים"
            />
            <span
              className="da-bubble"
              aria-hidden="true"
              style={{ insetInlineStart: `${yearsPct}%`, transform: `translateX(${yearsPct > 50 ? '' : '-'}50%)` }}
            >
              {years}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
            {[0, 3, 6, 9].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                aria-pressed={months === m}
                className={`da-month${months === m ? ' on' : ''}`}
              >
                +{m} חודשים
              </button>
            ))}
          </div>
        </div>

        {/* גודל */}
        <div role="group" aria-label="גודל הכלב">
          <span style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#3a3128', fontSize: 16 }}>גודל הכלב</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {DOG_SIZES.map((s) => {
              const on = size === s
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSize(s)}
                  className={`da-size${on ? ' on' : ''}`}
                >
                  {SIZE_LABEL[s]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* תוצאה - כרטיס "פרס" */}
      <div className="da-prize" aria-live="polite">
        <div className="da-prize-tag">בשנות אדם</div>
        <div className="da-prize-num" aria-label={`${human} בשנות אדם`}>
          {humanAnimated}
        </div>
        <div className="da-prize-stage">
          שלב חיים: <strong>{stage.label}</strong>
        </div>
        <p className="da-prize-note">{stage.note}</p>
      </div>

      <p className="muted" style={{ marginTop: 16, fontSize: 13, lineHeight: 1.6, textAlign: 'center' }}>
        הערכה כללית - קצב ההזדקנות משתנה בין גזעים ובין פרטים. אינו תחליף לבדיקה וטרינרית.
      </p>

      <style jsx>{`
        /* ---- סליידר ---- */
        .da-slider-wrap {
          position: relative;
          padding-top: 4px;
        }
        .da-range {
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
        .da-range::-webkit-slider-runnable-track {
          height: 12px;
          border-radius: 100px;
        }
        .da-range::-webkit-slider-thumb {
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
        .da-range::-webkit-slider-thumb:active {
          transform: scale(1.14);
          cursor: grabbing;
        }
        .da-range::-moz-range-thumb {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #fff;
          border: 4px solid var(--brand);
          box-shadow: 0 3px 10px rgba(201, 154, 91, 0.5);
          cursor: grab;
        }
        .da-range::-moz-range-track {
          height: 12px;
          border-radius: 100px;
          background: #efe7d6;
        }
        .da-range:focus-visible {
          outline: 3px solid var(--brand);
          outline-offset: 4px;
        }
        .da-bubble {
          position: absolute;
          top: -6px;
          direction: ltr;
          background: var(--ink);
          color: #fff;
          font-weight: 900;
          font-size: 13px;
          min-width: 28px;
          text-align: center;
          padding: 3px 7px;
          border-radius: 9px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(42, 32, 24, 0.28);
        }

        /* ---- כפתורי חודשים ---- */
        .da-month {
          background: #fff;
          border: 1.5px solid #e3dccd;
          border-radius: 100px;
          padding: 9px 16px;
          min-height: 44px;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          color: #6b5d4c;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, color 0.18s;
        }
        .da-month:hover {
          border-color: var(--brand);
        }
        .da-month.on {
          background: var(--brand);
          border-color: var(--brand);
          color: #fff;
        }

        /* ---- כפתורי גודל ---- */
        .da-size {
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
        .da-size:hover {
          border-color: var(--brand);
          transform: translateY(-2px);
        }
        .da-size.on {
          background: #fdf6e9;
          border-color: var(--brand);
          color: #8a5a2b;
          box-shadow: 0 8px 22px rgba(201, 154, 91, 0.18);
        }

        /* ---- כרטיס פרס ---- */
        .da-prize {
          position: relative;
          overflow: hidden;
          margin-top: 24px;
          background: linear-gradient(155deg, #2f2419, #241a12);
          border-radius: 22px;
          padding: 30px 24px 26px;
          color: #fff;
          text-align: center;
          box-shadow: 0 18px 44px rgba(42, 32, 24, 0.32);
        }
        .da-prize::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(115deg, transparent 30%, rgba(232, 200, 135, 0.16) 48%, transparent 66%);
          transform: translateX(-120%);
          animation: da-shine 1.5s ease 0.25s 1;
          pointer-events: none;
        }
        @keyframes da-shine {
          to {
            transform: translateX(120%);
          }
        }
        .da-prize-tag {
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #e8c887;
          font-weight: 700;
        }
        .da-prize-num {
          font-size: 68px;
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -2px;
          font-variant-numeric: tabular-nums;
          text-shadow: 0 4px 20px rgba(232, 200, 135, 0.25);
        }
        .da-prize-stage {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.82);
          margin-top: 2px;
        }
        .da-prize-stage strong {
          color: #e8c887;
        }
        .da-prize-note {
          margin: 14px auto 0;
          max-width: 460px;
          font-size: 14.5px;
          line-height: 1.65;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (prefers-reduced-motion: reduce) {
          .da-size,
          .da-month,
          .da-range::-webkit-slider-thumb {
            transition: none;
          }
          .da-prize::before {
            animation: none;
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
