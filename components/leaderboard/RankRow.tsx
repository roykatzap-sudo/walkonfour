'use client'

import { useToast } from '@/components/shared/Toast'
import { Tilt3D } from '@/components/fx/Tilt3D'
import type { RankedLeader } from '@/lib/leaderboard'

/**
 * שורה בודדת בלוח המובילים (מקום 4 ומטה - שלושת הראשונים מקבלים פודיום).
 *
 * נגישות: כל השורה היא <button> אמיתי עם aria-label מלא שמתאר מקום,
 * שם, דרגה, נקודות ומגמה. לחיצה מציגה toast (אין backend) שמדגיש איך
 * החבר צבר את הנקודות - חיזוק חיובי שמעודד מעורבות.
 */
export function RankRow({ leader }: { leader: RankedLeader }) {
  const toast = useToast()
  const l = leader
  const city = l.community?.name ?? '-'

  const trendText =
    l.trend === 'up'
      ? `עלה ${l.trendBy} מקומות`
      : l.trend === 'down'
        ? `ירד ${l.trendBy} מקומות`
        : 'ללא שינוי במקום'

  const onSelect = () => {
    toast(`${l.name} ו${l.dog} צברו ${l.points.toLocaleString('he-IL')} נקודות · דרגת ${l.tier.name}`)
  }

  return (
    <Tilt3D className="sweep" max={5} glare={false} style={{ display: 'block' }}>
      <button
        type="button"
        onClick={onSelect}
        className="lift-3d"
        aria-label={`מקום ${l.rank}: ${l.name} מ${city}, דרגת ${l.tier.name}, ${l.points.toLocaleString('he-IL')} נקודות, ${trendText}`}
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: 16,
          width: '100%',
          textAlign: 'start',
          padding: '14px 18px',
          borderRadius: 18,
          background: '#fff',
          border: '1px solid rgba(0,0,0,.07)',
          boxShadow: '0 2px 12px rgba(42,32,24,.05)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          color: 'var(--text)',
        }}
      >
        {/* מספר מקום + מגמה */}
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 44 }}>
          <span
            aria-hidden
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: 'var(--brand-dark)',
              letterSpacing: '-1px',
              lineHeight: 1,
            }}
          >
            {l.rank}
          </span>
          <TrendPill trend={l.trend} by={l.trendBy} />
        </span>

        {/* אווטר + שם + דרגה + תגים */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
          <span
            aria-hidden
            style={{
              flex: '0 0 auto',
              width: 46,
              height: 46,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              fontSize: 20,
              fontWeight: 900,
              color: '#fff',
              background: 'linear-gradient(135deg, #e8c887, #c99a5b)',
              boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.4)',
            }}
          >
            {l.name.charAt(0)}
          </span>

          <span style={{ display: 'flex', flexDirection: 'column', gap: 5, minWidth: 0 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <strong style={{ fontSize: 16, fontWeight: 800, lineHeight: 1.1 }}>{l.name}</strong>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                ו{l.dog} · {city}
              </span>
            </span>

            <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span className="chip3d">
                <span aria-hidden>{l.tier.icon}</span>
                {l.tier.name}
              </span>
              {l.badges.map((b) => (
                <span key={b.label} className="chip3d">
                  <span aria-hidden>{b.icon}</span>
                  {b.label}
                </span>
              ))}
            </span>
          </span>
        </span>

        {/* נקודות */}
        <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, minWidth: 80 }}>
          <strong style={{ fontSize: 20, fontWeight: 900, color: 'var(--brand-dark)', letterSpacing: '-0.5px' }}>
            {l.points.toLocaleString('he-IL')}
          </strong>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>נקודות</span>
        </span>
      </button>
    </Tilt3D>
  )
}

/** תגית מגמה קומפקטית - חץ צבעוני + מספר המקומות שזזו. */
function TrendPill({ trend, by }: { trend: RankedLeader['trend']; by: number }) {
  if (trend === 'same') {
    return (
      <span
        title="ללא שינוי"
        style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-soft)', lineHeight: 1 }}
      >
        <span aria-hidden>-</span>
      </span>
    )
  }
  const up = trend === 'up'
  return (
    <span
      title={up ? `עלה ${by} מקומות` : `ירד ${by} מקומות`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1,
        color: up ? '#c99a5b' : '#9a8366',
      }}
    >
      <span aria-hidden>{up ? '▲' : '▼'}</span>
      {by}
    </span>
  )
}
