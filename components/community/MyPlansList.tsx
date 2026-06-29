'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Plan = {
  id: number
  park_key: string
  arrival_at: string
  dog: { name: string; breed: string | null; temperament: string | null }
}

export function MyPlansList() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[] | null>(null)
  const [cancelling, setCancelling] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/community/plans?mine=1')
      .then((r) => r.json())
      .then((d) => setPlans(d.plans || []))
      .catch(() => setPlans([]))
  }, [])

  async function cancel(id: number) {
    if (cancelling) return
    setCancelling(id)
    try {
      const res = await fetch(`/api/community/plans/${id}`, { method: 'DELETE' })
      if ((await res.json()).ok) {
        setPlans((p) => (p ?? []).filter((x) => x.id !== id))
        router.refresh()
      }
    } finally {
      setCancelling(null)
    }
  }

  if (plans === null) {
    return <div className="card" style={{ padding: 28, textAlign: 'center', color: '#5b4d3c' }}>טוען...</div>
  }
  if (plans.length === 0) {
    return (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 36 }} aria-hidden="true">⏰</div>
        <p style={{ fontSize: 15, color: 'var(--ink)', margin: '8px 0 16px' }}>אין לכם תיאומים פעילים.</p>
        <Link href="/community/plans/new" className="btn btn-primary">תיאום חדש</Link>
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {plans.map((p) => {
        const date = new Date(p.arrival_at)
        const isToday = date.toDateString() === new Date().toDateString()
        const fmt = isToday ? `היום ${date.toTimeString().slice(0, 5)}` : `${date.toLocaleDateString('he-IL')} ${date.toTimeString().slice(0, 5)}`
        return (
          <div key={p.id} className="card" style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ fontSize: 30 }} aria-hidden="true">📍</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 16, fontWeight: 900, color: 'var(--ink)' }}>{fmt}</div>
              <div style={{ fontSize: 13.5, color: '#5b4d3c', marginTop: 2 }}>
                עם <strong>{p.dog.name}</strong>
                {p.dog.breed ? ` (${p.dog.breed})` : ''}
                {p.dog.temperament ? ` · ${p.dog.temperament}` : ''}
              </div>
            </div>
            <button
              type="button"
              onClick={() => cancel(p.id)}
              disabled={cancelling === p.id}
              style={{ background: 'none', border: 'none', color: '#a23c2e', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
            >
              {cancelling === p.id ? '...' : 'ביטול'}
            </button>
          </div>
        )
      })}
    </div>
  )
}
