import Link from 'next/link'
import { buildMetadata, SITE_URL } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
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

      {/* מדריכים מעמיקים - spoke pages */}
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>מדריכים מעמיקים לפי נושא</h2>
        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
          {SPOKE_PAGES.map((s) => (
            <Link key={s.slug} href={`/laws/${s.slug}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 14, textDecoration: 'none', color: 'var(--ink)', fontWeight: 700, fontSize: 15, transition: 'border-color .15s' }}>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              {s.label} →
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
