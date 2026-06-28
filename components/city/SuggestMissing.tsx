'use client'

import { useState } from 'react'

const TYPES: { key: string; label: string }[] = [
  { key: 'park', label: 'גינת כלבים' },
  { key: 'route', label: 'מסלול טיול' },
  { key: 'dogfriendly', label: 'מקום דוג-פרנדלי' },
  { key: 'other', label: 'אחר' },
]

export function SuggestMissing({ city }: { city: string }) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState('park')
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'soon' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending' || !name.trim()) return
    setState('sending')
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, type, name, details }),
      })
      const data = await res.json()
      if (data.ok) setState('done')
      else if (data.configured === false) setState('soon')
      else setState('error')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div style={{ background: 'linear-gradient(135deg, #fffaf0, #fdf6e9)', border: '2px solid var(--brand)', borderRadius: 18, padding: '22px', textAlign: 'center' }}>
        <div style={{ fontSize: 34 }}>🐾</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', marginTop: 4 }}>תודה! ההצעה נשלחה</div>
        <p style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>
          נבדוק אותה ונוסיף אותה למדריך של {city} אם היא מתאימה.
        </p>
      </div>
    )
  }

  return (
    <section style={{ marginTop: 40 }}>
      <div style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 18, padding: '20px 18px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>
          חסר משהו ב{city}?
        </h2>
        <p style={{ fontSize: 15, color: '#5b4d3c', margin: '6px 0 0', lineHeight: 1.6 }}>
          מכירים גינת כלבים, מסלול טיול או מקום דוג-פרנדלי שלא רשום כאן? ספרו לנו ונוסיף.
        </p>

        {!open ? (
          <button type="button" onClick={() => setOpen(true)} className="btn btn-primary" style={{ marginTop: 14, fontSize: 15.5 }}>
            הוסיפו המלצה +
          </button>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            <div style={{ display: 'grid', gap: 5 }}>
              <label htmlFor="sg-type" style={{ fontSize: 14, fontWeight: 800, color: '#5b4d3c' }}>מה זה?</label>
              <select
                id="sg-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, background: '#fff', color: 'var(--ink)' }}
              >
                {TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="שם המקום / המסלול"
              aria-label="שם"
              required
              maxLength={80}
              style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="פרטים (כתובת, למה כדאי...) - לא חובה"
              aria-label="פרטים"
              maxLength={500}
              rows={3}
              style={{ padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, fontFamily: 'inherit', resize: 'vertical' }}
            />
            <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16 }}>
              {state === 'sending' ? 'שולח...' : 'שלחו הצעה'}
            </button>
            {state === 'soon' && (
              <div role="status" style={{ fontSize: 14, color: '#8a6d3b', textAlign: 'center', lineHeight: 1.5 }}>
                התכונה נפתחת ממש בקרוב. בינתיים אפשר לשתף בקבוצת הפייסבוק שלנו 🐾
              </div>
            )}
            {state === 'error' && (
              <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>משהו השתבש. נסו שוב בעוד רגע.</div>
            )}
          </form>
        )}
      </div>
    </section>
  )
}
