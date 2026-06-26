'use client'

import Link from 'next/link'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { img, type Community } from '@/lib/communities'

/**
 * כרטיס עיר תלת-ממדי - תמונת רקע, שם העיר, מחוז, blurb ושורת סטטיסטיקה.
 * עוטף ב-Tilt3D, כל הכרטיס לינק ל-/community/{slug}.
 */
export function CommunityCard({ community }: { community: Community }) {
  const c = community
  return (
    <Tilt3D className="sweep" max={10} glare style={{ height: '100%' }}>
      <Link
        href={`/community/${c.slug}`}
        className="lift-3d"
        aria-label={`קהילת ${c.name}, מחוז ${c.district} - ${c.members.toLocaleString('he-IL')} חברים, ${c.events} אירועים, ${c.groups} קבוצות`}
        style={{
          display: 'block',
          position: 'relative',
          height: 320,
          borderRadius: 24,
          overflow: 'hidden',
          textDecoration: 'none',
          color: '#fff',
          border: `1px solid ${c.accent}55`,
          boxShadow: '0 18px 40px rgba(42,32,24,.18)',
          outlineOffset: 3,
        }}
      >
        {/* תמונת רקע */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${img(c.photo, 900)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'scale(1.04)',
          }}
        />
        {/* gradient כהה לקריאוּת */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(42,32,24,.08) 0%, rgba(42,32,24,.45) 48%, rgba(42,32,24,.92) 100%)',
          }}
        />

        {/* פס accent עליון */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0,
            insetInline: 0,
            height: 5,
            background: `linear-gradient(90deg, ${c.accent}, transparent)`,
          }}
        />

        {/* תווית מחוז (chip) */}
        <span
          style={{
            position: 'absolute',
            top: 16,
            insetInlineEnd: 16,
            padding: '5px 13px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 800,
            color: '#2a2018',
            background: c.accent,
            boxShadow: '0 4px 14px rgba(0,0,0,.22)',
          }}
        >
          {c.district}
        </span>

        {/* תוכן תחתון */}
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            padding: '22px 22px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 900,
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              textShadow: '0 2px 12px rgba(0,0,0,.5)',
            }}
          >
            {c.name}
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,.92)',
              minHeight: 38,
            }}
          >
            {c.blurb}
          </p>

          {/* שורת סטטיסטיקה */}
          <div
            aria-hidden
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 8,
              paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,.22)',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            <Stat icon="👥" label="חברים" value={c.members.toLocaleString('he-IL')} accent={c.accent} />
            <Stat icon="🎉" label="אירועים" value={String(c.events)} accent={c.accent} />
            <Stat icon="🛒" label="קבוצות" value={String(c.groups)} accent={c.accent} />
          </div>
        </div>
      </Link>
    </Tilt3D>
  )
}

function Stat({
  icon,
  value,
  label,
  accent,
}: {
  icon: string
  value: string
  label: string
  accent: string
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} title={`${value} ${label}`}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ color: accent }}>{value}</span>
    </span>
  )
}
