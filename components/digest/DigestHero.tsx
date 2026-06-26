import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { digestStats, currentMonthLabel } from '@/lib/digest'

/**
 * כותרת הדייג׳סט - באנר מגזיני כהה עם שם החודש, כותרת ומדדים מצטברים.
 * רכיב שרת (בלי 'use client'); כל המספרים read-only מ-lib/digest.
 */
export function DigestHero() {
  const stats = digestStats()
  const month = currentMonthLabel()

  return (
    <section
      aria-labelledby="digest-title"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 28,
        padding: '64px 28px 56px',
        marginBottom: 56,
        textAlign: 'center',
        color: '#fff',
        background: 'linear-gradient(160deg, #2a2018 0%, #3a2c1e 100%)',
        border: '1px solid rgba(232,200,135,.22)',
      }}
    >
      <FloatingShapes dark />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
        <span
          className="section-tag"
          style={{ color: '#e8c887' }}
        >
          הדייג׳סט הקהילתי · {month}
        </span>

        <h1
          id="digest-title"
          style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: 900,
            letterSpacing: '-2.5px',
            lineHeight: 1.02,
            margin: '6px 0 18px',
          }}
        >
          כלבניה <span style={{ color: '#e8c887' }}>החודש</span>
        </h1>

        <p
          style={{
            fontSize: 18,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,.82)',
            maxWidth: 580,
            margin: '0 auto',
          }}
        >
          מה שפספסתם החודש, בלי לגלול שבועיים אחורה. הדיונים שעשו רעש, מי שהוביל,
          ואיזה כלב עדיין מחכה שיבואו לקחת אותו.
        </p>

        {/* מדדי החודש */}
        <ul
          style={{
            listStyle: 'none',
            margin: '34px auto 0',
            padding: 0,
            maxWidth: 640,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: 14,
          }}
        >
          {stats.map((s) => (
            <li
              key={s.id}
              style={{
                padding: '16px 12px',
                borderRadius: 18,
                background: 'rgba(255,255,255,.06)',
                border: '1px solid rgba(232,200,135,.20)',
              }}
            >
              <span
                style={{
                  display: 'block',
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: '-1px',
                  color: '#e8c887',
                }}
              >
                {s.value}
              </span>
              <span style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.78)', marginTop: 2 }}>
                {s.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
