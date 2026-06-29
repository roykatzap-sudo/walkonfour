'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * הזמנה עדינה (משנית) להצטרף לקבוצת הפייסבוק - "בינתיים, בזמן שאנחנו בונים".
 * ה-CTA הראשי באתר הוא רשימת ההמתנה; הנדנוד הזה לא מתחרה בו: הוא לא מופיע
 * בדף הבית (שם נמצא ה-hero של הרשמה) ולא ב-/waitlist (שם נמצא הטופס).
 * מופיע פעם אחת בלבד - אחרי 18 שניות או אחרי גלילה של חצי עמוד (המוקדם מביניהם),
 * נסגר ב-X / Escape ולא חוזר (localStorage). לא ספאם, לא חוזר.
 */
const FB_GROUP = 'https://www.facebook.com/share/g/18wnLhr9tn/'
const LS_KEY = 'kv-fb-cta-dismissed'

// בדפים האלה לא מקפיצים פופ-אפ פייסבוק: עמודי המרה (/, /waitlist) ועמוד המפה
// האינטראקטיבי (/map) - שם הפופ-אפ מכסה את המפה.
const SUPPRESS_ON = ['/', '/waitlist', '/map']

export function FacebookCTA() {
  const pathname = usePathname()
  const suppressed = SUPPRESS_ON.includes(pathname ?? '')
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (suppressed) return
    if (localStorage.getItem(LS_KEY)) return

    let done = false
    const reveal = () => {
      if (done) return
      done = true
      window.removeEventListener('scroll', onScroll)
      setShow(true)
    }
    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
      if (scrolled > 0.25) reveal()
    }
    const timer = window.setTimeout(reveal, 8000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [suppressed])

  // Escape סוגר; פוקוס עובר לכפתור הסגירה כשנפתח (נגישות).
  useEffect(() => {
    if (!show) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [show])

  function dismiss() {
    setClosing(true)
    try { localStorage.setItem(LS_KEY, '1') } catch {}
    window.setTimeout(() => setShow(false), 280)
  }

  if (!show) return null

  return (
    <div className={`fbcta${closing ? ' closing' : ''}`} role="complementary" aria-label="הצטרפות לקבוצת הפייסבוק">
      <button ref={closeRef} type="button" className="fbcta-x" aria-label="סגירה" onClick={dismiss}>✕</button>
      <div className="fbcta-row">
        <div className="fbcta-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
        </div>
        <div className="fbcta-text">
          <div className="fbcta-title">חבר'ה - תצטרפו אלינו 🐾</div>
          <div className="fbcta-sub">קבוצת הפייסבוק של "קהילה על ארבע" - שאלות, טיפים והמלצות אמיתיות מבעלי כלבים מכל הארץ. שואלים ומקבלים תשובה תוך דקות.</div>
        </div>
      </div>
      <a href={FB_GROUP} target="_blank" rel="noopener noreferrer" className="fbcta-btn" onClick={dismiss}>
        להצטרפות לקבוצה 🐾
      </a>

      <style jsx>{`
        .fbcta {
          position: fixed;
          inset-inline-end: 20px;
          bottom: 20px;
          z-index: 1200;
          width: min(330px, calc(100vw - 32px));
          background: #fff;
          border: 1px solid rgba(201, 154, 91, 0.25);
          border-radius: 20px;
          box-shadow: 0 18px 50px rgba(42, 32, 24, 0.22);
          padding: 18px 18px 16px;
          animation: fbcta-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .fbcta.closing { animation: fbcta-out 0.28s ease forwards; }
        @keyframes fbcta-in { from { opacity: 0; transform: translateY(24px) scale(0.96); } to { opacity: 1; transform: none; } }
        @keyframes fbcta-out { to { opacity: 0; transform: translateY(16px); } }
        .fbcta-x {
          position: absolute; top: 8px; inset-inline-start: 8px;
          width: 28px; height: 28px; border: none; background: transparent;
          color: #5e5346; font-size: 15px; cursor: pointer; border-radius: 50%;
        }
        .fbcta-x:hover { background: #f3ece0; color: #5a4d3c; }
        .fbcta-row { display: flex; gap: 12px; align-items: flex-start; }
        .fbcta-ico {
          flex: none; width: 46px; height: 46px; border-radius: 14px;
          background: #1877f2; display: grid; place-items: center;
        }
        .fbcta-title { font-weight: 900; font-size: 16px; color: var(--ink); line-height: 1.3; }
        .fbcta-sub { font-size: 14px; color: var(--text-muted); margin-top: 4px; line-height: 1.55; }
        .fbcta-btn {
          display: block; text-align: center; margin-top: 14px;
          background: #1877f2; color: #fff; font-weight: 800; font-size: 15px;
          padding: 11px; border-radius: 13px; text-decoration: none;
          transition: filter 0.15s;
        }
        .fbcta-btn:hover { filter: brightness(1.07); }
        @media (prefers-reduced-motion: reduce) { .fbcta, .fbcta.closing { animation: none; } }
      `}</style>
    </div>
  )
}
