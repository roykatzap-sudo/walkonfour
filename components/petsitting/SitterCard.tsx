'use client'

import { Tilt3D } from '@/components/fx/Tilt3D'
import { Stars } from '@/components/shared/Stars'
import { sitterImg, type Sitter } from '@/lib/petsitting'

/**
 * מספר וואטסאפ דמו יציב לכל שומר/ת - נגזר דטרמיניסטית מהמזהה כדי
 * שכל כרטיס יוביל לקישור עקבי (במצב דמו, ללא backend). בייצור יוחלף
 * במספר אמיתי מנתוני השומר/ת.
 */
function demoWhatsApp(seed: string): string {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  const eight = (h % 100000000).toString().padStart(8, '0')
  return `97250${eight}` // פורמט בינלאומי ללא '+'
}

export function SitterCard({ sitter, sharedBy }: { sitter: Sitter; sharedBy?: string }) {
  const waMessage = `היי ${sitter.name}, ראיתי את הפרופיל שלך בכלבניה ואשמח לבדוק זמינות לשמירה על הכלב שלי.`
  const waUrl = `https://wa.me/${demoWhatsApp(sitter.id)}?text=${encodeURIComponent(waMessage)}`

  return (
    <Tilt3D className="ps-tilt" max={10} glare>
      <div
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          padding: 24,
          boxShadow: '0 12px 40px rgba(42,32,24,.08)',
          border: '1px solid rgba(42,32,24,.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          height: '100%',
        }}
      >
        {sharedBy && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              alignSelf: 'flex-start',
              fontSize: 12,
              fontWeight: 800,
              color: '#a97c46',
              background: 'rgba(232,200,135,.18)',
              border: '1px solid rgba(201,154,91,.35)',
              borderRadius: 100,
              padding: '4px 12px',
            }}
          >
            <span aria-hidden="true">🤝</span>
            שותף על ידי {sharedBy}
          </div>
        )}
        {/* ראש הכרטיס */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '3px solid #e8c887',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async"
              src={sitterImg(sitter.photo, 200)}
              alt={sitter.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: 18, color: '#2a2018' }}>{sitter.name}</span>
              {sitter.verified && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#c99a5b',
                    background: 'rgba(232,200,135,.14)',
                    border: '1px solid rgba(232,200,135,.3)',
                    borderRadius: 100,
                    padding: '2px 10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✓ מאומת
                </span>
              )}
            </div>
            <div style={{ color: '#7a8c80', fontSize: 14, marginTop: 2 }}>📍 {sitter.city}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: 14 }}>
              <Stars rating={sitter.rating} />
              <span style={{ fontWeight: 700, color: '#2a2018' }}>{sitter.rating.toFixed(1)}</span>
              <span style={{ color: '#9aa89e' }}>({sitter.reviews} ביקורות)</span>
            </div>
          </div>
        </div>

        {/* תיאור */}
        <p style={{ color: '#7a8c80', fontSize: 14, lineHeight: 1.6, margin: 0, flex: 1 }}>{sitter.bio}</p>

        {/* צ'יפים לשירותים */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sitter.services.map((s) => (
            <span
              key={s}
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#a97c46',
                background: 'rgba(232,200,135,.16)',
                border: '1px solid rgba(201,154,91,.22)',
                borderRadius: 100,
                padding: '5px 12px',
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* מחיר + כפתור */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 14,
            borderTop: '1px solid #f0ede4',
          }}
        >
          <div>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#2a2018' }}>₪{sitter.pricePerNight}</span>
            <span style={{ fontSize: 13, color: '#9aa89e', marginRight: 4 }}>/ לילה</span>
          </div>
          <a
            className="btn btn-primary"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`צרו קשר עם ${sitter.name} בוואטסאפ`}
            style={{ padding: '10px 22px', fontSize: 14, whiteSpace: 'nowrap' }}
          >
            צרו קשר
          </a>
        </div>
      </div>
    </Tilt3D>
  )
}
