'use client'

import { useCallback, useEffect, useState } from 'react'
import type { DirectoryBusiness, DirectoryReview } from '@/lib/directory/types'

type ReviewWithBiz = DirectoryReview & { business_name: string }

export function AdminDirectory() {
  const [configured, setConfigured] = useState(true)
  const [businesses, setBusinesses] = useState<DirectoryBusiness[]>([])
  const [reviews, setReviews] = useState<ReviewWithBiz[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/directory', { cache: 'no-store' })
      if (res.status === 503) { setConfigured(false); return }
      if (res.status === 401) { setErr('אין הרשאה - התחברו מחדש'); return }
      const data = await res.json()
      setBusinesses(data.businesses || [])
      setReviews(data.reviews || [])
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function act(type: 'business' | 'review', id: number, action: 'hide' | 'show' | 'delete') {
    // הסרה אופטימיסטית מהתצוגה
    if (type === 'business') {
      setBusinesses((prev) => prev.filter((b) => !(action === 'delete' && b.id === id)))
    } else {
      setReviews((prev) => prev.filter((r) => !(action === 'delete' && r.id === id)))
    }

    await fetch('/api/admin/directory/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, action }),
    })
    load()
  }

  if (!configured) {
    return (
      <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 16, padding: 24, textAlign: 'center' }}>
        <p style={{ fontWeight: 800, color: 'var(--ink)' }}>הפאנל עוד לא מוגדר</p>
        <p style={{ fontSize: 14, color: '#6a6155', marginTop: 6, lineHeight: 1.6 }}>
          צריך <code>DATABASE_URL</code> ומשתנה <code>ADMIN_TOKEN</code> (32+ תווים) ב-Vercel.
        </p>
      </div>
    )
  }

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>טוען...</p>
  }
  if (err) {
    return <p style={{ textAlign: 'center', color: '#b04a3a', padding: 30 }}>{err}</p>
  }

  return (
    <div style={{ display: 'grid', gap: 28 }}>
      {/* סקשן עסקים */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 6 }}>
          עסקים <span style={{ color: 'var(--brand)', fontSize: 15 }}>({businesses.length})</span>
        </h2>

        {businesses.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8a7c66', padding: 20 }}>אין עסקים עדיין.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {businesses.map((b) => (
              <div key={b.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)' }}>{b.name}</span>
                      <StatusChip status={b.status} />
                      {b.reports_count > 0 && <ReportsTag count={b.reports_count} />}
                    </div>
                    <div style={{ fontSize: 13.5, color: '#5f574c', marginTop: 4, lineHeight: 1.5 }}>
                      {b.category} - {b.city}
                      {b.avg_rating != null && ` - ${b.avg_rating} (${b.reviews_count} ביקורות)`}
                    </div>
                    <div style={{ fontSize: 13, color: '#8a7c66', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {b.description.slice(0, 100)}{b.description.length > 100 ? '...' : ''}
                    </div>
                    <FlagReason reason={b.flag_reason} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {b.status === 'live' ? (
                      <button type="button" onClick={() => act('business', b.id, 'hide')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>הסתר</button>
                    ) : (
                      <button type="button" onClick={() => act('business', b.id, 'show')} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 12px' }}>
                        {b.status === 'pending' ? 'אשר ופרסם' : 'הצג'}
                      </button>
                    )}
                    <button type="button" onClick={() => act('business', b.id, 'delete')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px', color: '#b04a3a' }}>מחק</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* סקשן ביקורות */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 6 }}>
          ביקורות <span style={{ color: 'var(--brand)', fontSize: 15 }}>({reviews.length})</span>
        </h2>

        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8a7c66', padding: 20 }}>אין ביקורות עדיין.</p>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)' }}>{r.author_name}</span>
                      <span style={{ fontSize: 13, color: '#8a7c66' }}>על {r.business_name}</span>
                      <span style={{ fontSize: 13, color: 'var(--brand-dark)', fontWeight: 800 }}>{'*'.repeat(r.rating)}</span>
                      <StatusChip status={r.status} />
                      {r.reports_count > 0 && <ReportsTag count={r.reports_count} />}
                    </div>
                    {r.text && (
                      <div style={{ fontSize: 13.5, color: '#5f574c', marginTop: 4, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.text.slice(0, 120)}{r.text.length > 120 ? '...' : ''}
                      </div>
                    )}
                    <div style={{ fontSize: 12.5, color: '#8a7c66', marginTop: 3 }}>
                      {new Date(r.created_at).toLocaleDateString('he-IL')}
                    </div>
                    <FlagReason reason={r.flag_reason} />
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    {r.status === 'live' ? (
                      <button type="button" onClick={() => act('review', r.id, 'hide')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>הסתר</button>
                    ) : (
                      <button type="button" onClick={() => act('review', r.id, 'show')} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 12px' }}>
                        {r.status === 'pending' ? 'אשר ופרסם' : 'הצג'}
                      </button>
                    )}
                    <button type="button" onClick={() => act('review', r.id, 'delete')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px', color: '#b04a3a' }}>מחק</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── תגיות עזר ─── */

function StatusChip({ status }: { status: string }) {
  const cfg =
    status === 'live'
      ? { label: 'פעיל', color: '#fff', bg: 'var(--brand)' }
      : status === 'pending'
        ? { label: 'ממתין לאישור', color: '#fff', bg: '#c2762b' }
        : { label: 'מוסתר', color: '#8a7c66', bg: '#e8e0d5' }
  return (
    <span style={{
      fontSize: 11.5,
      fontWeight: 800,
      color: cfg.color,
      background: cfg.bg,
      borderRadius: 999,
      padding: '2px 9px',
    }}>
      {cfg.label}
    </span>
  )
}

/** סיבת הסינון האוטומטי - מוצגת רק לפריטים שנתפסו */
function FlagReason({ reason }: { reason: string | null }) {
  if (!reason) return null
  return (
    <div style={{ fontSize: 12.5, fontWeight: 700, color: '#c2762b', marginTop: 4 }}>
      סינון אוטומטי: {reason}
    </div>
  )
}

function ReportsTag({ count }: { count: number }) {
  return (
    <span style={{
      fontSize: 11.5,
      fontWeight: 800,
      color: '#fff',
      background: '#b04a3a',
      borderRadius: 999,
      padding: '2px 9px',
    }}>
      {count} דיווחים
    </span>
  )
}
