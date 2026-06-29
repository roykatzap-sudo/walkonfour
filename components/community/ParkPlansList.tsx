'use client'

import { useEffect, useState } from 'react'

type OtherPlan = {
  id: number
  arrival_at: string
  anonymized: boolean
  dog: { breed: string | null; age_years: number | null; temperament: string | null }
  nickname?: string
  dog_name?: string
}

export function ParkPlansList({ parkKey }: { parkKey: string }) {
  const [plans, setPlans] = useState<OtherPlan[] | null>(null)

  useEffect(() => {
    function load() {
      fetch(`/api/community/plans?park_key=${encodeURIComponent(parkKey)}`)
        .then((r) => r.json())
        .then((d) => setPlans(d.plans || []))
        .catch(() => setPlans([]))
    }
    load()
    const t = setInterval(load, 30_000) // רענון כל 30 שניות (לחשיפת שמות 15 דק׳ לפני)
    return () => clearInterval(t)
  }, [parkKey])

  if (plans === null) return <div style={{ padding: 14, color: '#5b4d3c', fontSize: 14 }}>טוען...</div>
  if (plans.length === 0) {
    return (
      <div style={{ padding: '14px 16px', fontSize: 14, color: '#5b4d3c', textAlign: 'center' }}>
        אין כרגע תיאומי הגעה לגינה הזו. תהיו הראשונים!
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
      {plans.map((p) => {
        const arr = new Date(p.arrival_at)
        const isToday = arr.toDateString() === new Date().toDateString()
        const time = arr.toTimeString().slice(0, 5)
        const minutesUntil = Math.round((arr.getTime() - Date.now()) / 60_000)
        return (
          <li key={p.id} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 12, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 22 }} aria-hidden="true">{p.anonymized ? '🐾' : '🐕'}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14.5, color: 'var(--ink)', fontWeight: 800 }}>
                {p.anonymized
                  ? (
                    <>
                      <span style={{ color: '#8a7c66', fontWeight: 700 }}>אנונימי</span>
                      {' · '}
                      <span style={{ fontSize: 12.5, color: '#a37536', fontWeight: 600 }}>השם יחשף 15 דק׳ לפני</span>
                    </>
                  )
                  : (
                    <>
                      {p.nickname} עם {p.dog_name}
                    </>
                  )}
              </div>
              <div style={{ fontSize: 13, color: '#5b4d3c', marginTop: 2 }}>
                {isToday ? `היום ${time}` : `${arr.toLocaleDateString('he-IL')} ${time}`}
                {minutesUntil > 0 && minutesUntil < 120 && ` · בעוד ${minutesUntil} דק׳`}
                {[p.dog.breed, p.dog.temperament].filter(Boolean).length > 0 && ` · ${[p.dog.breed, p.dog.temperament].filter(Boolean).join(', ')}`}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
