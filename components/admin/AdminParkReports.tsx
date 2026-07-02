'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ParkReport } from '@/lib/parkReports'

const TABS: { key: string; label: string }[] = [
  { key: 'pending', label: 'ממתינים' },
  { key: 'approved', label: 'אושרו' },
  { key: 'rejected', label: 'נדחו' },
]

export function AdminParkReports() {
  const [configured, setConfigured] = useState(true)
  const [tab, setTab] = useState('pending')
  const [reports, setReports] = useState<ParkReport[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async (status: string) => {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/park-reports?status=${status}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.configured === false) { setConfigured(false); return }
      if (res.status === 401) { setErr('אין הרשאה - התחברו מחדש'); return }
      setReports(data.reports || [])
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(tab) }, [tab, load])

  async function act(id: number, status: 'approved' | 'rejected') {
    setReports((prev) => prev.filter((r) => r.id !== id)) // optimistי
    await fetch('/api/admin/park-reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    load(tab)
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

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className="chip3d"
            style={{ cursor: 'pointer', background: tab === t.key ? 'var(--brand)' : '#fff', color: tab === t.key ? '#fff' : 'var(--ink)', border: '1px solid rgba(201,154,91,.3)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>טוען…</p>
      ) : err ? (
        <p style={{ textAlign: 'center', color: '#b04a3a', padding: 30 }}>{err}</p>
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
