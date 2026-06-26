'use client'

import { createElement, useEffect, useRef, useState } from 'react'

/** האם המשתמש ביקש להפחית תנועה (prefers-reduced-motion). בטוח ל-SSR. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
  delay?: 1 | 2 | 3 | 4
  as?: 'div' | 'section' | 'span' | 'li'
}

/** חשיפה בגלילה עם כניסה תלת-ממדית (rotateX). */
export function Reveal3D({ children, delay, className = '', as = 'div', ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    // הפחתת תנועה: מציגים מיד בלי IntersectionObserver כדי לחסוך עבודה ולכבד את ההעדפה.
    if (!el || prefersReducedMotion()) {
      setShow(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return createElement(
    as,
    {
      ...rest,
      ref,
      className: `rv3d${delay ? ` d${delay}` : ''}${show ? ' in' : ''} ${className}`.trim(),
    },
    children
  )
}
