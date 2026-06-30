import Link from 'next/link'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { lawsContent } from '@/lib/lawsContent'

export function generateMetadata() {
  return buildMetadata({
    title: lawsContent.title,
    description: lawsContent.description,
    path: '/laws',
  })
}

export default function LawsPage() {
  const schemas: Record<string, unknown>[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: lawsContent.title,
      description: lawsContent.description,
      url: `${SITE_URL}/laws`,
      inLanguage: 'he-IL',
      author: { '@type': 'Organization', name: 'walkonfour' },
    },
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'חוקים על כלבים בישראל', path: '/laws' },
    ]),
    faqSchema(lawsContent.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">המדריך החוקי</span>
          <h1 className="page-title" style={{ fontSize: 40 }}>
            חוקים על כלבים בישראל - המדריך המלא 2026
          </h1>
          <p className="page-sub" style={{ maxWidth: 620, fontSize: 17, color: '#5b4d3c', lineHeight: 1.7 }}>
            רישוי, רצועה, גזעים מסוכנים, נביחות, ביטוח אחריות - כל מה שבעל כלב בישראל חייב לדעת.
          </p>
        </div>
      </div>

      {/* ★ תשובה מהירה */}
      <section style={{ marginTop: 8, padding: '20px 22px', background: 'linear-gradient(135deg,#fff8ea,#fef0d8)', border: '2px solid rgba(201,154,91,.35)', borderRadius: 18 }}>
        <div style={{ fontWeight: 900, color: 'var(--brand-dark)', fontSize: 14, letterSpacing: 0.5, marginBottom: 8 }}>⚡ תשובה מהירה</div>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.7 }}>{lawsContent.quickAnswer}</p>
      </section>

      {/* תוכן עניינים - חשוב ל-UX וגם ל-SEO */}
      <nav aria-label="תוכן עניינים" style={{ marginTop: 28, padding: '18px 22px', background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16 }}>
        <div style={{ fontWeight: 900, color: 'var(--ink)', fontSize: 15, marginBottom: 10 }}>📑 בעמוד זה</div>
        <ol style={{ margin: 0, paddingInlineStart: 22, fontSize: 14.5, color: '#5b4d3c', lineHeight: 2 }}>
          {lawsContent.sections.map((s, i) => (
            <li key={i}><a href={`#sec-${i}`} style={{ color: 'var(--brand-dark)', textDecoration: 'none' }}>{s.heading}</a></li>
          ))}
        </ol>
      </nav>

      {/* פרוזה */}
      <article style={{ marginTop: 32 }}>
        {lawsContent.sections.map((s, i) => (
          <section key={i} id={`sec-${i}`} style={{ marginBottom: 32, scrollMarginTop: 80 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 8 }}>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} style={{ fontSize: 16, color: '#3a2e22', lineHeight: 1.8, margin: '0 0 10px' }}>{p}</p>
            ))}
          </section>
        ))}
      </article>

      {/* FAQ */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>שאלות נפוצות</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {lawsContent.faq.map((f, i) => (
            <details key={i} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 12, padding: '12px 16px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--ink)', fontSize: 15.5 }}>{f.q}</summary>
              <p style={{ margin: '8px 0 0', fontSize: 14.5, color: '#5b4d3c', lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ marginTop: 40, padding: '20px 22px', background: '#fbf7ef', borderRadius: 16, textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px', fontSize: 15, color: '#5b4d3c' }}>
          מחפשים את הגזע הנכון? יש לנו מדריכים מקיפים ל-29 גזעים, או כלי התאמה אישי:
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם?</Link>
          <Link href="/breeds" className="btn btn-ghost">לכל הגזעים</Link>
        </div>
      </div>
    </main>
  )
}
