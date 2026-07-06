'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * כלב חמוד שחוצה את תחתית המסך מדי פעם (easter-egg חתום).
 * - מופיע כל ~35-70 שניות, גזע (אמוג'י) וכיוון מתחלפים.
 * - "טרוט" עם bob של הליכה (translateY), חוצה ב-translateX (GPU בלבד).
 * - אפשר ללחוץ עליו כדי "ללטף" - עפים לבבות והוא מכשכש בזנב.
 * - מכבד prefers-reduced-motion וגם את מתג הנגישות באתר (לא רץ בכלל).
 * - pointer-events: none על השכבה; רק הכלב עצמו לחיץ. לא חוסם כלום.
 */

const DOGS = ['🐕', '🐩', '🦮', '🐕‍🦺']

type Cross = { id: number; dog: string; dir: 1 | -1; top: number }
type Heart = { id: number; x: number; y: number; emoji: string }

function motionOff(): boolean {
  if (typeof window === 'undefined') return true
  const el = document.documentElement
  if (el.classList.contains('kv-a11y-reduce-motion')) return true
  if (el.getAttribute('data-reduce-motion') === '1') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const CROSS_MS = 11000 // משך חציית מסך אחת

export function WanderingDog() {
  const [cross, setCross] = useState<Cross | null>(null)
  const [petting, setPetting] = useState(false)
  const [hearts, setHearts] = useState<Heart[]>([])
  const seq = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (motionOff()) return
    let alive = true

    const schedule = (delay: number) => {
      const t = window.setTimeout(() => {
        if (!alive) return
        seq.current += 1
        const dog = DOGS[Math.floor(Math.random() * DOGS.length)]
        const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
        const top = 8 + Math.random() * 26 // מרחק קטן מהתחתית
        setCross({ id: seq.current, dog, dir, top })
        // מסירים בסוף החצייה, ואז קובעים את ההופעה הבאה
        const clear = window.setTimeout(() => {
          if (!alive) return
          setCross(null)
          schedule(35000 + Math.random() * 35000) // 35-70ש עד הבא
        }, CROSS_MS)
        timers.current.push(clear)
      }, delay)
      timers.current.push(t)
    }

    schedule(7000 + Math.random() * 5000) // ראשון אחרי ~7-12ש
    return () => {
      alive = false
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [])

  function pet(e: React.MouseEvent) {
    setPetting(true)
    window.setTimeout(() => setPetting(false), 700)
    const base = seq.current * 10
    const emojis = ['💛', '🐾', '💛']
    const burst: Heart[] = emojis.map((emoji, i) => ({
      id: base + i,
      x: e.clientX + (i - 1) * 16,
      y: e.clientY - 8,
      emoji,
    }))
    setHearts((h) => [...h, ...burst])
    window.setTimeout(() => {
      setHearts((h) => h.filter((x) => !burst.some((b) => b.id === x.id)))
    }, 950)
  }

  return (
    <>
      {cross && (
        <div className="wdog-layer" aria-hidden="true">
          <div
            key={cross.id}
            className="wdog-run"
            style={{ bottom: cross.top, ['--wdir' as string]: cross.dir }}
          >
            <button
              type="button"
              className={`wdog-hit${petting ? ' pet' : ''}`}
              aria-label="ללטף את הכלב"
              onClick={pet}
            >
              <span className="wdog-bob" style={{ transform: cross.dir === 1 ? 'scaleX(-1)' : 'none' }}>
                {cross.dog}
              </span>
            </button>
          </div>
        </div>
      )}

      {hearts.length > 0 && (
        <div className="wdog-hearts" aria-hidden="true">
          {hearts.map((h) => (
            <span key={h.id} style={{ left: h.x, top: h.y }}>{h.emoji}</span>
          ))}
        </div>
      )}

      <style jsx global>{`
        .wdog-layer {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 900;
          overflow: hidden;
        }
        .wdog-run {
          position: absolute;
          left: 0;
          /* נכנס מחוץ למסך בצד אחד ויוצא בצד השני. --wdir: 1 => שמאל→ימין, -1 => ימין→שמאל */
          animation: wdog-cross ${CROSS_MS}ms linear both;
        }
        /* כיוון: מכפילים את ההיסט ב---wdir דרך שני keyframes נפרדים */
        .wdog-run { will-change: transform; }
        @keyframes wdog-cross {
          from { transform: translateX(calc(var(--wdir) * -112vw)); }
          to   { transform: translateX(calc(var(--wdir) * 112vw)); }
        }
        .wdog-hit {
          pointer-events: auto;
          background: none;
          border: none;
          padding: 6px;
          cursor: pointer;
          line-height: 1;
        }
        .wdog-bob {
          display: inline-block;
          font-size: 40px;
          filter: drop-shadow(0 6px 6px rgba(42, 32, 24, 0.25));
          animation: wdog-bob 0.42s ease-in-out infinite alternate;
        }
        @keyframes wdog-bob {
          from { translate: 0 0; }
          to   { translate: 0 -7px; }
        }
        .wdog-hit.pet .wdog-bob {
          animation: wdog-wag 0.22s ease-in-out 3;
        }
        @keyframes wdog-wag {
          0%, 100% { rotate: 0deg; }
          25% { rotate: -12deg; }
          75% { rotate: 12deg; }
        }
        .wdog-hearts {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1250;
        }
        .wdog-hearts span {
          position: fixed;
          font-size: 22px;
          animation: wdog-heart 0.95s ease-out forwards;
        }
        @keyframes wdog-heart {
          from { opacity: 0; transform: translateY(0) scale(0.6); }
          20%  { opacity: 1; }
          to   { opacity: 0; transform: translateY(-46px) scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .wdog-layer, .wdog-hearts { display: none; }
        }
        html.kv-a11y-reduce-motion .wdog-layer,
        html[data-reduce-motion='1'] .wdog-layer,
        html.kv-a11y-reduce-motion .wdog-hearts,
        html[data-reduce-motion='1'] .wdog-hearts { display: none; }
      `}</style>
    </>
  )
}
