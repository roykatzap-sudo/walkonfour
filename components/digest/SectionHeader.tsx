import Link from 'next/link'

/**
 * כותרת סקשן מגזיני אחידה לדייג׳סט: תווית קטנה, כותרת גדולה, תיאור,
 * וקישור "לכל ה…" בקצה. רכיב שרת טהור (בלי 'use client') - קישוט בלבד.
 *
 * נגישות: ה-`id` מאפשר ל-`<section aria-labelledby>` להצביע על הכותרת.
 * אם מועבר `linkHref`, הוא קישור <a> אמיתי עם תווית ברורה.
 */
export function SectionHeader({
  id,
  tag,
  title,
  description,
  linkHref,
  linkLabel,
}: {
  id: string
  tag: string
  title: string
  description?: string
  linkHref?: string
  linkLabel?: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 22,
      }}
    >
      <div style={{ maxWidth: 620 }}>
        <span className="section-tag">{tag}</span>
        <h2
          id={id}
          className="page-title"
          style={{ fontSize: 'clamp(26px, 4.5vw, 34px)', margin: '2px 0 6px', letterSpacing: '-1px' }}
        >
          {title}
        </h2>
        {description && (
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.6, color: 'var(--text-muted)' }}>
            {description}
          </p>
        )}
      </div>

      {linkHref && linkLabel && (
        <Link
          href={linkHref}
          className="btn btn-ghost"
          style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {linkLabel}
          <span aria-hidden style={{ marginInlineStart: 6 }}>
            ←
          </span>
        </Link>
      )}
    </div>
  )
}
