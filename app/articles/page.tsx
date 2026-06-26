import Link from 'next/link'
import { breedArticles } from '@/lib/articles'
import { getBreed, breedImg } from '@/lib/breeds'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

export const metadata = {
  title: 'מדריכי הגזעים · כלבניה',
  description: 'מדריך מלא לכל גזע כלב - אופי, התאמה למשפחה, בריאות, טיפוח ואילוף. עברית, מקיף ומדויק.',
}

export default function ArticlesPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-card-link:focus-visible {
              outline: 3px solid #2a2018;
              outline-offset: 3px;
            }
            .article-card-link:focus-visible h2 { text-decoration: underline; }
          `,
        }}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 28px', marginBottom: 8 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריכי הגזעים</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            מדריך לכל גזע, <span className="grad-text">בלי לייפות</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17, color: '#6a6155', lineHeight: 1.7 }}>
            {breedArticles.length} מדריכים לעומק - לא רק החלקים החמודים, אלא גם הבריאות, הטיפוח
            והעצבים שזה דורש. כתבנו אותם כמו שהיינו מספרים לחבר ששוקל לאמץ.
          </p>
        </div>
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {breedArticles.map((a, i) => {
          const breed = getBreed(a.slug)
          return (
            <Reveal3D key={a.slug} as="li" delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Link
                href={`/articles/${a.slug}`}
                className="article-card-link"
                aria-label={`${a.title} - קריאה של ${a.readMinutes} דקות`}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderRadius: 20 }}
              >
                <Tilt3D className="sweep" max={8} glare>
                  <article
                    style={{
                      background: '#fff',
                      borderRadius: 20,
                      overflow: 'hidden',
                      border: '1px solid rgba(42,32,24,.08)',
                      boxShadow: '0 4px 18px rgba(42,32,24,.06)',
                      height: '100%',
                    }}
                  >
                    <div style={{ position: 'relative', height: 168 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        decoding="async"
                        src={breed ? breedImg(breed.photo, 600) : ''}
                        alt={breed?.name ? `כלב מגזע ${breed.name}` : 'כלב'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                      />
                      {breed?.name && (
                        <span
                          className="chip3d-dark"
                          aria-hidden="true"
                          style={{ position: 'absolute', top: 12, insetInlineStart: 12, backdropFilter: 'blur(6px)', background: 'rgba(42,32,24,.62)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}
                        >
                          {breed.name}
                        </span>
                      )}
                    </div>
                    <div className="lift-3d-sm" style={{ padding: 18 }}>
                      <h2 style={{ margin: 0, fontSize: 18.5, fontWeight: 800, lineHeight: 1.35 }}>{a.title}</h2>
                      <p style={{ margin: '8px 0 14px', fontSize: 14.5, color: '#5f574c', lineHeight: 1.65 }}>{a.excerpt}</p>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#a87a3e' }}>
                        קריאה של {a.readMinutes} דקות ←
                      </span>
                    </div>
                  </article>
                </Tilt3D>
              </Link>
            </Reveal3D>
          )
        })}
      </ul>
    </main>
  )
}
