import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { guides, getGuide, guideImg } from '@/lib/guides'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { GroupLink } from '@/components/shared/GroupLink'
import { GuideShare } from '@/components/guides/GuideShare'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema, howToSchema } from '@/components/seo/JsonLd'
import { ReadingProgress } from '@/components/articles/ReadingProgress'
import { buildMetadata } from '@/lib/seo'
import { getRelatedForGuide, getBreedsForGuide } from '@/lib/relatedContent'
import { RelatedContentBlock } from '@/components/shared/RelatedContentBlock'
import { CostCalculator } from '@/components/tools/CostCalculator'

/** מדריכים שמופיעים בעמוד /emergency - מקבלים קישור חזרה אליו. */
const EMERGENCY_SLUGS = new Set([
  'lost-dog-first-24-hours', 'dog-snake-bite-viper', 'rabies-israel-2026', 'dog-ate-chocolate',
  'dog-vomit-what-to-do', 'summer-heat', 'dog-sirens-safe-room', 'dog-ticks-ehrlichiosis', 'dog-first-aid',
])

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

/** מרנדר הדגשות markdown (**טקסט**) כ-<strong> אמיתי. התוכן שלנו, לא קלט משתמש. */
function renderBold(text: string) {
  const parts = text.split('**')
  return parts.map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part))
}

/** תאריך ISO -> "יוני 2026". התאריך הגלוי חייב להתאים לתאריך שבסכמה. */
function hebrewMonthYear(iso: string): string | null {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return new Intl.DateTimeFormat('he-IL', { year: 'numeric', month: 'long' }).format(d)
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug)
  if (!g) return buildMetadata({ title: 'מדריך לא נמצא', path: `/guides/${params.slug}`, noindex: true })
  return buildMetadata({
    title: g.title,
    description: g.metaDescription ?? g.excerpt,
    path: `/guides/${g.slug}`,
    image: guideImg(g.photo, 1200),
    type: 'article',
    // הכותרות של מדריכי המחירון ארוכות ממילא; סיומת המותג דוחפת את "מחירון 2026"
    // אל מעבר לגבול החיתוך של גוגל, ולכן לא מוסיפים אותה כאן.
    rawTitle: true,
    article: { section: g.category, publishedTime: g.datePublished, modifiedTime: g.dateModified },
  })
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  // קישורים סמנטיים ידניים; אם המדריך עוד לא ממופה - נופלים לאשכול של אותה קטגוריה
  // (ולא לשלושת הפריטים הראשונים במערך, כפי שהיה כאן קודם).
  const mapped = getRelatedForGuide(guide.slug)
  const related = mapped.length
    ? mapped
    : guides
        .filter((g) => g.category === guide.category && g.slug !== guide.slug)
        .slice(0, 4)
        .map((g) => ({ href: `/guides/${g.slug}`, label: g.title, reason: g.excerpt.slice(0, 70) }))

  const updatedLabel = guide.dateModified ? hebrewMonthYear(guide.dateModified) : null

  const structuredData = [
    breadcrumbSchema([
      { name: 'דף הבית', path: '/' },
      { name: 'מדריכים', path: '/guides' },
      { name: guide.title, path: `/guides/${guide.slug}` },
    ]),
    articleSchema({
      title: guide.title,
      description: guide.metaDescription ?? guide.excerpt,
      path: `/guides/${guide.slug}`,
      image: guideImg(guide.photo, 1200),
      section: guide.category,
      datePublished: guide.datePublished,
      dateModified: guide.dateModified ?? guide.datePublished,
    }),
    ...(guide.faq?.length ? [faqSchema(guide.faq)] : []),
    // HowTo רק למדריכים שהם באמת רצף פעולות. במדריכי מחירון זו הצהרה שגויה.
    ...(guide.howTo
      ? [
          howToSchema({
            name: guide.title,
            description: guide.excerpt,
            path: `/guides/${guide.slug}`,
            image: guideImg(guide.photo, 1200),
            steps: guide.sections.map((s) => ({
              name: s.heading,
              text: s.paragraphs.join(' ').replace(/\*\*/g, ''),
            })),
          }),
        ]
      : []),
  ]

  return (
    <main>
      <JsonLd data={structuredData} />
      <ReadingProgress />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .guide-section-h { position: relative; padding-top: 20px; }
            .guide-section-h::before {
              content: ''; position: absolute; top: 0; inset-inline-start: 0;
              width: 52px; height: 3px; border-radius: 2px;
              background: linear-gradient(90deg,#c99a5b,#e8c887);
            }
            .guide-faq {
              background: #fff; border: 1px solid rgba(201,154,91,.22);
              border-radius: 14px; padding: 14px 18px;
              box-shadow: var(--shadow-xs);
              transition: box-shadow var(--kv-dur-2,.34s) var(--kv-ease-warm,ease);
            }
            .guide-faq[open] { box-shadow: var(--hover-shadow-sm, 0 6px 20px rgba(42,32,24,.08)); }
            .guide-faq:focus-within { outline: 3px solid #c99a5b; outline-offset: 2px; }
            .guide-faq summary { list-style: none; }
            .guide-faq summary::-webkit-details-marker { display: none; }
            .guide-table-wrap { overflow-x: auto; border: 1px solid rgba(201,154,91,.3); border-radius: 14px; background: #fff; }
            .guide-table { width: 100%; border-collapse: collapse; font-size: 15.5px; line-height: 1.6; min-width: 520px; }
            .guide-table th, .guide-table td { padding: 12px 14px; text-align: start; vertical-align: top; border-bottom: 1px solid rgba(201,154,91,.2); color: #3a3128; }
            .guide-table thead th { background: #fdf6e9; font-weight: 800; color: #2a2018; }
            .guide-table tbody th { font-weight: 800; color: #2a2018; white-space: nowrap; }
            .guide-table tbody tr:last-child th, .guide-table tbody tr:last-child td { border-bottom: none; }
            @media (prefers-reduced-motion: reduce) { .guide-faq { transition: none; } }
          `,
        }}
      />

      {/* HERO */}
      <section style={{ position: 'relative', minHeight: 420, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={guideImg(guide.photo, 1400)}
          alt={guide.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,32,24,.94), rgba(42,32,24,.45) 55%, rgba(42,32,24,.25))' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto', width: '100%', padding: '120px 24px 40px', color: '#fff' }}>
          <Link href="/guides" style={{ color: '#f0d49a', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span aria-hidden="true">→</span> חזרה לכל המדריכים
          </Link>
          <div style={{ marginTop: 14, marginBottom: 6 }}>
            <span className="chip3d-dark">{guide.category}</span>
          </div>
          <h1 className="display" style={{ fontSize: 'clamp(28px,4.4vw,46px)', fontWeight: 900, lineHeight: 1.18, margin: '6px 0 10px' }}>
            {guide.title}
          </h1>
          <p style={{ fontSize: 17.5, color: 'rgba(255,255,255,.9)', maxWidth: 620, lineHeight: 1.65 }}>{guide.excerpt}</p>
          <span className="kv-shimmer-line" data-kv-reveal="in" aria-hidden="true" style={{ marginTop: 14 }} />
          <p style={{ marginTop: 12, fontSize: 14.5, color: 'rgba(255,255,255,.78)', fontWeight: 600 }}>
            {updatedLabel ? `עודכן: ${updatedLabel} · ` : ''}זמן קריאה משוער: {guide.readMinutes} דקות
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* תשובה קצרה בראש המדריך - מי שבא עם שאלה מקבל תשובה מיד */}
        {guide.quickAnswer && (
          <div
            style={{
              background: '#fdf6e9', border: '1px solid rgba(201,154,91,.3)', borderInlineStart: '5px solid var(--brand)',
              borderRadius: 16, padding: '20px 22px', marginBottom: 34,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--brand-dark, #a97c46)', marginBottom: 6 }}>בקצרה</div>
            <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.75, color: '#2a2018', fontWeight: 600 }}>{renderBold(guide.quickAnswer)}</p>
          </div>
        )}

        {/* טבלת סיכום - עובדות בשליש הראשון של העמוד, בפורמט שקל לסרוק */}
        {guide.table && (
          <figure style={{ margin: '0 0 34px' }}>
            <figcaption style={{ fontSize: 20, fontWeight: 900, color: '#2a2018', marginBottom: 10 }}>{guide.table.caption}</figcaption>
            <div className="guide-table-wrap">
              <table className="guide-table">
                <thead>
                  <tr>{guide.table.head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {guide.table.rows.map((row, r) => (
                    <tr key={r}>
                      {row.map((c, k) => (k === 0 ? <th key={k} scope="row">{c}</th> : <td key={k}>{c}</td>))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {guide.table.note && <p className="muted" style={{ fontSize: 14, lineHeight: 1.7, margin: '8px 0 0' }}>{guide.table.note}</p>}
          </figure>
        )}

        {/* SECTIONS */}
        <article>
          {guide.sections.map((s, i) => (
            <Reveal3D key={i} as="section">
              <div style={{ marginBottom: 34 }}>
                <h2 className="guide-section-h" style={{ fontSize: 25, fontWeight: 900, marginBottom: 12, color: '#2a2018' }}>{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} style={{ fontSize: 16.5, lineHeight: 1.9, color: '#3a3128', marginBottom: 14, maxWidth: '66ch' }}>{renderBold(p)}</p>
                ))}
              </div>
              {/* הזמנה לקהילה שמותאמת לנושא, בשליש הראשון של המדריך */}
              {i === 0 && guide.communityAsk && (
                <GroupLink
                  src="guide-inline"
                  className="kv-press no-print"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none', marginBottom: 34,
                    background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 16, padding: '16px 20px',
                  }}
                >
                  <span aria-hidden="true" style={{ flexShrink: 0, width: 40, height: 40, borderRadius: '50%', background: '#1877f2', display: 'grid', placeItems: 'center' }}>
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94z" /></svg>
                  </span>
                  <span style={{ fontSize: 16, lineHeight: 1.6, color: '#1b2a44', fontWeight: 600 }}>
                    {guide.communityAsk}{' '}
                    <span style={{ color: '#0f5fcc', fontWeight: 800, whiteSpace: 'nowrap' }}>לקבוצת הפייסבוק ←</span>
                  </span>
                </GroupLink>
              )}
            </Reveal3D>
          ))}
        </article>

        {/* כלי משלים למדריך: מחולל המודעות למדריך "כלב אבד", ועמוד החירום למדריכי הבטיחות */}
        {guide.slug === 'lost-dog-first-24-hours' && (
          <aside className="no-print" style={{ background: '#fdf6e9', border: '1px solid rgba(201,154,91,.3)', borderRadius: 16, padding: '18px 22px', margin: '0 0 30px' }}>
            <p style={{ margin: 0, fontSize: 16.5, lineHeight: 1.8, color: '#2a2018' }}>
              <strong>צריכים מודעה עכשיו?</strong> המחולל שלנו מכין מודעת &quot;כלב אבד&quot; להדפסה ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק.{' '}
              <Link href="/tools/lost-dog-poster" className="link" style={{ fontWeight: 800 }}>להכנת מודעה</Link>
            </p>
          </aside>
        )}
        {EMERGENCY_SLUGS.has(guide.slug) && (
          <p className="no-print" style={{ margin: '0 0 30px', fontSize: 15.5, lineHeight: 1.7 }}>
            <Link href={`/emergency#${guide.slug}`} className="link" style={{ fontWeight: 800 }}>כל מצבי החירום בעמוד אחד</Link>
            {' '}· כדאי לשמור בטלפון.
          </p>
        )}

        {/* מחשבון מוטמע - רק במדריכי עלויות. מי שמחפש "כמה עולה" רוצה לחשב,
            לא רק לקרוא. מעלה זמן שהייה ונותן רגע שיתוף בתוך הדף המדורג. */}
        {guide.category === 'עלויות' && (
          <section className="kv-reveal" style={{ marginTop: 28, marginBottom: 8 }} aria-labelledby="guide-calc-h">
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <span className="section-tag">אל תנחשו</span>
              <h2 id="guide-calc-h" style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '8px 0 6px' }}>
                חשבו כמה זה יוצא אצלכם
              </h2>
              <p style={{ fontSize: 15.5, color: '#5f574c', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
                בחרו גזע וגודל וקבלו הערכת עלות חודשית ושנתית, כולל ההוצאות הגדולות של השנה הראשונה.
              </p>
            </div>
            <CostCalculator />
          </section>
        )}

        {/* TIPS - כרטיס כהה עם חשיפה מדורגת חתומה */}
        <div className="kv-reveal" style={{ background: 'var(--ink)', borderRadius: 20, padding: '26px 28px', color: '#fff', marginTop: 12 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 900, color: '#e8c887' }}>נקודות מהירות</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }} data-kv-stagger>
            {guide.tips.map((t, i) => (
              <li key={i} className="kv-reveal kv-reveal-start" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>
                <span aria-hidden="true" style={{ color: '#e8c887', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* שיתוף - אחרי הקריאה, לא לפני התוכן */}
        <div style={{ marginTop: 26 }}>
          <GuideShare title={guide.title} quickAnswer={guide.quickAnswer} path={`/guides/${guide.slug}`} />
        </div>

        {/* FAQ - גלוי בעמוד. גוגל מכבד רק נתונים מובנים שגם נראים למשתמש. */}
        {guide.faq && guide.faq.length > 0 && (
          <section className="kv-reveal" style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 25, fontWeight: 900, color: '#2a2018', margin: '0 0 14px' }}>שאלות נפוצות</h2>
            <div style={{ display: 'grid', gap: 10 }}>
              {guide.faq.map((f, i) => (
                <details key={i} id={`faq-${i}`} className="guide-faq">
                  <summary className="kv-press" style={{ cursor: 'pointer', fontWeight: 800, fontSize: 16.5, color: '#2a2018', lineHeight: 1.5 }}>
                    {f.q}
                  </summary>
                  <p style={{ margin: '10px 0 0', fontSize: 16.5, lineHeight: 1.9, color: '#3a3128' }}>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* מקורות - קישורים חיצוניים שעליהם נשען המדריך */}
        {guide.sources && guide.sources.length > 0 && (
          <section style={{ marginTop: 36 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2a2018', margin: '0 0 10px' }}>מקורות</h2>
            <ul style={{ margin: 0, paddingInlineStart: 20, display: 'grid', gap: 6 }}>
              {guide.sources.map((src) => (
                <li key={src.url} style={{ fontSize: 15, lineHeight: 1.6 }}>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="link">{src.label}</a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* responsibility note for health/safety guides */}
        <p className="muted" style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7 }}>
          המדריך הוא מידע כללי מתוך ניסיון קהילתי, ולא תחליף לייעוץ מקצועי. בכל חשש בריאותי או התנהגותי
          ממשי - כדאי להתייעץ עם וטרינר או מאלף מוסמך.
        </p>

        {/* גילוי נאות: איך נכתב המדריך. גוגל ממליץ לגלות שימוש באוטומציה. */}
        <p className="muted" style={{ marginTop: 10, fontSize: 14, lineHeight: 1.7 }}>
          <strong>איך נכתב המדריך:</strong> מערכת קהילה על ארבע כתבה אותו בעזרת כלי בינה מלאכותית.
          {guide.sources && guide.sources.length > 0
            ? ' העובדות נבדקו מול המקורות שברשימה למעלה, נכון לתאריך העדכון.'
            : ''}{' '}
          מצאתם טעות? <Link href="/contact" className="link">כתבו לנו</Link> ונתקן.
        </p>

        {/* CTA - קבוצת הפייסבוק (קהילה אמיתית) */}
        <JoinCommunityCard tone="guides" />

        {/* RELATED - קישורים סמנטיים בתוך אשכול העלויות */}
        <RelatedContentBlock heading={guide.category === 'עלויות' ? 'מדריכי עלויות שכדאי לקרוא לפני שמחליטים' : 'מדריכים קשורים'} items={related} />

        {/* מזרים סמכות מדפי המחירון לדפי הגזע */}
        <RelatedContentBlock heading="כמה עולה לגדל גזע מסוים?" items={getBreedsForGuide(guide.slug)} />
      </div>
    </main>
  )
}
