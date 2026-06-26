'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import type { EventCategory } from '@/types'

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'meetup', label: 'מפגש קהילתי' },
  { value: 'lecture', label: 'הרצאה' },
  { value: 'market', label: 'יריד' },
  { value: 'training', label: 'אילוף' },
  { value: 'other', label: 'אחר' },
]

export function EventForm() {
  const router = useRouter()
  const toast = useToast()

  const [form, setForm] = useState({
    title: '', description: '', location: '', city: '', event_date: '', price: '0', max_participants: '',
    category: 'meetup' as EventCategory,
  })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('כדי ליצור אירוע צריך להתחבר תחילה')
      const { data: ev, error } = await supabase
        .from('events')
        .insert({
          title: form.title, description: form.description, location: form.location, city: form.city,
          event_date: new Date(form.event_date).toISOString(), price: Number(form.price) || 0,
          max_participants: form.max_participants ? Number(form.max_participants) : null,
          category: form.category, organizer_id: user.id,
        })
        .select('id')
        .single()
      if (error) throw error
      toast('האירוע נוצר בהצלחה')
      router.push(`/events/${ev.id}`)
    } catch (e: any) {
      setErr(e?.message || 'משהו השתבש. ודאו שההגדרות תקינות ונסו שוב.')
      setLoading(false)
    }
  }

  return (
    <div className="card">
      {err && (
        <div className="alert alert-error" role="alert">
          {err}
        </div>
      )}
      <form onSubmit={submit} noValidate>
        <div className="field">
          <label htmlFor="ev-title">שם האירוע</label>
          <input id="ev-title" className="input" value={form.title} onChange={(e) => set('title', e.target.value)} required />
        </div>
        <div className="field">
          <label htmlFor="ev-desc">תיאור</label>
          <textarea id="ev-desc" className="input" value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label htmlFor="ev-location">מיקום</label>
            <input id="ev-location" className="input" value={form.location} onChange={(e) => set('location', e.target.value)} required placeholder="פארק הירקון" />
          </div>
          <div className="field">
            <label htmlFor="ev-city">עיר</label>
            <input id="ev-city" className="input" value={form.city} onChange={(e) => set('city', e.target.value)} required placeholder="תל אביב" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label htmlFor="ev-date">תאריך ושעה</label>
            <input id="ev-date" className="input" type="datetime-local" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} required dir="ltr" />
          </div>
          <div className="field">
            <label htmlFor="ev-category">קטגוריה</label>
            <select id="ev-category" className="input" value={form.category} onChange={(e) => set('category', e.target.value as EventCategory)}>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="field">
            <label htmlFor="ev-price">מחיר (₪) <span className="muted">0 = חינם</span></label>
            <input id="ev-price" className="input" type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} dir="ltr" />
          </div>
          <div className="field">
            <label htmlFor="ev-max">מספר משתתפים מרבי <span className="muted">(לא חובה)</span></label>
            <input id="ev-max" className="input" type="number" min="1" value={form.max_participants} onChange={(e) => set('max_participants', e.target.value)} dir="ltr" />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading} aria-busy={loading}>
          {loading ? 'יוצר אירוע...' : 'יצירת אירוע'}
        </button>
      </form>
    </div>
  )
}
