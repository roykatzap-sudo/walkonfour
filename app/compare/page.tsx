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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .cmp-hub-card {
              display: block; padding: 20px 22px; background: #fff;
              border: 1px solid rgba(201,154,91,.22); border-radius: 18px;
              text-decoration: none; position: relative; overflow: hidden;
              transition: transform .2s cubic-bezier(.2,.7,.3,1), box-shadow .2s ease, border-color .2s ease;
            }
            .cmp-hub-card::before {
              content: ''; position: absolute; top: 0; inset-inline-start: 0;
              width: 4px; height: 100%; background: linear-gradient(180deg,#c99a5b,#e8c887);
              transform: scaleY(0); transform-origin: top; transition: transform .25s ease;
            }
            .cmp-hub-card:hover {
              transform: translateY(-3px);
              box-shadow: 0 12px 30px rgba(42,32,24,.1);
              border-color: rgba(201,154,91,.45);
            }
            .cmp-hub-card:hover::before { transform: scaleY(1); }
            .cmp-hub-card:focus-visible { outline: 3px solid rgba(201,154,91,.55); outline-offset: 3px; }
            .cmp-hub-arrow { transition: gap .2s ease; }
            .cmp-hub-card:hover .cmp-hub-arrow { gap: 10px; }
            @media (prefers-reduced-motion: reduce) {
              .cmp-hub-card, .cmp-hub-card::before, .cmp-hub-arrow { transition: none; }
              .cmp-hub-card:hover { transform: none; }
            }
          `,
        }}
      />

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
          <Link key={c.slug} href={`/compare/${c.slug}`} className="cmp-hub-card">
            <div style={{ fontWeight: 900, fontSize: 19, color: 'var(--ink)', marginBottom: 6 }}>
              {nameOf(c.breedA)} מול {nameOf(c.breedB)}
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#5b4d3c', lineHeight: 1.7 }}>{c.excerpt}</p>
            <span className="cmp-hub-arrow" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 12, fontWeight: 800, fontSize: 14, color: 'var(--brand-dark)' }}>
              להשוואה המלאה <span aria-hidden="true">→</span>
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
