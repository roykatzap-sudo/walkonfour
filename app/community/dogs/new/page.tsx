import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { DogForm } from '@/components/community/DogForm'
import { CommunityHeader } from '@/components/community/CommunityHeader'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'כלב חדש · קהילה על ארבע',
  description: 'הוספת כלב לפרופיל בקהילה',
  path: '/community/dogs/new',
  noindex: true,
})

export default async function NewDogPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 36 }} aria-hidden="true">🐕</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '6px 0 4px', letterSpacing: '-.5px' }}>
            כלב חדש
          </h1>
          <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: 0, lineHeight: 1.55 }}>
            כך אנשים בקהילה ידעו מי מגיע לגינה.
          </p>
        </div>
        <div className="card" style={{ padding: '26px 22px' }}>
          <DogForm />
        </div>
      </div>
    </main>
  )
}
