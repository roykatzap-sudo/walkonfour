import { redirect, notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { withCommunityDb } from '@/lib/community/db'
import { getDog } from '@/lib/community/dogs'
import { DogForm } from '@/components/community/DogForm'
import { DeleteDogButton } from '@/components/community/DeleteDogButton'
import { CommunityHeader } from '@/components/community/CommunityHeader'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'עריכת כלב · קהילה על ארבע',
  description: 'עריכת פרטי כלב',
  path: '/community/dogs',
  noindex: true,
})

export default async function EditDogPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')
  const dogId = Number(params.id)
  if (!Number.isInteger(dogId) || dogId <= 0) notFound()
  const dog = await withCommunityDb((c) => getDog(c, user.id, dogId))
  if (!dog) notFound()

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 540, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 36 }} aria-hidden="true">🐾</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '6px 0 4px', letterSpacing: '-.5px' }}>
            עריכת {dog.name}
          </h1>
        </div>
        <div className="card" style={{ padding: '26px 22px' }}>
          <DogForm initial={dog} />
        </div>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <DeleteDogButton dogId={dog.id} dogName={dog.name} />
        </div>
      </div>
    </main>
  )
}
