'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TEMPERAMENTS } from '@/lib/community/dogs'

type InitialDog = {
  id?: number
  name?: string
  breed?: string | null
  age_years?: number | null
  temperament?: string | null
}

export function DogForm({ initial }: { initial?: InitialDog }) {
  const router = useRouter()
  const isEdit = Boolean(initial?.id)
  const [name, setName] = useState(initial?.name || '')
  const [breed, setBreed] = useState(initial?.breed || '')
  const [age, setAge] = useState(initial?.age_years != null ? String(initial.age_years) : '')
  const [temperament, setTemperament] = useState(initial?.temperament || '')
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'sending') return
    setErrMsg('')
    setState('sending')
    try {
      const url = isEdit ? `/api/community/dogs/${initial?.id}` : '/api/community/dogs'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          breed: breed.trim() || null,
          age_years: age.trim() ? Number(age) : null,
          temperament: temperament || null,
        }),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'name') setErrMsg('חסר שם הכלב')
        else if (data.error === 'age') setErrMsg('גיל לא תקין (0-30)')
        else if (data.error === 'unauthorized') {
          setErrMsg('פג תוקף, אנא היכנסו שוב')
          setTimeout(() => router.push('/community/login'), 1500)
          return
        }
        else setErrMsg('שגיאה. נסו שוב.')
        setState('error')
        return
      }
      router.push('/community/dogs')
      router.refresh()
    } catch {
      setErrMsg('שגיאת רשת. נסו שוב.')
      setState('error')
    }
  }

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
      <div>
        <label htmlFor="dog-name" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          שם הכלב <span style={{ color: '#a23c2e' }}>*</span>
        </label>
        <input
          id="dog-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="לונה / רקס / מוקי..."
          required
          maxLength={40}
          autoFocus
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
        />
      </div>

      <div>
        <label htmlFor="dog-breed" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          גזע (לא חובה)
        </label>
        <input
          id="dog-breed"
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
          placeholder="גולדן / לברדור / מעורב..."
          maxLength={60}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
        />
      </div>

      <div>
        <label htmlFor="dog-age" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          גיל בשנים (לא חובה)
        </label>
        <input
          id="dog-age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="3.5"
          min="0"
          max="30"
          step="0.5"
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16 }}
        />
      </div>

      <div>
        <label htmlFor="dog-temp" style={{ display: 'block', fontSize: 14.5, fontWeight: 800, color: '#5b4d3c', marginBottom: 6 }}>
          המזג של הכלב (לא חובה)
        </label>
        <select
          id="dog-temp"
          value={temperament}
          onChange={(e) => setTemperament(e.target.value)}
          style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1.5px solid rgba(201,154,91,.35)', fontSize: 16, background: '#fff' }}
        >
          <option value="">-- בחרו --</option>
          {TEMPERAMENTS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <p style={{ fontSize: 13, color: '#8a7c66', margin: '0', lineHeight: 1.55 }}>
        הפרטים אינם חובה (רק השם). יוצגו לחברי הקהילה הסגורה ליד תיאומי הגעה והודעות. ניתן לערוך/למחוק בכל עת.
      </p>

      <button type="submit" className="btn btn-primary" disabled={state === 'sending' || !name.trim()} style={{ fontSize: 16, padding: '14px' }}>
        {state === 'sending' ? 'שומר...' : isEdit ? 'שמירת שינויים' : 'שמירת הכלב 🐾'}
      </button>
      {errMsg && <div role="alert" style={{ fontSize: 14, color: '#a23c2e', textAlign: 'center' }}>{errMsg}</div>}
    </form>
  )
}
