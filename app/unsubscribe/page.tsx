import { buildMetadata } from '@/lib/seo'
import { Unsubscribe } from '@/components/waitlist/Unsubscribe'

export const metadata = buildMetadata({
  title: 'הסרה מרשימת הדיוור',
  description: 'הסרה מרשימת הדיוור של קהילה על ארבע.',
  path: '/unsubscribe',
  noindex: true,
})

export const dynamic = 'force-dynamic'

export default function UnsubscribePage() {
  return (
    <main className="page page-narrow">
      <span className="section-tag">דיוור</span>
      <h1 className="page-title display" style={{ fontSize: 34, marginBottom: 8 }}>הסרה מרשימת הדיוור</h1>
      <Unsubscribe />
    </main>
  )
}
