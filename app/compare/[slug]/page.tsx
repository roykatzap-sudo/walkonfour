import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { comparisons, getComparison } from '@/lib/comparisons'
import { breeds } from '@/lib/breeds'

export function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug)
  if (!c) return buildMetadata({ title: 'השוואה לא נמצאה', path: `/compare/${params.slug}`, noindex: true })
  return buildMetadata({ title: c.title, description: c.excerpt, path: `/compare/${c.slug}` })
}

export default function ComparePage({ params }: { params: { slug: string } }) {
  const c = getComparison(params.slug)
  if (!c) notFound()
  const breedA = breeds.find((b) => b.slug === c.breedA)
  const breedB = breeds.find((b) => b.slug === c.breedB)

  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: c.title,
      description: c.excerpt,
      path: `/compare/${c.slug}`,
      section: 'השוואות גזעים',
      datePublished: '2026-07-01',
      dateModified: '2026-07-01',
    }),
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'גזעים', path: '/breeds' },
      { name: 'השוואות', path: '/compare' },
      { name: c.title, path: `/compare/${c.slug}` },
    ]),
    faqSchema(c.faq),
  ]

  const nameA = breedA?.name ?? c.breedA
  const nameB = breedB?.name ?? c.breedB

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* ── אקורדיון שאלות נפוצות ── */
            .cmp-faq { transition: border-color .18s ease, box-shadow .18s ease, background .18s ease; }
            .cmp-faq:hover { border-color: rgba(201,154,91,.5); box-shadow: 0 4px 16px rgba(42,32,24,.06); }
            .cmp-faq[open] { border-color: rgba(201,154,91,.55); box-shadow: 0 6px 20px rgba(42,32,24,.07); }
            .cmp-faq summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
            .cmp-faq summary::-webkit-details-marker { display: none; }
            .cmp-faq summary::after {
              content: '›'; font-size: 24px; line-height: 1; font-weight: 700;
              color: #c99a5b; transform: rotate(90deg); transition: transform .25s ease; flex-shrink: 0;
            }
            .cmp-faq[open] summary::after { transform: rotate(-90deg); }
            .cmp-faq:focus-within { outline: 3px solid rgba(201,154,91,.5); outline-offset: 2px; }
            .cmp-faq-body { overflow: hidden; }
            .cmp-faq[open] .cmp-faq-body { animation: cmpFaqIn .28s ease; }
            @keyframes cmpFaqIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }

            /* ── טבלת השוואה: כותרת דביקה + פסים ── */
            .cmp-table-wrap { position: relative; }
            .cmp-table-scroll { overflow-x: auto; border: 1px solid rgba(201,154,91,.22); border-radius: 14px; -webkit-overflow-scrolling: touch; }
            .cmp-table { width: 100%; border-collapse: collapse; font-size: 14.5px; min-width: 440px; }
            .cmp-table thead th { position: sticky; top: 0; z-index: 2; background: #fbf7ef; box-shadow: inset 0 -2px 0 rgba(201,154,91,.3); }
            .cmp-table tbody tr:nth-child(even) { background: rgba(201,154,91,.045); }
            .cmp-table tbody tr { transition: background .15s ease; }
            .cmp-table tbody tr:hover { background: rgba(201,154,91,.09); }
            .cmp-scroll-hint {
              display: none; font-size: 13px; color: #a87a3e; font-weight: 700;
              margin-top: 8px; text-align: center;
            }
            @media (max-width: 560px) { .cmp-scroll-hint { display: block; } }

            /* ── מפריד סקשן עקבי ── */
            .cmp-section-h { position: relative; padding-top: 4px; }
            .cmp-section-h::before {
              content: ''; position: absolute; top: -18px; inset-inline-start: 0;
              width: 48px; height: 3px; border-radius: 2px;
              background: linear-gradient(90deg, #c99a5b, #e8c887);
            }

            @media (prefers-reduced-motion: reduce) {
              .cmp-faq, .cmp-faq summary::after, .cmp-table tbody tr { transition: none; }
              .cmp-faq[open] .cmp-faq-body { animation: none; }
            }
          `,
        }}
      />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">השוואת גזעים</span>
          <h1 className="page-title" style={{ fontSize: 38 }}>{c.title}</h1>
          <p className="page-sub" style={{ maxWidth: 620, fontSize: 17, color: '#5b4d3c', lineHeight: 1.7 }}>{c.excerpt}</p>
        </div>
      </div>

      {/* ★ תשובה מהירה - Featured Snippet bait */}
      <section style={{ position: 'relative', marginTop: 8, padding: '20px 24px', background: 'linear-gradient(135deg,#fff8ea,#fef0d8)', border: '2px solid rgba(201,154,91,.35)', borderRadius: 18, boxShadow: '0 6px 22px rgba(201,154,91,.12)', overflow: 'hidden' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 0, insetInlineStart: 0, width: 5, height: '100%', background: 'linear-gradient(180deg,#c99a5b,#e8c887)' }} />
        <div style={{ fontWeight: 900, color: 'var(--brand-dark)', fontSize: 14, letterSpacing: 0.5, marginBottom: 8 }}>⚡ תשובה מהירה</div>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.75, maxWidth: '68ch' }}>{c.quickAnswer}</p>
      </section>

      {/* טבלת השוואה */}
      <section style={{ marginTop: 40 }}>
        <h2 className="cmp-section-h" style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>השוואה צד-בצד</h2>
        <div className="cmp-table-wrap">
          <div className="cmp-table-scroll">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th style={{ padding: '13px 14px', textAlign: 'right', fontWeight: 900, color: 'var(--ink)' }}>קריטריון</th>
                  <th style={{ padding: '13px 14px', textAlign: 'right', fontWeight: 900, color: 'var(--ink)' }}>{nameA}</th>
                  <th style={{ padding: '13px 14px', textAlign: 'right', fontWeight: 900, color: 'var(--ink)' }}>{nameB}</th>
                </tr>
              </thead>
              <tbody>
                {c.compareTable.map((row, i) => (
                  <tr key={i} style={{ borderTop: '1px solid rgba(201,154,91,.18)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#3a2e22' }}>{row.criterion}</td>
                    <td style={{ padding: '12px 14px', color: '#5b4d3c', background: row.winner === 'a' ? 'rgba(76,175,80,.1)' : 'transparent', fontWeight: row.winner === 'a' ? 700 : 400 }}>
                      {row.winner === 'a' && <span aria-hidden="true">✓ </span>}{row.valueA}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#5b4d3c', background: row.winner === 'b' ? 'rgba(76,175,80,.1)' : 'transparent', fontWeight: row.winner === 'b' ? 700 : 400 }}>
                      {row.winner === 'b' && <span aria-hidden="true">✓ </span>}{row.valueB}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cmp-scroll-hint" aria-hidden="true">← החליקו לצדדים לכל הנתונים →</div>
        </div>
      </section>

      {/* פרוזה השוואה */}
      <article style={{ marginTop: 44 }}>
        {c.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 34 }}>
            <h2 className="cmp-section-h" style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} style={{ fontSize: 16.5, color: '#3a2e22', lineHeight: 1.85, margin: '0 0 12px', maxWidth: '66ch' }}>{p}</p>
            ))}
          </section>
        ))}
      </article>

      {/* פסיקה */}
      <section style={{ marginTop: 28, padding: '22px 22px', background: '#fff', border: '2px solid rgba(201,154,91,.32)', borderRadius: 18 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>אז במי לבחור?</h2>
        <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          <div style={{ padding: 16, background: '#fbf7ef', borderRadius: 12 }}>
            <div style={{ fontWeight: 900, color: 'var(--brand-dark)', marginBottom: 6 }}>בחרו ב-{nameA}</div>
            <p style={{ margin: 0, fontSize: 14.5, color: '#5b4d3c', lineHeight: 1.7 }}>{c.verdict.chooseAIfYou}</p>
          </div>
          <div style={{ padding: 16, background: '#fbf7ef', borderRadius: 12 }}>
            <div style={{ fontWeight: 900, color: 'var(--brand-dark)', marginBottom: 6 }}>בחרו ב-{nameB}</div>
            <p style={{ margin: 0, fontSize: 14.5, color: '#5b4d3c', lineHeight: 1.7 }}>{c.verdict.chooseBIfYou}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' }}>
          {breedA && <Link href={`/breeds/${breedA.slug}`} className="btn btn-ghost">למדריך {nameA} →</Link>}
          {breedB && <Link href={`/breeds/${breedB.slug}`} className="btn btn-ghost">למדריך {nameB} →</Link>}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: 44 }}>
        <h2 className="cmp-section-h" style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 16px' }}>שאלות נפוצות</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {c.faq.map((f, i) => (
            <details key={i} className="cmp-faq" style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 14, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--ink)', fontSize: 16 }}>{f.q}</summary>
              <div className="cmp-faq-body">
                <p style={{ margin: '10px 0 0', fontSize: 15.5, color: '#5b4d3c', lineHeight: 1.75 }}>{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA + השוואות נוספות */}
      <section style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(42,32,24,.1)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', margin: '0 0 12px' }}>השוואות נוספות</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {comparisons.filter((x) => x.slug !== c.slug).map((x) => (
            <Link key={x.slug} href={`/compare/${x.slug}`} className="chip3d" style={{ textDecoration: 'none' }}>
              {x.title.split(' - ')[0]}
            </Link>
          ))}
        </div>
      </section>

      <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/match" className="btn btn-primary">איזה כלב מתאים לכם? קבלו המלצה</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל הגזעים</Link>
      </div>
    </main>
  )
}
