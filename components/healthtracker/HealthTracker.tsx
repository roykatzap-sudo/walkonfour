'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '@/components/shared/Toast'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { AddDogForm, type DogDraft } from './AddDogForm'
import { AddEventForm, type EventDraft } from './AddEventForm'
import { HealthTimeline } from './HealthTimeline'
import { UpcomingReminders } from './UpcomingReminders'
import {
  EVENT_META,
  computeReminders,
  describeAge,
  emptyState,
  makeId,
  readState,
  writeState,
  type Dog,
  type HealthEvent,
  type HealthState,
  type StorageError,
} from '@/lib/healthTracker'
import './healthTracker.css'

/**
 * מעקב בריאות אישי לכלב - הרכיב הראשי (client).
 *
 * אחראי על המצב, על השמירה ב-localStorage ('kalbaniya:health') ועל הרכבת
 * תתי-הרכיבים: הוספת כלב, בורר כלבים, רישום אירוע, תזכורות קרובות וציר זמן.
 *
 * אין backend ואין הבטחות רפואיות. התזכורות הן עזר לארגון בלבד.
 */
export function HealthTracker() {
  const toast = useToast()

  const [state, setState] = useState<HealthState>(emptyState)
  const [activeDogId, setActiveDogId] = useState<string>('')
  const [storageError, setStorageError] = useState<StorageError>('none')
  const [hydrated, setHydrated] = useState(false)

  // טעינה חד-פעמית בצד הלקוח (נמנע מ-hydration mismatch).
  useEffect(() => {
    const { state: loaded, error } = readState()
    setState(loaded)
    setStorageError(error)
    if (loaded.dogs.length > 0) setActiveDogId(loaded.dogs[0].id)
    setHydrated(true)
  }, [])

  // שמירה בכל שינוי מצב - רק אחרי שהטעינה הראשונית הסתיימה.
  const persist = useCallback((next: HealthState) => {
    setState(next)
    const err = writeState(next)
    setStorageError(err)
  }, [])

  const addDog = useCallback(
    (draft: DogDraft) => {
      const dog: Dog = {
        id: makeId(),
        name: draft.name,
        breed: draft.breed,
        birthDate: draft.birthDate,
        createdAt: new Date().toISOString(),
      }
      persist({ ...state, dogs: [...state.dogs, dog] })
      setActiveDogId(dog.id)
      toast(`${dog.name} נוסף למעקב`)
    },
    [state, persist, toast],
  )

  const removeDog = useCallback(
    (dogId: string) => {
      const dog = state.dogs.find((d) => d.id === dogId)
      const dogs = state.dogs.filter((d) => d.id !== dogId)
      const events = state.events.filter((e) => e.dogId !== dogId)
      persist({ ...state, dogs, events })
      if (activeDogId === dogId) {
        setActiveDogId(dogs[0]?.id ?? '')
      }
      if (dog) toast(`${dog.name} והרישומים שלו הוסרו`)
    },
    [state, activeDogId, persist, toast],
  )

  const addEvent = useCallback(
    (dogId: string, draft: EventDraft) => {
      const meta = EVENT_META[draft.type]
      const reminderMonths = draft.reminderOn ? meta.defaultReminderMonths : null
      const ev: HealthEvent = {
        id: makeId(),
        dogId,
        type: draft.type,
        date: draft.date,
        note: draft.note,
        reminderMonths,
        createdAt: new Date().toISOString(),
      }
      persist({ ...state, events: [...state.events, ev] })
      toast(`${meta.label} נרשם`)
    },
    [state, persist, toast],
  )

  const removeEvent = useCallback(
    (eventId: string) => {
      persist({ ...state, events: state.events.filter((e) => e.id !== eventId) })
      toast('הרישום נמחק')
    },
    [state, persist, toast],
  )

  const activeDog = useMemo(
    () => state.dogs.find((d) => d.id === activeDogId) ?? null,
    [state.dogs, activeDogId],
  )

  const activeEvents = useMemo(
    () => state.events.filter((e) => e.dogId === activeDogId),
    [state.events, activeDogId],
  )

  const reminders = useMemo(
    () => computeReminders(state.dogs, state.events),
    [state.dogs, state.events],
  )

  // לפני הידרציה - שלד שקט כדי שלא יהיה הבדל בין השרת ללקוח.
  if (!hydrated) {
    return (
      <div className="card" aria-hidden="true" style={{ minHeight: 160, opacity: 0.5 }} />
    )
  }

  return (
    <div>
      {storageError !== 'none' && (
        <div role="alert" className="ht-storage-warn">
          <span aria-hidden="true" className="ht-storage-icon">!</span>
          <span>
            {storageError === 'quota'
              ? 'האחסון בדפדפן מלא, ולכן לא ניתן לשמור שינויים חדשים. המעקב ממשיך לעבוד בזיכרון עד לסגירת הדף.'
              : 'הנתונים אינם נשמרים בדפדפן (מצב גלישה פרטי או אחסון חסום). אפשר להמשיך להשתמש, אך המעקב יתאפס בסגירת הדף.'}
          </span>
        </div>
      )}

      {/* ── תזכורות קרובות ── */}
      {state.dogs.length > 0 && (
        <Reveal3D as="section" aria-labelledby="ht-rem-h" style={{ marginBottom: 40 }}>
          <header className="ht-block-head">
            <span className="section-tag">מבט קדימה</span>
            <h2 id="ht-rem-h" className="section-title">תזכורות קרובות</h2>
            <p className="ht-block-sub">
              חישבנו מתי בערך כדאי לחזור על אירועים מחזוריים - למשל חיסון שנה אחרי
              האחרון, או תילוע כעבור שלושה חודשים. זו עזרה לזיכרון בלבד, לא הנחיה רפואית.
            </p>
          </header>
          <UpcomingReminders reminders={reminders} />
        </Reveal3D>
      )}

      {/* ── הוספת כלב ── */}
      <Reveal3D as="section" aria-labelledby="ht-add-h" style={{ marginBottom: 40 }}>
        <header className="ht-block-head">
          <span className="section-tag">הכלבים שלי</span>
          <h2 id="ht-add-h" className="section-title">הוספת כלב למעקב</h2>
          <p className="ht-block-sub">
            הזינו שם, וגם גזע ותאריך לידה אם ידועים. הכול נשמר רק בדפדפן הזה -
            אין חשבון, אין שרת, ואף אחד אחר לא רואה את הנתונים.
          </p>
        </header>

        <AddDogForm onAdd={addDog} />

        {/* בורר כלבים */}
        {state.dogs.length > 0 && (
          <div className="ht-dog-picker" role="group" aria-label="בחירת כלב פעיל">
            {state.dogs.map((dog) => {
              const active = dog.id === activeDogId
              const age = describeAge(dog.birthDate)
              return (
                <button
                  key={dog.id}
                  type="button"
                  className={`ht-dog-chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setActiveDogId(dog.id)}
                >
                  <span className="ht-dog-name">{dog.name}</span>
                  {(dog.breed || age) && (
                    <span className="ht-dog-meta">
                      {[dog.breed, age].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </Reveal3D>

      {/* ── רישום אירוע + ציר זמן לכלב הפעיל ── */}
      {activeDog ? (
        <Reveal3D as="section" aria-labelledby="ht-dog-h" key={activeDog.id}>
          <header className="ht-block-head ht-dog-head">
            <div>
              <span className="section-tag">תיק בריאות</span>
              <h2 id="ht-dog-h" className="section-title">
                {activeDog.name}
              </h2>
              {(activeDog.breed || describeAge(activeDog.birthDate)) && (
                <p className="ht-block-sub" style={{ marginBottom: 0 }}>
                  {[activeDog.breed, describeAge(activeDog.birthDate) && `בן/בת ${describeAge(activeDog.birthDate)}`]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              )}
            </div>
            <button
              type="button"
              className="link ht-remove-dog"
              onClick={() => removeDog(activeDog.id)}
            >
              הסרת הכלב מהמעקב
            </button>
          </header>

          <div className="ht-dog-grid">
            <div>
              <h3 className="ht-sub-h">רישום אירוע חדש</h3>
              <AddEventForm
                dogName={activeDog.name}
                onAdd={(draft) => addEvent(activeDog.id, draft)}
              />
            </div>

            <div>
              <h3 className="ht-sub-h">
                ציר הזמן
                <span className="chip3d" style={{ marginInlineStart: 10, verticalAlign: 'middle' }}>
                  {activeEvents.length}
                </span>
              </h3>
              <HealthTimeline events={activeEvents} onDelete={removeEvent} />
            </div>
          </div>
        </Reveal3D>
      ) : (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          הוסיפו כלב ראשון כדי להתחיל לרשום אירועי בריאות ולקבל תזכורות קרובות.
        </div>
      )}
    </div>
  )
}
