'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { breedArticles } from '@/lib/articles'
import { getBreed, breedFace } from '@/lib/breeds'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'

export function ArticleSearch() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return breedArticles
    return breedArticles.filter((a) => {
      const breed = getBreed(a.slug)
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        (breed?.name?.toLowerCase().includes(q) ?? false) ||
        (breed?.en?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query])

  return (
    <div>
      {/* ── חיפוש ── */}
      <div
        style={{
          padding: 16,
          borderRadius: 18,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          background: '#fff',
          border: '1px solid rgba(42,32,24,.08)',
          boxShadow: '0 4px 18px rgba(42,32,24,.06)',
        }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 חפשו מדריך - שם גזע, בעברית או באנגלית…"
          aria-label="חיפוש מדריך גזע"
          style={{ flex: 1, minWidth: 220, padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, background: '#fbf7f1', color: '#2a2018' }}
        />
        <span style={{ fontSize: 15, fontWeight: 700, color: '#7a6c55', whiteSpace: 'nowrap' }}>
          {filtered.length} מדריכים
        </span>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7a6c55', padding: '40px 0', fontSize: 16, fontWeight: 600 }}>
          לא נמצא מדריך ל״{query}״. נסו שם גזע אחר.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map((a, i) => {
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
                    <article style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(42,32,24,.08)', boxShadow: '0 4px 18px rgba(42,32,24,.06)', height: '100%' }}>
                      <div style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          loading="lazy"
                          decoding="async"
                          src={breed ? breedFace(breed.photo) : ''}
                          alt={breed?.name ? `כלב מגזע ${breed.name}` : 'כלב'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                        />
                        {breed?.name && (
                          <span className="chip3d-dark" aria-hidden="true" style={{ position: 'absolute', bottom: 12, insetInlineStart: 12, backdropFilter: 'blur(6px)', background: 'rgba(42,32,24,.62)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}>
                            {breed.name}
                          </span>
                        )}
                      </div>
                      <div className="lift-3d-sm" style={{ padding: 18 }}>
                        <h2 className="display" style={{ margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35, color: '#2a2018' }}>{a.title}</h2>
                        <p style={{ margin: '8px 0 14px', fontSize: 15.5, color: '#5f574c', lineHeight: 1.65 }}>{a.excerpt}</p>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#a06f30' }}>
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
      )}
    </div>
  )
}
