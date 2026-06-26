'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { formatEventDate, formatPrice } from '@/lib/utils'
import { Tilt3D } from '@/components/fx/Tilt3D'
import type { Event } from '@/types'

const CATEGORY_LABEL: Record<Event['category'], string> = {
  meetup: 'מפגש קהילתי',
  lecture: 'הרצאה',
  market: 'יריד',
  training: 'אילוף',
  other: 'אירוע',
}

const u = (id: string) => `https://images.unsplash.com/${id}?w=700&auto=format&fit=crop&q=55`
const FALLBACK_IMG = u('photo-1601758228041-f3b2795255f1')

/** טקסט לקוראי מסך בלבד - נסתר ויזואלית. */
const SR_ONLY: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function EventCard({ event, demo }: { event: Event; demo?: boolean }) {
  const toast = useToast()
  const [registered, setRegistered] = useState(!!event.is_registered)
  const [count, setCount] = useState(event.registrations_count ?? 0)

  async function register() {
    if (demo) {
      setRegistered(true)
      setCount((c) => c + 1)
      toast(`נרשמת בהצלחה ל${event.title}`)
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
    if (!user) {
      toast('כדי להירשם לאירוע צריך להתחבר תחילה')
      return
    }
    const { error } = await supabase
      .from('event_registrations')
      .insert({ event_id: event.id, user_id: user.id })
    if (error) {
      toast('משהו השתבש בהרשמה. נסו שוב')
      return
    }
    setRegistered(true)
    setCount((c) => c + 1)
    toast('נרשמת בהצלחה לאירוע')
  }

  const dateLabel = formatEventDate(event.event_date)
  const categoryLabel = CATEGORY_LABEL[event.category]

  return (
    <Tilt3D className="ev-tilt" max={8} glare>
      <article className="ev sweep lift-3d-sm" aria-label={`אירוע: ${event.title}`}>
        <div className="ev-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            loading="lazy"
            decoding="async"
            src={event.image_url || FALLBACK_IMG}
            alt={`תמונת האירוע ${event.title}`}
          />
          <div className="ev-badge">
            <span style={SR_ONLY}>מועד: </span>
            {dateLabel}
          </div>
        </div>
        <div className="ev-body">
          <div className="ev-type">{categoryLabel}</div>
          <h3 className="ev-title" style={{ margin: 0 }}>
            <Link
              href={`/events/${event.id}`}
              style={{ textDecoration: 'none', color: 'inherit', borderRadius: 4 }}
            >
              {event.title}
            </Link>
          </h3>
          <div className="ev-loc" style={{ color: '#6b6258' }}>
            <span aria-hidden="true">📍 </span>
            {event.city} · {count} נרשמו
          </div>
        </div>
        <div className="ev-foot">
          <span className="ev-price">{formatPrice(event.price)}</span>
          <button
            className="ev-btn"
            onClick={register}
            disabled={registered}
            aria-pressed={registered}
            aria-label={
              registered
                ? `נרשמת לאירוע ${event.title}`
                : `הרשמה לאירוע ${event.title}`
            }
          >
            {registered ? '✓ נרשמת' : 'הרשמה'}
          </button>
        </div>
      </article>
    </Tilt3D>
  )
}
