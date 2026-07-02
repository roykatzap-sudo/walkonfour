import { buildMetadata } from '@/lib/seo'
import { AdminGate } from '@/components/admin/AdminGate'
import { AdminWaitlist } from '@/components/admin/AdminWaitlist'

export const metadata = buildMetadata({
  title: 'אדמין · רשימת המתנה',
  description: 'פאנל ניהול רשימת ההמתנה - כל הנרשמים, חיפוש, וייצוא ל-CSV.',
  path: '/admin/waitlist',
  noindex: true,
})

export default function AdminWaitlistPage() {
  return (
    <main className="page" style={{ maxWidth: 980 }}>
      <span className="section-tag">אדמין</span>
      <h1 className="page-title" style={{ fontSize: 34, marginBottom: 6 }}>רשימת המתנה</h1>
      <p className="page-sub" style={{ fontSize: 15.5, color: '#6a6155', marginBottom: 24 }}>
        כל מי שנרשם לרשימה. רואים מי אישר דיוור, אפשר לחפש לפי מייל / שם / עיר, ולהוריד CSV.
      </p>
      <AdminGate><AdminWaitlist /></AdminGate>
    </main>
  )
}
