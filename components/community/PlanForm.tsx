'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Dog = { id: number; name: string }
type Park = { id: number | string; name: string | null; city: string | null }

/** טופס יצירת תיאום הגעה: בחירת כלב + גינה + שעה (עד 24 שעות קדימה). */
export function PlanForm({ dogs, parks }: { dogs: Dog[]; parks: Park[] }) {
  const router = useRouter()
  const [dogId, setDogId] = useState(dogs[0]?.id ?? 0)
  const [parkKey, setParkKey] = useState(String(parks[0]?.id ?? ''))
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [err, setErr] = useState('')

  // ברירת מחדל: שעה קרובה הקרובה (השעה הבאה כשהדף נטען)
  useEffect(() => {
    const now = new Date()
    const next = new Date(now.getTime() + 60 * 60_000) // שעה מעכשiv
    const localDate = next.toISOString().slice(0, 10)
    const localTime = next.toTimeString().slice(0, 5)
    setDate(localDate)
    setTime(localTime)
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setErr('')
    if (!dogId || !parkKey || !date || !time) { setErr('חסרים פרטים'); return }
    const arrivalAt = new Date(`${date}T${time}:00`).toISOString()
    setState('sending')
    try {
      const res = await fetch('/api/community/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dog_id: dogId, park_key: parkKey, arrival_at: arrivalAt }),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'arrival_past') setErr('השעה שבחרתם כבר עברה')
        else if (data.error === 'arrival_too_far') setErr('אפשר לתאם עד 24 שעות קדימה בלבד')
        else if (data.error === 'dog_not_found') setErr('הכלב לא נמצא')
        else setErr('שגיאה בשמירה')
        setState('error')
        return
      }
      router.push('/community/plans')
      router.refresh()
    } catch {
      setErr('שגיאת רשת')
      setState('error')
    }
  }

  if (dogs.length === 0) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 6 }} aria-hidden="true">🐕</div>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>קודם תוסיפו כלב</h2>
        <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: '0 0 14px' }}>
          כדי לתאם הגעה לגינה - חייב להיות כלב רשום.
        </p>
        <a href="/community/dogs/new" className="btn btn-primary">הוספת כלב</a>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div>
        <label htmlFor="pl-dog" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          עם איזה כלב?
        </label>
        <select
          id="pl-dog"
          value={dogId}
          onChange={(e) => setDogId(Number(e.target.value))}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, background: '#fff' }}
        >
          {dogs.map((d) => <option key={d.id} value={d.id}>🐕 {d.name}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="pl-park" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          לאיזו גינה?
        </label>
        <select
          id="pl-park"
          value={parkKey}
          onChange={(e) => setParkKey(e.target.value)}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, background: '#fff' }}
        >
          {parks.map((p) => (
            <option key={p.id} value={String(p.id)}>
              📍 {p.name || 'גינה'}{p.city ? ` · ${p.city}` : ''}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label htmlFor="pl-date" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
            מתי?
          </label>
          <input
            id="pl-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: '100%', padding: '13px 14px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, fontFamily: 'inherit' }}
          />
        </div>
        <div>
          <label htmlFor="pl-time" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
            באיזו שעה?
          </label>
          <input
            id="pl-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            style={{ width: '100%', padding: '13px 14px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, fontFamily: 'inherit' }}
          />
        </div>
      </div>

      <p style={{ fontSize: 13, color: '#8a7c66', margin: 0, lineHeight: 1.6 }}>
        🔒 <strong>פרטיות:</strong> השם והכלב שלכם נחשפים לחברים בקהילה <strong>רק 15 דקות לפני שעת ההגעה</strong>. עד אז - אנונימי. אפשר לבטל בכל עת. התיאום נמחק אוטומטית 30 דקות אחרי השעה.
      </p>

      <button type="submit" className="btn btn-primary" disabled={state === 'sending'} style={{ fontSize: 16, padding: '14px' }}>
        {state === 'sending' ? 'שומר...' : 'תיאום הגעה 📍'}
      </button>
      {err && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>{err}</div>}
    </form>
  )
}
