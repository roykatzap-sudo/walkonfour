'use client'

import { useId, useMemo, useState } from 'react'
import {
  EVENT_META,
  EVENT_TYPES,
  todayISO,
  type HealthEventType,
} from '@/lib/healthTracker'

/** ערכי טופס הוספת אירוע. */
export type EventDraft = {
  type: HealthEventType
  date: string
  note: string
  /** האם לחשב תזכורת חוזרת (רלוונטי רק לסוגים מחזוריים). */
  reminderOn: boolean
}

/**
 * טופס רישום אירוע בריאות לכלב נבחר.
 * בוחרים סוג, תאריך והערה. עבור סוג מחזורי, צ'קבוקס מאפשר לכבות
 * את חישוב התזכורת. הסוג קובע את תדירות ברירת המחדל (כללי בלבד).
 */
export function AddEventForm({
  dogName,
  onAdd,
}: {
  dogName: string
  onAdd: (draft: EventDraft) => void
}) {
  const uid = useId()
  const [type, setType] = useState<HealthEventType>('vaccine')
  const [date, setDate] = useState(todayISO())
  const [note, setNote] = useState('')
  const [reminderOn, setReminderOn] = useState(true)
  const [error, setError] = useState('')

  const meta = EVENT_META[type]
  const hasReminder = meta.defaultReminderMonths != null

  const reminderLabel = useMemo(() => {
    if (!hasReminder) return meta.cadenceLabel
    const m = meta.defaultReminderMonths as number
    const every =
      m === 1 ? 'כל חודש' : m === 12 ? 'כל שנה' : `כל ${m} חודשים`
    return `נחשב לתזכורת ${every} (${meta.cadenceLabel})`
  }, [hasReminder, meta])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) {
      setError('צריך לבחור תאריך לאירוע.')
      return
    }
    if (date > todayISO()) {
      setError('תאריך האירוע לא יכול להיות בעתיד.')
      return
    }
    onAdd({ type, date, note: note.trim(), reminderOn: hasReminder && reminderOn })
    setNote('')
    setDate(todayISO())
    setError('')
  }

  const typeId = `${uid}-type`
  const dateId = `${uid}-date`
  const noteId = `${uid}-note`
  const remId = `${uid}-rem`
  const errId = `${uid}-err`

  return (
    <form className="card ht-form" onSubmit={submit} noValidate aria-label={`רישום אירוע בריאות עבור ${dogName}`}>
      <div className="ht-field-grid">
        <div className="ht-field">
          <label htmlFor={typeId} className="ht-label">
            סוג האירוע
          </label>
          <select
            id={typeId}
            className="input"
            value={type}
            onChange={(e) => {
              setType(e.target.value as HealthEventType)
              setReminderOn(true)
            }}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {EVENT_META[t].label}
              </option>
            ))}
          </select>
          <p className="ht-help">{meta.hint}</p>
        </div>

        <div className="ht-field">
          <label htmlFor={dateId} className="ht-label">
            תאריך
          </label>
          <input
            id={dateId}
            type="date"
            className="input"
            value={date}
            max={todayISO()}
            onChange={(e) => setDate(e.target.value)}
            required
            aria-required="true"
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errId : undefined}
          />
        </div>

        <div className="ht-field ht-field-wide">
          <label htmlFor={noteId} className="ht-label">
            הערה <span className="ht-opt">(לא חובה)</span>
          </label>
          <input
            id={noteId}
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="לדוגמה: חיסון משושה, שם הווטרינר, מותג התכשיר"
            autoComplete="off"
            maxLength={120}
          />
        </div>
      </div>

      {hasReminder ? (
        <label htmlFor={remId} className="ht-check">
          <input
            id={remId}
            type="checkbox"
            checked={reminderOn}
            onChange={(e) => setReminderOn(e.target.checked)}
          />
          <span>
            חשבו לי תזכורת קרובה לאירוע הזה - {reminderLabel}
          </span>
        </label>
      ) : (
        <p className="ht-help" style={{ marginTop: 4 }}>
          לסוג זה לא מחושבת תזכורת אוטומטית.
        </p>
      )}

      {error && (
        <p id={errId} role="alert" className="ht-error">
          {error}
        </p>
      )}

      <div className="ht-form-actions">
        <button type="submit" className="btn btn-dark">
          רישום האירוע
        </button>
      </div>
    </form>
  )
}
