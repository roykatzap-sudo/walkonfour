'use client'

import { useEffect, useRef } from 'react'

/**
 * האם יש להפחית תנועה. מכבד גם את הגדרת מערכת ההפעלה (prefers-reduced-motion)
 * וגם את מתג "הפחתת תנועה" שבתפריט הנגישות באתר (data-reduce-motion / class על <html>).
 */
function reduceMotionActive(): boolean {
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * סמן כף-רגל של כלב 🐾 - קל מאוד: רק transform על תזוזת עכבר, בלי rAF ובלי קנבס.
 * נטען רק בדסקטופ עם עכבר. בזום (pinch) מחזיר את סמן המערכת כדי שלעולם לא ייעלם.
 * מכבד הפחתת-תנועה (מערכת + מתג נגישות) ומדליק/מכבה בזמן אמת.
 */
export function CursorFX() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    let teardown: (() => void) | null = null

    // הפעלת סמן כף-הרגל העוקב. מופרד לפונקציה כדי שנוכל להדליק/לכבות
    // בתגובה לשינוי מתג "הפחתת תנועה" בזמן אמת.
    function enable() {
      if (teardown) return
      teardown = start()
    }
    function disable() {
      if (teardown) {
        teardown()
        teardown = null
      }
    }
    function sync() {
      if (reduceMotionActive()) disable()
      else enable()
    }

    // מאזינים לשינוי מתג הנגישות (class / data-attr על <html>) ולשינוי הגדרת המערכת.
    const mo = new MutationObserver(sync)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-reduce-motion'] })
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => sync()
    mq.addEventListener?.('change', onMq)

    sync()

    return () => {
      mo.disconnect()
      mq.removeEventListener?.('change', onMq)
      disable()
    }
  }, [])

  function start(): () => void {
    document.body.classList.add('kv-paw-on')
    const cursor = cursorRef.current!
    let ready = false

    const onMove = (e: PointerEvent) => {
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      if (!ready) {
        ready = true
        cursor.classList.add('ready')
      }
      cursor.classList.remove('hidden')
    }
    const onOver = (e: Event) => {
      const t = e.target as HTMLElement
      cursor.classList.toggle(
        'hover',
        !!t.closest('a,button,input,textarea,select,[role="button"],.gc,.ev,.pc,.feat-row,.pg-item,.flip,.tilt')
      )
    }
    const onDown = () => cursor.classList.add('down')
    const onUp = () => cursor.classList.remove('down')
    const onLeave = () => cursor.classList.add('hidden')

    document.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('pointerleave', onLeave)

    // זיהוי זום (pinch) - מחזיר סמן מערכת כדי שלא ייעלם
    const vv = window.visualViewport
    const onZoom = () => {
      const zoomed = !!vv && vv.scale > 1.01
      document.body.classList.toggle('kv-zoomed', zoomed)
      cursor.classList.toggle('hidden', zoomed)
    }
    if (vv) {
      vv.addEventListener('resize', onZoom)
      vv.addEventListener('scroll', onZoom)
    }

    return () => {
      document.body.classList.remove('kv-paw-on', 'kv-zoomed')
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.removeEventListener('pointerleave', onLeave)
      if (vv) {
        vv.removeEventListener('resize', onZoom)
        vv.removeEventListener('scroll', onZoom)
      }
    }
  }

  return (
    <div className="kv-cursor" ref={cursorRef} aria-hidden>
      <div className="kv-cursor-inner">
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="16" cy="22" rx="7.5" ry="6.5" />
          <ellipse cx="6.5" cy="14" rx="3" ry="4" />
          <ellipse cx="12.5" cy="9" rx="3" ry="4.5" />
          <ellipse cx="19.5" cy="9" rx="3" ry="4.5" />
          <ellipse cx="25.5" cy="14" rx="3" ry="4" />
        </svg>
      </div>
    </div>
  )
}
