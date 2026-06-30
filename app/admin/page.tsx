import { buildMetadata } from '@/lib/seo'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export const metadata = buildMetadata({
  title: 'פאנל ניהול · קהילה על ארבע',
  description: 'פאנל ניהול פנימי.',
  path: '/admin',
  noindex: true,
})

export default function AdminPage() {
  return (
    <main className="page" style={{ maxWidth: 1000, paddingTop: 40 }}>
      <AdminDashboard />
    </main>
  )
}
