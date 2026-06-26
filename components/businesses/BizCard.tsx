'use client'

import { Tilt3D } from '@/components/fx/Tilt3D'
import { Stars } from '@/components/shared/Stars'
import { useToast } from '@/components/shared/Toast'
import { bizImg, BIZ_CATEGORY_ICON, type Business } from '@/lib/businesses'

export function BizCard({ business }: { business: Business }) {
  const toast = useToast()

  return (
    <Tilt3D className="biz-tilt" max={9} glare>
      <article
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          border: business.premium
            ? '1px solid rgba(201,154,91,.45)'
            : '1px solid rgba(42,32,24,.06)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* ── תמונת כותרת ── */}
        <div style={{ position: 'relative', height: 168, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={bizImg(business.photo, 600)}
            alt={`${business.name} - ${business.category}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* צ'יפ קטגוריה בפינה */}
          <span
            className="chip3d-dark"
            style={{
              position: 'absolute',
              top: 12,
              insetInlineStart: 12,
              backdropFilter: 'blur(6px)',
              background: 'rgba(42,32,24,.58)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,.25)',
              fontWeight: 700,
            }}
          >
            <span aria-hidden>{BIZ_CATEGORY_ICON[business.category]}</span> {business.category}
          </span>

          {/* תג פרימיום בפינה הנגדית */}
          {business.premium && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                insetInlineEnd: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                fontWeight: 800,
                color: '#2a2018',
                background: 'linear-gradient(135deg, #e8c887, #c99a5b)',
                border: '1px solid rgba(255,255,255,.4)',
                borderRadius: 'var(--pill-radius)',
                padding: 'var(--chip-md-pad)',
                boxShadow: 'var(--shadow-brand-sm)',
              }}
            >
              <span aria-hidden>★</span> פרימיום
            </span>
          )}
        </div>

        {/* ── גוף הכרטיס ── */}
        <div
          style={{
            padding: 'var(--card-padding)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            flex: 1,
          }}
        >
          {/* שם + תג מאומת */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: 19, color: '#2a2018' }}>
                {business.name}
              </h3>
              {business.verified && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#c99a5b',
                    background: 'rgba(232,200,135,.14)',
                    border: '1px solid rgba(232,200,135,.3)',
                    borderRadius: 'var(--pill-radius)',
                    padding: 'var(--chip-sm-pad)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ עסק מאומת
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                <span aria-hidden>📍</span> {business.city}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
                <Stars rating={business.rating} />
                <span style={{ fontWeight: 700, color: '#2a2018' }}>{business.rating.toFixed(1)}</span>
                <span style={{ color: 'var(--text-soft)' }}>({business.reviews})</span>
              </span>
            </div>
          </div>

          {/* תיאור */}
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.65, margin: 0, flex: 1 }}>
            {business.description}
          </p>

          {/* צ'יפים להתמחויות */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {business.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#a97c46',
                  background: 'rgba(232,200,135,.16)',
                  border: '1px solid rgba(201,154,91,.22)',
                  borderRadius: 'var(--pill-radius)',
                  padding: 'var(--chip-md-pad)',
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* כפתור צרו קשר */}
          <div style={{ paddingTop: 12, borderTop: '1px solid #f0ede4' }}>
            <button
              type="button"
              className="btn btn-primary btn-block"
              style={{ fontSize: 14 }}
              onClick={() => toast(`פרטי הקשר של ${business.name} נשלחו אליכם 🐾`)}
              aria-label={`צרו קשר עם ${business.name}`}
            >
              צרו קשר
            </button>
          </div>
        </div>
      </article>
    </Tilt3D>
  )
}
