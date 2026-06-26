import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { breedArticles, getArticle, hasArticle } from '@/lib/articles'
import { getBreed, breedImg, breeds } from '@/lib/breeds'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { absoluteUrl, clampDescription, ogImageUrl } from '@/lib/seo'

export function generateStaticParams() {
  return breedArticles.map((a) => ({ slug: a.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getArticle(params.slug)
  if (!a) return { title: 'מאמר · כלבניה' }
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
    title: `${a.title} · כלבניה`,
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
    }),
    ...(article.faq.length > 0 ? [faqSchema(article.faq)] : []),
  ]

  return (
    <main>
      <JsonLd data={structuredData} />
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
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
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
              <span className="chip3d-dark">{breed.name}</span>
              <span className="chip3d-dark">{breed.size}</span>
              <span className="chip3d-dark">תוחלת חיים {breed.lifespan} שנים</span>
            </div>
          )}
          <h1 style={{ fontSize: 'clamp(30px,4.5vw,48px)', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1px', margin: '6px 0 10px' }}>
            {article.title}
          </h1>
          <p style={{ fontSize: 17.5, color: 'rgba(255,255,255,.9)', maxWidth: 620, lineHeight: 1.65 }}>{article.excerpt}</p>
          <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,.78)', fontWeight: 600 }}>
            זמן קריאה משוער: {article.readMinutes} דקות
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* QUICK FACTS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 10,
            marginBottom: 44,
          }}
        >
          {article.quickFacts.map((f) => (
            <div key={f.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 12.5, color: '#6e6052', fontWeight: 700, marginBottom: 4 }}>{f.label}</div>
              <div style={{ fontSize: 15.5, fontWeight: 800, color: '#2a2018' }}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* SECTIONS */}
        <article>
          {article.sections.map((s, i) => (
            <Reveal3D key={i} as="section">
              <div style={{ marginBottom: 36 }}>
                <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-.5px', marginBottom: 14, color: '#2a2018' }}>
                  {s.heading}
                </h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} style={{ fontSize: 16.5, lineHeight: 1.9, color: '#3a3128', marginBottom: 14 }}>
                    {p}
                  </p>
                ))}
              </div>
            </Reveal3D>
          ))}
        </article>

        {/* FAQ */}
        {article.faq.length > 0 && (
          <section style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 18, color: '#2a2018' }}>שאלות נפוצות</h2>
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
          <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>
            יש לכם {breed?.name ?? 'גזע כזה'}? הצטרפו לקהילה
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
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>מדריכים נוספים</h2>
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
                  <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: 130 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src={breedImg(b.photo, 500)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,32,24,.88), transparent 60%)' }} />
                    <span aria-hidden="true" style={{ position: 'absolute', bottom: 11, insetInlineStart: 12, color: '#fff', fontWeight: 800, fontSize: 16 }}>{b.name}</span>
                  </div>
                </Tilt3D>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
