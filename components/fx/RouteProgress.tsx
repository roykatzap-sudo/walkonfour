'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * פס התקדמות עליון לניווט (כמו ביוטיוב/NProgress) - נותן משוב מיידי
 * ברגע הלחיצה על קישור פנימי, ומשלים כשהעמוד החדש נטען. הופך את
 * המעבר בין עמודים (במיוחד דינמיים: אירועים/פורום) להרגיש חלק וזריז.
 */
export function RouteProgress() {
  const pathname = usePathname()
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // התחלה: לחיצה על קישור פנימי שמוביל לנתיב אחר
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      const a = (e.target as HTMLElement)?.closest?.('a')
      if (!a) return
      const href = a.getAttribute('href')
      const target = a.getAttribute('target')
      if (!href || !href.startsWith('/') || target === '_blank') return
      // אותו עמוד / עוגן - לא מפעילים
      const path = href.split('#')[0].split('?')[0]
      if (!path || path === pathname) return
      if (doneTimer.current) clearTimeout(doneTimer.current)
      setState('loading')
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [pathname])

  // השלמה: כשהנתיב באמת השתנה
  useEffect(() => {
    setState((s) => (s === 'loading' ? 'done' : s))
    doneTimer.current = setTimeout(() => setState('idle'), 450)
    return () => {
      if (doneTimer.current) clearTimeout(doneTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <div className={`kv-progress kv-progress--${state}`} aria-hidden="true" />
}
