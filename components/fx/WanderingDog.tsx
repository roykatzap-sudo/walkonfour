'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * כלבים שעוברים על המסך מדי פעם (easter-egg חתום, אקטיבי).
 * - חוצים את תחתית המסך, לפעמים בלהקה של 2-3 (~כל 15-33ש).
 * - מדי פעם כלב מציץ מהתחתית ומתחבא.
 * - לחיצה על כלב = ליטוף: עפים לבבות, הוא מכשכש בזנב, ונביחה קלילה (Web Audio).
 * - GPU בלבד, שכבה שקופה ללחיצות (רק הכלב לחיץ), מכבד reduced-motion + מתג הנגישות.
 */

const DOGS = ['🐕', '🐩', '🦮', '🐕‍🦺']
type Cross = { id: number; dog: string; dir: 1 | -1; top: number }
type Heart = { id: number; x: number; y: number; emoji: string }
type Peek = { id: number; dog: string; left: number }

function motionOff(): boolean {
  if (typeof window === 'undefined') return true
  const el = document.documentElement
  if (el.classList.contains('kv-a11y-reduce-motion')) return true
  if (el.getAttribute('data-reduce-motion') === '1') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** נביחה קצרה ורכה מסונתזת (Web Audio) - רק בעקבות לחיצה (מחווה של המשתמש). */
function bark() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AC()
    const now = ctx.currentTime
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'triangle'
    o.frequency.setValueAtTime(330, now)
    o.frequency.exponentialRampToValueAtTime(150, now + 0.13)
    g.gain.setValueAtTime(0.0001, now)
    g.gain.exponentialRampToValueAtTime(0.16, now + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.19)
    o.connect(g)
    g.connect(ctx.destination)
    o.start(now)
    o.stop(now + 0.2)
    o.onended = () => ctx.close()
  } catch {
    /* אודיו חסום/לא נתמך - מתעלמים בשקט */
  }
}

const CROSS_MS = 9000

export function WanderingDog() {
  const [crosses, setCrosses] = useState<Cross[]>([])
  const [peek, setPeek] = useState<Peek | null>(null)
  const [petting, setPetting] = useState(false)
  const [hearts, setHearts] = useState<Heart[]>([])
  const seq = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (motionOff()) return
    let alive = true
    const push = (t: number) => timers.current.push(t)

    const addCross = (dir: 1 | -1) => {
      if (!alive) return
      seq.current += 1
      const id = seq.current
      const dog = DOGS[Math.floor(Math.random() * DOGS.length)]
      const top = 12 + Math.random() * 46
      setCrosses((c) => [...c, { id, dog, dir, top }])
      push(window.setTimeout(() => { if (alive) setCrosses((c) => c.filter((x) => x.id !== id)) }, CROSS_MS))
    }

    const runPack = () => {
      if (!alive) return
      const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1
      // 35% מהפעמים להקה של 2-3 כלבים באותו כיוון, בהיסט קטן
      const size = Math.random() < 0.35 ? 2 + Math.floor(Math.random() * 2) : 1
      for (let i = 0; i < size; i++) push(window.setTimeout(() => addCross(dir), i * 650))
      const lastStart = (size - 1) * 650
      push(window.setTimeout(runPack, lastStart + CROSS_MS + 15000 + Math.random() * 18000))
    }
    push(window.setTimeout(runPack, 4000 + Math.random() * 4000))

    const runPeek = () => {
      if (!alive) return
      seq.current += 1
      const id = seq.current
      setPeek({ id, dog: '🐶', left: 8 + Math.random() * 82 })
      push(window.setTimeout(() => { if (alive) setPeek((p) => (p && p.id === id ? null : p)) }, 2600))
      push(window.setTimeout(runPeek, 20000 + Math.random() * 24000))
    }
    push(window.setTimeout(runPeek, 11000 + Math.random() * 9000))

    return () => {
      alive = false
      timers.current.forEach((t) => window.clearTimeout(t))
      timers.current = []
    }
  }, [])

  function petAt(clientX: number, clientY: number) {
    setPetting(true)
    window.setTimeout(() => setPetting(false), 700)
    bark()
    seq.current += 1
    const base = seq.current * 3
    const emojis = ['💛', '🐾', '💛']
    const burst: Heart[] = emojis.map((emoji, i) => ({ id: base + i, x: clientX + (i - 1) * 16, y: clientY - 8, emoji }))
    setHearts((h) => [...h, ...burst])
    window.setTimeout(() => setHearts((h) => h.filter((x) => !burst.some((b) => b.id === x.id))), 950)
  }

  return (
    <>
      {crosses.length > 0 && (
        <div className="wdog-layer" aria-hidden="true">
          {crosses.map((c) => (
            <div key={c.id} className="wdog-run" style={{ bottom: c.top, ['--wdir' as string]: c.dir }}>
              <button type="button" className={`wdog-hit${petting ? ' pet' : ''}`} aria-label="ללטף את הכלב" onClick={(e) => petAt(e.clientX, e.clientY)}>
                <span className="wdog-bob" style={{ transform: c.dir === 1 ? 'scaleX(-1)' : 'none' }}>{c.dog}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {peek && (
        <div className="wdog-peek-layer" aria-hidden="true">
          <button type="button" className={`wdog-peek${petting ? ' pet' : ''}`} style={{ left: `${peek.left}vw` }} aria-label="ללטף את הכלב" onClick={(e) => petAt(e.clientX, e.clientY)}>
            <span className="wdog-peek-em">{peek.dog}</span>
          </button>
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
        .wdog-layer { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; }
        .wdog-run { position: absolute; left: 0; will-change: transform; animation: wdog-cross ${CROSS_MS}ms linear both; }
        @keyframes wdog-cross {
          from { transform: translateX(calc(var(--wdir) * -112vw)); }
          to   { transform: translateX(calc(var(--wdir) * 112vw)); }
        }
        .wdog-hit { pointer-events: auto; background: none; border: none; padding: 6px; cursor: pointer; line-height: 1; }
        .wdog-bob {
          display: inline-block;
          font-size: clamp(58px, 9vw, 84px);
          filter: drop-shadow(0 9px 9px rgba(42, 32, 24, 0.3));
          animation: wdog-bob 0.34s ease-in-out infinite alternate;
        }
        @keyframes wdog-bob { from { translate: 0 0; } to { translate: 0 -14px; } }
        .wdog-hit.pet .wdog-bob { animation: wdog-wag 0.22s ease-in-out 3; }
        @keyframes wdog-wag { 0%, 100% { rotate: 0deg; } 25% { rotate: -12deg; } 75% { rotate: 12deg; } }

        .wdog-peek-layer { position: fixed; inset: 0; pointer-events: none; z-index: 900; overflow: hidden; }
        .wdog-peek {
          position: fixed; bottom: 0; pointer-events: auto;
          background: none; border: none; padding: 0; cursor: pointer;
          animation: wdog-peek-in 2.6s ease-in-out both;
        }
        .wdog-peek-em { display: block; font-size: clamp(56px, 9vw, 82px); filter: drop-shadow(0 -6px 8px rgba(42, 32, 24, 0.25)); }
        @keyframes wdog-peek-in {
          0% { transform: translateY(100%); }
          16% { transform: translateY(4%); }
          28% { transform: translateY(0); }
          72% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        .wdog-peek.pet .wdog-peek-em { animation: wdog-wag 0.22s ease-in-out 3; }

        .wdog-hearts { position: fixed; inset: 0; pointer-events: none; z-index: 1250; }
        .wdog-hearts span { position: fixed; font-size: 22px; animation: wdog-heart 0.95s ease-out forwards; }
        @keyframes wdog-heart {
          from { opacity: 0; transform: translateY(0) scale(0.6); }
          20% { opacity: 1; }
          to { opacity: 0; transform: translateY(-46px) scale(1.15); }
        }

        @media (prefers-reduced-motion: reduce) { .wdog-layer, .wdog-peek-layer, .wdog-hearts { display: none; } }
        html.kv-a11y-reduce-motion .wdog-layer, html[data-reduce-motion='1'] .wdog-layer,
        html.kv-a11y-reduce-motion .wdog-peek-layer, html[data-reduce-motion='1'] .wdog-peek-layer,
        html.kv-a11y-reduce-motion .wdog-hearts, html[data-reduce-motion='1'] .wdog-hearts { display: none; }
      `}</style>
    </>
  )
}
