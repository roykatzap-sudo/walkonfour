'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * שובל כפות עדין שרץ אחרי העכבר בזמן תנועה (דסקטופ בלבד).
 * כפה נשמטת כל ~115px תנועה, דוהה ומתכווצת. מוגבל ל-14 אחרונות (ביצועים).
 * לא רץ במובייל (pointer: coarse) ולא ב-reduced-motion / מתג הנגישות.
 */
type Paw = { id: number; x: number; y: number; r: number }

export function PawTrail() {
  const [paws, setPaws] = useState<Paw[]>([])
  const st = useRef({ x: 0, y: 0, seq: 0 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const el = document.documentElement
    const reduce =
      el.classList.contains('kv-a11y-reduce-motion') ||
      el.getAttribute('data-reduce-motion') === '1' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    if (!window.matchMedia('(pointer: fine)').matches) return // דסקטופ בלבד

    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - st.current.x
      const dy = e.clientY - st.current.y
      if (dx * dx + dy * dy < 115 * 115) return
      st.current.x = e.clientX
      st.current.y = e.clientY
      st.current.seq += 1
      const id = st.current.seq
      const r = Math.random() * 46 - 23
      setPaws((p) => [...p.slice(-13), { id, x: e.clientX, y: e.clientY, r }])
      window.setTimeout(() => setPaws((p) => p.filter((z) => z.id !== id)), 760)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="pawtrail" aria-hidden="true">
      {paws.map((p) => (
        <span key={p.id} style={{ left: p.x, top: p.y, ['--pr' as string]: `${p.r}deg` }}>🐾</span>
      ))}
      <style jsx global>{`
        .pawtrail { position: fixed; inset: 0; pointer-events: none; z-index: 850; }
        .pawtrail span {
          position: fixed;
          font-size: 17px;
          color: #c99a5b;
          transform: translate(-50%, -50%) rotate(var(--pr));
          animation: pawfade 0.76s ease-out forwards;
        }
        @keyframes pawfade {
          from { opacity: 0.5; }
          to { opacity: 0; transform: translate(-50%, -50%) rotate(var(--pr)) scale(0.5); }
        }
        @media (pointer: coarse) { .pawtrail { display: none; } }
        @media (prefers-reduced-motion: reduce) { .pawtrail { display: none; } }
        html.kv-a11y-reduce-motion .pawtrail,
        html[data-reduce-motion='1'] .pawtrail { display: none; }
      `}</style>
    </div>
  )
}
