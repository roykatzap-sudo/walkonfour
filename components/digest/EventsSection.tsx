import Link from 'next/link'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { SectionHeader } from '@/components/digest/SectionHeader'
import { upcomingEvents } from '@/lib/digest'
import { formatEventDate, formatPrice } from '@/lib/utils'
import type { Event } from '@/types'

/** תוויות הקטגוריות - תואמות ל-EventCard, באותה פלטה. */
const CATEGORY_LABEL: Record<Event['category'], string> = {
  meetup: 'מפגש קהילתי',
  lecture: 'הרצאה',
  market: 'יריד',
  training: 'אילוף',
  other: 'אירוע',
}

/** מחלץ יום בחודש ושם-חודש קצר ל"קוביית תאריך". */
function dateParts(iso: string): { day: string; month: string } {
  const d = new Date(iso)
  const month = new Intl.DateTimeFormat('he-IL', { month: 'short' }).format(d)
  return { day: String(d.getDate()), month }
}

/**
 * אירועים קרובים - ארבעת האירועים הקרובים (ממוינים לפי תאריך ב-lib/digest).
 * שורות אופקיות בסגנון מגזין: קוביית תאריך, פרטי האירוע, מטא ומחיר.
 * read-only מ-demoEvents.
 */
export function EventsSection() {
  const events = upcomingEvents(4)
  if (events.length === 0) return null

  return (
    <section aria-labelledby="digest-events" style={{ marginBottom: 64 }}>
      <SectionHeader
        id="digest-events"
        tag="היומן הקהילתי"
        title="אירועים קרובים"
        description="מפגשים, הרצאות, ימי שוק וסדנאות אילוף - הקרובים ביותר, לפי סדר התאריכים."
        linkHref="/events"
        linkLabel="לכל האירועים"
      />

      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {events.map((e, i) => {
          const { day, month } = dateParts(e.event_date)
          const seats =
            e.max_participants != null
              ? Math.max(0, e.max_participants - (e.registrations_count ?? 0))
              : null
          return (
            <Reveal3D as="li" key={e.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Tilt3D max={5} glare={false} className="sweep" style={{ display: 'block' }}>
                <div
                  className="lift-3d card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    padding: 18,
                    borderColor: '#efe2cd',
                  }}
                >
                  {/* קוביית תאריך */}
                  <div
                    aria-hidden
                    style={{
                      flexShrink: 0,
                      width: 68,
                      height: 68,
                      borderRadius: 18,
                      display: 'grid',
                      placeItems: 'center',
                      lineHeight: 1.05,
                      textAlign: 'center',
                      color: '#fff',
                      background: 'linear-gradient(160deg, #e8c887 0%, #c99a5b 100%)',
                      boxShadow: '0 8px 20px rgba(201,154,91,.30)',
                    }}
                  >
                    <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-1px' }}>{day}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.95 }}>{month}</span>
                  </div>

                  {/* פרטי האירוע */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: '1.2px',
                          textTransform: 'uppercase',
                          color: 'var(--brand-dark)',
                        }}
                      >
                        {CATEGORY_LABEL[e.category]}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-soft)', fontWeight: 600 }}>
                        {formatEventDate(e.event_date)}
                      </span>
                    </div>
                    <h3
                      style={{
                        margin: '0 0 4px',
                        fontSize: 18,
                        fontWeight: 800,
                        lineHeight: 1.25,
                        letterSpacing: '-0.5px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {e.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-muted)' }}>
                      <span aria-hidden>⌖</span> {e.location} · {e.city}
                      {seats != null && seats > 0 ? ` · ${seats} מקומות פנויים` : ''}
                    </p>
                  </div>

                  {/* מחיר + מעבר */}
                  <div
                    style={{
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--brand-dark)' }}>
                      {formatPrice(e.price)}
                    </span>
                    <Link
                      href="/events"
                      className="btn btn-ghost"
                      style={{ padding: '8px 16px', fontSize: 14 }}
                      aria-label={`פרטים והרשמה לאירוע ${e.title}`}
                    >
                      לפרטים
                    </Link>
                  </div>
                </div>
              </Tilt3D>
            </Reveal3D>
          )
        })}
      </ul>
    </section>
  )
}
