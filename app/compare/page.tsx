import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { comparisons } from '@/lib/comparisons'
import { breeds } from '@/lib/breeds'

export const metadata = buildMetadata({
  title: 'השוואות גזעים - מי מתאים לכם יותר?',
  description:
    'השוואות צד-בצד בין גזעי הכלבים הפופולריים בישראל: לברדור מול גולדן, רוטוויילר מול דוברמן, האסקי מול מלינואה ועוד - טבלה, מחירים ופסק דין כן.',
  path: '/compare',
})

export default function CompareHubPage() {
  const schemas: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'גזעים', path: '/breeds' },
      { name: 'השוואות', path: '/compare' },
    ]),
  ]

  const nameOf = (slug: string) => breeds.find((b) => b.slug === slug)?.name ?? slug

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">השוואות גזעים</span>
          <h1 className="page-title" style={{ fontSize: 38 }}>איזה גזע מתאים לכם יותר?</h1>
          <p className="page-sub" style={{ maxWidth: 620, fontSize: 17, color: '#5b4d3c', lineHeight: 1.7 }}>
            השוואות כנות, צד-בצד: אופי, אנרגיה, מחיר, בריאות והתאמה לחיים בישראל - ובסוף פסק דין ברור.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 14, marginTop: 20 }}>
        {comparisons.map((c) => (
          <Link
            key={c.slug}
            href={`/compare/${c.slug}`}
            style={{ display: 'block', padding: '20px 22px', background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 18, textDecoration: 'none' }}
          >
            <div style={{ fontWeight: 900, fontSize: 19, color: 'var(--ink)', marginBottom: 6 }}>
              {nameOf(c.breedA)} מול {nameOf(c.breedB)}
            </div>
            <p style={{ margin: 0, fontSize: 14.5, color: '#5b4d3c', lineHeight: 1.7 }}>{c.excerpt}</p>
            <span style={{ display: 'inline-block', marginTop: 10, fontWeight: 800, fontSize: 14, color: 'var(--brand-dark)' }}>
              להשוואה המלאה →
            </span>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם? קבלו המלצה</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל הגזעים</Link>
      </div>
    </main>
  )
}
