import Link from 'next/link'
import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { CommunityHeader } from '@/components/community/CommunityHeader'
import { MyPlansList } from '@/components/community/MyPlansList'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'התיאומים שלי · קהילה על ארבע',
  description: 'ניהול תיאומי הגעה לגינות',
  path: '/community/plans',
  noindex: true,
})

export default async function MyPlansPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: 0, letterSpacing: '-.5px' }}>
            ⏰ התיאומים שלי
          </h1>
          <Link href="/community/plans/new" className="btn btn-primary" style={{ fontSize: 14.5, padding: '10px 18px' }}>
            + תיאום חדש
          </Link>
        </div>
        <MyPlansList />
      </div>
    </main>
  )
}
