'use client'

import Link from 'next/link'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { FavButton } from '@/components/shared/FavButton'
import {
  listingImg,
  formatPrice,
  CONDITION_STYLE,
  type Listing,
} from '@/lib/market'

export function ListingCard({ listing }: { listing: Listing }) {
  const cond = CONDITION_STYLE[listing.condition]
  const isFree = listing.price === 0
  const href = `/market/${listing.id}`

  return (
    <Tilt3D className="mk-tilt" max={9} glare>
      <article
        className="lift-3d"
        style={{
          position: 'relative',
          background: '#fff',
          borderRadius: 24,
          overflow: 'hidden',
          boxShadow: listing.promoted
            ? 'var(--shadow-brand-lg)'
            : 'var(--shadow-lg)',
          border: listing.promoted
            ? '1.5px solid rgba(201,154,91,.45)'
            : '1px solid rgba(42,32,24,.06)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        {/* ── תמונה ── */}
        <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', background: '#f6ecd8' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={listingImg(listing.photo, 600)}
            alt={listing.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />

          {/* תג "מודעה מקודמת" - רמז למונטיזציה */}
          {listing.promoted && (
            <span
              style={{
                position: 'absolute',
                top: 12,
                insetInlineEnd: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 12,
                fontWeight: 800,
                color: '#2a2018',
                background: 'linear-gradient(135deg, #e8c887, #d8b46a)',
                border: '1px solid rgba(255,255,255,.55)',
                borderRadius: 'var(--pill-radius)',
                padding: 'var(--chip-md-pad)',
                boxShadow: 'var(--shadow-brand-sm)',
              }}
            >
              <span aria-hidden="true">★</span>
              מודעה מקודמת
            </span>
          )}

          {/* תג מצב הפריט */}
          <span
            style={{
              position: 'absolute',
              top: 12,
              insetInlineStart: 12,
              fontSize: 12,
              fontWeight: 700,
              color: cond.fg,
              background: cond.bg,
              border: `1px solid ${cond.border}`,
              borderRadius: 'var(--pill-radius)',
              padding: 'var(--chip-md-pad)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {listing.condition}
          </span>

          {/* כפתור שמירה למועדפים - פינה תחתונה-סוף של התמונה */}
          <FavButton
            type="listing"
            id={listing.id}
            label={listing.title}
            style={{ position: 'absolute', bottom: 12, insetInlineEnd: 12, zIndex: 2 }}
          />
        </div>

        {/* ── גוף הכרטיס ── */}
        <div style={{ padding: 'var(--card-padding)', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.35 }}>
              <Link href={href} style={{ color: '#2a2018', textDecoration: 'none' }}>
                {listing.title}
              </Link>
            </h3>
            <span
              style={{
                fontSize: 20,
                fontWeight: 900,
                color: isFree ? '#c99a5b' : '#2a2018',
                whiteSpace: 'nowrap',
              }}
            >
              {formatPrice(listing.price)}
            </span>
          </div>

          {/* קטגוריה + עיר */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, fontSize: 13 }}>
            <span
              style={{
                fontWeight: 600,
                color: '#a97c46',
                background: 'rgba(232,200,135,.16)',
                border: '1px solid rgba(201,154,91,.22)',
                borderRadius: 'var(--pill-radius)',
                padding: 'var(--chip-md-pad)',
              }}
            >
              {listing.category}
            </span>
            <span style={{ color: 'var(--text-soft)' }}>
              <span aria-hidden="true">📍</span> {listing.city}
            </span>
          </div>

          {/* תיאור */}
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13.5, lineHeight: 1.6, flex: 1 }}>
            {listing.description}
          </p>

          {/* תחתית: מוכר + זמן + כפתור */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              paddingTop: 12,
              borderTop: '1px solid #f0ede4',
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#2a2018' }}>{listing.seller}</div>
              <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{listing.postedAgo}</div>
            </div>
            <Link
              href={href}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: 14, whiteSpace: 'nowrap' }}
            >
              לפרטים
            </Link>
          </div>
        </div>
      </article>
    </Tilt3D>
  )
}
