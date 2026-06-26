'use client'

import { PlanCard } from '@/components/premium/PlanCard'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { useToast } from '@/components/shared/Toast'
import {
  PLANS,
  COMPARE_ROWS,
  REVENUE_STREAMS,
  TRUST_NOTES,
  type CompareRow,
} from '@/lib/premium'

/** תא בטבלת ההשוואה: בוליאני → ✓ / -, אחרת טקסט. */
function CompareCell({
  value,
  featured = false,
}: {
  value: boolean | string
  featured?: boolean
}) {
  if (typeof value === 'boolean') {
    return value ? (
      <span
        aria-label="כלול"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: featured ? '#c99a5b' : 'rgba(201,154,91,.16)',
          color: featured ? '#fff' : '#a97c46',
          fontSize: 14,
          fontWeight: 900,
        }}
      >
        ✓
      </span>
    ) : (
      <span aria-label="לא כלול" style={{ color: '#c4baa9', fontSize: 18, fontWeight: 700 }}>
        -
      </span>
    )
  }
  return (
    <span style={{ fontWeight: 800, color: featured ? '#a97c46' : '#241a12', fontSize: 15 }}>
      {value}
    </span>
  )
}

export default function PremiumPage() {
  const toast = useToast()

  const cellStyle: React.CSSProperties = {
    padding: '14px 16px',
    textAlign: 'center',
    borderTop: '1px solid rgba(201,154,91,.14)',
  }

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        aria-labelledby="premium-title"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 32,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">מסלולים ומחירים</span>
          <h1 id="premium-title" className="page-title grad-text" style={{ marginTop: 10 }}>
            הקהילה חינם. תמיד תישאר חינם.
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, margin: '12px auto 0' }}>
            הפרימיום קיים בשביל דבר אחד: שתחסכו על הכלב יותר ממה שתשלמו. אם זה לא קורה,
            לא שווה לכם - תישארו בחינם בלב שקט. בלי אותיות קטנות, בלי טלפון של "אבל למה ביטלת".
          </p>
        </div>
      </section>

      <DemoBanner />

      {/* ── שלושת המסלולים ── */}
      <section aria-label="מסלולי המנוי" style={{ marginBottom: 48 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: 24,
            alignItems: 'stretch',
          }}
        >
          {PLANS.map((plan, i) => (
            <Reveal3D key={plan.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <PlanCard plan={plan} />
            </Reveal3D>
          ))}
        </div>
        <p className="muted" style={{ textAlign: 'center', marginTop: 18, fontSize: 14 }}>
          כל המחירים כוללים מע&quot;מ. אפשר לשדרג, להוריד מסלול או לבטל בכל רגע - בלי קנסות ובלי טלפונים.
        </p>
      </section>

      {/* ── טבלת השוואה ── */}
      <Reveal3D as="section" className="" delay={1}>
        <section aria-labelledby="compare-title" style={{ marginBottom: 52 }}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <span className="section-tag">השוואה מלאה</span>
            <h2 id="compare-title" className="page-title" style={{ fontSize: 28 }}>
              מה כלול בכל מסלול
            </h2>
          </div>

          <div
            className="card"
            style={{ padding: 0, overflowX: 'auto', borderRadius: 20 }}
          >
            <table
              style={{
                width: '100%',
                minWidth: 560,
                borderCollapse: 'collapse',
                fontSize: 15,
              }}
            >
              <caption className="muted" style={{ padding: '14px 16px 0', textAlign: 'right', fontSize: 13 }}>
                השוואת תכונות בין המסלולים חינם, פרימיום ועסקים
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    style={{
                      padding: '16px',
                      textAlign: 'right',
                      fontWeight: 800,
                      color: '#7a6a58',
                      fontSize: 14,
                    }}
                  >
                    תכונה
                  </th>
                  <th scope="col" style={{ padding: '16px', textAlign: 'center', fontWeight: 900, color: '#2a2018' }}>
                    חינם
                  </th>
                  <th
                    scope="col"
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: 900,
                      color: '#a97c46',
                      background: 'rgba(201,154,91,.07)',
                    }}
                  >
                    פרימיום
                  </th>
                  <th scope="col" style={{ padding: '16px', textAlign: 'center', fontWeight: 900, color: '#2a2018' }}>
                    עסקים
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row: CompareRow) => (
                  <tr key={row.feature}>
                    <th
                      scope="row"
                      style={{
                        padding: '14px 16px',
                        textAlign: 'right',
                        fontWeight: 700,
                        color: '#241a12',
                        borderTop: '1px solid rgba(201,154,91,.14)',
                      }}
                    >
                      {row.feature}
                    </th>
                    <td style={cellStyle}>
                      <CompareCell value={row.free} />
                    </td>
                    <td style={{ ...cellStyle, background: 'rgba(201,154,91,.07)' }}>
                      <CompareCell value={row.premium} featured />
                    </td>
                    <td style={cellStyle}>
                      <CompareCell value={row.business} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal3D>

      {/* ── איך כלבניה מתפרנסת (שקיפות) ── */}
      <section aria-labelledby="revenue-title" style={{ marginBottom: 48 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <span className="section-tag">שקיפות מלאה</span>
          <h2 id="revenue-title" className="page-title" style={{ fontSize: 28 }}>
            איך כלבניה מתפרנסת
          </h2>
          <p className="page-sub" style={{ maxWidth: 620, margin: '12px auto 0' }}>
            אנחנו מאמינים שמותר לכם לדעת בדיוק מאיפה מגיע הכסף. ארבעה מקורות הכנסה, כולם
            גלויים - ואף אחד מהם לא כולל מכירת המידע שלכם.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {REVENUE_STREAMS.map((s, i) => (
            <Reveal3D key={s.title} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <div className="card" style={{ height: '100%', padding: '26px 24px' }}>
                <div
                  aria-hidden
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    background: 'rgba(201,154,91,.14)',
                    marginBottom: 16,
                  }}
                >
                  {s.icon}
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 900, color: '#241a12', marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#5f5346', margin: 0 }}>
                  {s.body}
                </p>
              </div>
            </Reveal3D>
          ))}
        </div>

        {/* הבטחות אמון */}
        <div
          className="glass"
          style={{ marginTop: 24, padding: '24px 26px', borderRadius: 20 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#2a2018', marginBottom: 14 }}>
            <span aria-hidden>🤍</span> ההבטחות שלנו אליכם
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
            {TRUST_NOTES.map((note) => (
              <li
                key={note}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 15,
                  lineHeight: 1.5,
                  color: '#241a12',
                }}
              >
                <span aria-hidden style={{ color: '#c99a5b', fontWeight: 900, marginTop: 1 }}>
                  ✓
                </span>
                {note}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA סיום ── */}
      <section
        aria-label="הצטרפות לכלבניה"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          background: '#2a2018',
          borderRadius: 24,
          padding: '30px 32px',
        }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 900, fontSize: 22, letterSpacing: '-0.5px' }}>
            מתלבטים? פשוט תתחילו בחינם
          </div>
          <div style={{ color: '#d8c7b0', fontSize: 15, marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>
            בלי כרטיס אשראי, בלי התחייבות. תבנו לכלב פרופיל, תכירו אנשים מהשכונה, ואם בכלל
            תשדרגו לפרימיום - רק כשתרגישו שזה משתלם.
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{ whiteSpace: 'nowrap' }}
            onClick={() => toast('מצוין! הצטרפתם לכלבניה בחינם - בואו נבנה לכלב פרופיל 🐾')}
          >
            הצטרפו בחינם ←
          </button>
          <a
            href="/businesses"
            className="btn btn-ghost"
            style={{ whiteSpace: 'nowrap', color: '#fff', borderColor: 'rgba(255,255,255,.3)' }}
          >
            לספריית העסקים
          </a>
        </div>
      </section>
    </main>
  )
}
