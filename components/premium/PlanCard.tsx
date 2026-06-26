'use client'

import { Tilt3D } from '@/components/fx/Tilt3D'
import { useToast } from '@/components/shared/Toast'
import type { Plan } from '@/lib/premium'

/**
 * כרטיס מסלול בודד לעמוד הפרימיום.
 *
 * נגישות: הכפתור אלמנט <button> אמיתי עם תווית מלאה; כל שורת תכונה
 * מסומנת ב-✓ / - עם aria-hidden על האייקון וטקסט מפורש לקורא מסך.
 * המסלול המודגש (featured) מקבל מסגרת accent ותג פינה - קישוט בלבד.
 */
export function PlanCard({ plan }: { plan: Plan }) {
  const toast = useToast()
  const featured = !!plan.featured

  return (
    <Tilt3D max={6} glare={false} style={{ height: '100%' }}>
      <div
        className="card lift-3d"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '32px 26px',
          border: featured ? '2px solid #c99a5b' : '1px solid rgba(0,0,0,.07)',
          background: featured
            ? 'linear-gradient(165deg, #fffaf0, #fdf6e9)'
            : '#fff',
          boxShadow: featured
            ? '0 14px 40px rgba(201,154,91,.22)'
            : '0 2px 12px rgba(0,0,0,.04)',
        }}
      >
        {/* תג פינה למסלול המודגש */}
        {plan.badge && (
          <span
            style={{
              position: 'absolute',
              top: 18,
              insetInlineEnd: 18,
              background: '#c99a5b',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 0.5,
              padding: '6px 12px',
              borderRadius: 100,
            }}
          >
            {plan.badge}
          </span>
        )}

        {/* כותרת + תועלת */}
        <h3
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#241a12',
            letterSpacing: '-0.5px',
            marginBottom: 6,
          }}
        >
          {plan.name}
        </h3>
        <p style={{ color: '#7a6a58', fontSize: 14.5, lineHeight: 1.5, margin: 0, minHeight: 44 }}>
          {plan.tagline}
        </p>

        {/* מחיר */}
        <div style={{ marginTop: 20, marginBottom: 4 }}>
          {plan.price === 0 ? (
            <span style={{ fontSize: 40, fontWeight: 900, color: '#2a2018' }}>חינם</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 900, color: '#2a2018', lineHeight: 1 }}>
                {plan.price}
              </span>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#c99a5b' }}>₪</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#7a6a58' }}>
                {plan.unit}
              </span>
            </span>
          )}
        </div>
        {plan.priceNote ? (
          <p style={{ fontSize: 12.5, color: '#9a8a76', margin: '0 0 6px', minHeight: 18 }}>
            {plan.priceNote}
          </p>
        ) : (
          <p style={{ fontSize: 12.5, color: '#9a8a76', margin: '0 0 6px', minHeight: 18 }}>
            {plan.unit}
          </p>
        )}

        {/* קהל יעד */}
        <p
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: '#c99a5b',
            margin: '6px 0 18px',
          }}
        >
          {plan.audience}
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(201,154,91,.18)', margin: '0 0 18px' }} />

        {/* רשימת תכונות */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 11, flex: 1 }}>
          {plan.features.map((f) => (
            <li
              key={f.label}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                fontSize: 14.5,
                lineHeight: 1.45,
                color: f.included ? '#241a12' : '#a99e8e',
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 900,
                  marginTop: 1,
                  background: f.included ? 'rgba(201,154,91,.16)' : 'rgba(0,0,0,.05)',
                  color: f.included ? '#a97c46' : '#b5ab9b',
                }}
              >
                {f.included ? '✓' : '-'}
              </span>
              <span>
                <span
                  style={{
                    position: 'absolute',
                    width: 1,
                    height: 1,
                    padding: 0,
                    margin: -1,
                    overflow: 'hidden',
                    clip: 'rect(0 0 0 0)',
                    whiteSpace: 'nowrap',
                    border: 0,
                  }}
                >
                  {f.included ? 'כלול: ' : 'לא כלול: '}
                </span>
                {f.label}
              </span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          type="button"
          className={`btn ${featured ? 'btn-primary' : 'btn-dark'} btn-block`}
          style={{ marginTop: 24 }}
          onClick={() => toast(plan.toast)}
        >
          {plan.cta}
        </button>
      </div>
    </Tilt3D>
  )
}
