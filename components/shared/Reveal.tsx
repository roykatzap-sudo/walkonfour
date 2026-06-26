'use client'

import { useEffect, useRef, useState } from 'react'

/** עוטף תוכן באנימציית reveal בגלילה (כמו .r ב-HTML המקורי). */
export function Reveal({
  children,
  delay,
  className = '',
  as = 'div',
}: {
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4
  className?: string
  as?: 'div' | 'section' | 'span'
}) {
  const ref = useRef<HTMLElement>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // כיבוד prefers-reduced-motion - מציגים מיד בלי אנימציית reveal בגלילה.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOn(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOn(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cls = `r${delay ? ` d${delay}` : ''}${on ? ' on' : ''} ${className}`.trim()
  const Tag = as as any
  return (
    <Tag ref={ref} className={cls}>
      {children}
    </Tag>
  )
}
