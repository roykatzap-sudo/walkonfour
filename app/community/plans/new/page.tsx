import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { withCommunityDb } from '@/lib/community/db'
import { listUserDogs } from '@/lib/community/dogs'
import { allDogParks } from '@/lib/dogParksAll'
import { CommunityHeader } from '@/components/community/CommunityHeader'
import { PlanForm } from '@/components/community/PlanForm'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'תיאום הגעה · קהילה על ארבע',
  description: 'תיאום הגעה לגינה - שמות נחשפים רק 15 דקות לפני',
  path: '/community/plans/new',
  noindex: true,
})

export default async function NewPlanPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')
  const dogs = (await withCommunityDb((c) => listUserDogs(c, user.id))) || []
  // הצגת רק 200 גינות לדוגמה - בעתיד נוסיף חיפוש/קרבה
  const parks = allDogParks.slice(0, 200).map((p) => ({ id: p.id, name: p.name, city: p.city }))

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 36 }} aria-hidden="true">⏰</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '6px 0 4px', letterSpacing: '-.5px' }}>
            תיאום הגעה
          </h1>
          <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: 0, lineHeight: 1.55 }}>
            תאמו עם חברי הקהילה - שמות נחשפים רק 15 דק׳ לפני.
          </p>
        </div>
        <div className="card" style={{ padding: '26px 22px' }}>
          <PlanForm dogs={dogs.map((d) => ({ id: d.id, name: d.name }))} parks={parks} />
        </div>
      </div>
    </main>
  )
}
