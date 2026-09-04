import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { guides, getGuide, guideImg } from '@/lib/guides'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema, howToSchema } from '@/components/seo/JsonLd'
import { ReadingProgress } from '@/components/articles/ReadingProgress'
import { buildMetadata } from '@/lib/seo'
import { getRelatedForGuide, getBreedsForGuide } from '@/lib/relatedContent'
import { RelatedContentBlock } from '@/components/shared/RelatedContentBlock'
import { CostCalculator } from '@/components/tools/CostCalculator'

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
            </Reveal3D>
          ))}
        </article>

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

        {/* responsibility note for health/safety guides */}
        <p className="muted" style={{ marginTop: 18, fontSize: 14, lineHeight: 1.7 }}>
          המדריך הוא מידע כללי מתוך ניסיון קהילתי, ולא תחליף לייעוץ מקצועי. בכל חשש בריאותי או התנהגותי
          ממשי - כדאי להתייעץ עם וטרינר או מאלף מוסמך.
        </p>

        {/* CTA - קבוצת הפייסבוק (קהילה אמיתית) */}
        <JoinCommunityCard tone="guides" />

        {/* RELATED - קישורים סמנטיים בתוך אשכול העלויות */}
        <RelatedContentBlock heading="מדריכי עלויות שכדאי לקרוא לפני שמחליטים" items={related} />

        {/* מזרים סמכות מדפי המחירון לדפי הגזע */}
        <RelatedContentBlock heading="כמה עולה לגדל גזע מסוים?" items={getBreedsForGuide(guide.slug)} />
      </div>
    </main>
  )
}
