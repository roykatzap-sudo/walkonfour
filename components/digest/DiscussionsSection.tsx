import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { SectionHeader } from '@/components/digest/SectionHeader'
import { hotDiscussions } from '@/lib/digest'

/** מספר מעוצב עם הפרדת אלפים. */
const num = (n: number) => n.toLocaleString('he-IL')

/**
 * דיונים חמים - שלושת הפוסטים החמים מהפורום (לפי מדד חום ב-lib/digest).
 * כרטיס ראשון מודגש כ"דיון החודש". כל הנתונים read-only מ-demoPosts.
 */
export function DiscussionsSection() {
  const posts = hotDiscussions(3)
  if (posts.length === 0) return null

  return (
    <section aria-labelledby="digest-discussions" style={{ marginBottom: 64 }}>
      <SectionHeader
        id="digest-discussions"
        tag="הקהילה מדברת"
        title="הדיונים החמים של החודש"
        description="השאלות והשיחות שריכזו הכי הרבה תגובות, לייקים וצפיות בפורום."
        linkHref="/forum"
        linkLabel="לכל הפורום"
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {posts.map((p, i) => {
          const featured = i === 0
          return (
            <Reveal3D key={p.id} delay={((i % 3) + 1) as 1 | 2 | 3}>
              <Tilt3D max={7} className="sweep" style={{ height: '100%' }}>
                <article
                  className="lift-3d"
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    padding: 22,
                    borderRadius: 22,
                    background: featured
                      ? 'linear-gradient(160deg, #2a2018 0%, #3a2c1e 100%)'
                      : '#fff',
                    color: featured ? '#fff' : 'var(--text)',
                    border: featured
                      ? '1px solid rgba(232,200,135,.28)'
                      : '1px solid #efe2cd',
                    boxShadow: featured
                      ? '0 18px 40px rgba(42,32,24,.30)'
                      : 'var(--shadow-lg)',
                  }}
                >
                  {/* כותרת עליונה: קטגוריה + תג "דיון החודש" */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    {p.category && (
                      <span
                        className="chip3d"
                        style={
                          featured
                            ? {
                                background: 'rgba(232,200,135,.16)',
                                color: '#e8c887',
                                borderColor: 'rgba(232,200,135,.34)',
                              }
                            : undefined
                        }
                      >
                        <span aria-hidden>{p.category.icon}</span>
                        {p.category.name}
                      </span>
                    )}
                    {featured && (
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: 'var(--brand-dark)',
                          background: '#e8c887',
                          borderRadius: 'var(--pill-radius)',
                          padding: 'var(--chip-md-pad)',
                        }}
                      >
                        דיון החודש
                      </span>
                    )}
                  </div>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: featured ? 21 : 18,
                      fontWeight: 800,
                      lineHeight: 1.25,
                      letterSpacing: '-0.5px',
                    }}
                  >
                    {p.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      flex: 1,
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      color: featured ? 'rgba(255,255,255,.82)' : 'var(--text-secondary)',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {p.content}
                  </p>

                  {/* מטא: מחבר + מעורבות */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                      flexWrap: 'wrap',
                      paddingTop: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: featured ? 'rgba(255,255,255,.78)' : 'var(--text-soft)',
                      }}
                    >
                      {p.author?.full_name ?? 'חבר/ה בקהילה'}
                      {p.author?.city ? ` · ${p.author.city}` : ''}
                    </span>
                    <span
                      aria-label={`${num(p.comments_count ?? 0)} תגובות, ${num(p.likes_count ?? 0)} לייקים, ${num(p.views ?? 0)} צפיות`}
                      style={{
                        display: 'inline-flex',
                        gap: 12,
                        fontSize: 13,
                        fontWeight: 700,
                        color: featured ? '#e8c887' : 'var(--brand-dark)',
                      }}
                    >
                      <span>
                        <span aria-hidden>💬</span> {num(p.comments_count ?? 0)}
                      </span>
                      <span>
                        <span aria-hidden>♥</span> {num(p.likes_count ?? 0)}
                      </span>
                    </span>
                  </div>

                  <Link
                    href="/forum"
                    className={featured ? 'btn btn-primary' : 'btn btn-ghost'}
                    style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
                    aria-label={`להמשך הדיון: ${p.title}`}
                  >
                    להמשך הדיון
                  </Link>
                </article>
              </Tilt3D>
            </Reveal3D>
          )
        })}
      </div>
    </section>
  )
}
