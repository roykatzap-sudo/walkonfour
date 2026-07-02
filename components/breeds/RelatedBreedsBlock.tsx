/* ════════════════════════════════════════════════════════════
   רכיב "גזעים דומים" - קישורים פנימיים בתחתית כל דף גזע.
   על פי מחקר SEO: 4-6 internal links עם anchor text descriptive
   הם boost עצום ל-rankings (קישורים פנימיים = הצבעת אמון).
   ════════════════════════════════════════════════════════════ */

import Link from 'next/link'
import { breeds } from '@/lib/breeds'
import { getRelatedBreeds } from '@/lib/relatedBreeds'

export function RelatedBreedsBlock({ currentSlug }: { currentSlug: string }) {
  const related = getRelatedBreeds(currentSlug)
  if (related.length === 0) return null

  // אסוף את ה-breed objects לקבלת השם בעברית
  const items = related
    .map((r) => {
      const breed = breeds.find((b) => b.slug === r.slug)
      return breed ? { ...r, name: breed.name, en: breed.en } : null
    })
    .filter((x): x is { slug: string; reason: string; name: string; en: string } => Boolean(x))

  if (items.length === 0) return null

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
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: 'var(--ink)', letterSpacing: '-.3px' }}>
        גזעים דומים שכדאי להכיר
      </h2>
      <p style={{ margin: '0 0 18px', fontSize: 15, color: '#5b4d3c', lineHeight: 1.55 }}>
        אם הגעתם לכאן ושוקלים את הגזע - שווה לבדוק גם:
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {items.map((b) => (
          <Link
            key={b.slug}
            href={`/breeds/${b.slug}`}
            style={{
              display: 'block',
              padding: '16px 18px',
              background: 'linear-gradient(165deg, #fffdf8, #fbf7ef)',
              border: '1.5px solid rgba(201,154,91,.2)',
              borderRadius: 14,
              textDecoration: 'none',
              transition: 'all .2s',
            }}
            className="related-breed-card kv-lift"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
              <span style={{ fontWeight: 900, fontSize: 16.5, color: 'var(--ink)' }}>
                <span aria-hidden="true" style={{ marginInlineEnd: 6 }}>🐾</span>
                {b.name}
              </span>
              <span style={{ color: 'var(--brand-dark)', fontWeight: 800 }} aria-hidden="true">←</span>
            </div>
            <div lang="en" style={{ fontSize: 13, color: '#8a7c66', marginBottom: 6 }}>{b.en}</div>
            <div style={{ fontSize: 14, color: '#5b4d3c', lineHeight: 1.55 }}>{b.reason}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
