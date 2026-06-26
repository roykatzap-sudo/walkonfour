'use client'

import { useEffect, useRef, useState } from 'react'

/** מונה שמתחיל לרוץ כשהוא נכנס למסך. */
export function Counter({ to, duration = 1800 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLElement>(null)
  const [val, setVal] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return
        obs.disconnect()
        // כיבוד prefers-reduced-motion - קפיצה ישירה לערך הסופי בלי ספירה מונפשת.
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduce) {
          setVal(to)
          return
        }
        // הגנה מפני קלט לא תקין - קפיצה ישירה לערך הסופי במקום אנימציה פגומה.
        if (!Number.isFinite(to) || to < 0 || duration <= 0) {
          setVal(to)
          return
        }
        const step = to / (duration / 16)
        let c = 0
        const tm = setInterval(() => {
          c += step
          if (c >= to) {
            setVal(to)
            clearInterval(tm)
          } else {
            setVal(Math.floor(c))
          }
        }, 16)
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return <em ref={ref}>{val.toLocaleString('he-IL')}</em>
}
