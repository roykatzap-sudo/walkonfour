'use client'

import type { CSSProperties, ReactNode } from 'react'
import { FB_GROUP_URL } from '@/lib/social'

/**
 * קישור לקבוצת הפייסבוק שסופר הקלקות.
 * הקישור עצמו נשאר ישיר לפייסבוק (כדי שבנייד ייפתח באפליקציה), והספירה
 * נשלחת ברקע ב-sendBeacon. src = מיקום הכפתור (hero, guide-inline, popup...).
 */
/** שולח ספירת הקלקה ברקע. לשימוש גם מרכיבים שמחזיקים <a> משלהם. */
export function trackGroupClick(src: string) {
  try {
    const body = JSON.stringify({ src, page: window.location.pathname })
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
}: {
  src: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: () => void
  ariaLabel?: string
}) {
  function track() {
    trackGroupClick(src)
    onClick?.()
  }

  return (
    <a
      href={FB_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={style}
      aria-label={ariaLabel}
      data-group-src={src}
      onClick={track}
      onAuxClick={track}
    >
      {children}
    </a>
  )
}
