'use client'

import Link from 'next/link'
import { Stars } from '@/components/shared/Stars'
import { BIZ_CATEGORY_ICON, type BizCategory } from '@/lib/businesses'
import type { DirectoryBusiness } from '@/lib/directory/types'

export function BizCard({ business }: { business: DirectoryBusiness }) {
  const icon = BIZ_CATEGORY_ICON[business.category as BizCategory] ?? '🐾'

  return (
    <Link
      href={`/businesses/${business.slug}`}
      style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
      aria-label={`צפייה בעמוד של ${business.name}`}
    >
      <article
        className="kv-lift"
        style={{
          background: '#fff',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid rgba(42,32,24,.06)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 'var(--card-padding)',
          gap: 12,
        }}
      >
        {/* שם + צ'יפ קטגוריה */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontWeight: 800, fontSize: 19, color: '#2a2018' }}>
              {business.name}
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <span
              className="chip3d"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              <span aria-hidden>{icon}</span> {business.category}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              {business.city}
              {business.area ? ` - ${business.area}` : ''}
            </span>
          </div>
        </div>

        {/* דירוג */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14 }}>
          {business.avg_rating != null ? (
            <>
              <Stars rating={business.avg_rating} />
              <span style={{ fontWeight: 700, color: '#2a2018' }}>
                {business.avg_rating.toFixed(1)}
              </span>
              <span style={{ color: 'var(--text-soft)' }}>
                ({business.reviews_count} {business.reviews_count === 1 ? 'ביקורת' : 'ביקורות'})
              </span>
            </>
          ) : (
            <span style={{ color: 'var(--text-soft)', fontSize: 13 }}>
              עדיין אין ביקורות
            </span>
          )}
        </div>

        {/* מחירים */}
        {business.pricing && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: '#8a6a3e',
              background: '#fdf6e9',
              border: '1px solid rgba(201,154,91,.25)',
              borderRadius: 10,
              padding: '6px 10px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {business.pricing}
          </div>
        )}

        {/* תיאור */}
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: 14,
            lineHeight: 1.65,
            margin: 0,
            flex: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {business.description}
        </p>
      </article>
    </Link>
  )
}
