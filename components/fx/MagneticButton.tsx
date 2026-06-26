'use client'

import Link from 'next/link'
import { useRef } from 'react'

/** האם המשתמש ביקש להפחית תנועה (prefers-reduced-motion). בטוח ל-SSR. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * כפתור/לינק "מגנטי" שנמשך לכיוון העכבר.
 *
 * נגישות: המשיכה היא קישוט עכבר בלבד. הלינק/הכפתור נשארים אלמנט מקורי
 * (Link/button) ולכן ממוקדים וניתנים להפעלה במקלדת (Tab + Enter/Space)
 * בלי שום תלות באפקט. כשהאלמנט מקבל פוקוס מקלדת - או כשהמשתמש ביקש
 * להפחית תנועה - לא מחילים הזחה כלל ומאפסים את המיקום, כך שהפוקוס לעולם
 * אינו מוסט והכפתור נשאר במקומו.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 0.4,
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - (r.left + r.width / 2)) * strength
    const y = (e.clientY - (r.top + r.height / 2)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }
  function reset() {
    if (ref.current) ref.current.style.transform = 'translate(0,0)'
  }

  const common = {
    className: `magnetic ${className}`,
    onMouseMove: onMove,
    onMouseLeave: reset,
    // ניווט מקלדת: כשמגיעים בפוקוס מבטלים כל הזחה שנותרה מהעכבר,
    // כדי שהכפתור לא יזוז מתחת ל-focus ring.
    onFocus: reset,
    onBlur: reset,
  }

  if (href) {
    return (
      <Link href={href} ref={ref} {...common}>
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} onClick={onClick} {...common}>
      {children}
    </button>
  )
}
