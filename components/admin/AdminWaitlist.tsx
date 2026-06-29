'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

type Row = {
  id: number
  email: string
  name: string | null
  city: string | null
  marketing_consent: boolean
  created_at: string
}

const LS_KEY = 'kv-admin-token'

export function AdminWaitlist() {
  const [token, setToken] = useState('')
  const [input, setInput] = useState('')
  const [authed, setAuthed] = useState(false)
  const [configured, setConfigured] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem(LS_KEY) : null
    if (t) { setToken(t); setAuthed(true) }
  }, [])

  const load = useCallback(async (tk: string) => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/admin/waitlist', { headers: { 'x-admin-token': tk } })
      if (res.status === 503) { setConfigured(false); setAuthed(false); return }
      const data = await res.json()
      if (res.status === 401) { setErr('טוקן שגוי'); setAuthed(false); localStorage.removeItem(LS_KEY); return }
      setRows(data.rows || [])
      setAuthed(true)
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (authed && token) load(token) }, [authed, token, load])

  function submitToken(e: React.FormEvent) {
    e.preventDefault()
    const t = input.trim(); if (!t) return
    localStorage.setItem(LS_KEY, t); setToken(t); setAuthed(true)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) =>
      r.email.toLowerCase().includes(q) ||
      (r.name || '').toLowerCase().includes(q) ||
      (r.city || '').toLowerCase().includes(q),
    )
  }, [rows, query])

  const consentCount = useMemo(() => rows.filter((r) => r.marketing_consent).length, [rows])

  function downloadCsv() {
    const head = 'created_at,email,name,city,marketing_consent\n'
    const body = filtered.map((r) =>
      [r.created_at, r.email, r.name || '', r.city || '', r.marketing_consent ? '1' : '0']
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','),
    ).join('\n')
    const blob = new Blob([head + body], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!configured) {
    return (
      <div className="card" style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 30, marginBottom: 6 }}>🔒</div>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--ink)' }}>הפאנל לא מוגדר</h2>
        <p style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>
          חסר ADMIN_TOKEN (32+ תווים) בהגדרות.
        </p>
      </div>
    )
  }

  if (!authed) {
    return (
      <form onSubmit={submitToken} className="card" style={{ padding: 24, display: 'grid', gap: 12, maxWidth: 380, margin: '0 auto' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>פאנל אדמין</h2>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0 }}>הזינו את טוקן האדמין כדי לצפות ברשימת ההמתנה.</p>
        <input
          type="password" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="טוקן אדמין" aria-label="טוקן אדמין"
          style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
        />
        <button type="submit" className="btn btn-primary">כניסה</button>
        {err && <div role="alert" style={{ fontSize: 13.5, color: '#a23c2e', textAlign: 'center' }}>{err}</div>}
      </form>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div className="card" style={{ padding: '14px 18px', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 15, color: 'var(--ink)' }}>
          <strong style={{ fontSize: 22 }}>{rows.length}</strong> נרשמים סך הכל
        </div>
        <div style={{ fontSize: 15, color: 'var(--ink)' }}>
          <strong style={{ fontSize: 22, color: 'var(--brand-dark)' }}>{consentCount}</strong> אישרו דיוור
        </div>
        <div style={{ flex: 1 }} />
        <input
          value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש (מייל / שם / עיר)" aria-label="חיפוש"
          style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 14.5, minWidth: 200 }}
        />
        <button type="button" onClick={downloadCsv} className="btn btn-ghost" style={{ fontSize: 13.5, padding: '8px 14px' }}>
          הורדה כ-CSV
        </button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>טוען...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>אין רשומות תואמות.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14.5 }}>
            <thead>
              <tr style={{ background: 'rgba(201,154,91,.08)', color: 'var(--ink)', fontWeight: 800 }}>
                <th style={{ textAlign: 'start', padding: '12px 14px' }}>תאריך</th>
                <th style={{ textAlign: 'start', padding: '12px 14px' }}>מייל</th>
                <th style={{ textAlign: 'start', padding: '12px 14px' }}>שם</th>
                <th style={{ textAlign: 'start', padding: '12px 14px' }}>עיר</th>
                <th style={{ textAlign: 'center', padding: '12px 14px' }}>דיוור</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} style={{ borderTop: '1px solid rgba(201,154,91,.18)' }}>
                  <td style={{ padding: '11px 14px', color: '#5b4d3c', fontVariantNumeric: 'tabular-nums' }}>
                    {new Date(r.created_at).toLocaleDateString('he-IL')}
                  </td>
                  <td style={{ padding: '11px 14px', color: 'var(--ink)' }}>{r.email}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--ink)' }}>{r.name || '—'}</td>
                  <td style={{ padding: '11px 14px', color: 'var(--ink)' }}>{r.city || '—'}</td>
                  <td style={{ padding: '11px 14px', textAlign: 'center' }}>
                    {r.marketing_consent ? (
                      <span style={{ background: 'var(--brand)', color: '#fff', borderRadius: 999, padding: '3px 10px', fontSize: 12.5, fontWeight: 800 }}>אישר</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>לא</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
