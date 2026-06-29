import { buildMetadata } from '@/lib/seo'
import { AdminSuggestions } from '@/components/admin/AdminSuggestions'

export const metadata = buildMetadata({
  title: 'אדמין · הצעות',
  description: 'פאנל ניהול הצעות משתמשים למדריכי הערים.',
  path: '/admin/suggestions',
  noindex: true,
})

export default function AdminSuggestionsPage() {
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <span className="section-tag">אדמין</span>
      <h1 className="page-title" style={{ fontSize: 34, marginBottom: 6 }}>הצעות מהקהילה</h1>
      <p className="page-sub" style={{ fontSize: 15.5, color: '#6a6155', marginBottom: 24 }}>
        כל ההצעות מהמשתמשים, מקובצות לפי העמוד שממנו נשלחו. לכל הצעה מסומן הסוג (גינה / מסלול / גזע / כללי).
      </p>
      <AdminSuggestions />
    </main>
  )
}
