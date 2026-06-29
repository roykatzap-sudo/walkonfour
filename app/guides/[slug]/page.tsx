import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { guides, getGuide, guideImg } from '@/lib/guides'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { JsonLd, articleSchema, breadcrumbSchema, howToSchema } from '@/components/seo/JsonLd'

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const g = getGuide(params.slug)
  if (!g) return { title: 'מדריך · קהילה על ארבע' }
  return { title: `${g.title} · קהילה על ארבע`, description: g.excerpt }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = getGuide(params.slug)
  if (!guide) notFound()

  const related = guides.filter((g) => g.slug !== guide.slug).slice(0, 3)

  const structuredData = [
    breadcrumbSchema([
      { name: 'דף הבית', path: '/' },
      { name: 'מדריכים', path: '/guides' },
      { name: guide.title, path: `/guides/${guide.slug}` },
    ]),
    articleSchema({
      title: guide.title,
      description: guide.excerpt,
      path: `/guides/${guide.slug}`,
      image: guideImg(guide.photo, 1200),
      section: 'מדריכי טיפול ואילוף',
    }),
    howToSchema({
      name: guide.title,
      description: guide.excerpt,
      path: `/guides/${guide.slug}`,
      image: guideImg(guide.photo, 1200),
      steps: guide.sections.map((s) => ({
        name: s.heading,
        text: s.paragraphs.join(' '),
      })),
    }),
  ]

  return (
    <main>
      <JsonLd data={structuredData} />

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
          <p style={{ marginTop: 12, fontSize: 14, color: 'rgba(255,255,255,.78)', fontWeight: 600 }}>
            זמן קריאה משוער: {guide.readMinutes} דקות
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        {/* SECTIONS */}
        <article>
          {guide.sections.map((s, i) => (
            <Reveal3D key={i} as="section">
              <div style={{ marginBottom: 34 }}>
                <h2 style={{ fontSize: 25, fontWeight: 900, marginBottom: 12, color: '#2a2018' }}>{s.heading}</h2>
                {s.paragraphs.map((p, j) => (
                  <p key={j} style={{ fontSize: 16.5, lineHeight: 1.9, color: '#3a3128', marginBottom: 14 }}>{p}</p>
                ))}
              </div>
            </Reveal3D>
          ))}
        </article>

        {/* TIPS */}
        <div style={{ background: 'var(--ink)', borderRadius: 20, padding: '26px 28px', color: '#fff', marginTop: 12 }}>
          <h2 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 900, color: '#e8c887' }}>נקודות מהירות</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {guide.tips.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15.5, lineHeight: 1.6, color: 'rgba(255,255,255,.9)' }}>
                <span aria-hidden="true" style={{ color: '#e8c887', fontWeight: 900, flexShrink: 0 }}>✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* responsibility note for health/safety guides */}
        <p className="muted" style={{ marginTop: 18, fontSize: 13, lineHeight: 1.6 }}>
          המדריך הוא מידע כללי מתוך ניסיון קהילתי, ולא תחליף לייעוץ מקצועי. בכל חשש בריאותי או התנהגותי
          ממשי - כדאי להתייעץ עם וטרינר או מאלף מוסמך.
        </p>

        {/* CTA - קבוצת הפייסבוק (קהילה אמיתית) */}
        <JoinCommunityCard tone="guides" />

        {/* RELATED */}
        <section style={{ marginTop: 44 }}>
          <h2 style={{ fontSize: 21, fontWeight: 900, marginBottom: 16 }}>עוד מדריכים שכדאי לכם</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            {related.map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Tilt3D className="sweep" max={6} glare>
                  <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: 130 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img loading="lazy" decoding="async" src={guideImg(g.photo, 500)} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(42,32,24,.9), transparent 65%)' }} />
                    <span style={{ position: 'absolute', bottom: 10, insetInlineStart: 12, insetInlineEnd: 12, color: '#fff', fontWeight: 800, fontSize: 14.5, lineHeight: 1.3 }}>{g.title}</span>
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
