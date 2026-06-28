'use client'

import { useEffect, useState } from 'react'

export function Unsubscribe() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error' | 'badEmail'>('idle')

  // מילוי אוטומטי מהקישור במייל: /unsubscribe?email=...
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('email')
    if (p) setEmail(p)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setState('badEmail'); return }
    setState('sending')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setState(data.ok ? 'done' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '28px 22px' }}>
        <div style={{ fontSize: 38 }}>✓</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)', margin: '6px 0' }}>הוסרת מרשימת הדיוור</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          לא נשלח אליך עוד דיוור שיווקי. אם תרצה לחזור, אפשר להירשם שוב בכל עת.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card" style={{ display: 'grid', gap: 14, padding: '24px 22px', maxWidth: 460, margin: '0 auto' }}>
      <p style={{ fontSize: 15.5, color: '#5b4d3c', lineHeight: 1.6, margin: 0 }}>
        הזינו את כתובת המייל שלכם כדי להסיר אותה מרשימת הדיוור של קהילה על ארבע.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="האימייל שלכם"
        aria-label="כתובת אימייל"
        required
        style={{ padding: '14px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
      />
      <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16 }}>
        {state === 'sending' ? 'מסיר...' : 'הסירו אותי מהדיוור'}
      </button>
      {state === 'badEmail' && (
        <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>כתובת אימייל לא תקינה.</div>
      )}
      {state === 'error' && (
        <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>משהו השתבש. נסו שוב בעוד רגע.</div>
      )}
    </form>
  )
}
