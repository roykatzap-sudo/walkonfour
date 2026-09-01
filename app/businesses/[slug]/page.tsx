import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { JsonLd, localBusinessSchema, breadcrumbSchema } from '@/components/seo/JsonLd'
import { Stars } from '@/components/shared/Stars'
import { BIZ_CATEGORY_ICON, type BizCategory } from '@/lib/businesses'
import { getBusinessBySlug } from '@/lib/directory/store'
import { ReviewForm } from '@/components/businesses/ReviewForm'
import { ReportButton } from '@/components/businesses/ReportButton'
import type { DirectoryReview } from '@/lib/directory/types'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const result = await getBusinessBySlug(slug)
  if (!result) return buildMetadata({ title: 'העסק לא נמצא', path: `/businesses/${slug}`, noindex: true })
  const { business } = result
  const categoryLabel = business.category
  return buildMetadata({
    title: `${business.name} - ${categoryLabel} ב${business.city}`,
    description: business.description,
    path: `/businesses/${slug}`,
  })
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

/** מנקה מספר טלפון לספרות בלבד (בלי מקפים ורווחים) */
function digitsOnly(s: string): string {
  return s.replace(/[^\d+]/g, '')
}

function ReviewItem({ review }: { review: DirectoryReview }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '20px 22px',
        border: '1px solid rgba(42,32,24,.06)',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#2a2018', marginBottom: 4 }}>
            {review.author_name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Stars rating={review.rating} />
            <span style={{ fontSize: 13, color: 'var(--text-soft)' }}>
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>
        <ReportButton type="review" id={review.id} />
      </div>
      {review.text && (
        <p style={{ margin: '12px 0 0', fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {review.text}
        </p>
      )}
    </div>
  )
}

export default async function BusinessDetailPage({ params }: Props) {
  const { slug } = await params
  const result = await getBusinessBySlug(slug)
  if (!result) notFound()

  const { business, reviews } = result
  const icon = BIZ_CATEGORY_ICON[business.category as BizCategory] ?? '🐾'
  const path = `/businesses/${slug}`

  return (
    <main className="page page-narrow">
      <JsonLd
        data={[
          localBusinessSchema({
            name: business.name,
            city: business.city,
            phone: business.phone,
            website: business.website,
            path,
            avgRating: business.avg_rating,
            reviewsCount: business.reviews_count,
          }),
          breadcrumbSchema([
            { name: 'מדריך בעלי מקצוע', path: '/businesses' },
            { name: business.name, path },
          ]),
        ]}
      />

      {/* ── חזרה למדריך ── */}
      <Link
        href="/businesses"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--brand-dark)',
          textDecoration: 'none',
          marginBottom: 20,
        }}
      >
        ← חזרה למדריך
      </Link>

      {/* ── כותרת ── */}
      <section
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 'var(--card-padding)',
          border: '1px solid rgba(42,32,24,.06)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
          <span className="chip3d" style={{ fontSize: 13, fontWeight: 700 }}>
            <span aria-hidden>{icon}</span> {business.category}
          </span>
          <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            {business.city}
            {business.area ? ` - ${business.area}` : ''}
          </span>
        </div>

        <h1 style={{ fontSize: 'var(--h3)', fontWeight: 900, margin: '0 0 12px', color: '#2a2018' }}>
          {business.name}
        </h1>

        {/* דירוג */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 15 }}>
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
            <span style={{ color: 'var(--text-soft)', fontSize: 14 }}>
              עדיין אין ביקורות
            </span>
          )}
        </div>

        {/* כפתורי יצירת קשר */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {business.phone && (
            <a
              href={`tel:${digitsOnly(business.phone)}`}
              className="btn btn-primary"
              style={{ fontSize: 14 }}
            >
              התקשרו
            </a>
          )}
          {business.whatsapp && (
            <a
              href={`https://wa.me/${digitsOnly(business.whatsapp)}`}
              className="btn btn-dark"
              style={{ fontSize: 14 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
          {business.website && (
            <a
              href={business.website}
              className="btn btn-ghost"
              style={{ fontSize: 14 }}
              target="_blank"
              rel="nofollow noopener"
            >
              אתר
            </a>
          )}
        </div>
      </section>

      {/* ── תיאור ── */}
      <section
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 'var(--card-padding)',
          border: '1px solid rgba(42,32,24,.06)',
          boxShadow: 'var(--shadow-xs)',
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10, color: '#2a2018' }}>
          על העסק
        </h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
          {business.description}
        </p>
        <div style={{ marginTop: 16 }}>
          <ReportButton type="business" id={business.id} />
        </div>
      </section>

      {/* ── ביקורות ── */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#2a2018' }}>
          ביקורות ({reviews.length})
        </h2>
        {reviews.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.map((r) => (
              <ReviewItem key={r.id} review={r} />
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            עדיין אין ביקורות. היו הראשונים לכתוב.
          </p>
        )}
      </section>

      {/* ── טופס ביקורת ── */}
      <section
        style={{
          background: '#fff',
          borderRadius: 20,
          padding: 'var(--card-padding)',
          border: '1px solid rgba(42,32,24,.06)',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#2a2018' }}>
          כתבו ביקורת
        </h2>
        <ReviewForm businessSlug={slug} />
      </section>
    </main>
  )
}
