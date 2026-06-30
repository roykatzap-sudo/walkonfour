'use client'

import { useState, useEffect } from 'react'
import { AdminWaitlist } from './AdminWaitlist'
import { AdminSuggestions } from './AdminSuggestions'
import { AdminParkReports } from './AdminParkReports'

const LS_KEY = 'kv-admin-token'

const TABS = [
  { key: 'waitlist', label: 'רשימת המתנה', icon: '📋' },
  { key: 'suggestions', label: 'הצעות', icon: '💡' },
  { key: 'park-reports', label: 'דיווחי גינות', icon: '🌳' },
]

export function AdminDashboard() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('waitlist')

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem(LS_KEY)) {
      setAuthed(true)
    }
  }, [])

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
      const data = await res.json()
      if (!data.ok) {
        setErr('שם משתמש או סיסמה שגויים')
        return
      }
      localStorage.setItem(LS_KEY, data.token)
      setAuthed(true)
    } catch {
      setErr('שגיאת רשת, נסה שנית')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(LS_KEY)
    setAuthed(false)
    setUsername('')
    setPassword('')
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={login} style={{ width: '100%', maxWidth: 380, display: 'grid', gap: 14, background: '#fff', border: '1.5px solid rgba(201,154,91,.28)', borderRadius: 20, padding: '32px 28px', boxShadow: '0 4px 24px rgba(42,32,24,.07)' }}>
          <div style={{ textAlign: 'center', marginBottom: 4 }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>🐾</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>פאנל אדמין</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>כניסה למנהלים בלבד</p>
          </div>

          <div style={{ display: 'grid', gap: 10 }}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="שם משתמש"
              autoComplete="username"
              required
              style={{ padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15.5, outline: 'none', direction: 'ltr', textAlign: 'right' }}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              autoComplete="current-password"
              required
              style={{ padding: '13px 16px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 15.5, outline: 'none', direction: 'ltr', textAlign: 'right' }}
            />
          </div>

          {err && (
            <div role="alert" style={{ fontSize: 13.5, color: '#b04a3a', textAlign: 'center', background: '#fdf1ef', borderRadius: 8, padding: '8px 12px' }}>
              {err}
            </div>
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
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>פאנל ניהול</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>קהילה על ארבע</p>
        </div>
        <button type="button" onClick={logout} className="btn btn-ghost" style={{ fontSize: 13.5 }}>
          יציאה
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid rgba(201,154,91,.18)', paddingBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px',
              fontWeight: tab === t.key ? 900 : 600,
              fontSize: 15,
              color: tab === t.key ? 'var(--brand-dark)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2.5px solid var(--brand-dark)' : '2.5px solid transparent',
              cursor: 'pointer',
              marginBottom: -2,
              transition: 'color .15s, border-color .15s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ display: tab === 'waitlist' ? 'block' : 'none' }}>
        <AdminWaitlist />
      </div>
      <div style={{ display: tab === 'suggestions' ? 'block' : 'none' }}>
        <AdminSuggestions />
      </div>
      <div style={{ display: tab === 'park-reports' ? 'block' : 'none' }}>
        <AdminParkReports />
      </div>
    </div>
  )
}
