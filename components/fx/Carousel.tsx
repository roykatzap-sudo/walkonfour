'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * קרוסלה אופקית חלקה - scroll-snap, חצי ניווט, גרירה בעכבר, דהיית קצוות.
 * RTL-aware ונגישה (role/aria, ניווט מקלדת). מכבדת prefers-reduced-motion.
 * הילדים הם הסליידים; הקורא מספק את הכרטיסים.
 */
export function Carousel({
  children,
  ariaLabel = 'קרוסלה',
  itemMinWidth = 280,
}: {
  children: React.ReactNode
  ariaLabel?: string
  itemMinWidth?: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const update = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    // ב-RTL scrollLeft יכול להיות שלילי - מנרמלים לערך מוחלט.
    const max = el.scrollWidth - el.clientWidth
    const pos = Math.abs(el.scrollLeft)
    setAtStart(pos < 8)
    setAtEnd(pos > max - 8)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  function scrollByDir(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const amount = Math.max(el.clientWidth * 0.8, itemMinWidth + 16)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  // גרירה בעכבר (desktop) - תחושת "תפיסה"
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    let down = false, startX = 0, startScroll = 0, moved = false
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      down = true; moved = false; startX = e.clientX; startScroll = el.scrollLeft
      el.classList.add('kv-carousel-grabbing')
    }
    const onMove = (e: PointerEvent) => {
      if (!down) return
      const dx = e.clientX - startX
      if (Math.abs(dx) > 4) moved = true
      el.scrollLeft = startScroll - dx
    }
    const onUp = () => { down = false; el.classList.remove('kv-carousel-grabbing') }
    // מניעת קליק בטעות אחרי גרירה
    const onClickCapture = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation() } }
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('click', onClickCapture, true)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  return (
    <div className="kv-carousel" role="region" aria-label={ariaLabel}>
      <button
        type="button"
        className={`kv-carousel-arrow start${atStart ? ' hidden' : ''}`}
        aria-label="הקודם"
        onClick={() => scrollByDir(1)}
      >
        <span aria-hidden="true">›</span>
      </button>

      <div
        ref={trackRef}
        className="kv-carousel-track"
        style={{ ['--item-min' as string]: `${itemMinWidth}px` }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') scrollByDir(1)
          if (e.key === 'ArrowLeft') scrollByDir(-1)
        }}
      >
        {children}
      </div>

      <button
        type="button"
        className={`kv-carousel-arrow end${atEnd ? ' hidden' : ''}`}
        aria-label="הבא"
        onClick={() => scrollByDir(-1)}
      >
        <span aria-hidden="true">‹</span>
      </button>
    </div>
  )
}
