'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { SearchEntry } from '@/lib/searchIndex'

/* חיפוש באתר. האינדקס נטען פעם אחת כקובץ סטטי, וההתאמה נעשית בדפדפן. */

/** מנרמל טקסט להשוואה: בלי ניקוד, גרשיים, מקפים וסימני פיסוק. */
function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/[֑-ׇ]/g, '')
    .replace(/["'`׳״\-־:,.?!()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** מוריד תחילית נפוצה (ה, ו, ב, ל, מ, ש, כ) ממילה של 4 אותיות ומעלה, כדי ש"בחיפה" ימצא את "חיפה". */
function stripPrefix(w: string): string {
  return w.length >= 4 && 'הובלמשכ'.includes(w[0]!) ? w.slice(1) : w
}

function score(e: SearchEntry & { nt: string; nall: string }, words: string[]): number {
  let total = 0
  for (const w of words) {
    const alt = stripPrefix(w)
    const inTitle = e.nt.includes(w) || e.nt.includes(alt)
    const inAll = inTitle || e.nall.includes(w) || e.nall.includes(alt)
    if (!inAll) return 0
    total += inTitle ? (e.nt.startsWith(w) || e.nt.startsWith(alt) ? 6 : 4) : 1
  }
  return total
}

export function SiteSearch() {
  const [index, setIndex] = useState<(SearchEntry & { nt: string; nall: string })[] | null>(null)
  const [failed, setFailed] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get('q')
    if (initial) setQ(initial)
    inputRef.current?.focus()
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((rows: SearchEntry[]) => setIndex(rows.map((e) => ({ ...e, nt: norm(e.t), nall: norm(`${e.t} ${e.d} ${e.x ?? ''}`) }))))
      .catch(() => setFailed(true))
  }, [])

  const results = useMemo(() => {
    const words = norm(q).split(' ').filter((w) => w.length >= 2)
    if (!index || words.length === 0) return []
    return index
      .map((e) => ({ e, s: score(e, words) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 30)
      .map((r) => r.e)
  }, [index, q])

  const typed = norm(q).length >= 2

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} style={{ marginBottom: 14 }}>
        <label htmlFor="site-search" style={{ display: 'block', fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
          מה אתם מחפשים?
        </label>
        <input
          ref={inputRef}
          id="site-search"
          type="search"
          inputMode="search"
          autoComplete="off"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="למשל: חיפה, קרציות, גולדן, רישיון"
          style={{
            width: '100%', minHeight: 56, padding: '12px 18px', font: 'inherit', fontSize: 18,
            border: '2px solid rgba(90,77,60,.45)', borderRadius: 16, background: '#fff', color: '#2a2018',
          }}
        />
      </form>

      <p role="status" aria-live="polite" style={{ margin: '0 0 14px', fontSize: 15.5, color: '#5b4d3c', minHeight: 24 }}>
        {failed
          ? 'החיפוש לא נטען. נסו לרענן את העמוד.'
          : !index
            ? 'טוען...'
            : !typed
              ? 'הקלידו לפחות שתי אותיות.'
              : results.length === 0
                ? 'לא מצאנו תוצאות. נסו מילה אחרת, או שאלו בקבוצת הפייסבוק שלנו.'
                : `${results.length} תוצאות`}
      </p>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {results.map((e) => (
          <li key={e.u}>
            <Link
              href={e.u}
              style={{
                display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid rgba(201,154,91,.3)',
                borderRadius: 14, padding: '14px 18px', color: 'inherit',
              }}
            >
              <span style={{ display: 'inline-block', fontSize: 13.5, fontWeight: 800, color: '#7a5a2e', background: 'rgba(232,200,135,.25)', borderRadius: 999, padding: '2px 10px', marginBottom: 4 }}>
                {e.k}
              </span>
              <span style={{ display: 'block', fontSize: 18, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.4 }}>{e.t}</span>
              <span style={{ display: 'block', fontSize: 15.5, color: '#5b4d3c', lineHeight: 1.6, marginTop: 2 }}>{e.d}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
