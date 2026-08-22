import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { dogFriendlyContent } from '@/lib/dogFriendlyContent'
import { DOG_PARK_COUNT } from '@/lib/siteStats'
import { WaitlistCTA } from '@/components/shared/WaitlistCTA'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { ReadingProgress } from '@/components/articles/ReadingProgress'

const c = dogFriendlyContent

export function generateMetadata() {
  return buildMetadata({
    title: c.title,
    description: c.description,
    path: '/dog-friendly',
    type: 'article',
    rawTitle: true,
    article: { section: 'איפה מותר עם כלב', publishedTime: '2026-07-05', modifiedTime: '2026-07-05' },
  })
}

const VERDICT_STYLE: Record<'yes' | 'depends' | 'no', { bg: string; border: string; color: string }> = {
  yes: { bg: '#f1f7ef', border: 'rgba(90,140,70,.35)', color: '#3f6b32' },
  depends: { bg: '#fff8ea', border: 'rgba(201,154,91,.4)', color: '#8a6220' },
  no: { bg: '#fdf1ef', border: 'rgba(180,80,46,.35)', color: '#a4432c' },
}

export default function DogFriendlyPage() {
  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: c.title,
      description: c.description,
      path: '/dog-friendly',
      section: 'איפה מותר עם כלב',
      datePublished: '2026-07-05',
      dateModified: '2026-07-05',
    }),
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'איפה מותר עם כלב', path: '/dog-friendly' },
    ]),
    faqSchema(c.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 860 }}>
      <JsonLd data={schemas} />
      <ReadingProgress />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .df-card {
              background: #fff; border: 1px solid rgba(201,154,91,.22);
              border-radius: 18px; padding: 22px 24px; margin-bottom: 18px;
              scroll-margin-top: 84px;
            }
            .df-verdict {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 14px; font-weight: 800; line-height: 1;
              padding: 8px 14px; border-radius: 999px; border: 1.5px solid;
            }
            .df-toc a {
              color: var(--brand-dark); text-decoration: none; font-weight: 700;
            }
            .df-toc a:hover { text-decoration: underline; }
            .df-asset {
              display: flex; align-items: center; gap: 12px;
              padding: 16px 18px; background: #fbf7ef;
              border: 1px solid rgba(201,154,91,.28); border-radius: 14px;
              text-decoration: none; color: var(--ink); font-weight: 700; font-size: 15.5;
              transition: transform .18s ease, box-shadow .18s ease;
            }
            .df-asset:hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(42,32,24,.09); }
            .df-asset:focus-visible { outline: 3px solid rgba(201,154,91,.55); outline-offset: 3px; }
            @media (prefers-reduced-motion: reduce) {
              .df-asset { transition: none; }
              .df-asset:hover { transform: none; }
            }
          `,
        }}
      />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 14 }}>
        <FloatingShapes />
        <div className="kv-reveal" style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">איפה מותר עם כלב</span>
          <h1 className="page-title" style={{ fontSize: 40 }}>
            איפה מותר עם כלב בישראל?
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, fontSize: 17, color: '#5b4d3c', lineHeight: 1.7 }}>
            גינות, חופים, מסלולים, אוטובוס ורכבת, בתי קפה ומלונות. מה החוק אומר, איפה זה תלוי בעסק, ואיפה פשוט אסור.
          </p>
          <span className="kv-shimmer-line" aria-hidden="true" style={{ marginTop: 14 }} />
        </div>
      </div>

      {/* תשובה מהירה */}
      <section className="kv-reveal" style={{ position: 'relative', marginTop: 8, padding: '20px 24px', background: 'linear-gradient(135deg,#fff8ea,#fef0d8)', border: '2px solid rgba(201,154,91,.35)', borderRadius: 18, overflow: 'hidden' }}>
        <span aria-hidden="true" style={{ position: 'absolute', top: 0, insetInlineStart: 0, width: 5, height: '100%', background: 'linear-gradient(180deg,#c99a5b,#e8c887)' }} />
        <div style={{ fontWeight: 900, color: 'var(--brand-dark)', fontSize: 14, letterSpacing: 0.5, marginBottom: 8 }}>⚡ תשובה מהירה</div>
        <p style={{ margin: 0, fontSize: 16.5, color: 'var(--ink)', lineHeight: 1.75, maxWidth: '68ch' }}>{c.quickAnswer}</p>
      </section>

      {/* הנכסים האמיתיים - גינות ומסלולים */}
      <section style={{ marginTop: 28, display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }} data-kv-stagger>
        <Link href="/map" className="df-asset kv-reveal">
          <span aria-hidden="true" style={{ fontSize: 26 }}>🗺️</span>
          <span>
            {DOG_PARK_COUNT} גינות כלבים על המפה
            <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#6a6155', marginTop: 3 }}>סינון לפי עיר ואיתור הקרובות אליכם</span>
          </span>
        </Link>
        <Link href="/walks" className="df-asset kv-reveal">
          <span aria-hidden="true" style={{ fontSize: 26 }}>🥾</span>
          <span>
            38 מסלולי טיול עם כלב
            <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: '#6a6155', marginTop: 3 }}>עם סימון צל, מים ומקטעים מגודרים</span>
          </span>
        </Link>
      </section>

      {/* תוכן עניינים */}
      <nav className="df-toc" aria-label="תוכן עניינים" style={{ marginTop: 26, padding: '18px 22px', background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 16 }}>
        <div style={{ fontWeight: 900, color: 'var(--ink)', fontSize: 15, marginBottom: 10 }}>📑 בעמוד זה</div>
        <ol style={{ margin: 0, paddingInlineStart: 22, fontSize: 15, color: '#5b4d3c', lineHeight: 2 }}>
          {c.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.heading}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* הסקשנים */}
      <div style={{ marginTop: 30 }} data-kv-stagger>
        {c.sections.map((s) => {
          const v = s.verdict ? VERDICT_STYLE[s.verdict.tone] : null
          return (
            <section key={s.id} id={s.id} className="df-card kv-reveal">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 12 }}>
                <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span aria-hidden="true" style={{ fontSize: 24 }}>{s.icon}</span>
                  {s.heading}
                </h2>
                {s.verdict && v && (
                  <span className="df-verdict" style={{ background: v.bg, borderColor: v.border, color: v.color }}>
                    {s.verdict.label}
                  </span>
                )}
              </div>
              {s.paragraphs.map((p, j) => (
                <p key={j} style={{ fontSize: 16, color: '#3a2e22', lineHeight: 1.85, margin: '0 0 10px', maxWidth: '66ch' }}>
                  {p}
                </p>
              ))}
            </section>
          )
        })}
      </div>

      {/* הזמנה לקהילה להוסיף מקומות - זה מה שיהפוך את העמוד למאגר אמיתי */}
      <JoinCommunityCard tone="parks" />

      {/* FAQ */}
      <section className="kv-reveal" style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 14px' }}>שאלות נפוצות</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {c.faq.map((f, i) => (
            <details key={i} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 12, padding: '14px 18px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--ink)', fontSize: 15.5 }}>{f.q}</summary>
              <p style={{ margin: '10px 0 0', fontSize: 15, color: '#5b4d3c', lineHeight: 1.75 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* הסתייגות */}
      <div role="note" style={{ marginTop: 30, padding: '14px 18px', background: '#fdf6f0', border: '1.5px solid #e8c49a', borderRadius: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <span aria-hidden="true" style={{ fontSize: 18, flexShrink: 0 }}>⚖️</span>
        <p style={{ margin: 0, fontSize: 14, color: '#6b4c2a', lineHeight: 1.65 }}>
          <strong>המידע כאן הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.</strong> מדיניות של רשויות מקומיות, חופים, חברות תחבורה ובתי עסק משתנה מעת לעת. השילוט במקום ומדיניות העסק הם הקובעים, וכדאי לוודא מראש לפני שנוסעים.
        </p>
      </div>

      {/* קישורים פנימיים */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>קשור לעמוד הזה</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/laws" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>חוקים על כלבים בישראל →</Link>
          <Link href="/laws/leash-fine" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>קנס על כלב בלי רצועה →</Link>
          <Link href="/cities" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>מדריכי ערים →</Link>
          <Link href="/guides/flying-abroad" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>טיסה לחו"ל עם כלב →</Link>
        </div>
      </section>

      <WaitlistCTA />
    </main>
  )
}
