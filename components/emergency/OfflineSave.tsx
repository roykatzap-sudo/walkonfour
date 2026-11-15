'use client'

import { useEffect, useState } from 'react'

/* "שמירה לשימוש בלי קליטה": רושם service worker שמוגבל לעמוד החירום בלבד,
   ושומר במכשיר את העמוד ואת הקבצים שהוא צריך. אחרי זה העמוד נפתח גם בשטח. */

type State = 'hidden' | 'idle' | 'saving' | 'saved' | 'error'

export function OfflineSave() {
  const [state, setState] = useState<State>('hidden')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('caches' in window)) return
    // אם העמוד כבר נשמר בעבר - מציגים את זה
    caches
      .has('kv-emergency-v1')
      .then((has) => (has ? caches.open('kv-emergency-v1').then((c) => c.match(`${location.origin}/emergency`)) : undefined))
      .then((hit) => setState(hit ? 'saved' : 'idle'))
      .catch(() => setState('idle'))
  }, [])

  async function save() {
    setState('saving')
    try {
      const reg = await navigator.serviceWorker.register('/sw-emergency.js', { scope: '/emergency' })
      const sw = reg.active ?? reg.waiting ?? reg.installing
      if (!sw) throw new Error('no worker')
      if (sw.state !== 'activated') {
        await new Promise<void>((resolve, reject) => {
          const t = window.setTimeout(() => reject(new Error('timeout')), 10000)
          sw.addEventListener('statechange', () => {
            if (sw.state === 'activated') {
              window.clearTimeout(t)
              resolve()
            }
          })
        })
      }
      // העמוד עצמו + כל קובץ מאותו דומיין שהעמוד טען (סגנונות, סקריפטים, גופנים)
      const urls = new Set<string>([`${location.origin}/emergency`])
      for (const e of performance.getEntriesByType('resource')) {
        if (e.name.startsWith(location.origin) && !e.name.includes('/api/')) urls.add(e.name)
      }
      const done = new Promise<number>((resolve, reject) => {
        const t = window.setTimeout(() => reject(new Error('timeout')), 20000)
        navigator.serviceWorker.addEventListener('message', function onMsg(ev) {
          if (ev.data?.type === 'precached') {
            window.clearTimeout(t)
            navigator.serviceWorker.removeEventListener('message', onMsg)
            resolve(Number(ev.data.saved) || 0)
          }
        })
      })
      sw.postMessage({ type: 'precache', urls: Array.from(urls) })
      const saved = await done
      setState(saved > 0 ? 'saved' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'hidden') return null

  return (
    <div className="no-print" style={{ margin: '0 0 22px', background: '#fff', border: '1px solid rgba(201,154,91,.35)', borderRadius: 16, padding: '16px 20px' }}>
      {state === 'saved' ? (
        <p role="status" style={{ margin: 0, fontSize: 16.5, lineHeight: 1.7, fontWeight: 700, color: '#1b7a43' }}>
          העמוד שמור במכשיר הזה, והוא ייפתח גם בלי קליטה. כדי למצוא אותו מהר, הוסיפו אותו למסך הבית או לסימניות.
        </p>
      ) : (
        <>
          <p style={{ margin: '0 0 10px', fontSize: 16.5, lineHeight: 1.7, color: '#3d342a' }}>
            יוצאים לטיול במקום בלי קליטה? אפשר לשמור את העמוד במכשיר, והוא ייפתח גם בלי אינטרנט.
          </p>
          <button
            type="button"
            onClick={save}
            disabled={state === 'saving'}
            style={{ minHeight: 50, padding: '0 24px', borderRadius: 999, border: 'none', cursor: 'pointer', font: 'inherit', fontSize: 16.5, fontWeight: 800, background: '#241a12', color: '#fff' }}
          >
            {state === 'saving' ? 'שומר...' : 'שמירה לשימוש בלי קליטה'}
          </button>
          <p role="status" aria-live="polite" style={{ margin: '8px 0 0', minHeight: 22, fontSize: 15.5, fontWeight: 700, color: '#7a2e1e' }}>
            {state === 'error' ? 'השמירה לא הצליחה בדפדפן הזה. אפשר במקום זה לצלם מסך או להדפיס את העמוד.' : ''}
          </p>
        </>
      )}
    </div>
  )
}
