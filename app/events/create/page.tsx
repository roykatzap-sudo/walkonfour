import Link from 'next/link'
import { EventForm } from '@/components/events/EventForm'

export const metadata = { title: 'יצירת אירוע · קהילה על ארבע' }

export default function CreateEventPage() {
  return (
    <main className="page page-narrow">
      <Link href="/events" className="link" style={{ display: 'inline-block', marginBottom: 20 }}>
        <span aria-hidden="true">← </span>חזרה לאירועים
      </Link>
      <h1 className="page-title">יצירת אירוע</h1>
      <p className="page-sub">ארגנו מפגש, הרצאה או יריד לקהילה.</p>
      <EventForm />
    </main>
  )
}
