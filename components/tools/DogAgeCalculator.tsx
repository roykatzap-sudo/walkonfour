'use client'

import { useMemo, useState } from 'react'
import { DOG_SIZES, SIZE_LABEL, dogToHuman, lifeStage, type DogSize } from '@/lib/dogAge'

export function DogAgeCalculator() {
  const [years, setYears] = useState(3)
  const [months, setMonths] = useState(0)
  const [size, setSize] = useState<DogSize>('medium')

  const dogYears = years + months / 12
  const human = useMemo(() => dogToHuman(dogYears, size), [dogYears, size])
  const stage = useMemo(() => lifeStage(human), [human])

  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: '1fr', marginBottom: 8 }}>
        {/* גיל */}
        <div>
          <label htmlFor="dog-years" style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#3a3128' }}>
            גיל הכלב: <strong style={{ color: '#a87a3e' }}>{years} שנים {months > 0 ? `ו-${months} חודשים` : ''}</strong>
          </label>
          <input
            id="dog-years"
            type="range"
            min={0}
            max={20}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c99a5b', minHeight: 36 }}
            aria-label="שנים"
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
            {[0, 3, 6, 9].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMonths(m)}
                aria-pressed={months === m}
                className="chip3d"
                style={{ cursor: 'pointer', border: months === m ? '1px solid #c99a5b' : undefined, background: months === m ? '#c99a5b' : undefined, color: months === m ? '#fff' : undefined }}
              >
                +{m} חודשים
              </button>
            ))}
          </div>
        </div>

        {/* גודל */}
        <div role="group" aria-label="גודל הכלב">
          <span style={{ display: 'block', fontWeight: 700, marginBottom: 8, color: '#3a3128' }}>גודל הכלב</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 8 }}>
            {DOG_SIZES.map((s) => {
              const on = size === s
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSize(s)}
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
                  {SIZE_LABEL[s]}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* תוצאה */}
      <div
        style={{
          marginTop: 22,
          background: 'var(--ink)',
          borderRadius: 18,
          padding: '26px 24px',
          color: '#fff',
          textAlign: 'center',
        }}
        aria-live="polite"
      >
        <div style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: '#e8c887', fontWeight: 700 }}>
          בשנות אדם
        </div>
        <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px' }}>{human}</div>
        <div style={{ fontSize: 16, color: 'rgba(255,255,255,.82)', marginTop: 2 }}>
          שלב חיים: <strong style={{ color: '#e8c887' }}>{stage.label}</strong>
        </div>
        <p style={{ margin: '14px auto 0', maxWidth: 460, fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,.8)' }}>
          {stage.note}
        </p>
      </div>

      <p className="muted" style={{ marginTop: 16, fontSize: 12.5, lineHeight: 1.6, textAlign: 'center' }}>
        הערכה כללית - קצב ההזדקנות משתנה בין גזעים ובין פרטים. אינו תחליף לבדיקה וטרינרית.
      </p>
    </div>
  )
}
