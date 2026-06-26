'use client'

import { useState } from 'react'
import { useToast } from '@/components/shared/Toast'

/**
 * יצירת קשר מוגנת + דיווח על מודעה.
 * אין חשיפת טלפון אוטומטית - ההודעה נשלחת דרך המערכת (כרגע דמו/toast).
 * שומר על הפרטיות של המוכר ועל בטיחות הקונה.
 */
export function ContactSeller({ seller }: { seller: string }) {
  const toast = useToast()
  const [sent, setSent] = useState(false)

  function contact() {
    setSent(true)
    toast(`ההודעה נשלחה אל ${seller}. תקבלו תשובה כאן בכלבניה, בלי לחשוף טלפון.`)
  }

  function report() {
    toast('הדיווח התקבל. הצוות יבדוק את המודעה. תודה שעוזרים לשמור על קהילה בטוחה.')
  }

  return (
    <div className="cs-wrap">
      <button type="button" className="btn btn-primary cs-contact" onClick={contact} disabled={sent}>
        {sent ? '✓ ההודעה נשלחה' : `💬 שליחת הודעה ל${seller}`}
      </button>
      <button type="button" className="cs-report" onClick={report}>
        🚩 דיווח על המודעה
      </button>

      <style jsx>{`
        .cs-wrap { display: flex; flex-direction: column; gap: 12px; }
        .cs-contact { width: 100%; font-size: 16px; padding: 15px 24px; }
        .cs-contact:disabled { opacity: 0.7; cursor: default; }
        .cs-report {
          background: none;
          border: none;
          color: #9a7c5a;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          padding: 6px;
          align-self: center;
          transition: color 0.2s;
        }
        .cs-report:hover { color: #b4502e; }
      `}</style>
    </div>
  )
}
