'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

// גוזר סוג ברירת-מחדל מהעמוד שממנו מציעים (האדמין יכול לראות גם את העמוד עצמו).
function typeForPath(path: string): string {
  if (path.startsWith('/breeds') || path.startsWith('/articles')) return 'breed'
  if (path.startsWith('/walks')) return 'route'
  if (path.startsWith('/map') || path.startsWith('/city') || path.startsWith('/cities') || path.startsWith('/community')) return 'park'
  return 'general'
}

// בעמודים האלה כבר יש מנגנון הצעה ייעודי/לא רלוונטי - לא מציגים את הכפתור הצף.
// במפה (/map) - כי יש שם כפתור "דווח על גינה חסרה" + כדי לא לכסות את המפה.
// בקהילה (/community) - חוויית הקהילה הסגורה לא צריכה כפתור הצעה כללי.
const HIDE_ON = ['/admin', '/unsubscribe', '/privacy', '/terms', '/map', '/community']

export function GlobalSuggest() {
  const pathname = usePathname() || '/'
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'soon'>('idle')
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending' || !name.trim()) return
    setState('sending')
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, type: typeForPath(pathname), name, details }),
      })
      const data = await res.json()
      if (data.ok) setState('done')
      else if (data.configured === false) setState('soon')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  function reset() {
    setOpen(false)
    setTimeout(() => { setName(''); setDetails(''); setState('idle') }, 200)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="הצעה לתוספת לאתר"
        style={{
          position: 'fixed', bottom: 18, insetInlineEnd: 18, zIndex: 600,
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'var(--brand)', color: '#fff', border: 'none',
          borderRadius: 999, padding: '11px 18px', fontSize: 15, fontWeight: 800,
          fontFamily: 'inherit', cursor: 'pointer', boxShadow: '0 8px 24px rgba(201,154,91,.45)',
        }}
      >
        <span aria-hidden="true">💡</span> יש לכם הצעה?
      </button>

      {open && (
        <div
          role="dialog" aria-modal="true" aria-label="הצעה לתוספת"
          onClick={reset}
          style={{ position: 'fixed', inset: 0, zIndex: 12000, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(42,32,24,.55)', backdropFilter: 'blur(4px)' }}
        >
          <div onClick={(e) => e.stopPropagation()} className="card" style={{ width: 'min(440px, 100%)', padding: '26px 22px', position: 'relative' }}>
            <button ref={closeRef} type="button" onClick={reset} aria-label="סגירה" style={{ position: 'absolute', top: 12, insetInlineEnd: 12, background: 'none', border: 'none', fontSize: 22, color: '#8a7c66', cursor: 'pointer', lineHeight: 1 }}>✕</button>

            {state === 'done' ? (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{ fontSize: 38 }}>🐾</div>
                <div style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', marginTop: 4 }}>תודה! ההצעה התקבלה</div>
                <p style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>נעבור עליה ונוסיף אם היא מתאימה.</p>
                <button type="button" onClick={reset} className="btn btn-ghost" style={{ marginTop: 16 }}>סגירה</button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
                <div>
                  <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>יש לכם הצעה?</h2>
                  <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: '6px 0 0', lineHeight: 1.55 }}>
                    חסר גזע, גינה, מסלול או כל דבר אחר? ספרו לנו ונוסיף.
                  </p>
                </div>
                <input
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="מה תרצו שנוסיף?" aria-label="ההצעה" required maxLength={80}
                  style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
                />
                <textarea
                  value={details} onChange={(e) => setDetails(e.target.value)}
                  placeholder="פרטים (לא חובה)" aria-label="פרטים" maxLength={500} rows={3}
                  style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, fontFamily: 'inherit', resize: 'vertical' }}
                />
                <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16 }}>
                  {state === 'sending' ? 'שולח...' : 'שליחת הצעה'}
                </button>
                {state === 'soon' && <div role="status" style={{ fontSize: 13.5, color: '#8a6d3b', textAlign: 'center' }}>התכונה נפתחת בקרוב 🐾</div>}
                {state === 'error' && <div role="alert" style={{ fontSize: 13.5, color: '#a23c2e', textAlign: 'center' }}>משהו השתבש. נסו שוב.</div>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
