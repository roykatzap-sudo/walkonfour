'use client'

import {
  EVENT_META,
  describeDueIn,
  formatDateHe,
  type Reminder,
  type ReminderStatus,
} from '@/lib/healthTracker'

/**
 * "תזכורות קרובות" - כרטיס סיכום של תזכורות מחושבות לכל הכלבים.
 * רכיב תצוגה בלבד: מקבל את התזכורות כבר מחושבות מההורה.
 *
 * התזכורות הן עזר לארגון בלבד (למשל חיסון שנה אחרי האחרון), ואינן
 * הנחיה רפואית. הווטרינר קובע מתי באמת לחזור.
 */
export function UpcomingReminders({ reminders }: { reminders: Reminder[] }) {
  if (reminders.length === 0) {
    return (
      <div
        className="card"
        style={{ textAlign: 'center', color: 'var(--text-muted)', lineHeight: 1.7 }}
      >
        אין כרגע תזכורות קרובות. ברגע שתרשמו אירוע מחזורי כמו חיסון או תילוע,
        נחשב כאן מתי בערך כדאי לחזור עליו.
      </div>
    )
  }

  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 14,
      }}
    >
      {reminders.map((r) => {
        const meta = EVENT_META[r.type]
        const tone = STATUS_TONE[r.status]
        return (
          <li key={r.id}>
            <div
              className="card"
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                padding: 20,
                borderInlineStart: `4px solid ${tone.accent}`,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>
                  {meta.label}
                </span>
                <span
                  style={{
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: 800,
                    padding: 'var(--chip-md-pad)',
                    borderRadius: 100,
                    background: tone.bg,
                    color: tone.fg,
                  }}
                >
                  {tone.label}
                </span>
              </div>

              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                {r.dogName} · {describeDueIn(r.daysUntil)}
              </p>

              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                תזכורת ל-{formatDateHe(r.dueDate)}
                <br />
                לפי הרישום האחרון מ-{formatDateHe(r.basedOnDate)}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** גוון תצוגה לפי דחיפות התזכורת - בתוך פלטת הקרם-לברדור בלבד. */
const STATUS_TONE: Record<
  ReminderStatus,
  { label: string; accent: string; bg: string; fg: string }
> = {
  overdue: {
    label: 'הגיע הזמן',
    accent: 'var(--brand-dark)',
    bg: '#f4e2c8',
    fg: '#7a5320',
  },
  soon: {
    label: 'בקרוב',
    accent: 'var(--brand)',
    bg: '#fdf6e9',
    fg: '#8a6126',
  },
  upcoming: {
    label: 'בהמשך',
    accent: 'rgba(201,154,91,.4)',
    bg: '#fbf7ef',
    fg: 'var(--text-muted)',
  },
}
