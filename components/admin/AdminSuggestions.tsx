'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { TYPE_LABELS, type Suggestion } from '@/lib/suggestionTypes'

const TABS = [
  { key: 'pending', label: 'ממתינות' },
  { key: 'approved', label: 'אושרו' },
  { key: 'rejected', label: 'נדחו' },
]

// צבעי תג לכל סוג - בפלטת המותג (בלי ירוקים)
const TYPE_COLOR: Record<string, string> = {
  park: 'var(--brand)',
  route: 'var(--brand-dark)',
  other: '#8a7c66',
}

export function AdminSuggestions() {
  const [configured, setConfigured] = useState(true)
  const [tab, setTab] = useState('pending')
  const [items, setItems] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async (status: string) => {
    setLoading(true); setErr('')
    try {
      const res = await fetch(`/api/admin/suggestions?status=${status}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.configured === false) { setConfigured(false); return }
      if (res.status === 401) { setErr('אין הרשאה - התחברו מחדש'); return }
      setItems(data.suggestions || [])
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(tab) }, [tab, load])

  // קיבוץ לפי העמוד שממנו הוצעה ההצעה (ואם אין - לפי עיר / כללי)
  const byCity = useMemo(() => {
    const m = new Map<string, Suggestion[]>()
    for (const s of items) {
      const key = s.page || (s.city ? `עיר: ${s.city}` : 'כללי')
      const arr = m.get(key) || []
      arr.push(s)
      m.set(key, arr)
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [items])

  async function act(id: number, status: 'approved' | 'rejected' | 'pending') {
    setItems((prev) => prev.filter((s) => s.id !== id))
    await fetch('/api/admin/suggestions', {
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
          צריך <code>DATABASE_URL</code> (Railway) ומשתנה <code>ADMIN_TOKEN</code> (32+ תווים) ב-Vercel.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className="chip3d"
            style={{ cursor: 'pointer', background: tab === t.key ? 'var(--brand)' : '#fff', color: tab === t.key ? '#fff' : 'var(--ink)', border: '1px solid rgba(201,154,91,.3)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>טוען…</p>
      ) : err ? (
        <p style={{ textAlign: 'center', color: '#b04a3a', padding: 30 }}>{err}</p>
      ) : items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>אין הצעות בקטגוריה הזו.</p>
      ) : (
        <div style={{ display: 'grid', gap: 26 }}>
          {byCity.map(([city, list]) => (
            <div key={city}>
              <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 6 }}>
                {city} <span style={{ color: 'var(--brand)', fontSize: 15 }}>({list.length})</span>
              </h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {list.map((s) => (
                  <div key={s.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', background: TYPE_COLOR[s.type] || 'var(--brand)', borderRadius: 999, padding: '3px 10px' }}>
                            {TYPE_LABELS[s.type] || s.type}
                          </span>
                          <span style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)' }}>{s.name}</span>
                        </div>
                        {s.details && <div style={{ fontSize: 14, color: '#5f574c', marginTop: 6, lineHeight: 1.5 }}>{s.details}</div>}
                        <div style={{ fontSize: 12.5, color: '#8a7c66', marginTop: 6 }}>
                          {s.city ? `📍 ${s.city} · ` : ''}{s.page ? `${s.page} · ` : ''}{new Date(s.created_at).toLocaleDateString('he-IL')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        {tab === 'pending' ? (
                          <>
                            <button type="button" onClick={() => act(s.id, 'approved')} className="btn btn-primary" style={{ fontSize: 13.5, padding: '7px 14px' }}>אשר</button>
                            <button type="button" onClick={() => act(s.id, 'rejected')} className="btn btn-ghost" style={{ fontSize: 13.5, padding: '7px 14px' }}>דחה</button>
                          </>
                        ) : (
                          <button type="button" onClick={() => act(s.id, tab === 'approved' ? 'rejected' : 'approved')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>
                            {tab === 'approved' ? 'בטל אישור' : 'אשר בכל זאת'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
