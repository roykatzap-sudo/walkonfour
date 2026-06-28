'use client'

import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { POINT_RULES, RANK_TIERS } from '@/lib/leaderboard'

export default function LeaderboardPage() {
  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        aria-labelledby="lb-title"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '60px 28px 64px',
          marginBottom: 36,
          background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
          border: '1px solid #efe2cd',
          textAlign: 'center',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span className="section-tag">לוח המובילים · בהקמה</span>
          <h1
            id="lb-title"
            className="grad-text"
            style={{
              fontSize: 'clamp(38px, 7vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              margin: '4px 0 16px',
            }}
          >
            החברים שמניעים את הקהילה
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#5b4d3c', maxWidth: 560, margin: '0 auto' }}>
            כשהקהילה תתחיל, כאן יופיעו האנשים שעונים לשאלה שלכם בפורום ב-11 בלילה
            ומארגנים את המפגש בירקון בשישי. כל עזרה תצבור נקודות - וכך זה יעבוד.
          </p>
        </div>
      </section>

      {/* ── איך צוברים נקודות ── */}
      <PointsExplainer />

      {/* ── מצב טרום-השקה: הלוח ייפתח עם הקהילה ── */}
      <ComingSoonBoard />

      {/* ── קריאה לפעולה ── */}
      <JoinCallout />
    </main>
  )
}

/* ───────────────────────── מצב טרום-השקה ───────────────────────── */

function ComingSoonBoard() {
  return (
    <section
      aria-labelledby="board-soon-title"
      style={{
        marginBottom: 48,
        padding: '44px 28px',
        borderRadius: 24,
        textAlign: 'center',
        background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
        border: '1px dashed #e0cfb0',
      }}
    >
      <span aria-hidden style={{ fontSize: 40, lineHeight: 1, display: 'block', marginBottom: 12 }}>
        🏆
      </span>
      <h2
        id="board-soon-title"
        style={{ margin: '0 0 10px', fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px' }}
      >
        הלוח ייפתח כשהקהילה תתחיל
      </h2>
      <p
        style={{
          margin: '0 auto',
          maxWidth: 520,
          fontSize: 16,
          lineHeight: 1.65,
          color: 'var(--text-muted)',
        }}
      >
        עדיין לא צברנו מספיק פעילות אמיתית כדי להציג לוח מובילים. אנחנו לא ממציאים
        חברים ולא ממציאים נקודות - ברגע שתהיה קהילה פעילה, המקומות הראשונים יופיעו
        כאן, עם שמות אמיתיים.
      </p>
    </section>
  )
}

/* ───────────────────────── איך צוברים נקודות ───────────────────────── */

function PointsExplainer() {
  return (
    <section aria-labelledby="rules-title" style={{ marginBottom: 36 }}>
      <h2 id="rules-title" className="page-title" style={{ fontSize: 22, marginBottom: 6 }}>
        איך צוברים נקודות
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: '0 0 18px' }}>
        לא צריך להתאמץ במיוחד - פשוט להיות נוכח. עונים, באים, משתפים. הנקודות מצטברות לבד.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {POINT_RULES.map((r, i) => (
          <Reveal3D key={r.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
            <Tilt3D className="sweep" max={8} style={{ height: '100%' }}>
              <div
                className="lift-3d card"
                style={{
                  height: '100%',
                  padding: 22,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                  borderColor: '#efe2cd',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 22,
                      background: 'rgba(232,200,135,.16)',
                    }}
                  >
                    {r.icon}
                  </span>
                  <strong style={{ fontSize: 18, fontWeight: 800 }}>{r.label}</strong>
                </span>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5, flex: 1 }}>
                  {r.detail}
                </p>
                <span
                  className="chip3d"
                  style={{ alignSelf: 'flex-start', fontSize: 13 }}
                  aria-label={`${r.per} נקודות לכל פעולה`}
                >
                  <span aria-hidden>+{r.per}</span>
                  נקודות
                </span>
              </div>
            </Tilt3D>
          </Reveal3D>
        ))}
      </div>

      {/* סולם הדרגות */}
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
          padding: '14px 18px',
          borderRadius: 16,
          background: '#fff',
          border: '1px solid #efe2cd',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-soft)', marginInlineEnd: 4 }}>
          סולם הדרגות:
        </span>
        {[...RANK_TIERS].reverse().map((t) => (
          <span
            key={t.id}
            className="chip3d"
            title={`${t.name} - מ-${t.min.toLocaleString('he-IL')} נקודות`}
          >
            <span aria-hidden>{t.icon}</span>
            {t.name}
          </span>
        ))}
      </div>
    </section>
  )
}

/* ───────────────────────── קריאה לפעולה ───────────────────────── */

function JoinCallout() {
  return (
    <section
      style={{
        marginTop: 48,
        padding: '34px 28px',
        borderRadius: 24,
        textAlign: 'center',
        background: 'linear-gradient(160deg, #2a2018 0%, #3a2c1e 100%)',
        color: '#fff',
        border: '1px solid rgba(232,200,135,.25)',
      }}
    >
      <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, letterSpacing: '-1px' }}>
        רוצים לראות את עצמכם כאן?
      </h2>
      <p style={{ margin: '0 auto 20px', maxWidth: 520, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.85)' }}>
        כשהקהילה תתחיל, מי שעוזר בפורום, מארגן מפגשים ומשתתף - יוביל את הלוח.
        הצטרפו לרשימה ותהיו מהראשונים שצוברים נקודות.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/waitlist" className="btn btn-primary">
          הצטרפו לרשימה
        </Link>
        <Link href="/forum" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
          הציצו בפורום
        </Link>
      </div>
    </section>
  )
}
