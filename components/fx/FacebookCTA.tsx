'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackGroupClick, GROUP_CLICKED_KEY } from '@/components/shared/GroupLink'
import { FB_GROUP_URL } from '@/lib/social'
import { cameFromFacebook } from '@/lib/arrival'

/**
 * הזמנה לקבוצת הפייסבוק - מופיעה אחרי 5 שניות (או גלילה של רבע עמוד), וחוזרת
 * 3 דקות אחרי סגירה. מי שכבר לחץ על קישור לקבוצה לא מקבל אותה במשך שבוע.
 *
 * נגישות ונוחות:
 * - לא גונבת פוקוס: מי שקורא או מקליד לא נזרק לחלונית. אפשר להגיע אליה ב-Tab, ו-Escape סוגר.
 * - יושבת בצד שמנגד לכפתור הנגישות ולכפתור ההצעות, כדי לא לכסות אותם.
 * - בנייד היא פס נמוך ולא כרטיס גבוה, כדי לא להסתיר תוכן.
 * - לא מופיעה בעמודים שבהם היא רק מפריעה (חירום, כלים עם טפסים, חיפוש).
 * - הנוסח מותאם לסוג העמוד.
 */
const RESHOW_MS = 3 * 60_000
const QUIET_AFTER_CLICK_MS = 7 * 24 * 60 * 60_000

const HIDE_ON = ['/emergency', '/tools/', '/search', '/quiz', '/near-me', '/admin', '/facebook', '/welcome', '/community', '/unsubscribe', '/privacy', '/terms', '/post-kit']

function copyFor(path: string): { title: string; sub: string } {
  if (path.startsWith('/city/')) {
    return { title: 'איזו גינה הכי שווה אצלכם?', sub: 'בקבוצת הפייסבוק שלנו בעלי כלבים מהאזור משתפים איפה יש צל, מים וחברים לכלב.' }
  }
  if (['/guides', '/articles', '/breeds', '/vet', '/laws', '/glossary'].some((p) => path.startsWith(p))) {
    return { title: 'נשארה לכם שאלה?', sub: 'בקבוצת הפייסבוק שלנו שואלים בעלי כלבים אחרים, שכבר עברו את זה.' }
  }
  if (['/walks', '/map', '/cities'].some((p) => path.startsWith(p))) {
    return { title: 'מחפשים חברים לטיול?', sub: 'בקבוצת הפייסבוק שלנו מוצאים שותפים לגינה ולטיול של שבת, לפי אזור.' }
  }
  return {
    title: 'בואו להצטרף אלינו',
    sub: 'קבוצת הפייסבוק של קהילה על ארבע: שאלות, טיפים והמלצות מבעלי כלבים מכל הארץ. הקבוצה בתחילת הדרך, ומי שנכנס עכשיו הוא מהראשונים.',
  }
}

/** האם המבקר כבר לחץ על קישור לקבוצה בשבוע האחרון (מכל כפתור באתר). */
function alreadyClicked(): boolean {
  try {
    const at = Number(window.localStorage.getItem(GROUP_CLICKED_KEY) || 0)
    return at > 0 && Date.now() - at < QUIET_AFTER_CLICK_MS
  } catch {
    return false
  }
}

export function FacebookCTA() {
  const pathname = usePathname() || '/'
  const hidden = HIDE_ON.some((p) => pathname.startsWith(p))
  const [show, setShow] = useState(false)
  const [closing, setClosing] = useState(false)
  const [fromFb, setFromFb] = useState(false)
  const reshowRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || alreadyClicked()) return
    // מי שהגיע מפייסבוק כבר נמצא שם, והקבוצה במרחק לחיצה: מציגים לו את ההזמנה מוקדם יותר.
    const fb = cameFromFacebook()
    setFromFb(fb)

    let armed = true
    const reveal = () => {
      if (!armed || alreadyClicked()) return
      armed = false
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(timer)
      setClosing(false)
      setShow(true)
    }
    const onScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight || 1)
      if (scrolled > 0.25) reveal()
    }
    const timer = window.setTimeout(reveal, fb ? 1800 : 5000)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      if (reshowRef.current) window.clearTimeout(reshowRef.current)
    }
  }, [])

  // Escape סוגר את החלונית (בלי להעביר אליה פוקוס מראש)
  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])

  function dismiss() {
    setClosing(true)
    window.setTimeout(() => {
      setShow(false)
      setClosing(false)
    }, 160)
    if (reshowRef.current) window.clearTimeout(reshowRef.current)
    reshowRef.current = window.setTimeout(() => {
      if (!alreadyClicked()) setShow(true)
    }, RESHOW_MS)
  }

  if (!show || hidden) return null
  const base = copyFor(pathname)
  const copy = fromFb ? { title: base.title, sub: `הגעתם מפייסבוק, אז זה במרחק לחיצה אחת. ${base.sub}` } : base

  return (
    <div className={`fbcta${closing ? ' closing' : ''}`} role="region" aria-label="הזמנה לקבוצת הפייסבוק">
      <div className="fbcta-row">
        <div className="fbcta-ico" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
        </div>
        <div className="fbcta-text">
          <div className="fbcta-title">{copy.title}</div>
          <div className="fbcta-sub">{copy.sub}</div>
        </div>
      </div>
      <a
        href={FB_GROUP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fbcta-btn"
        onClick={() => { trackGroupClick(fromFb ? 'popup-fb' : 'popup'); dismiss() }}
      >
        <span className="fbcta-long">להצטרפות לקבוצה</span>
        <span className="fbcta-short" aria-hidden="true">לקבוצה</span>
        <span className="kv-sr-only"> בפייסבוק (נפתח בחלון חדש)</span>
      </a>
      <button type="button" className="fbcta-x" aria-label="סגירת ההזמנה לקבוצה" onClick={dismiss}>
        <span aria-hidden="true">✕</span>
      </button>

      <style jsx>{`
        .fbcta {
          position: fixed;
          inset-inline-start: 20px;
          bottom: 20px;
          z-index: 1200;
          width: min(350px, calc(100vw - 32px));
          background: #fff;
          border: 1px solid rgba(201, 154, 91, 0.3);
          border-radius: 20px;
          box-shadow: 0 18px 50px rgba(42, 32, 24, 0.22);
          padding: 18px 18px 16px;
          animation: fbcta-in 0.26s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .fbcta.closing { animation: fbcta-out 0.16s ease-out forwards; }
        @keyframes fbcta-in { from { opacity: 0; transform: translateY(12px) scale(0.97); } to { opacity: 1; transform: none; } }
        @keyframes fbcta-out { to { opacity: 0; transform: translateY(16px); } }
        .fbcta-x {
          position: absolute; top: 6px; inset-inline-end: 6px;
          width: 44px; height: 44px; border: none; background: transparent;
          color: #5a4d3c; font-size: 17px; cursor: pointer; border-radius: 50%;
          display: grid; place-items: center;
        }
        .fbcta-x:hover { background: #f3ece0; }
        .fbcta-x:focus-visible, .fbcta-btn:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
        .fbcta-row { display: flex; gap: 12px; align-items: flex-start; padding-inline-end: 34px; }
        .fbcta-ico { flex: none; width: 46px; height: 46px; border-radius: 14px; background: #1877f2; display: grid; place-items: center; }
        .fbcta-title { font-weight: 900; font-size: 18px; color: var(--ink); line-height: 1.3; }
        .fbcta-sub { font-size: 15.5px; color: #5b4d3c; margin-top: 4px; line-height: 1.6; }
        .fbcta-btn {
          display: flex; align-items: center; justify-content: center; min-height: 50px; margin-top: 14px;
          background: #1565d8; color: #fff; font-weight: 800; font-size: 17px;
          padding: 0 16px; border-radius: 14px; text-decoration: none;
          transition: filter 0.15s;
        }
        .fbcta-btn:hover { filter: brightness(1.07); }
        .fbcta-short { display: none; }

        /* נייד: פס נמוך לרוחב המסך, בלי הטקסט המשני - כדי לא להסתיר תוכן */
        @media (max-width: 600px) {
          .fbcta {
            /* משאירים מקום לכפתור הנגישות שבפינה השנייה */
            inset-inline: 10px 76px; bottom: 10px; width: auto;
            display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 16px;
          }
          .fbcta-row { flex: 1; min-width: 0; align-items: center; padding-inline-end: 0; gap: 10px; }
          .fbcta-ico { display: none; }
          .fbcta-title { font-size: 15.5px; line-height: 1.3; }
          .fbcta-long { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
          .fbcta-short { display: inline; }
          .fbcta-sub { display: none; }
          .fbcta-btn { margin-top: 0; min-height: 46px; padding: 0 16px; font-size: 16px; white-space: nowrap; flex: none; position: relative; }
          .fbcta-x { position: static; flex: none; width: 40px; height: 44px; }
        }
        @media (prefers-reduced-motion: reduce) { .fbcta, .fbcta.closing { animation: none; } }
        @media print { .fbcta { display: none; } }
      `}</style>
    </div>
  )
}
