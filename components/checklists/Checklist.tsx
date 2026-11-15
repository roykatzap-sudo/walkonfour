'use client'

import { useEffect, useState } from 'react'

/* צ'קליסט עם סימונים שנשמרים במכשיר (localStorage), וכפתור הדפסה.
   הפריטים עצמם מרונדרים גם בלי JavaScript, כרשימה רגילה. */

export type ChecklistGroup = { title: string; items: string[] }

export function Checklist({ id, groups }: { id: string; groups: ChecklistGroup[] }) {
  const key = `kv-checklist-${id}`
  const [done, setDone] = useState<Record<string, boolean>>({})

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw) setDone(JSON.parse(raw))
    } catch {
      /* גלישה פרטית - עובדים בלי שמירה */
    }
  }, [key])

  function toggle(itemId: string) {
    setDone((d) => {
      const next = { ...d, [itemId]: !d[itemId] }
      try { window.localStorage.setItem(key, JSON.stringify(next)) } catch { /* בלי שמירה */ }
      return next
    })
  }
  function reset() {
    setDone({})
    try { window.localStorage.removeItem(key) } catch { /* בלי שמירה */ }
  }

  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const count = groups.reduce((n, g, gi) => n + g.items.filter((_, ii) => done[`${gi}-${ii}`]).length, 0)

  return (
    <div className="ckl">
      <p className="ckl-count no-print" role="status" aria-live="polite">סימנתם {count} מתוך {total}</p>
      {groups.map((g, gi) => (
        <div key={g.title} className="ckl-group">
          <h3>{g.title}</h3>
          <ul>
            {g.items.map((item, ii) => {
              const itemId = `${gi}-${ii}`
              return (
                <li key={itemId}>
                  <label className={done[itemId] ? 'is-done' : undefined}>
                    <input type="checkbox" checked={!!done[itemId]} onChange={() => toggle(itemId)} />
                    <span>{item}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
      <div className="ckl-actions no-print">
        <button type="button" className="ckl-b ckl-b1" onClick={() => window.print()}>הדפסת הרשימה</button>
        <button type="button" className="ckl-b" onClick={reset}>ניקוי הסימונים</button>
      </div>
      <p className="ckl-note no-print">הסימונים נשמרים במכשיר הזה בלבד.</p>
      <style jsx>{`
        .ckl { background: #fff; border: 1px solid rgba(201,154,91,.3); border-radius: 18px; padding: 20px 22px; }
        .ckl-count { margin: 0 0 8px; font-size: 15.5px; font-weight: 800; color: #7a5a2e; }
        .ckl-group h3 { margin: 14px 0 6px; font-size: 19px; font-weight: 900; color: var(--ink); }
        .ckl-group ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
        .ckl label { display: flex; align-items: flex-start; gap: 12px; min-height: 46px; padding: 9px 8px; border-radius: 10px; cursor: pointer; font-size: 17px; line-height: 1.6; color: #2a2018; }
        .ckl label:hover { background: #fbf7ef; }
        .ckl label:focus-within { outline: 3px solid #c99a5b; outline-offset: 1px; }
        .ckl input { width: 22px; height: 22px; flex: none; margin-top: 3px; }
        .ckl .is-done span { color: #5b4d3c; text-decoration: line-through; }
        .ckl-actions { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
        .ckl-b { min-height: 48px; padding: 0 22px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16px; font-weight: 800; background: #fff; color: #7a5a2e; border: 1.5px solid rgba(201,154,91,.55); }
        .ckl-b1 { background: #241a12; color: #fff; border-color: #241a12; }
        .ckl-b:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
        .ckl-note { margin: 8px 0 0; font-size: 14.5px; color: #5b4d3c; }
        @media print {
          .ckl { border: none; padding: 0; }
          .ckl .is-done span { text-decoration: none; color: #000; }
          .ckl label { min-height: 0; padding: 4px 0; }
        }
      `}</style>
    </div>
  )
}
