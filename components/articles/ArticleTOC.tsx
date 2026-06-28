'use client'

import { useEffect, useState } from 'react'

export type TocItem = { id: string; heading: string }

/**
 * תוכן עניינים למאמר:
 * - דסקטופ: ריל דביק בצד עם הדגשת הסקשן הפעיל.
 * - מובייל: רשימת צ'יפים מתקפלת ("במדריך הזה").
 * שתי הגרסאות בקומפוננטה אחת, נשלטות ב-CSS (media query).
 */
export function ArticleTOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (items.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -60% 0px', threshold: 0 },
    )
    items.forEach((it) => {
      const el = document.getElementById(it.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [items])

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
      setOpen(false)
      history.replaceState(null, '', `#${id}`)
    }
  }

  if (items.length === 0) return null

  return (
    <nav aria-label="תוכן העניינים של המדריך" className="article-toc">
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-toc { font-family: var(--font-body, inherit); }
            /* ── דסקטופ: ריל דביק ── */
            .article-toc-rail { display: none; }
            .article-toc-rail .toc-title {
              font-size: 13px; font-weight: 800; letter-spacing: .04em;
              text-transform: none; color: #a06f30; margin: 0 0 12px;
            }
            .article-toc-rail ol { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
            .article-toc-rail a {
              display: block; padding: 7px 12px; border-radius: 9px;
              font-size: 14.5px; line-height: 1.45; font-weight: 600;
              color: #6e6052; text-decoration: none;
              border-inline-start: 2px solid transparent;
              transition: background .15s, color .15s, border-color .15s;
            }
            .article-toc-rail a:hover { background: rgba(201,154,91,.1); color: #2a2018; }
            .article-toc-rail a.is-active {
              background: rgba(201,154,91,.14); color: #2a2018; font-weight: 800;
              border-inline-start-color: #c99a5b;
            }
            .article-toc-rail a:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }

            /* ── מובייל: צ'יפים מתקפלים ── */
            .article-toc-mobile {
              background: #fff; border: 1px solid rgba(42,32,24,.08);
              border-radius: 16px; box-shadow: 0 4px 18px rgba(42,32,24,.06);
              padding: 6px 6px; margin-bottom: 28px;
            }
            .article-toc-mobile > summary {
              list-style: none; cursor: pointer; padding: 12px 14px;
              font-size: 15px; font-weight: 800; color: #2a2018;
              display: flex; align-items: center; justify-content: space-between; gap: 10px;
            }
            .article-toc-mobile > summary::-webkit-details-marker { display: none; }
            .article-toc-mobile > summary .chev { color: #a06f30; transition: transform .2s; font-size: 13px; }
            .article-toc-mobile[open] > summary .chev { transform: rotate(180deg); }
            .article-toc-mobile .chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 4px 12px 14px; }
            .article-toc-mobile .chips a {
              font-size: 14px; font-weight: 600; color: #5f574c;
              background: #f6efe5; border: 1px solid rgba(201,154,91,.25);
              border-radius: 999px; padding: 7px 13px; text-decoration: none;
            }
            .article-toc-mobile .chips a:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }

            @media (min-width: 1024px) {
              .article-toc-rail { display: block; position: sticky; top: 96px; }
              .article-toc-mobile { display: none; }
            }
          `,
        }}
      />

      {/* דסקטופ */}
      <div className="article-toc-rail">
        <p className="toc-title">במדריך הזה</p>
        <ol>
          {items.map((it) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                onClick={(e) => go(e, it.id)}
                className={active === it.id ? 'is-active' : undefined}
                aria-current={active === it.id ? 'true' : undefined}
              >
                {it.heading}
              </a>
            </li>
          ))}
        </ol>
      </div>

      {/* מובייל */}
      <details className="article-toc-mobile" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
        <summary>
          <span>במדריך הזה ({items.length})</span>
          <span className="chev" aria-hidden="true">▼</span>
        </summary>
        <div className="chips">
          {items.map((it) => (
            <a key={it.id} href={`#${it.id}`} onClick={(e) => go(e, it.id)}>
              {it.heading}
            </a>
          ))}
        </div>
      </details>
    </nav>
  )
}
