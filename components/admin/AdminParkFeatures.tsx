'use client'

import { useCallback, useEffect, useState } from 'react'

type Row = { id: number; park_id: number; park_name: string | null; city: string; shade: boolean | null; water: boolean | null; fence: boolean | null; created_at: string }

const tri = (v: boolean | null) => (v === true ? 'כן' : v === false ? 'לא' : 'לא סומן')
const cell: React.CSSProperties = { padding: '9px 10px', borderBottom: '1px solid rgba(201,154,91,.16)', fontSize: 15, textAlign: 'start', verticalAlign: 'middle' }

export function AdminParkFeatures() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/admin/park-features', { cache: 'no-store' })
      if (res.status === 401) { setErr('אין הרשאה - התחברו מחדש'); return }
      const data = await res.json()
      setRows(data.rows || [])
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function decide(id: number, status: 'approved' | 'rejected') {
    const res = await fetch('/api/admin/park-features', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    const d = await res.json().catch(() => ({}))
    if (d.ok) setRows((r) => r.filter((x) => x.id !== id))
    else setErr('הפעולה נכשלה')
  }

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>טוען...</p>

  return (
    <div>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 0 }}>
        דיווחים של בעלי כלבים על צל, מים וגדר בגינות. דיווח שאושר מופיע כתגית על כרטיס הגינה בעמוד העיר. דיווח חדש יותר גובר על ישן.
      </p>
      {err && <p style={{ color: '#b3261e' }}>{err}</p>}
      {rows.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>אין דיווחים שמחכים לאישור.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, minWidth: 640 }}>
            <thead>
              <tr>{['גינה', 'עיר', 'צל', 'מים', 'גדר', 'תאריך', ''].map((h) => <th key={h} scope="col" style={{ ...cell, fontWeight: 800 }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td style={cell}>{r.park_name || r.park_id}</td>
                  <td style={{ ...cell, direction: 'ltr' }}>{r.city}</td>
                  <td style={cell}>{tri(r.shade)}</td>
                  <td style={cell}>{tri(r.water)}</td>
                  <td style={cell}>{tri(r.fence)}</td>
                  <td style={cell}>{new Date(r.created_at).toLocaleDateString('he-IL')}</td>
                  <td style={{ ...cell, whiteSpace: 'nowrap' }}>
                    <button type="button" onClick={() => decide(r.id, 'approved')} style={{ padding: '8px 14px', borderRadius: 8, border: 'none', background: '#1b7a43', color: '#fff', fontWeight: 800, cursor: 'pointer', marginInlineEnd: 6 }}>אישור</button>
                    <button type="button" onClick={() => decide(r.id, 'rejected')} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid #b3261e', background: '#fff', color: '#b3261e', fontWeight: 800, cursor: 'pointer' }}>דחייה</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="button" onClick={load} style={{ marginTop: 18, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(201,154,91,.45)', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>רענון</button>
    </div>
  )
}
