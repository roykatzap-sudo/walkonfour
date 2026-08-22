/* ════════════════════════════════════════════════════════════
   בלוק קישורים פנימיים גנרי.

   אותה שפה ויזואלית של "גזעים דומים", אבל בלי תלות בסוג התוכן:
   מקבל רשימת פריטים מוכנה (ראה lib/relatedContent.ts) ומרנדר
   אותה. אפשר להציב אותו בדף מדריך, בדף גזע או בדף עיר בלי
   שינוי, והוא מחזיר null כשאין מה להציג, כך שאין צורך בשמירה
   בצד הקורא.

   רכיב שרת טהור: בלי state, בלי אפקטים, בלי תלויות חיצוניות.
   ════════════════════════════════════════════════════════════ */

import Link from 'next/link'
import type { RelatedItem } from '@/lib/relatedContent'

/* אייקון כף רגל בקו נקי, במקום אמוג'י (מדיניות האתר). */
function PawIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      style={{ marginInlineEnd: 6, verticalAlign: '-1px', flexShrink: 0 }}
    >
      <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
      <ellipse cx="10" cy="6.5" rx="2" ry="2.7" />
      <ellipse cx="14.8" cy="6.5" rx="2" ry="2.7" />
      <ellipse cx="19" cy="10" rx="2" ry="2.6" />
      <path d="M12.3 12.4c2.6 0 4.9 1.9 4.9 4.2 0 1.7-1.4 2.9-3.2 2.9-1 0-1.4-.4-2.4-.4s-1.4.4-2.4.4c-1.8 0-3.2-1.2-3.2-2.9 0-2.3 2.3-4.2 4.9-4.2Z" />
    </svg>
  )
}

export function RelatedContentBlock({
  heading,
  intro,
  items,
}: {
  heading: string
  intro?: string
  items: RelatedItem[]
}) {
  /* הגנה כפולה: גם על מערך ריק וגם על כפילויות href (מפתחי React). */
  const unique = items.filter((item, i) => items.findIndex((x) => x.href === item.href) === i)
  if (unique.length === 0) return null

  return (
    <section
      style={{
        marginTop: 40,
        padding: '24px 22px',
        background: '#fff',
        border: '1px solid rgba(201,154,91,.22)',
        borderRadius: 16,
      }}
    >
      {/* כותרת + מבטא זהב חתום שנצנץ פעם אחת עם החשיפה */}
      <div className="kv-reveal">
        <h2
          style={{
            margin: '0 0 6px',
            fontSize: 22,
            fontWeight: 900,
            color: 'var(--ink)',
            letterSpacing: '-.3px',
          }}
        >
          {heading}
        </h2>
        <span className="kv-shimmer-line" aria-hidden style={{ margin: '0 0 12px' }} />
        {intro ? (
          <p style={{ margin: '0 0 18px', fontSize: 15, color: '#5b4d3c', lineHeight: 1.6 }}>{intro}</p>
        ) : (
          <div style={{ height: 6 }} />
        )}
      </div>

      {/* גריד עם חשיפה מדורגת חתומה: כל כרטיס עולה בתורו */}
      <div
        data-kv-stagger
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {unique.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="kv-lift kv-reveal kv-press"
            style={{
              display: 'block',
              padding: '16px 18px',
              background: 'linear-gradient(165deg, #fffdf8, #fbf7ef)',
              border: '1.5px solid rgba(201,154,91,.2)',
              borderRadius: 14,
              textDecoration: 'none',
              transition: 'all .2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <span
                className="kv-underline"
                style={{
                  fontWeight: 900,
                  fontSize: 16.5,
                  lineHeight: 1.4,
                  color: 'var(--ink)',
                  display: 'inline-flex',
                  alignItems: 'baseline',
                }}
              >
                <PawIcon />
                {item.label}
              </span>
              <span style={{ color: 'var(--brand-dark)', fontWeight: 800, flexShrink: 0 }} aria-hidden="true">
                ←
              </span>
            </div>
            <div style={{ fontSize: 14, color: '#5b4d3c', lineHeight: 1.55 }}>{item.reason}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
