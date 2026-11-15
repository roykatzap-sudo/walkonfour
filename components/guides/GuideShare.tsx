'use client'

import { useState } from 'react'

/**
 * שורת שיתוף למדריך: וואטסאפ, העתקת התשובה הקצרה עם קישור, והדפסה.
 * ההעתקה כוללת את שם האתר והקישור, כדי שמי שמדביק את התשובה בקבוצה
 * שכונתית או בוואטסאפ יביא איתו גם את המקור.
 */
export function GuideShare({ title, quickAnswer, path }: { title: string; quickAnswer?: string; path: string }) {
  const [copied, setCopied] = useState(false)
  const url = `https://walkonfour.org${path}?utm_source=share`
  const plain = (quickAnswer ?? '').replace(/\*\*/g, '')
  const message = plain
    ? `${title}\n\n${plain}\n\nהמדריך המלא באתר קהילה על ארבע:\n${url}`
    : `${title}\n\nמדריך באתר קהילה על ארבע:\n${url}`

  function whatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2400)
    } catch {
      /* הדפדפן חסם גישה ללוח - שאר הכפתורים עובדים */
    }
  }

  return (
    <div className="gsh no-print" role="group" aria-label="שיתוף המדריך">
      <span className="gsh-l">מכירים מישהו שזה יעזור לו?</span>
      <div className="gsh-btns">
        <button type="button" className="gsh-b gsh-wa" onClick={whatsapp}>שלחו בוואטסאפ</button>
        <button type="button" className="gsh-b" onClick={copy} aria-live="polite">
          {copied ? 'הועתק' : plain ? 'העתקת התשובה עם קישור' : 'העתקת קישור'}
        </button>
        <button type="button" className="gsh-b" onClick={() => window.print()}>הדפסה</button>
      </div>
      <style jsx>{`
        .gsh {
          display: flex; align-items: center; justify-content: space-between; gap: 14px; flex-wrap: wrap;
          margin: 0; padding: 14px 18px;
          background: #fff; border: 1px solid rgba(201, 154, 91, 0.3); border-radius: 16px;
        }
        .gsh-l { font-weight: 800; font-size: 15.5px; color: var(--ink); }
        .gsh-btns { display: flex; gap: 9px; flex-wrap: wrap; }
        .gsh-b {
          min-height: 46px; padding: 0 18px; border-radius: 999px; cursor: pointer;
          font-family: inherit; font-size: 15px; font-weight: 800;
          background: #fff; color: var(--brand-dark); border: 1.5px solid rgba(201, 154, 91, 0.45);
        }
        .gsh-b:hover { background: #fdf6ea; }
        .gsh-b:focus-visible { outline: 3px solid rgba(201, 154, 91, 0.6); outline-offset: 3px; }
        .gsh-wa { background: #17804a; color: #fff; border-color: transparent; }
        .gsh-wa:hover { background: #136c3e; }
        @media (max-width: 560px) {
          .gsh { flex-direction: column; align-items: stretch; }
          .gsh-b { flex: 1; }
        }
      `}</style>
    </div>
  )
}
