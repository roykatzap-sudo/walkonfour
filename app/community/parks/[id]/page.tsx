import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { allDogParks } from '@/lib/dogParksAll'
import { CommunityHeader } from '@/components/community/CommunityHeader'
import { ParkPlansList } from '@/components/community/ParkPlansList'
import { ParkChat } from '@/components/community/ParkChat'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'גינה · קהילה על ארבע',
  description: 'תיאומי הגעה וצ\'אט',
  path: '/community/parks',
  noindex: true,
})

export default async function CommunityParkPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  const parkId = params.id
  const park = allDogParks.find((p) => String(p.id) === parkId)
  if (!park) notFound()

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 60px' }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/community/plans" style={{ fontSize: 13.5, color: 'var(--brand-dark)', textDecoration: 'none', fontWeight: 700 }}>← לתיאומים שלי</Link>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '8px 0 4px', letterSpacing: '-.5px' }}>
            📍 {park.name || 'גינת כלבים'}
          </h1>
          <p style={{ fontSize: 14, color: '#5b4d3c', margin: 0 }}>
            {park.city || 'ישראל'}
          </p>
        </div>

        {/* תיאומים */}
        <section style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>⏰ תיאומי הגעה</h2>
            <Link href={`/community/plans/new`} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 14px' }}>+ תיאום</Link>
          </div>
          <ParkPlansList parkKey={String(park.id)} />
        </section>

        {/* צ'אט */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>💬 צ'אט הגינה</h2>
          <ParkChat parkKey={String(park.id)} currentUserId={user.id} />
        </section>
      </div>
    </main>
  )
}
