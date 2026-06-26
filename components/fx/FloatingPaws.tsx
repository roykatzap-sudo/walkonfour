'use client'

/**
 * שכבת קישוט - אמוג'ים/כפות שמרחפים ברקע של סקשן.
 * הצב בתוך אלמנט עם position:relative.
 */
const ITEMS = [
  { e: '🐾', top: '12%', left: '8%', size: 38, dur: 8 },
  { e: '🦴', top: '70%', left: '14%', size: 30, dur: 10 },
  { e: '🐕', top: '22%', left: '82%', size: 44, dur: 9 },
  { e: '🐾', top: '60%', left: '88%', size: 34, dur: 11 },
  { e: '🦴', top: '40%', left: '46%', size: 26, dur: 7 },
  { e: '🐶', top: '82%', left: '60%', size: 36, dur: 12 },
  { e: '🐾', top: '8%', left: '52%', size: 28, dur: 9 },
]

export function FloatingPaws({ className = '' }: { className?: string }) {
  return (
    <div className={`paws-layer ${className}`} aria-hidden>
      {ITEMS.map((it, i) => (
        <span
          key={i}
          style={{
            top: it.top,
            left: it.left,
            fontSize: it.size,
            animationDuration: `${it.dur}s`,
            animationDelay: `${i * 0.6}s`,
          }}
        >
          {it.e}
        </span>
      ))}
    </div>
  )
}
