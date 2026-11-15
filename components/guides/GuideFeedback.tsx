'use client'

import { useEffect, useState } from 'react'
import { GroupLink } from '@/components/shared/GroupLink'

/* "המדריך הזה עזר?" - שאלה אחת בסוף המדריך. התשובה נשמרת בלי שום פרט על המבקר.
   מי שעונה "לא" מקבל שתי דרכים לומר מה היה חסר. */

export function GuideFeedback({ slug }: { slug: string }) {
  const key = `kv-guide-fb-${slug}`
  const [answer, setAnswer] = useState<'yes' | 'no' | null>(null)

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(key)
      if (v === 'yes' || v === 'no') setAnswer(v)
    } catch {
      /* בלי זיכרון */
    }
  }, [key])

  function send(helpful: boolean) {
    setAnswer(helpful ? 'yes' : 'no')
    try { window.localStorage.setItem(key, helpful ? 'yes' : 'no') } catch { /* בלי זיכרון */ }
    fetch('/api/guide-feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, helpful }), keepalive: true }).catch(() => {})
  }

  return (
    <div className="gfb no-print">
      {answer === null ? (
        <>
          <span className="gfb-q" id={`gfb-${slug}`}>המדריך הזה עזר לכם?</span>
          <div className="gfb-btns" role="group" aria-labelledby={`gfb-${slug}`}>
            <button type="button" className="gfb-b" onClick={() => send(true)}>כן</button>
            <button type="button" className="gfb-b" onClick={() => send(false)}>לא ממש</button>
          </div>
        </>
      ) : (
        <p className="gfb-thanks" role="status">
          {answer === 'yes' ? (
            <>תודה. אם יש לכם מה להוסיף מהניסיון שלכם, <GroupLink src="guide-feedback">ספרו בקבוצת הפייסבוק</GroupLink>.</>
          ) : (
            <>תודה שאמרתם. מה היה חסר? <GroupLink src="guide-feedback">כתבו לנו בקבוצת הפייסבוק</GroupLink>, ונשפר את המדריך.</>
          )}
        </p>
      )}
      <style jsx>{`
        .gfb { display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-top: 14px; padding: 14px 18px; background: #fbf7ef; border: 1px solid rgba(201,154,91,.3); border-radius: 16px; }
        .gfb-q { font-size: 16.5px; font-weight: 800; color: var(--ink); }
        .gfb-btns { display: flex; gap: 9px; }
        .gfb-b { min-height: 46px; min-width: 84px; padding: 0 18px; border-radius: 999px; cursor: pointer; font: inherit; font-size: 16px; font-weight: 800; background: #fff; color: #7a5a2e; border: 1.5px solid rgba(201,154,91,.55); transition: transform 160ms cubic-bezier(0.23, 1, 0.32, 1), background-color 160ms ease; }
        .gfb-b:hover { background: #fdf6ea; }
        .gfb-b:active { transform: scale(.97); }
        .gfb-b:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
        .gfb-thanks { margin: 0; font-size: 16.5px; line-height: 1.7; color: #3a3128; }
        .gfb-thanks :global(a) { color: #0f5fcc; font-weight: 800; }
        @media (prefers-reduced-motion: reduce) { .gfb-b { transition: none; } .gfb-b:active { transform: none; } }
      `}</style>
    </div>
  )
}
