'use client'

import { useEffect } from 'react'

/**
 * האם יש להפחית תנועה. מכבד גם את הגדרת מערכת ההפעלה (prefers-reduced-motion)
 * וגם את מתג "הפחתת תנועה" שבתפריט הנגישות באתר (data-reduce-motion / class על <html>).
 */
function reduceMotionActive(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * פיצוץ כפות קטן בכל לחיצה על כפתור ראשי / CTA - אפקט "פופ" משמח.
 * גלובלי: מאזין ל-pointerdown, לא דורש לגעת בכפתורים.
 * מכבד הפחתת-תנועה (הגדרת מערכת + מתג נגישות) ונבדק בכל לחיצה כדי שמתג
 * הנגישות ישפיע מיד, בלי צורך ברענון העמוד.
 */
export function ClickBurst() {
  useEffect(() => {
    const PAWS = ['🐾', '🐾', '🐾', '✨', '🦴']

    function onDown(e: PointerEvent) {
      if (reduceMotionActive()) return
      const t = e.target as HTMLElement
      // רק על כפתורי פעולה - לא על כל קליק בעמוד
      if (!t.closest('.btn-primary, .hbm, .pc-fill, .kv-nav-btn, .gc-btn, .ev-btn, .live-pop, .magnetic')) return

      const n = 6
      for (let i = 0; i < n; i++) {
        const span = document.createElement('span')
        span.className = 'paw-burst'
        span.textContent = PAWS[Math.floor(Math.random() * PAWS.length)]
        const angle = (Math.PI * 2 * i) / n + Math.random() * 0.6
        const dist = 34 + Math.random() * 30
        span.style.left = e.clientX + 'px'
        span.style.top = e.clientY + 'px'
        span.style.setProperty('--dx', Math.cos(angle) * dist + 'px')
        span.style.setProperty('--dy', (Math.sin(angle) * dist - 18) + 'px')
        span.style.setProperty('--rot', (Math.random() * 120 - 60) + 'deg')
        span.style.fontSize = 12 + Math.random() * 10 + 'px'
        document.body.appendChild(span)
        span.addEventListener('animationend', () => span.remove(), { once: true })
      }
    }

    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [])

  return null
}
