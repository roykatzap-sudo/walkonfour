'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { useToast } from '@/components/shared/Toast'
import { RankRow } from '@/components/leaderboard/RankRow'
import {
  POINT_RULES,
  RANK_TIERS,
  citiesWithLeaders,
  cityLeaderboard,
  nationalLeaderboard,
  type RankedLeader,
} from '@/lib/leaderboard'

/** הסתרה ויזואלית תוך שמירה על נגישות לקוראי מסך (אין class גלובלי כזה כאן). */
const VISUALLY_HIDDEN: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

/** מדליות הפודיום לפי מקום. קישוט בלבד - תמיד aria-hidden. */
const PODIUM_ICON = ['🥇', '🥈', '🥉'] as const
/** סדר תצוגה ויזואלי לפודיום: שני, ראשון (מוגבה), שלישי. */
const PODIUM_ORDER = [1, 0, 2] as const

export default function LeaderboardPage() {
  // 'all' = ארצי · אחרת slug של עיר מ-communities.ts
  const [scope, setScope] = useState<string>('all')

  const cities = useMemo(() => citiesWithLeaders(), [])
  const board = useMemo<RankedLeader[]>(
    () => (scope === 'all' ? nationalLeaderboard() : cityLeaderboard(scope)),
    [scope]
  )

  const podium = board.slice(0, 3)
  const rest = board.slice(3)
  const scopeName = scope === 'all' ? 'ארצי' : cities.find((c) => c.slug === scope)?.name ?? ''

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
          <span className="section-tag">לוח המובילים</span>
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
            אלה האנשים שעונים לשאלה שלכם בפורום ב-11 בלילה, ומארגנים את המפגש בירקון בשישי.
            כל עזרה צוברת נקודות. הנה מי שמוביל, ארצית ובעיר שלכם.
          </p>
        </div>
      </section>

      {/* ── איך צוברים נקודות ── */}
      <PointsExplainer />

      {/* ── בורר היקף: ארצי / עיר ── */}
      <ScopePicker
        scope={scope}
        onChange={setScope}
        cities={cities.map((c) => ({ slug: c.slug, name: c.name }))}
      />

      {/* ── פודיום ── */}
      {podium.length > 0 && (
        <section aria-labelledby="podium-title" style={{ marginBottom: 44 }}>
          <h2 id="podium-title" style={VISUALLY_HIDDEN}>
            שלושת המובילים - דירוג {scopeName}
          </h2>
          <Podium podium={podium} />
        </section>
      )}

      {/* ── שאר הטבלה ── */}
      {rest.length > 0 ? (
        <section aria-labelledby="rest-title">
          <h2
            id="rest-title"
            className="page-title"
            style={{ fontSize: 22, marginBottom: 16 }}
          >
            המקומות הבאים
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {rest.map((l, i) => (
              <Reveal3D as="li" key={l.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <RankRow leader={l} />
              </Reveal3D>
            ))}
          </ul>
        </section>
      ) : (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, padding: '8px 0 24px' }}>
          זו עיר קטנה ומגובשת - כל המובילים שלה כבר על הפודיום.
        </p>
      )}

      {/* ── קריאה לפעולה ── */}
      <JoinCallout />
    </main>
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

/* ───────────────────────── בורר היקף ───────────────────────── */

function ScopePicker({
  scope,
  onChange,
  cities,
}: {
  scope: string
  onChange: (s: string) => void
  cities: { slug: string; name: string }[]
}) {
  const options = [{ slug: 'all', name: 'ארצי' }, ...cities]
  return (
    <nav aria-label="סינון לוח המובילים לפי היקף" style={{ marginBottom: 28 }}>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        {options.map((o) => {
          const active = scope === o.slug
          return (
            <li key={o.slug}>
              <button
                type="button"
                onClick={() => onChange(o.slug)}
                aria-pressed={active}
                style={{
                  padding: '9px 18px',
                  minHeight: 42,
                  borderRadius: 100,
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'all .2s',
                  border: active ? '1.5px solid var(--brand)' : '1.5px solid #e6dcc9',
                  background: active ? 'var(--brand)' : '#fff',
                  color: active ? '#fff' : 'var(--text)',
                  boxShadow: active ? '0 6px 18px rgba(201,154,91,.28)' : 'none',
                }}
              >
                {o.name}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/* ───────────────────────── פודיום ───────────────────────── */

function Podium({ podium }: { podium: RankedLeader[] }) {
  const toast = useToast()
  // מסדרים ל-[שני, ראשון, שלישי] אך מדלגים על מקומות חסרים (עיר קטנה).
  const ordered = PODIUM_ORDER.map((idx) => podium[idx]).filter(Boolean) as RankedLeader[]

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${ordered.length}, minmax(0, 1fr))`,
        alignItems: 'end',
        gap: 14,
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      {ordered.map((l) => {
        const place = l.rank // 1 / 2 / 3
        const first = place === 1
        return (
          <Tilt3D key={l.id} className="sweep" max={9} style={{ display: 'block' }}>
            <button
              type="button"
              onClick={() =>
                toast(
                  `מקום ${place} ${PODIUM_ICON[place - 1]} · ${l.name} ו${l.dog} · ${l.points.toLocaleString(
                    'he-IL'
                  )} נקודות`
                )
              }
              className="lift-3d"
              aria-label={`מקום ${place}: ${l.name}, ${l.points.toLocaleString('he-IL')} נקודות, דרגת ${l.tier.name}`}
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                padding: first ? '26px 16px 30px' : '20px 14px 22px',
                borderRadius: 22,
                cursor: 'pointer',
                fontFamily: 'inherit',
                color: first ? '#fff' : 'var(--text)',
                background: first
                  ? 'linear-gradient(160deg, #e8c887 0%, #c99a5b 100%)'
                  : 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
                border: first ? '1px solid #c99a5b' : '1px solid #efe2cd',
                boxShadow: first
                  ? '0 22px 48px rgba(201,154,91,.34)'
                  : '0 12px 30px rgba(42,32,24,.10)',
                marginBottom: first ? 22 : 0,
              }}
            >
              <span aria-hidden style={{ fontSize: first ? 34 : 28, lineHeight: 1 }}>
                {PODIUM_ICON[place - 1]}
              </span>

              <span
                aria-hidden
                style={{
                  width: first ? 76 : 60,
                  height: first ? 76 : 60,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: first ? 30 : 24,
                  fontWeight: 900,
                  color: first ? 'var(--brand-dark)' : '#fff',
                  background: first
                    ? 'rgba(255,255,255,.92)'
                    : 'linear-gradient(135deg, #e8c887, #c99a5b)',
                  boxShadow: 'inset 0 0 0 3px rgba(255,255,255,.5)',
                }}
              >
                {l.name.charAt(0)}
              </span>

              <strong style={{ fontSize: first ? 20 : 17, fontWeight: 900, textAlign: 'center', lineHeight: 1.15 }}>
                {l.name}
              </strong>
              <span style={{ fontSize: 13, opacity: 0.9, textAlign: 'center' }}>
                ו{l.dog} · {l.community?.name ?? '-'}
              </span>

              <span
                style={{
                  marginTop: 2,
                  fontSize: first ? 26 : 21,
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                }}
              >
                {l.points.toLocaleString('he-IL')}
                <span style={{ fontSize: 12, fontWeight: 700, marginInlineStart: 5, opacity: 0.85 }}>נק׳</span>
              </span>

              <span
                className={first ? 'chip3d-dark chip3d' : 'chip3d'}
                style={
                  first
                    ? { background: 'rgba(255,255,255,.22)', color: '#fff', borderColor: 'rgba(255,255,255,.4)' }
                    : undefined
                }
              >
                <span aria-hidden>{l.tier.icon}</span>
                {l.tier.name}
              </span>
            </button>
          </Tilt3D>
        )
      })}
    </div>
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
        מישהו בפורום שואל עכשיו על גור שלא אוכל. אתם יודעים את התשובה? תענו. ככה זה מתחיל.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/forum" className="btn btn-primary">
          לפורום הקהילה
        </Link>
        <Link href="/events" className="btn btn-ghost" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.35)' }}>
          לאירועים הקרובים
        </Link>
      </div>
    </section>
  )
}
