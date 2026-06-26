import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoEvents } from '@/lib/demo'
import { EventCard } from '@/components/events/EventCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import type { Event } from '@/types'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'מפגשים אמיתיים',
  description:
    '18 אירועים חברתיים בחודש ברחבי הארץ - הצטרפו וכירו בעלי כלבים מהקהילה.',
  path: '/events',
})
export const dynamic = 'force-dynamic'

/**
 * מנרמל את ספירת הנרשמים מתשובת Supabase. השאילתה משתמשת ב-
 * `registrations:event_registrations(count)`, ש-PostGREST מחזיר כמערך
 * `[{ count: number }]`. מחזיר את הספירה, או 0 כברירת מחדל.
 */
function extractRegistrationCount(event: {
  registrations?: { count?: number }[] | null
}): number {
  const first = event.registrations?.[0]
  return typeof first?.count === 'number' ? first.count : 0
}

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events, isDemo } = await safeQuery<Event[]>(
    () =>
      supabase
        .from('events')
        .select('*, organizer:profiles(id, full_name, avatar_url), registrations:event_registrations(count)')
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true }) as any,
    demoEvents
  )

  const list: Event[] = (events as any[]).map((e) => ({
    ...e,
    registrations_count: extractRegistrationCount(e),
  }))

  return (
    <main className="page">
      <div className="ev-head" style={{ marginBottom: 36 }}>
        <div>
          <span className="section-tag">אירועים</span>
          <h1 className="page-title">מפגשים אמיתיים</h1>
        </div>
        <Link href="/events/create" className="btn btn-dark" aria-label="צור אירוע חדש">
          <span aria-hidden="true">+ </span>צור אירוע
        </Link>
      </div>

      {isDemo && <DemoBanner />}

      {list.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 28px' }}>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
            עדיין אין אירועים קרובים
          </p>
          <p className="muted" style={{ marginBottom: 24 }}>
            רוצים להיות הראשונים? ארגנו מפגש לקהילה.
          </p>
          <Link href="/events/create" className="btn btn-primary">
            צרו את האירוע הראשון
          </Link>
        </div>
      ) : (
        <ul className="ev-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {list.map((e) => (
            <li key={e.id}>
              <EventCard event={e} demo={isDemo} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
