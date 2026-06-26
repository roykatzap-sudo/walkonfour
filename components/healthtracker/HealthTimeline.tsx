'use client'

import {
  EVENT_META,
  formatDateHe,
  sortEventsDesc,
  type HealthEvent,
} from '@/lib/healthTracker'

/**
 * ציר זמן אירועי הבריאות של כלב נבחר - מהחדש לישן.
 * רכיב תצוגה בלבד. מאפשר מחיקת רישום (דרך onDelete).
 */
export function HealthTimeline({
  events,
  onDelete,
}: {
  events: HealthEvent[]
  onDelete: (id: string) => void
}) {
  if (events.length === 0) {
    return (
      <div
        className="card"
        style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.7 }}
      >
        עדיין אין רישומים לכלב הזה. הוסיפו אירוע ראשון - חיסון, ביקור וטרינר,
        תילוע או טיפול - והוא יופיע כאן בציר הזמן.
      </div>
    )
  }

  const sorted = sortEventsDesc(events)

  return (
    <ol className="ht-timeline" aria-label="ציר זמן אירועי בריאות">
      {sorted.map((ev) => {
        const meta = EVENT_META[ev.type]
        return (
          <li key={ev.id} className="ht-tl-item">
            <span className="ht-tl-node" aria-hidden="true" />
            <div className="card ht-tl-card">
              <div className="ht-tl-head">
                <div>
                  <span className="ht-tl-type">{meta.label}</span>
                  <time className="ht-tl-date" dateTime={ev.date}>
                    {formatDateHe(ev.date)}
                  </time>
                </div>
                <button
                  type="button"
                  className="ht-tl-del"
                  onClick={() => onDelete(ev.id)}
                  aria-label={`מחק את הרישום: ${meta.label} מ-${formatDateHe(ev.date)}`}
                >
                  מחק
                </button>
              </div>

              {ev.note && <p className="ht-tl-note">{ev.note}</p>}

              {ev.reminderMonths != null && (
                <p className="ht-tl-reminder">
                  תזכורת חוזרת מחושבת כל{' '}
                  {ev.reminderMonths === 1
                    ? 'חודש'
                    : ev.reminderMonths === 12
                      ? 'שנה'
                      : `${ev.reminderMonths} חודשים`}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
