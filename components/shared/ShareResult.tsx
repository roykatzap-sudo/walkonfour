'use client'

import { useState } from 'react'

/**
 * שיתוף תוצאה מכלי אינטראקטיבי.
 * וואטסאפ הוא הראשי (ערוץ ההפצה המרכזי בישראל), ולצידו העתקת קישור
 * ושיתוף מובנה במובייל. הטקסט מגיע מהכלי עצמו כדי שההודעה תהיה ספציפית
 * ("הגזע שהתאים לי הוא X") ולא גנרית.
 */
export function ShareResult({
  text,
  url,
  label = 'אהבתם את התוצאה? שתפו',
}: {
  /** ההודעה שתישלח, בלי הקישור - הוא נוסף אוטומטית. */
  text: string
  /** ברירת מחדל: הכתובת הנוכחית. */
  url?: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  const link = () => url ?? (typeof window !== 'undefined' ? window.location.href : 'https://walkonfour.org')
  const message = () => `${text}\n\n${link()}`

  function shareWhatsapp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(message())}`, '_blank', 'noopener,noreferrer')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message())
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* דפדפן חסם קליפבורד - הכפתורים האחרים עדיין עובדים */
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ text, url: link() })
    } catch {
      /* המשתמש ביטל, או אין תמיכה - לא עושים כלום */
    }
  }

  const hasNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function'

  return (
    <div className="shr">
      <span className="shr-l">{label}</span>
      <div className="shr-btns">
        <button type="button" onClick={shareWhatsapp} className="shr-b shr-wa">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.32l-.34-.2-3.57.93.96-3.47-.23-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.18 4.23-9.4 9.43-9.4a9.36 9.36 0 0 1 9.42 9.41c0 5.18-4.23 9.4-9.42 9.4Zm8.01-17.42A11.28 11.28 0 0 0 12.03.75C5.8.75.75 5.8.75 12.02c0 1.99.52 3.93 1.51 5.64L.66 23.25l5.72-1.5a11.3 11.3 0 0 0 5.65 1.44h.01c6.22 0 11.28-5.06 11.28-11.27 0-3.01-1.17-5.84-3.3-7.97Z" />
          </svg>
          שלחו בוואטסאפ
        </button>
        <button type="button" onClick={copy} className="shr-b shr-cp">
          {copied ? '✓ הועתק' : '🔗 העתקת קישור'}
        </button>
        {hasNative && (
          <button type="button" onClick={nativeShare} className="shr-b shr-cp shr-native">
            שיתוף
          </button>
        )}
      </div>

      <style jsx>{`
        .shr {
          margin-top: 22px;
          padding: 16px 18px;
          background: linear-gradient(135deg, #fffaf1, #fdf3e3);
          border: 1.5px solid rgba(201, 154, 91, 0.32);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .shr-l {
          font-weight: 800;
          font-size: 15.5px;
          color: var(--ink);
        }
        .shr-btns {
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }
        .shr-b {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 46px;
          padding: 0 18px;
          border-radius: 999px;
          font-family: inherit;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: transform 0.18s ease, filter 0.18s ease, background 0.18s ease;
        }
        .shr-b:hover {
          transform: translateY(-2px);
        }
        .shr-b:focus-visible {
          outline: 3px solid rgba(201, 154, 91, 0.6);
          outline-offset: 3px;
        }
        .shr-wa {
          background: #25d366;
          color: #fff;
        }
        .shr-wa:hover {
          filter: brightness(1.06);
        }
        .shr-cp {
          background: #fff;
          color: var(--brand-dark);
          border-color: rgba(201, 154, 91, 0.45);
        }
        .shr-cp:hover {
          background: #fdf6ea;
        }
        @media (max-width: 560px) {
          .shr {
            flex-direction: column;
            align-items: stretch;
          }
          .shr-btns {
            width: 100%;
          }
          .shr-b {
            flex: 1;
            justify-content: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .shr-b {
            transition: none;
          }
          .shr-b:hover {
            transform: none;
          }
        }
      `}</style>
    </div>
  )
}
