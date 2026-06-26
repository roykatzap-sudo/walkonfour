'use client'

import { useId, useState } from 'react'
import { todayISO } from '@/lib/healthTracker'

/** ערכי טופס הוספת כלב. */
export type DogDraft = { name: string; breed: string; birthDate: string }

/**
 * טופס הוספת כלב - שם (חובה), גזע (רשות), תאריך לידה (רשות).
 * נגיש: label אמיתי לכל שדה, הודעת שגיאה מקושרת ב-aria-describedby.
 */
export function AddDogForm({ onAdd }: { onAdd: (draft: DogDraft) => void }) {
  const uid = useId()
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('צריך להזין שם לכלב כדי להוסיף אותו.')
      return
    }
    if (birthDate && birthDate > todayISO()) {
      setError('תאריך הלידה לא יכול להיות בעתיד.')
      return
    }
    onAdd({ name: trimmed, breed: breed.trim(), birthDate })
    setName('')
    setBreed('')
    setBirthDate('')
    setError('')
  }

  const nameId = `${uid}-name`
  const breedId = `${uid}-breed`
  const birthId = `${uid}-birth`
  const errId = `${uid}-err`

  return (
    <form className="card ht-form" onSubmit={submit} noValidate>
      <div className="ht-field-grid">
        <div className="ht-field">
          <label htmlFor={nameId} className="ht-label">
            שם הכלב <span className="ht-req" aria-hidden="true">*</span>
          </label>
          <input
            id={nameId}
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="לדוגמה: לונה"
            required
            aria-required="true"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
            autoComplete="off"
            maxLength={40}
          />
        </div>

        <div className="ht-field">
          <label htmlFor={breedId} className="ht-label">
            גזע <span className="ht-opt">(לא חובה)</span>
          </label>
          <input
            id={breedId}
            className="input"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="לדוגמה: לברדור / מעורב"
            autoComplete="off"
            maxLength={60}
          />
        </div>

        <div className="ht-field">
          <label htmlFor={birthId} className="ht-label">
            תאריך לידה <span className="ht-opt">(אם ידוע)</span>
          </label>
          <input
            id={birthId}
            type="date"
            className="input"
            value={birthDate}
            max={todayISO()}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <p id={errId} role="alert" className="ht-error">
          {error}
        </p>
      )}

      <div className="ht-form-actions">
        <button type="submit" className="btn btn-primary">
          הוספת כלב
        </button>
      </div>
    </form>
  )
}
