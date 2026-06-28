import type { CSSProperties } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoEvents } from '@/lib/demo'
import { EventCard } from '@/components/events/EventCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { formatEventDate, formatPrice } from '@/lib/utils'
import { absoluteUrl, ogImageUrl } from '@/lib/seo'
import type { Event } from '@/types'

export const dynamic = 'force-dynamic'

const CATEGORY_LABEL: Record<Event['category'], string> = {
  meetup: 'מפגש קהילתי', lecture: 'הרצאה', market: 'יריד', training: 'אילוף', other: 'אירוע',
}
const u = (id: string) => `https://images.unsplash.com/${id}?w=1000&auto=format&fit=crop&q=55`
const FALLBACK_IMG = u('photo-1601758228041-f3b2795255f1')

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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = await createClient()
  const demoMatch = demoEvents.find((e) => e.id === params.id) ?? null

  const { data: event } = await safeQuery<Event | null>(
    () =>
      supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single() as any,
    demoMatch
  )

  if (!event) return { title: 'אירוע לא נמצא · קהילה על ארבע' }

  const description = event.description || `אירוע בקטגוריית ${CATEGORY_LABEL[event.category]}`
  const ogImage = absoluteUrl(ogImageUrl({ title: event.title, subtitle: CATEGORY_LABEL[event.category], tag: 'אירוע' }))
  return {
    title: `${event.title} · קהילה על ארבע`,
    description,
    openGraph: { title: event.title, description, type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }] },
    twitter: { card: 'summary_large_image', title: event.title, description, images: [ogImage] },
  }
}

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

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const demoMatch = demoEvents.find((e) => e.id === params.id) ?? null

  const { data: event, isDemo } = await safeQuery<Event | null>(
    () =>
      supabase
        .from('events')
        .select('*, organizer:profiles(id, full_name, avatar_url), registrations:event_registrations(count)')
        .eq('id', params.id)
        .single() as any,
    demoMatch
  )

  if (!event) notFound()

  const count = extractRegistrationCount(event as any)

  return (
    <main className="page">
      <Link href="/events" className="link" style={{ display: 'inline-block', marginBottom: 20 }}><span aria-hidden="true">← </span>חזרה לאירועים</Link>
      {isDemo && <DemoBanner />}

      <div style={{ borderRadius: 24, overflow: 'hidden', marginBottom: 28, height: 360, position: 'relative' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img loading="eager" fetchPriority="high" decoding="async" src={event.image_url || FALLBACK_IMG} alt={`תמונת האירוע ${event.title}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div className="ev-type" style={{ marginBottom: 8 }}>{CATEGORY_LABEL[event.category]}</div>
      <h1 className="page-title">{event.title}</h1>

      <dl style={{ display: 'flex', gap: 24, flexWrap: 'wrap', color: '#5a5048', fontSize: 16, margin: '14px 0 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
          <dt style={{ margin: 0 }}><span aria-hidden="true">🗓️</span><span style={SR_ONLY}>מועד</span></dt>
          <dd style={{ margin: 0 }}>{formatEventDate(event.event_date)}</dd>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
          <dt style={{ margin: 0 }}><span aria-hidden="true">📍</span><span style={SR_ONLY}>מיקום</span></dt>
          <dd style={{ margin: 0 }}>{event.location}, {event.city}</dd>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
          <dt style={{ margin: 0 }}><span aria-hidden="true">👥</span><span style={SR_ONLY}>נרשמו</span></dt>
          <dd style={{ margin: 0 }}>{count} נרשמו</dd>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0 }}>
          <dt style={{ margin: 0 }}><span aria-hidden="true">💰</span><span style={SR_ONLY}>מחיר</span></dt>
          <dd style={{ margin: 0 }}>{formatPrice(event.price)}</dd>
        </div>
      </dl>

      {event.description && (
        <div className="card" style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 12px' }}>על האירוע</h2>
          <p style={{ lineHeight: 1.8, color: '#332b22' }}>{event.description}</p>
        </div>
      )}

      <section aria-label="הרשמה לאירוע" style={{ maxWidth: 380 }}>
        <h2 style={SR_ONLY}>הרשמה לאירוע</h2>
        <EventCard event={{ ...event, registrations_count: count }} demo={isDemo} />
      </section>
    </main>
  )
}
