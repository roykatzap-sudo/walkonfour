'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * מונה מתגלגל: מנפיש מספר מהערך הקודם אל היעד החדש בכל שינוי.
 * נותן ל"פרס" (התוצאה) תחושת התגלגלות מספקת בלי תלות חיצונית.
 *
 * מכבד prefers-reduced-motion: אם המשתמש ביקש פחות תנועה,
 * הערך קופץ מיד ליעד בלי אנימציה.
 *
 * @param target  ערך היעד להצגה
 * @param opts.duration  משך האנימציה במילישניות (ברירת מחדל 650)
 * @param opts.decimals  ספרות אחרי הנקודה (ברירת מחדל 0)
 */
export function useCountUp(
  target: number,
  opts: { duration?: number; decimals?: number } = {},
): number {
  const { duration = 650, decimals = 0 } = opts
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | null>(null)
  const factor = Math.pow(10, decimals)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const from = fromRef.current
    const to = target

    // ללא תנועה, או ללא שינוי ממשי - קופצים מיד ליעד.
    if (prefersReduced || from === to || duration <= 0) {
      fromRef.current = to
      setDisplay(to)
      return
    }

    const start = performance.now()
    // easeOutCubic - מהיר בהתחלה, מתרכך לקראת הסוף (תחושת "נחיתה" רכה).
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)

    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const value = from + (to - from) * ease(t)
      setDisplay(Math.round(value * factor) / factor)
      if (t < 1) {
        rafRef.current = requestAnimationFrame(frame)
      } else {
        fromRef.current = to
      }
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, factor])

  return display
}
