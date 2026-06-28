'use client'

import { useRef } from 'react'

/**
 * האם יש להפחית תנועה. בטוח ל-SSR.
 * מכבד גם את הגדרת מערכת ההפעלה (prefers-reduced-motion) וגם את מתג
 * "הפחתת תנועה" שבתפריט הנגישות באתר (data-reduce-motion / class על <html>).
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  if (!window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * כרטיס תלת-ממד שמגיב לעכבר (tilt + glare).
 * שימוש: <Tilt3D className="..."> <div className="lift-3d">תוכן</div> </Tilt3D>
 *
 * נגישות: האפקט הוא קישוט עכבר בלבד ולעולם אינו מעכב ניווט מקלדת/טאץ' -
 * הקישורים שבתוכו נשארים ממוקדים ולחיצים כרגיל. אם המשתמש ביקש להפחית
 * תנועה, מדלגים על חישוב ההטיה לגמרי.
 */
export function Tilt3D({
  children,
  className = '',
  max = 12,
  glare = true,
  style,
}: {
  children: React.ReactNode
  className?: string
  max?: number
  glare?: boolean
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)

  function onMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    const ry = (px - 0.5) * max * 2
    const rx = -(py - 0.5) * max * 2
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`
    el.style.setProperty('--g', glare ? '1' : '0')
    el.style.setProperty('--gx', `${px * 100}%`)
    el.style.setProperty('--gy', `${py * 100}%`)
  }
  function reset() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'rotateX(0) rotateY(0)'
    el.style.setProperty('--g', '0')
  }

  return (
    <div className="scene" style={style}>
      <div ref={ref} className={`tilt ${className}`} onMouseMove={onMove} onMouseLeave={reset}>
        <div className="tilt-inner">{children}</div>
        {glare && <span className="tilt-glare" aria-hidden />}
      </div>
    </div>
  )
}
