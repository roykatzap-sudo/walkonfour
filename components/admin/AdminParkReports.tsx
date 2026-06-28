'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ParkReport } from '@/lib/parkReports'

const TABS: { key: string; label: string }[] = [
  { key: 'pending', label: 'ממתינים' },
  { key: 'approved', label: 'אושרו' },
  { key: 'rejected', label: 'נדחו' },
]

const LS_KEY = 'kv-admin-token'

export function AdminParkReports() {
  const [token, setToken] = useState('')
  const [input, setInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [tab, setTab] = useState('pending')
  const [reports, setReports] = useState<ParkReport[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null
    if (t) {
      setToken(t)
      setAuthed(true)
    }
  }, [])

  const load = useCallback(async (tk: string, status: string) => {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/park-reports?status=${status}`, { headers: { 'x-admin-token': tk } })
      const data = await res.json()
      if (data.configured === false) {
        setConfigured(false)
        setAuthed(false)
        return
      }
      if (res.status === 401) {
        setErr('טוקן שגוי')
        setAuthed(false)
        localStorage.removeItem(LS_KEY)
        return
      }
      setReports(data.reports || [])
      setAuthed(true)
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed && token) load(token, tab)
  }, [authed, token, tab, load])

  function submitToken(e: React.FormEvent) {
    e.preventDefault()
    const t = input.trim()
    if (!t) return
    localStorage.setItem(LS_KEY, t)
    setToken(t)
    setAuthed(true)
  }

  async function act(id: number, status: 'approved' | 'rejected') {
    setReports((prev) => prev.filter((r) => r.id !== id)) // optimistי
    await fetch('/api/admin/park-reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify({ id, status }),
    })
    load(token, tab)
  }

  function logout() {
    localStorage.removeItem(LS_KEY)
    setToken('')
    setAuthed(false)
    setInput('')
  }

  if (!configured) {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <p style={{ fontWeight: 800, color: 'var(--ink)' }}>הפאנל עוד לא מוגדר</p>
        <p style={{ fontSize: 14, color: '#6a6155', marginTop: 6, lineHeight: 1.6 }}>
          צריך Supabase + משתנה סביבה <code>ADMIN_TOKEN</code> ב-Vercel. ראו את ההוראות ב-<code>lib/parkReports.ts</code>.
        </p>
      </div>
    )
  }

  if (!authed) {
    return (
      <form onSubmit={submitToken} style={{ maxWidth: 360, margin: '0 auto', display: 'grid', gap: 12 }}>
        <input
          type="password"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="טוקן אדמין"
          aria-label="טוקן אדמין"
          style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.3)', fontSize: 16 }}
        />
        <button type="submit" className="btn btn-primary">כניסה</button>
        {err && <div style={{ color: '#b04a3a', fontSize: 13.5, textAlign: 'center' }}>{err}</div>}
      </form>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`chip3d${tab === t.key ? '' : ''}`}
              style={{ cursor: 'pointer', background: tab === t.key ? 'var(--brand)' : '#fff', color: tab === t.key ? '#fff' : 'var(--ink)', border: '1px solid rgba(201,154,91,.3)' }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={logout} style={{ fontSize: 13, color: '#8a7c66', background: 'none', border: 'none', cursor: 'pointer' }}>יציאה</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>טוען…</p>
      ) : reports.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>אין דיווחים בקטגוריה הזו.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          {reports.map((r) => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 16, padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: 'var(--ink)' }}>{r.name}</div>
                  <div style={{ fontSize: 13.5, color: '#8a7c66', marginTop: 3 }}>
                    {r.city ? `📍 ${r.city}` : '📍 ללא עיר'}
                    {r.lat && r.lng ? ` · ${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}` : ''}
                    {' · '}{new Date(r.created_at).toLocaleDateString('he-IL')}
                  </div>
                  {r.note && <div style={{ fontSize: 14, color: '#5f574c', marginTop: 6, lineHeight: 1.5 }}>{r.note}</div>}
                </div>
                {tab === 'pending' && (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <button type="button" onClick={() => act(r.id, 'approved')} className="btn btn-primary" style={{ fontSize: 14, padding: '8px 16px' }}>אשר</button>
                    <button type="button" onClick={() => act(r.id, 'rejected')} className="btn btn-ghost" style={{ fontSize: 14, padding: '8px 16px' }}>דחה</button>
                  </div>
                )}
                {tab !== 'pending' && (
                  <button type="button" onClick={() => act(r.id, tab === 'approved' ? 'rejected' : 'approved')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>
                    {tab === 'approved' ? 'בטל אישור' : 'אשר בכל זאת'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
