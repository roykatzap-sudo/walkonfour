'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DirectoryBusiness, DirectoryReview } from '@/lib/directory/types'

type ReviewWithBiz = DirectoryReview & { business_name: string }
type Filter = 'all' | 'pending' | 'live' | 'hidden'

export function AdminDirectory({ onPendingCount }: { onPendingCount?: (n: number) => void }) {
  const [configured, setConfigured] = useState(true)
  const [businesses, setBusinesses] = useState<DirectoryBusiness[]>([])
  const [reviews, setReviews] = useState<ReviewWithBiz[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  // דיווח מונה "ממתין לאישור" לטאב בדשבורד
  const pendingCount =
    businesses.filter((b) => b.status === 'pending').length +
    reviews.filter((r) => r.status === 'pending').length
  useEffect(() => { onPendingCount?.(pendingCount) }, [pendingCount, onPendingCount])

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  async function act(type: 'business' | 'review', id: number, action: 'hide' | 'show' | 'delete') {
    const key = `${type}:${id}`

    // מחיקה דורשת לחיצה שנייה לאישור
    if (action === 'delete' && confirmDelete !== key) {
      setConfirmDelete(key)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      confirmTimer.current = setTimeout(() => setConfirmDelete(null), 4000)
      return
    }
    if (confirmTimer.current) clearTimeout(confirmTimer.current)
    setConfirmDelete(null)
    setBusy(key)

    if (action === 'delete') {
      if (type === 'business') setBusinesses((prev) => prev.filter((b) => b.id !== id))
      else setReviews((prev) => prev.filter((r) => r.id !== id))
    }

    await fetch('/api/admin/directory/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, id, action }),
    })
    setBusy(null)
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

  if (loading && businesses.length === 0 && reviews.length === 0) {
    return <p style={{ textAlign: 'center', color: '#8a7c66', padding: 30 }}>טוען...</p>
  }
  if (err) {
    return <p style={{ textAlign: 'center', color: '#b04a3a', padding: 30 }}>{err}</p>
  }

  const pendingBiz = businesses.filter((b) => b.status === 'pending')
  const pendingRev = reviews.filter((r) => r.status === 'pending')
  const restBiz = businesses.filter((b) => b.status !== 'pending' && (filter === 'all' || b.status === filter))
  const restRev = reviews.filter((r) => r.status !== 'pending' && (filter === 'all' || r.status === filter))
  const showPendingSection = pendingCount > 0 && (filter === 'all' || filter === 'pending')
  const showRegularSections = filter !== 'pending'

  const liveCount = businesses.filter((b) => b.status === 'live').length + reviews.filter((r) => r.status === 'live').length
  const hiddenCount = businesses.filter((b) => b.status === 'hidden').length + reviews.filter((r) => r.status === 'hidden').length

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      {/* סרגל: סינון + רענון */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <FilterChip label="הכל" active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterChip label={`ממתין לאישור (${pendingCount})`} active={filter === 'pending'} onClick={() => setFilter('pending')} accent={pendingCount > 0} />
        <FilterChip label={`פעיל (${liveCount})`} active={filter === 'live'} onClick={() => setFilter('live')} />
        <FilterChip label={`מוסתר (${hiddenCount})`} active={filter === 'hidden'} onClick={() => setFilter('hidden')} />
        <button
          type="button"
          onClick={load}
          disabled={loading}
          style={{
            marginInlineStart: 'auto',
            fontSize: 13,
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: 999,
            border: '1px solid rgba(201,154,91,.35)',
            background: '#fff',
            color: 'var(--brand-dark)',
            cursor: loading ? 'default' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'מרענן...' : 'רענון'}
        </button>
      </div>

      {/* ─── תור אישורים - תוכן מלא כדי להחליט בלי לנחש ─── */}
      {showPendingSection && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#a3611f', margin: '0 0 12px', borderBottom: '2px solid #e2b06a', paddingBottom: 6 }}>
            ממתין לאישור <span style={{ fontSize: 15 }}>({pendingCount})</span>
          </h2>
          <div style={{ display: 'grid', gap: 12 }}>
            {pendingBiz.map((b) => (
              <div key={`pb-${b.id}`} style={{ background: '#fffaf0', border: '1.5px solid #e2b06a', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--ink)' }}>{b.name}</span>
                  <span style={{ fontSize: 13, color: '#8a7c66' }}>עסק חדש</span>
                  {b.reports_count > 0 && <ReportsTag count={b.reports_count} />}
                </div>
                <FlagReason reason={b.flag_reason} />
                <DetailGrid rows={[
                  ['קטגוריה', b.category],
                  ['עיר', b.city + (b.area ? ` (${b.area})` : '')],
                  ['מחירון', b.pricing],
                  ['טלפון', b.phone],
                  ['וואטסאפ', b.whatsapp],
                  ['אתר', b.website],
                ]} />
                <p style={{ fontSize: 14, color: '#3a3128', margin: '10px 0 0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{b.description}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button type="button" onClick={() => act('business', b.id, 'show')} disabled={busy === `business:${b.id}`} className="btn btn-primary" style={{ fontSize: 14, padding: '8px 18px' }}>אשר ופרסם</button>
                  <DeleteButton pending={confirmDelete === `business:${b.id}`} onClick={() => act('business', b.id, 'delete')} />
                </div>
              </div>
            ))}
            {pendingRev.map((r) => (
              <div key={`pr-${r.id}`} style={{ background: '#fffaf0', border: '1.5px solid #e2b06a', borderRadius: 14, padding: '16px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 900, fontSize: 16, color: 'var(--ink)' }}>{r.author_name}</span>
                  <span style={{ fontSize: 13, color: '#8a7c66' }}>ביקורת על {r.business_name}</span>
                  <Stars rating={r.rating} />
                  {r.reports_count > 0 && <ReportsTag count={r.reports_count} />}
                </div>
                <FlagReason reason={r.flag_reason} />
                {r.text && (
                  <p style={{ fontSize: 14, color: '#3a3128', margin: '10px 0 0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.text}</p>
                )}
                <div style={{ fontSize: 12.5, color: '#8a7c66', marginTop: 6 }}>{new Date(r.created_at).toLocaleDateString('he-IL')}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button type="button" onClick={() => act('review', r.id, 'show')} disabled={busy === `review:${r.id}`} className="btn btn-primary" style={{ fontSize: 14, padding: '8px 18px' }}>אשר ופרסם</button>
                  <DeleteButton pending={confirmDelete === `review:${r.id}`} onClick={() => act('review', r.id, 'delete')} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filter === 'pending' && pendingCount === 0 && (
        <p style={{ textAlign: 'center', color: '#8a7c66', padding: 20 }}>אין פריטים שממתינים לאישור. הכל נקי!</p>
      )}

      {showRegularSections && (
        <>
          {/* סקשן עסקים */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 6 }}>
              עסקים <span style={{ color: 'var(--brand)', fontSize: 15 }}>({restBiz.length})</span>
            </h2>

            {restBiz.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#8a7c66', padding: 20 }}>אין עסקים בסינון הזה.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {restBiz.map((b) => {
                  const key = `b-${b.id}`
                  const open = expanded.has(key)
                  return (
                    <div key={b.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div
                          style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                          onClick={() => toggleExpand(key)}
                          title={open ? 'סגירת פרטים' : 'הצגת כל הפרטים'}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)' }}>{b.name}</span>
                            <StatusChip status={b.status} />
                            {b.reports_count > 0 && <ReportsTag count={b.reports_count} />}
                          </div>
                          <div style={{ fontSize: 13.5, color: '#5f574c', marginTop: 4, lineHeight: 1.5 }}>
                            {b.category} - {b.city}
                            {b.avg_rating != null && <> - <Stars rating={Math.round(b.avg_rating)} /> {b.avg_rating} ({b.reviews_count} ביקורות)</>}
                          </div>
                          {open ? (
                            <>
                              <DetailGrid rows={[
                                ['מחירון', b.pricing],
                                ['אזור', b.area],
                                ['טלפון', b.phone],
                                ['וואטסאפ', b.whatsapp],
                                ['אתר', b.website],
                                ['נוצר', new Date(b.created_at).toLocaleDateString('he-IL')],
                              ]} />
                              <p style={{ fontSize: 13.5, color: '#3a3128', margin: '8px 0 0', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{b.description}</p>
                            </>
                          ) : (
                            <div style={{ fontSize: 13, color: '#8a7c66', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {b.description.slice(0, 100)}{b.description.length > 100 ? '...' : ''}
                            </div>
                          )}
                          <FlagReason reason={b.flag_reason} />
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                          {b.status === 'live' ? (
                            <button type="button" onClick={() => act('business', b.id, 'hide')} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 12px' }}>הסתר</button>
                          ) : (
                            <button type="button" onClick={() => act('business', b.id, 'show')} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 12px' }}>הצג</button>
                          )}
                          <DeleteButton small pending={confirmDelete === `business:${b.id}`} onClick={() => act('business', b.id, 'delete')} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* סקשן ביקורות */}
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px', borderBottom: '2px solid rgba(201,154,91,.25)', paddingBottom: 6 }}>
              ביקורות <span style={{ color: 'var(--brand)', fontSize: 15 }}>({restRev.length})</span>
            </h2>

            {restRev.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#8a7c66', padding: 20 }}>אין ביקורות בסינון הזה.</p>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {restRev.map((r) => {
                  const key = `r-${r.id}`
                  const open = expanded.has(key)
                  return (
                    <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 14, padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                        <div
                          style={{ flex: 1, minWidth: 0, cursor: r.text ? 'pointer' : 'default' }}
                          onClick={() => r.text && toggleExpand(key)}
                          title={r.text ? (open ? 'סגירת פרטים' : 'הצגת הביקורת המלאה') : undefined}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)' }}>{r.author_name}</span>
                            <span style={{ fontSize: 13, color: '#8a7c66' }}>על {r.business_name}</span>
                            <Stars rating={r.rating} />
                            <StatusChip status={r.status} />
                            {r.reports_count > 0 && <ReportsTag count={r.reports_count} />}
                          </div>
                          {r.text && (
                            <div style={{
                              fontSize: 13.5, color: '#5f574c', marginTop: 4, lineHeight: 1.6,
                              ...(open
                                ? { whiteSpace: 'pre-wrap' as const }
                                : { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }),
                            }}>
                              {open ? r.text : <>{r.text.slice(0, 120)}{r.text.length > 120 ? '...' : ''}</>}
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
                            <button type="button" onClick={() => act('review', r.id, 'show')} className="btn btn-primary" style={{ fontSize: 13, padding: '6px 12px' }}>הצג</button>
                          )}
                          <DeleteButton small pending={confirmDelete === `review:${r.id}`} onClick={() => act('review', r.id, 'delete')} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

/* ─── תגיות ורכיבי עזר ─── */

function FilterChip({ label, active, onClick, accent }: { label: string; active: boolean; onClick: () => void; accent?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontSize: 13,
        fontWeight: active ? 900 : 700,
        padding: '6px 14px',
        borderRadius: 999,
        border: active ? '1px solid var(--brand-dark)' : '1px solid rgba(201,154,91,.35)',
        background: active ? 'var(--brand)' : accent ? '#fdf3e3' : '#fff',
        color: active ? '#fff' : accent ? '#a3611f' : '#6a6155',
        cursor: 'pointer',
        transition: 'background .15s, color .15s',
      }}
    >
      {label}
    </button>
  )
}

function DeleteButton({ pending, onClick, small }: { pending: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={pending ? 'btn' : 'btn btn-ghost'}
      style={{
        fontSize: small ? 13 : 14,
        padding: small ? '6px 12px' : '8px 18px',
        fontWeight: 800,
        ...(pending
          ? { background: '#b04a3a', color: '#fff', border: 'none', borderRadius: 999 }
          : { color: '#b04a3a' }),
      }}
    >
      {pending ? 'בטוח? מחק' : 'מחק'}
    </button>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span aria-label={`${rating} מתוך 5`} style={{ fontSize: 13, color: 'var(--brand-dark)', letterSpacing: 1 }}>
      <span>{'★'.repeat(rating)}</span>
      <span style={{ color: '#e2ddd2' }}>{'★'.repeat(5 - rating)}</span>
    </span>
  )
}

/** שורות פרטים - מדלג אוטומטית על שדות ריקים */
function DetailGrid({ rows }: { rows: [string, string | null][] }) {
  const filled = rows.filter(([, v]) => v && v.trim())
  if (filled.length === 0) return null
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3px 10px', marginTop: 8, fontSize: 13.5 }}>
      {filled.map(([k, v]) => (
        <div key={k} style={{ display: 'contents' }}>
          <span style={{ fontWeight: 800, color: '#8a7c66', whiteSpace: 'nowrap' }}>{k}:</span>
          <span style={{ color: '#3a3128', wordBreak: 'break-word' }}>{v}</span>
        </div>
      ))}
    </div>
  )
}

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
