'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * שער כניסה לאדמין מבוסס עוגייה חתומה httpOnly.
 * אין שמירת טוקן ב-localStorage (עמיד ל-XSS). הכניסה מנפיקה עוגייה
 * בשרת, וכל קריאות ה-API נושאות אותה אוטומטית (same-origin).
 */
export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null) // null = בודק
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const check = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/me', { cache: 'no-store' })
      const data = await res.json()
      setAuthed(Boolean(data.ok))
    } catch {
      setAuthed(false)
    }
  }, [])

  useEffect(() => { check() }, [check])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (res.status === 429) { setErr('יותר מדי ניסיונות. נסו שוב בעוד רבע שעה.'); return }
      const data = await res.json()
      if (!data.ok) { setErr('שם משתמש או סיסמה שגויים'); return }
      setPassword('')
      await check()
    } catch {
      setErr('שגיאת רשת, נסו שנית')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setAuthed(false)
    setUsername('')
    setPassword('')
  }

  if (authed === null) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>טוען…</div>
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '55vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={login} style={{ width: '100%', maxWidth: 380, display: 'grid', gap: 14, background: '#fff', border: '1.5px solid rgba(201,154,91,.28)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(42,32,24,.07)' }}>
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🐾</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>פאנל אדמין</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>כניסה למנהלים בלבד</p>
          </div>
          <input
            type="text" value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="שם משתמש" autoComplete="username" required
            style={{ padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15.5, outline: 'none', direction: 'ltr', textAlign: 'right' }}
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה" autoComplete="current-password" required
            style={{ padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15.5, outline: 'none', direction: 'ltr', textAlign: 'right' }}
          />
          {err && (
            <div role="alert" style={{ fontSize: 13.5, color: '#b04a3a', textAlign: 'center', background: '#fdf1ef', borderRadius: 8, padding: '8px 12px' }}>{err}</div>
          )}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ fontSize: 16, padding: '13px 0' }}>
            {loading ? 'מתחבר…' : 'כניסה'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" onClick={logout} className="btn btn-ghost" style={{ fontSize: 13.5 }}>יציאה</button>
      </div>
      {children}
    </div>
  )
}
