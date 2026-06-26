'use client'

import Link from 'next/link'
import type { Community } from '@/lib/communities'
import { img } from '@/lib/communities'
import { formatNumber } from '@/lib/utils'
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

/** אווטארים מספריים מדומים - עיגול עם gradient ואות. */
const AVATAR_LETTERS = ['ד', 'מ', 'ל', 'ש', 'נ', 'ר', 'א', 'ע', 'ת', 'י', 'ב', 'ג']

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
              קהילת כלבניה · מחוז {c.district}
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
              <span className="chip3d-dark">
                {formatNumber(c.members)} חברים
              </span>
              <span className="chip3d-dark">{c.events} אירועים החודש</span>
              <span className="chip3d-dark">{c.groups} קבוצות רכישה</span>
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
              <span className="grad-text">{formatNumber(c.members)}+</span> בעלי כלבים
            </h2>
          </Reveal3D>
          <Reveal3D delay={2}>
            <p
              style={{
                color: 'rgba(255,255,255,.75)',
                fontSize: 18,
                margin: '0 0 40px',
                lineHeight: 1.5,
              }}
            >
              שכנים שלכם מ{c.name}, עם הכלבים שלהם. אותם פרצופים בטיול של שישי, אותם אנשים ששומרים על הכלב כשאתם בחו"ל.
            </p>
          </Reveal3D>

          {/* avatar strip - דקורטיבי בלבד */}
          <Reveal3D delay={3}>
            <div
              aria-hidden
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 0,
                marginBottom: 40,
              }}
            >
              {AVATAR_LETTERS.map((letter, i) => (
                <div
                  key={i}
                  className="floaty"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    color: '#2a2018',
                    marginInlineStart: i === 0 ? 0 : -14,
                    border: '3px solid #2a2018',
                    background: `linear-gradient(135deg, ${accent}, ${hexToRgba(accent, 0.6)})`,
                    boxShadow: `0 6px 18px ${hexToRgba(accent, 0.35)}`,
                    animationDelay: `${i * 0.25}s`,
                    position: 'relative',
                    zIndex: AVATAR_LETTERS.length - i,
                  }}
                >
                  {letter}
                </div>
              ))}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: 13,
                  fontWeight: 900,
                  color: '#fff',
                  marginInlineStart: -14,
                  border: '3px solid #2a2018',
                  background: 'rgba(255,255,255,.12)',
                  position: 'relative',
                  zIndex: 0,
                }}
              >
                +{formatNumber(Math.max(c.members - AVATAR_LETTERS.length, 0))}
              </div>
            </div>
          </Reveal3D>

          {/* mini stats */}
          <Reveal3D delay={4}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 14,
                marginBottom: 40,
              }}
            >
              {[
                { val: formatNumber(c.members), lbl: 'חברים' },
                { val: c.events, lbl: 'אירועים החודש' },
                { val: c.groups, lbl: 'קבוצות פעילות' },
              ].map((s) => (
                <div
                  key={s.lbl}
                  className="glass-dark"
                  style={{ borderRadius: 18, padding: '18px 26px', minWidth: 130 }}
                >
                  <div style={{ fontSize: 30, fontWeight: 900, color: accent }}>{s.val}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </Reveal3D>

          <Reveal3D delay={4}>
            <MagneticButton href="/auth/register" className="btn btn-primary sweep">
              אני רוצה להצטרף
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
