import { buildMetadata } from '@/lib/seo'
import { AdminParkReports } from '@/components/admin/AdminParkReports'

export const metadata = buildMetadata({
  title: 'אדמין · דיווחי גינות',
  description: 'פאנל ניהול דיווחי גינות חסרות.',
  path: '/admin/park-reports',
  noindex: true,
})

export default function AdminParkReportsPage() {
  return (
    <main className="page" style={{ maxWidth: 720 }}>
      <span className="section-tag">אדמין</span>
      <h1 className="page-title" style={{ fontSize: 34, marginBottom: 6 }}>דיווחי גינות חסרות</h1>
      <p className="page-sub" style={{ fontSize: 15.5, color: '#6a6155', marginBottom: 24 }}>
        אשרו או דחו גינות שמשתמשים דיווחו עליהן. גינה שתאושר תופיע על המפה.
      </p>
      <AdminParkReports />
    </main>
  )
}
