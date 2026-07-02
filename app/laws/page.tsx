import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { lawsContent, officialSources } from '@/lib/lawsContent'

const SPOKE_PAGES = [
  { slug: 'dangerous-breeds', label: 'גזעים מסוכנים - הרשימה המלאה', icon: '⚠️' },
  { slug: 'leash-fine', label: 'קנס על כלב בלי רצועה', icon: '🔴' },
  { slug: 'dog-license', label: 'רישיון לכלב - שלב אחר שלב', icon: '📋' },
  { slug: 'dog-bite', label: 'כלב נשך - מה עושים', icon: '🩹' },
  { slug: 'poop-fine', label: 'קנס על אי-איסוף צואה', icon: '🚫' },
]

export function generateMetadata() {
  return buildMetadata({
    title: lawsContent.title,
    description: lawsContent.description,
    path: '/laws',
  })
}

export default function LawsPage() {
  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: lawsContent.title,
      description: lawsContent.description,
      path: '/laws',
      section: 'חוקים על כלבים',
      datePublished: '2026-07-01',
      dateModified: '2026-07-01',
    }),
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'חוקים על כלבים בישראל', path: '/laws' },
    ]),
    faqSchema(lawsContent.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .law-faq { transition: border-color .18s ease, box-shadow .18s ease; }
            .law-faq:hover { border-color: rgba(201,154,91,.5); box-shadow: 0 4px 16px rgba(42,32,24,.06); }
            .law-faq[open] { border-color: rgba(201,154,91,.55); box-shadow: 0 6px 20px rgba(42,32,24,.07); }
            .law-faq summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .law-faq summary::-webkit-details-marker { display: none; }
            .law-faq summary::after {
              content: '›'; font-size: 24px; line-height: 1; font-weight: 700;
              color: #c99a5b; transform: rotate(90deg); transition: transform .25s ease; flex-shrink: 0;
            }
            .law-faq[open] summary::after { transform: rotate(-90deg); }
            .law-faq:focus-within { outline: 3px solid rgba(201,154,91,.5); outline-offset: 2px; }
            .law-faq[open] .law-faq-body { animation: lawFaqIn .28s ease; }
            @keyframes lawFaqIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

            .law-spoke {
              display: flex; align-items: center; gap: 10px; padding: 15px 16px;
              background: #fff; border: 1px solid rgba(201,154,91,.22); border-radius: 14px;
              text-decoration: none; color: var(--ink); font-weight: 700; font-size: 15px;
              transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
            }
            .law-spoke:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(42,32,24,.09); border-color: rgba(201,154,91,.5); }
            .law-spoke:focus-visible { outline: 3px solid rgba(201,154,91,.55); outline-offset: 3px; }
            .law-spoke-arrow { margin-inline-start: auto; color: #c99a5b; transition: transform .18s ease; }
            .law-spoke:hover .law-spoke-arrow { transform: translateX(-3px); }

            @media (prefers-reduced-motion: reduce) {
              .law-faq, .law-faq summary::after, .law-spoke, .law-spoke-arrow { transition: none; }
              .law-faq[open] .law-faq-body { animation: none; }
              .law-spoke:hover { transform: none; }
            }
          `,
        }}
      />

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

      {/* באנר הסתייגות משפטית */}
      <div role="note" style={{ marginTop: 8, padding: '14px 18px', background: '#fdf6f0', border: '1.5px solid #e8c49a', borderRadius: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚖️</span>
        <p style={{ margin: 0, fontSize: 14, color: '#6b4c2a', lineHeight: 1.65 }}>
          <strong>המידע באתר זה הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.</strong> הוא אינו תחליף לפנייה לעורך דין. במצב של מחלוקת, תביעה, קנס או שאלה משפטית קונקרטית - פנו לייעוץ מקצועי.
        </p>
      </div>

      {/* ★ תשובה מהירה */}
      <section style={{ position: 'relative', marginTop: 16, padding: '20px 24px', background: 'linear-gradient(135deg,#fff8ea,#fef0d8)', border: '2px solid rgba(201,154,91,.35)', borderRadius: 18, boxShadow: '0 6px 22px rgba(201,154,91,.12)', overflow: 'hidden' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 0, insetInlineStart: 0, width: 5, height: '100%', background: 'linear-gradient(180deg,#c99a5b,#e8c887)' }} />
        <div style={{ fontWeight: 900, color: 'var(--brand-dark)', fontSize: 14, letterSpacing: 0.5, marginBottom: 8 }}>⚡ תשובה מהירה</div>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.75, maxWidth: '68ch' }}>{lawsContent.quickAnswer}</p>
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
            <details key={i} className="law-faq" style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 14, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--ink)', fontSize: 16 }}>{f.q}</summary>
              <div className="law-faq-body">
                <p style={{ margin: '10px 0 0', fontSize: 15.5, color: '#5b4d3c', lineHeight: 1.75 }}>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* מדריכים מעמיקים - spoke pages */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>מדריכים מעמיקים לפי נושא</h2>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {SPOKE_PAGES.map((s) => (
            <Link key={s.slug} href={`/laws/${s.slug}`} className="law-spoke">
              <span style={{ fontSize: 20 }} aria-hidden="true">{s.icon}</span>
              <span>{s.label}</span>
              <span className="law-spoke-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* מקורות רשמיים */}
      <section style={{ marginTop: 40, padding: '22px 22px', background: '#fff', border: '1.5px solid rgba(201,154,91,.28)', borderRadius: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>מקורות רשמיים</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 8 }}>
          {officialSources.map((s, i) => (
            <li key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontWeight: 700, fontSize: 14.5, color: 'var(--ink)' }}>{s.label}</span>
              <span style={{ fontSize: 12.5, color: '#8a7c66', direction: 'ltr', textAlign: 'right' }}>{s.url}{s.note ? ` · ${s.note}` : ''}</span>
            </li>
          ))}
        </ul>
        <p style={{ margin: '14px 0 0', fontSize: 13, color: '#8a7c66', lineHeight: 1.6 }}>
          המידע בעמוד זה מבוסס על החקיקה הרשמית. לאימות עצמאי של הנוסח המחייב, פנו למאגר החקיקה נבו או לאתר הכנסת.
        </p>
      </section>

      {/* CTA */}
      <div style={{ marginTop: 32, padding: '20px 22px', background: '#fbf7ef', borderRadius: 16, textAlign: 'center' }}>
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
