'use client'

import Link from 'next/link'
import type { Community } from '@/lib/communities'
import { img } from '@/lib/communities'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

/** קישורי "מה קורה בעיר" - שלושה מרכזי פעילות. */
const HUBS = [
  {
    href: '/events',
    icon: '🎉',
    title: 'אירועים בשכונה',
    desc: 'מפגש בוקר בפארק, ערב אילוף עם מאלף אמיתי, ולפעמים יריד יד שנייה. הכול במרחק הליכה.',
  },
  {
    href: '/groups',
    icon: '🛒',
    title: 'קונים יחד',
    desc: 'מתאחדים עם השכנים על שק מזון, חול לכלבים או מיטה. כשקונים בכמות, המחיר יורד יפה.',
  },
  {
    href: '/forum',
    icon: '💬',
    title: 'שואלים את השכנים',
    desc: 'איזה וטרינר באזור שווה את הכסף? מי מכיר מאלף טוב? כאן עונים אנשים שגרים ליד, לא גוגל.',
  },
] as const

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const n = parseInt(
    h.length === 3
      ? h.split('').map((c) => c + c).join('')
      : h,
    16
  )
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function CityHub({ community: c }: { community: Community }) {
  const accent = c.accent
  const accentSoft = hexToRgba(accent, 0.16)
  const accentLine = hexToRgba(accent, 0.4)

  return (
    <main>
      {/* ───────── HERO ───────── */}
      <section
        style={{
          position: 'relative',
          minHeight: '78vh',
          display: 'flex',
          alignItems: 'flex-end',
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="eager" decoding="async" fetchPriority="high"
          src={img(c.photo, 1000)}
          alt={`נוף העיר ${c.name}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            aspectRatio: '16 / 9',
            objectFit: 'cover',
            zIndex: 0,
          }}
        />
        {/* dark ink overlay לקריאוּת מעל התמונה */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background:
              'linear-gradient(180deg, rgba(42,32,24,.45) 0%, rgba(42,32,24,.72) 55%, rgba(42,32,24,.94) 100%)',
          }}
        />
        {/* accent glow */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-120px',
            insetInlineEnd: '-80px',
            width: 420,
            height: 420,
            borderRadius: '50%',
            zIndex: 1,
            background: `radial-gradient(circle, ${hexToRgba(accent, 0.45)} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
        />
        <FloatingPaws />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px 64px',
          }}
        >
          <Reveal3D>
            <Link
              href="/communities"
              className="chip3d-dark"
              style={{ textDecoration: 'none', marginBottom: 18 }}
            >
              ← כל הקהילות
            </Link>
          </Reveal3D>

          <Reveal3D delay={1}>
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                letterSpacing: '.04em',
                color: accent,
                marginBottom: 6,
              }}
            >
              קהילת קהילה על ארבע · מחוז {c.district}
            </div>
          </Reveal3D>

          <Reveal3D delay={1}>
            <h1
              className="display"
              style={{
                fontSize: 'clamp(48px, 9vw, 116px)',
                lineHeight: 0.95,
                fontWeight: 900,
                margin: '0 0 14px',
                color: accent,
                textShadow: '0 8px 40px rgba(0,0,0,.4)',
              }}
            >
              {c.name}
            </h1>
          </Reveal3D>

          <Reveal3D delay={2}>
            <p
              style={{
                fontSize: 'clamp(17px, 2.4vw, 22px)',
                maxWidth: 620,
                color: 'rgba(255,255,255,.92)',
                margin: '0 0 26px',
                lineHeight: 1.5,
              }}
            >
              {c.blurb}
            </p>
          </Reveal3D>

          <Reveal3D delay={3}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 30 }}>
              <span className="chip3d-dark">✨ קהילה חדשה ב{c.name}</span>
              <span className="chip3d-dark">📍 מחוז {c.district}</span>
              <span className="chip3d-dark">🐾 הצטרפו ראשונים</span>
            </div>
          </Reveal3D>

          <Reveal3D delay={4}>
            <MagneticButton
              href="/auth/register"
              className="btn btn-primary sweep"
            >
              בואו לטייל איתנו ב{c.name} 🐾
            </MagneticButton>
          </Reveal3D>
        </div>
      </section>

      {/* ───────── מה קורה בעיר (light) ───────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#fbf7ef',
          padding: '90px 24px',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
          <Reveal3D>
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <span
                className="section-tag"
                style={{ color: '#c99a5b', borderColor: accentLine, background: accentSoft }}
              >
                מרכז הפעילות
              </span>
            </div>
          </Reveal3D>
          <Reveal3D delay={1}>
            <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
              מה קורה ב{c.name}?
            </h2>
          </Reveal3D>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 26,
            }}
          >
            {HUBS.map((h, i) => (
              <Reveal3D as="div" delay={((i + 1) as 1 | 2 | 3)} key={h.href}>
                <Tilt3D className="lift-3d" max={10}>
                  <Link
                    href={h.href}
                    className="card sweep"
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'inherit',
                      height: '100%',
                      padding: 28,
                      borderTop: `4px solid ${accent}`,
                    }}
                  >
                    <div
                      style={{
                        width: 62,
                        height: 62,
                        borderRadius: 18,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 30,
                        marginBottom: 18,
                        background: accentSoft,
                        border: `1px solid ${accentLine}`,
                      }}
                    >
                      {h.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: 22,
                        fontWeight: 900,
                        margin: '0 0 8px',
                        color: '#2a2018',
                      }}
                    >
                      {h.title}
                    </h3>
                    <p style={{ margin: 0, color: '#5b4d3c', lineHeight: 1.55, fontSize: 15 }}>
                      {h.desc}
                    </p>
                    <div
                      style={{
                        marginTop: 18,
                        fontWeight: 800,
                        color: '#c99a5b',
                        fontSize: 15,
                      }}
                    >
                      לכל הפרטים ←
                    </div>
                  </Link>
                </Tilt3D>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── חברי הקהילה (dark) ───────── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: '#2a2018',
          color: '#fff',
          padding: '96px 24px',
        }}
      >
        <FloatingShapes dark />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 880,
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <Reveal3D>
            <span className="chip3d-dark" style={{ marginBottom: 18 }}>
              הקהילה שלנו
            </span>
          </Reveal3D>
          <Reveal3D delay={1}>
            <h2
              style={{
                fontSize: 'clamp(30px, 5vw, 48px)',
                fontWeight: 900,
                margin: '14px 0 10px',
              }}
            >
              <span className="grad-text">קהילה נבנית</span> ב{c.name}
            </h2>
          </Reveal3D>
          <Reveal3D delay={2}>
            <p
              style={{
                color: 'rgba(255,255,255,.82)',
                fontSize: 18,
                margin: '0 0 36px',
                lineHeight: 1.55,
              }}
            >
              אנחנו מקימים עכשיו את חבורת בעלי הכלבים של {c.name}. הצטרפו ראשונים, ונעדכן אתכם
              ברגע שנפתחת חבורה לטיול באזור שלכם.
            </p>
          </Reveal3D>

          {/* honest waitlist value-prop card */}
          <Reveal3D delay={3}>
            <div
              className="glass-dark"
              style={{
                borderRadius: 22,
                padding: '26px 24px',
                maxWidth: 520,
                margin: '0 auto 36px',
                textAlign: 'start',
                display: 'grid',
                gap: 14,
                border: `1px solid ${accentLine}`,
              }}
            >
              {[
                { icon: '🐾', txt: `מפגש טיול ראשון ב${c.name} ברגע שיש מספיק חברים באזור` },
                { icon: '🔔', txt: 'עדכון אישי כשנפתחת פעילות, אירוע או קבוצת רכישה קרובה אליכם' },
                { icon: '🤝', txt: 'אתם בין הראשונים שמעצבים את אופי החבורה המקומית' },
              ].map((row) => (
                <div key={row.txt} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 20,
                      background: accentSoft,
                      border: `1px solid ${accentLine}`,
                    }}
                  >
                    {row.icon}
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.5, color: 'rgba(255,255,255,.9)' }}>
                    {row.txt}
                  </span>
                </div>
              ))}
            </div>
          </Reveal3D>

          <Reveal3D delay={4}>
            <MagneticButton href="/auth/register" className="btn btn-primary sweep">
              הצטרפו ראשונים ל{c.name}
            </MagneticButton>
          </Reveal3D>
        </div>
      </section>

      {/* ───────── חזרה (light) ───────── */}
      <section style={{ background: '#fbf7ef', padding: '54px 24px', textAlign: 'center' }}>
        <Link href="/communities" className="btn btn-ghost">
          ← חזרה לכל הקהילות
        </Link>
      </section>
    </main>
  )
}
