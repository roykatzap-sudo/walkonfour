'use client'

import { useEffect, useState } from 'react'
import { TAG_LABELS, type RatingTag } from '@/lib/community/ratings'

type Summary = { avg: number; count: number; tags: Record<string, number> }
type PublicRating = { id: number; stars: number; tags: string[]; note: string | null; created_at: string }

const TAG_KEYS = Object.keys(TAG_LABELS) as RatingTag[]

export function ParkRating({ parkKey, isAuthed }: { parkKey: string; isAuthed: boolean }) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [ratings, setRatings] = useState<PublicRating[]>([])
  const [my, setMy] = useState<{ stars: number; tags: string[]; note: string | null } | null>(null)
  const [open, setOpen] = useState(false)
  const [stars, setStars] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    fetch(`/api/community/ratings?park_key=${encodeURIComponent(parkKey)}`).then((r) => r.json()).then((d) => {
      setSummary(d.summary)
      setRatings(d.ratings || [])
      if (d.my) {
        setMy(d.my)
        setStars(d.my.stars)
        setTags(d.my.tags || [])
        setNote(d.my.note || '')
      }
    })
  }, [parkKey])

  function toggleTag(t: string) {
    setTags((cur) => cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (saving || stars < 1) return
    setSaving(true); setErr('')
    try {
      const res = await fetch('/api/community/ratings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ park_key: parkKey, stars, tags, note: note.trim() || null }),
      })
      const data = await res.json()
      if (!data.ok) { setErr('שגיאה'); setSaving(false); return }
      // רענון
      const fresh = await fetch(`/api/community/ratings?park_key=${encodeURIComponent(parkKey)}`).then((r) => r.json())
      setSummary(fresh.summary); setRatings(fresh.ratings || []); setMy(fresh.my)
      setOpen(false)
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setSaving(false)
    }
  }

  const popularTags = summary
    ? Object.entries(summary.tags).sort((a, b) => b[1] - a[1]).slice(0, 4)
    : []

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* סיכום */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <Stars value={summary?.avg ?? 0} />
        <div style={{ fontSize: 14, color: '#5b4d3c' }}>
          {summary && summary.count > 0
            ? <>{summary.avg.toFixed(1)} · {summary.count} {summary.count === 1 ? 'דירוג' : 'דירוגים'}</>
            : 'עוד אין דירוגים'}
        </div>
      </div>

      {/* תגיות פופולריות */}
      {popularTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {popularTags.map(([t, n]) => (
            <span key={t} style={{ fontSize: 12.5, background: 'rgba(201,154,91,.12)', border: '1px solid rgba(201,154,91,.25)', padding: '3px 9px', borderRadius: 999, color: '#5b4d3c' }}>
              {TAG_LABELS[t as RatingTag] || t} <span style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>{n}</span>
            </span>
          ))}
        </div>
      )}

      {/* כפתור דרג */}
      {isAuthed && !open && (
        <button type="button" onClick={() => setOpen(true)} className="btn btn-ghost" style={{ fontSize: 14, padding: '8px 16px', alignSelf: 'flex-start' }}>
          {my ? `✏️ עריכת הדירוג שלי (${my.stars}★)` : '⭐ דרגו את הגינה'}
        </button>
      )}

      {/* טופס דירוג */}
      {open && (
        <form onSubmit={submit} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 14, padding: 16, display: 'grid', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>כמה כוכבים?</div>
            <StarPicker value={stars} onChange={setStars} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>מה אופייני? (אפשר כמה)</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TAG_KEYS.map((t) => (
                <button
                  key={t} type="button"
                  onClick={() => toggleTag(t)}
                  style={{
                    fontSize: 13, padding: '5px 11px', borderRadius: 999,
                    background: tags.includes(t) ? 'var(--brand)' : '#fff',
                    color: tags.includes(t) ? '#fff' : 'var(--ink)',
                    border: '1.5px solid ' + (tags.includes(t) ? 'var(--brand)' : 'rgba(201,154,91,.35)'),
                    cursor: 'pointer', fontFamily: 'inherit', fontWeight: tags.includes(t) ? 700 : 500,
                  }}
                >{TAG_LABELS[t]}</button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="rt-note" style={{ display: 'block', fontSize: 13.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
              ביקורת קצרה (לא חובה)
            </label>
            <textarea
              id="rt-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="מה כדאי לדעת על הגינה?"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1.5px solid rgba(201,154,91,.3)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }}
            />
            <div style={{ fontSize: 11.5, color: '#8a7c66', marginTop: 4 }}>הביקורת מוצגת באנונימיות לחברי הקהילה.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="submit" disabled={saving || stars < 1} className="btn btn-primary" style={{ fontSize: 14, padding: '9px 18px' }}>
              {saving ? 'שומר...' : my ? 'עדכון' : 'שליחת דירוג'}
            </button>
            <button type="button" onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#5b4d3c', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
              ביטול
            </button>
          </div>
          {err && <div role="alert" style={{ fontSize: 13, color: '#a23c2e' }}>{err}</div>}
        </form>
      )}

      {/* רשימת ביקורות (אנונימי) */}
      {ratings.length > 0 && (
        <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: '#5b4d3c' }}>ביקורות אנונימיות</div>
          {ratings.filter((r) => r.note).slice(0, 5).map((r) => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 10, padding: '10px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Stars value={r.stars} size={14} />
                <span style={{ fontSize: 11.5, color: '#8a7c66' }}>
                  {new Date(r.created_at).toLocaleDateString('he-IL')}
                </span>
              </div>
              {r.note && <div style={{ fontSize: 13.5, color: 'var(--ink)', lineHeight: 1.5 }}>{r.note}</div>}
              {r.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 6 }}>
                  {r.tags.slice(0, 5).map((t) => (
                    <span key={t} style={{ fontSize: 11, color: '#5b4d3c', background: 'rgba(201,154,91,.08)', padding: '2px 7px', borderRadius: 999 }}>
                      {TAG_LABELS[t as RatingTag] || t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!isAuthed && (
        <p style={{ fontSize: 12.5, color: '#8a7c66', textAlign: 'center', margin: 0 }}>
          <a href="/community/login" style={{ color: 'var(--brand-dark)', fontWeight: 700 }}>היכנסו לקהילה</a> כדי לדרג ולראות פרטים נוספים.
        </p>
      )}
    </div>
  )
}

function Stars({ value, size = 18 }: { value: number; size?: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span aria-label={`דירוג ${value.toFixed(1)} מתוך 5`} style={{ display: 'inline-flex', gap: 2, lineHeight: 1, fontSize: size, color: 'var(--brand)' }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full
        const isHalf = !filled && i === full && half
        return (
          <span key={i} style={{ color: filled || isHalf ? 'var(--brand)' : 'rgba(201,154,91,.25)' }} aria-hidden="true">
            {filled ? '★' : isHalf ? '⯨' : '☆'}
          </span>
        )
      })}
    </span>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  const display = hover || value
  return (
    <div style={{ display: 'inline-flex', gap: 4 }} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`${n} כוכבים`}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          style={{
            fontSize: 30, lineHeight: 1, padding: 0, width: 36, height: 36,
            background: 'none', border: 'none', cursor: 'pointer',
            color: n <= display ? 'var(--brand)' : 'rgba(201,154,91,.3)',
            transition: 'transform .1s',
            transform: hover === n ? 'scale(1.15)' : 'scale(1)',
          }}
        >★</button>
      ))}
    </div>
  )
}
