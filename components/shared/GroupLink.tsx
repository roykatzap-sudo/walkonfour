'use client'

import type { CSSProperties, ReactNode } from 'react'
import { FB_GROUP_URL } from '@/lib/social'
import { getArrival } from '@/lib/arrival'

/**
 * קישור לקבוצת הפייסבוק שסופר הקלקות.
 * הקישור עצמו נשאר ישיר לפייסבוק (כדי שבנייד ייפתח באפליקציה), והספירה
 * נשלחת ברקע ב-sendBeacon. src = מיקום הכפתור (hero, guide-inline, popup...).
 */
/** שולח ספירת הקלקה ברקע. לשימוש גם מרכיבים שמחזיקים <a> משלהם. */
/** מפתח בזיכרון הדפדפן: מתי המבקר לחץ על קישור לקבוצה. משמש כדי לא להקפיץ לו שוב הזמנה. */
export const GROUP_CLICKED_KEY = 'kv-group-clicked-at'

export function trackGroupClick(src: string) {
  try {
    window.localStorage.setItem(GROUP_CLICKED_KEY, String(Date.now()))
  } catch {
    /* מצב גלישה פרטית - ממשיכים בלי זיכרון */
  }
  try {
    const body = JSON.stringify({ src, page: window.location.pathname, via: getArrival() })
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/group-click', new Blob([body], { type: 'text/plain' }))
    } else {
      fetch('/api/group-click', { method: 'POST', body, keepalive: true }).catch(() => {})
    }
  } catch {
    /* ספירה היא לא סיבה לשבור קישור */
  }
}

export function GroupLink({
  src,
  children,
  className,
  style,
  onClick,
  ariaLabel,
  tabIndex,
  href,
}: {
  src: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  ariaLabel?: string
  tabIndex?: number
  /** קישור ספציפי בתוך הקבוצה (למשל שרשור של עיר). ברירת מחדל: הקבוצה עצמה. */
  href?: string
}) {
  function track() {
    trackGroupClick(src)
    onClick?.()
  }

  return (
    <a
      href={href ?? FB_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      data-group-src={src}
      onClick={track}
      onAuxClick={track}
    >
      {children}
      {!ariaLabel && <span className="kv-sr-only"> (נפתח בחלון חדש)</span>}
    </a>
  )
}
