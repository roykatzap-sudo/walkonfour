'use client'

import { useCallback, useEffect, useState } from 'react'

type Row = { slug: string; title: string; yes: number; no: number }
const cell: React.CSSProperties = { padding: '9px 10px', borderBottom: '1px solid rgba(201,154,91,.16)', fontSize: 15, textAlign: 'start' }

export function AdminGuideFeedback() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true); setErr('')
    try {
      const res = await fetch('/api/admin/guide-feedback', { cache: 'no-store' })
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

  if (loading) return <p style={{ color: 'var(--text-muted)' }}>טוען...</p>
  if (err) return <p style={{ color: '#b3261e' }}>{err}</p>

  return (
    <div>
      <p style={{ fontSize: 14.5, color: 'var(--text-muted)', lineHeight: 1.7, marginTop: 0 }}>
        התשובות לשאלה &quot;המדריך הזה עזר לכם?&quot; שמופיעה בסוף כל מדריך. מדריך עם הרבה &quot;לא ממש&quot; הוא הראשון שכדאי לשפר.
      </p>
      {rows.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>עדיין אין תשובות.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12 }}>
          <thead>
            <tr>{['מדריך', 'כן', 'לא ממש'].map((h) => <th key={h} scope="col" style={{ ...cell, fontWeight: 800 }}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td style={cell}>{r.title}</td>
                <td style={{ ...cell, width: 70, fontWeight: 800, color: '#1b7a43' }}>{r.yes}</td>
                <td style={{ ...cell, width: 90, fontWeight: 800, color: '#b3261e' }}>{r.no}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button type="button" onClick={load} style={{ marginTop: 18, padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(201,154,91,.45)', background: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>רענון</button>
    </div>
  )
}
