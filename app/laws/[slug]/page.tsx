import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { lawSpokes, getLawSpoke } from '@/lib/lawSpokes'
import { officialSources } from '@/lib/lawsContent'

export function generateStaticParams() {
  return lawSpokes.map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const s = getLawSpoke(params.slug)
  if (!s) return buildMetadata({ title: 'דף לא נמצא', path: `/laws/${params.slug}`, noindex: true })
  return buildMetadata({ title: s.title, description: s.description, path: `/laws/${s.slug}` })
}

export default function LawSpokePage({ params }: { params: { slug: string } }) {
  const s = getLawSpoke(params.slug)
  if (!s) notFound()

  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: s.title,
      description: s.description,
      path: `/laws/${s.slug}`,
      section: 'חוקים על כלבים',
      datePublished: '2026-07-01',
      dateModified: '2026-07-01',
    }),
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'חוקים על כלבים', path: '/laws' },
      { name: s.title.split(' - ')[0], path: `/laws/${s.slug}` },
    ]),
    faqSchema(s.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <Link href="/laws" style={{ fontSize: 13.5, color: 'var(--brand-dark)', textDecoration: 'none', fontWeight: 700 }}>
            ← חוקים על כלבים בישראל
          </Link>
          <h1 className="page-title" style={{ fontSize: 36, marginTop: 10 }}>{s.title.split(' - ')[0]}</h1>
          <p className="page-sub" style={{ maxWidth: 620, fontSize: 17, color: '#5b4d3c', lineHeight: 1.7 }}>{s.description}</p>
        </div>
      </div>

      {/* באנר הסתייגות משפטית */}
      <div role="note" style={{ marginTop: 8, padding: '14px 18px', background: '#fdf6f0', border: '1.5px solid #e8c49a', borderRadius: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚖️</span>
        <p style={{ margin: 0, fontSize: 14, color: '#6b4c2a', lineHeight: 1.65 }}>
          <strong>המידע באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.</strong> הוא אינו תחליף לפנייה לעורך דין. במצב של מחלוקת, תביעה, קנס או שאלה משפטית קונקרטית - פנו לייעוץ מקצועי.
        </p>
      </div>

      {/* תשובה מהירה */}
      <section style={{ marginTop: 16, padding: '20px 22px', background: 'linear-gradient(135deg,#fff8ea,#fef0d8)', border: '2px solid rgba(201,154,91,.35)', borderRadius: 18 }}>
        <div style={{ fontWeight: 900, color: 'var(--brand-dark)', fontSize: 14, letterSpacing: 0.5, marginBottom: 8 }}>⚡ תשובה מהירה</div>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.7 }}>{s.quickAnswer}</p>
      </section>

      {/* פרוזה */}
      <article style={{ marginTop: 32 }}>
        {s.sections.map((sec, i) => (
          <section key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 8 }}>{sec.heading}</h2>
            {sec.paragraphs.map((p, j) => (
              <p key={j} style={{ fontSize: 16, color: '#3a2e22', lineHeight: 1.8, margin: '0 0 10px' }}>{p}</p>
            ))}
          </section>
        ))}
      </article>

      {/* FAQ */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>שאלות נפוצות</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {s.faq.map((f, i) => (
            <details key={i} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 12, padding: '12px 16px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--ink)', fontSize: 15.5 }}>{f.q}</summary>
              <p style={{ margin: '8px 0 0', fontSize: 14.5, color: '#5b4d3c', lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* מקורות רשמיים */}
      <section style={{ marginTop: 36, padding: '20px 22px', background: '#fff', border: '1.5px solid rgba(201,154,91,.28)', borderRadius: 18 }}>
        <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>מקורות רשמיים</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 6 }}>
          {officialSources.map((src, i) => (
            <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--ink)' }}>{src.label}</span>
              <span style={{ fontSize: 12, color: '#8a7c66', direction: 'ltr', textAlign: 'right' }}>{src.url}{src.note ? ` · ${src.note}` : ''}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ניווט חזרה */}
      <div style={{ marginTop: 36, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link href="/laws" className="btn btn-ghost">← המדריך המלא לחוקי כלבים</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל הגזעים</Link>
      </div>
    </main>
  )
}
