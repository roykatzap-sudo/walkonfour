import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { breedArticles, getArticle, hasArticle } from '@/lib/articles'
import { getBreed, breedImg, breedFace, breeds } from '@/lib/breeds'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'
import { ReadingProgress } from '@/components/articles/ReadingProgress'
import { ArticleTOC } from '@/components/articles/ArticleTOC'

/** תוויות מדדי אנרגיה/תוקפנות - תואם את התבנית בעמוד הגזע. */
const ENERGY_LABEL: Record<number, string> = {
  1: 'רגוע מאוד',
  2: 'נינוח',
  3: 'מאוזן',
  4: 'אנרגטי',
  5: 'בלתי-נלאה',
}
const AGGRESSION_LABEL: Record<number, string> = {
  1: 'רגוע ומאוזן',
  2: 'נינוח עם זרים',
  3: 'מגן וערני',
  4: 'דורש יד מנוסה',
  5: 'לבעלים מנוסים בלבד',
}
/** צבע מדד התוקפנות - זהב רגוע בנמוך, טרקוטה בגבוה (בלי ירוקים). */
function aggColor(level: number, n: number): string {
  if (n > level) return '#e5e2da'
  if (level <= 2) return '#c99a5b'
  if (level === 3) return '#cf8a3a'
  return '#b4502e'
}

export function generateStaticParams() {
  return breedArticles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug)
  if (!a) return { title: 'מאמר · קהילה על ארבע' }
  const breed = getBreed(a.slug)
  // תיאור מועשר במילות חיפוש סביב שם הגזע.
  const description = breed
    ? clampDescription(
        `מדריך מלא ל${breed.name}: אופי ומזג, התאמה למשפחה ולדירה, בריאות, טיפוח ואילוף. ${a.excerpt}`,
      )
    : clampDescription(a.excerpt)
  const url = absoluteUrl(`/articles/${a.slug}`)
  const ogImage = absoluteUrl(ogImageUrl({ title: a.title, subtitle: breed ? `מדריך הגזע ${breed.name}` : a.excerpt, tag: 'מדריך' }))
  return {
    title: `${a.title} · קהילה על ארבע`,
    description,
    keywords: breed ? [breed.name, `${breed.name} מדריך`, `${breed.name} אופי`, 'גזעי כלבים', 'אילוף'] : undefined,
    alternates: { canonical: url },
    openGraph: { title: a.title, description, url, type: 'article', locale: 'he_IL', images: [{ url: ogImage, width: 1200, height: 630, alt: a.title }] },
    twitter: { card: 'summary_large_image', title: a.title, description, images: [ogImage] },
  }
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug)
  if (!article) notFound()
  const breed = getBreed(article.slug)

  // 3 גזעים נוספים להמלצה
  const related = breeds.filter((b) => hasArticle(b.slug) && b.slug !== article.slug).slice(0, 3)

  // תוכן עניינים: מזהה יציב לכל סקשן (בטוח לעברית, ייחודי).
  const tocItems = article.sections.map((s, i) => ({ id: `section-${i}`, heading: s.heading }))

  // נתונים מובנים: פירורי לחם + מאמר + שאלות נפוצות (אם יש)
  const structuredData = [
    breadcrumbSchema([
      { name: 'דף הבית', path: '/' },
      { name: 'מאמרים', path: '/articles' },
      { name: article.title, path: `/articles/${article.slug}` },
    ]),
    articleSchema({
      title: article.title,
      description: article.excerpt,
      path: `/articles/${article.slug}`,
      image: breed ? breedImg(breed.photo, 1200) : undefined,
      section: 'מדריכי גזעים',
      // תאריך עריכה אמיתי של המדריכים (לא מומצא לכל מאמר בנפרד).
      dateModified: '2026-06-01',
    }),
    ...(article.faq.length > 0 ? [faqSchema(article.faq)] : []),
  ]

  return (
    <main>
      <JsonLd data={structuredData} />
      <ReadingProgress />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-back-link:focus-visible,
            .article-related-link:focus-visible {
              outline: 3px solid #e8c887;
              outline-offset: 3px;
              border-radius: 6px;
            }
            .article-faq:focus-within {
              outline: 3px solid #c99a5b;
              outline-offset: 2px;
            }
            .article-faq summary { list-style-position: inside; }

            /* ── צ'יפ קריא על גבי תמונה (אחיד עם כרטיסי הרשימה) ── */
            .chip-on-photo {
              display: inline-flex; align-items: center;
              padding: 7px 14px; border-radius: 999px;
              font-size: 14px; font-weight: 700; line-height: 1;
              color: #fff; background: rgba(42,32,24,.62);
              border: 1px solid rgba(255,255,255,.3);
              backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
            }

            /* ── פריסת מאמר: גוף + ריל תוכן עניינים (דסקטופ) ── */
            .article-layout {
              max-width: 1080px; margin: 0 auto;
              padding: 40px 24px 80px;
              display: block;
            }
            @media (min-width: 1024px) {
              .article-layout {
                display: grid;
                grid-template-columns: 1fr 248px;
                gap: 48px;
                align-items: start;
              }
              .article-toc-col { order: 2; }
              .article-main-col { order: 1; min-width: 0; }
            }

            /* ── תבנית פרוזה מגזינית ── */
            .article-prose { max-width: 62ch; }
            .article-prose .prose-section { margin-bottom: 40px; scroll-margin-top: 96px; }
            .article-prose h2 {
              font-family: var(--font-display, inherit);
              font-size: clamp(22px, 3vw, 28px);
              font-weight: 800; letter-spacing: -.3px;
              color: #2a2018; margin: 0 0 16px;
              padding-top: 18px; position: relative;
            }
            /* קו זהב דק מעל כל כותרת סקשן */
            .article-prose h2::before {
              content: ''; position: absolute; top: 0; inset-inline-start: 0;
              width: 56px; height: 3px; border-radius: 2px;
              background: linear-gradient(90deg, #c99a5b, #e8c887);
            }
            .article-prose p {
              font-size: 17px; line-height: 1.95; color: #3a3128; margin: 0 0 16px;
            }
            /* drop-cap בסקשן הראשון בלבד */
            .article-prose .prose-section:first-of-type > p:first-of-type::first-letter {
              float: inline-start; font-family: var(--font-display, inherit);
              font-size: 3.4em; line-height: .82; font-weight: 800;
              color: #c99a5b; margin-inline-end: 10px; margin-top: 4px;
            }

            /* ── ציטוט בולט ── */
            .article-pullquote {
              margin: 36px 0; padding: 4px 22px;
              border-inline-start: 4px solid #c99a5b;
              font-family: var(--font-display, inherit);
              font-size: clamp(19px, 2.4vw, 23px); line-height: 1.5;
              font-weight: 700; color: #6b4a1f;
            }

            /* ── רצועת תמונה פנימית ── */
            .article-photoband { margin: 40px 0; border-radius: 18px; overflow: hidden; position: relative; }
            .article-photoband img { width: 100%; height: 280px; object-fit: cover; object-position: center 20%; display: block; }
            .article-photoband figcaption {
              position: absolute; bottom: 0; inset-inline-start: 0; width: 100%;
              padding: 16px 18px; color: #fff; font-size: 14.5px; font-weight: 600;
              background: linear-gradient(to top, rgba(42,32,24,.85), transparent);
            }
          `,
        }}
      />
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          loading="eager"
          fetchPriority="high"
          decoding="async"
          src={breed ? breedImg(breed.photo, 1400) : ''}
          alt={breed ? `כלב מגזע ${breed.name}` : article.title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,32,24,.94), rgba(42,32,24,.45) 55%, rgba(42,32,24,.25))' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', width: '100%', padding: '120px 24px 44px', color: '#fff' }}>
          <Link
            href="/articles"
            className="article-back-link"
            style={{ color: '#f0d49a', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <span aria-hidden="true">→</span> חזרה לכל המדריכים
          </Link>
          {breed && (
            <div style={{ marginTop: 14, marginBottom: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="chip-on-photo">{breed.name}</span>
              <span className="chip-on-photo">{breed.size}</span>
              <span className="chip-on-photo">תוחלת חיים {breed.lifespan} שנים</span>
            </div>
          )}
          <h1 className="display" style={{ fontSize: 'clamp(30px,4.5vw,48px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', margin: '6px 0 10px' }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 17.5, color: 'rgba(255,255,255,.9)', maxWidth: 620, lineHeight: 1.65 }}>{article.excerpt}</p>
          <p style={{ marginTop: 14, fontSize: 14.5, color: 'rgba(255,255,255,.82)', fontWeight: 600, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            <span>צוות קהילה על ארבע</span>
            <span aria-hidden="true" style={{ opacity: .6 }}>·</span>
            <span>עודכן ביוני 2026</span>
            <span aria-hidden="true" style={{ opacity: .6 }}>·</span>
            <span>זמן קריאה {article.readMinutes} דקות</span>
          </p>
        </div>
      </section>

      <div className="article-layout">
        {/* תוכן עניינים - ריל דביק בדסקטופ, מתקפל במובייל */}
        <aside className="article-toc-col">
          <ArticleTOC items={tocItems} />
        </aside>

        <div className="article-main-col">
        {/* BREED STATS - מדדים + עובדות מהירות (אחיד עם עמוד הגזע) */}
        {breed ? (
          <div className="card" style={{ padding: 22, marginBottom: 40 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
              {/* אנרגיה */}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#a06f30', marginBottom: 6 }}>רמת אנרגיה</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#2a2018', marginBottom: 9 }}>{ENERGY_LABEL[breed.energy]}</div>
                <div style={{ display: 'flex', gap: 6 }} aria-label={`אנרגיה ${breed.energy} מתוך 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} aria-hidden="true" style={{ width: 26, height: 8, borderRadius: 5, background: n <= breed.energy ? '#c99a5b' : '#e5e2da' }} />
                  ))}
                </div>
              </div>
              {/* תוקפנות / שמירה */}
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: '#a06f30', marginBottom: 6 }}>נטייה להגנה</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#2a2018', marginBottom: 9 }}>{AGGRESSION_LABEL[breed.aggression]}</div>
                <div style={{ display: 'flex', gap: 6 }} aria-label={`נטייה להגנה ${breed.aggression} מתוך 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} aria-hidden="true" style={{ width: 26, height: 8, borderRadius: 5, background: aggColor(breed.aggression, n) }} />
                  ))}
                </div>
              </div>
            </div>
            {/* רצועת עובדות נוספות (בלי גודל/תוחלת חיים - כבר בכותרת) */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 18, paddingTop: 18, borderTop: '1px solid rgba(42,32,24,.08)' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#3a3128', background: '#f6efe5', borderRadius: 999, padding: '6px 13px' }}>
                {breed.goodWithKids ? '👨‍👩‍👧 מתאים למשפחה עם ילדים' : '⚠️ מתאים יותר לבית בוגר'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#3a3128', background: '#f6efe5', borderRadius: 999, padding: '6px 13px' }}>
                קבוצה: {breed.group}
              </span>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 10,
              marginBottom: 40,
            }}
          >
            {article.quickFacts.map((f) => (
              <div key={f.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 14, color: '#6e6052', fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#2a2018' }}>{f.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* SECTIONS - תבנית פרוזה מגזינית */}
        <article className="article-prose">
          {article.sections.map((s, i) => {
            // ציטוט בולט אחרי כל סקשן שני (מתוך פסקה ארוכה מספיק)
            const pull = i > 0 && i % 2 === 0 ? s.paragraphs.find((p) => p.length > 70 && p.length < 190) : undefined
            // רצועת תמונה אחת באמצע המאמר
            const showBand = breed && article.sections.length >= 4 && i === Math.floor(article.sections.length / 2)
            return (
              <Reveal3D key={i} as="section">
                <div id={`section-${i}`} className="prose-section">
                  <h2>{s.heading}</h2>
                  {s.paragraphs.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {pull && <blockquote className="article-pullquote">{`„${pull}”`}</blockquote>}
                </div>
                {showBand && breed && (
                  <figure className="article-photoband">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src={breedImg(breed.photo, 1000)} alt={`${breed.name} - תמונת המחשה`} />
                    <figcaption>{breed.name} · {breed.en ?? ''}</figcaption>
                  </figure>
                )}
              </Reveal3D>
            )
          })}
        </article>

        {/* FAQ */}
        {article.faq.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <h2 className="display" style={{ fontSize: 26, fontWeight: 800, marginBottom: 18, color: '#2a2018' }}>שאלות נפוצות</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {article.faq.map((item, i) => (
                <details key={i} className="card article-faq" style={{ padding: '16px 20px' }}>
                  <summary style={{ fontWeight: 800, fontSize: 16.5, cursor: 'pointer', color: '#2a2018', padding: '6px 0', lineHeight: 1.5 }}>
                    {item.q}
                  </summary>
                  <p style={{ marginTop: 10, fontSize: 16, lineHeight: 1.85, color: '#3a3128' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="card" style={{ marginTop: 44, textAlign: 'center', padding: 32 }}>
          <h3 className="display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            {breed ? `שוקלים ${breed.name}? יש קהילה שלמה שתשמח לעזור` : 'הצטרפו לקהילה'}
          </h3>
          <p className="muted" style={{ marginBottom: 20, color: '#5f574c', fontSize: 15.5, lineHeight: 1.6 }}>
            שאלו שאלות, שתפו תמונות, וקבלו עצות מבעלים אחרים בדיוק כמוכם.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton href="/forum" className="btn btn-primary">לפורום הקהילה</MagneticButton>
            {breed && <MagneticButton href={`/breeds/${breed.slug}`} className="btn btn-ghost">לעמוד הגזע</MagneticButton>}
          </div>
        </div>

        {/* RELATED */}
        <section style={{ marginTop: 48 }}>
          <h2 className="display" style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>מדריכים נוספים</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {related.map((b) => (
              <Link
                key={b.slug}
                href={`/articles/${b.slug}`}
                className="article-related-link"
                aria-label={`מדריך ${b.name}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Tilt3D className="sweep" max={6} glare>
                  <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', aspectRatio: '1 / 1' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src={breedFace(b.photo, 500)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,32,24,.88), transparent 60%)' }} />
                    <span aria-hidden="true" style={{ position: 'absolute', bottom: 11, insetInlineStart: 12, color: '#fff', fontWeight: 800, fontSize: 16.5 }}>{b.name}</span>
                  </div>
                </Tilt3D>
              </Link>
            ))}
          </div>
        </section>
        </div>
      </div>
    </main>
  )
}
