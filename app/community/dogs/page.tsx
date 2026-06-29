import Link from 'next/link'
import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { withCommunityDb } from '@/lib/community/db'
import { listUserDogs } from '@/lib/community/dogs'
import { CommunityHeader } from '@/components/community/CommunityHeader'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'הכלבים שלי · קהילה על ארבע',
  description: 'ניהול הכלבים בקהילה',
  path: '/community/dogs',
  noindex: true,
})

export default async function DogsListPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  const dogs = (await withCommunityDb((c) => listUserDogs(c, user.id))) || []

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22, gap: 12, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: 0, letterSpacing: '-.5px' }}>
            הכלבים שלי
          </h1>
          <Link href="/community/dogs/new" className="btn btn-primary" style={{ fontSize: 14.5, padding: '10px 18px' }}>
            + הוספת כלב
          </Link>
        </div>

        {dogs.length === 0 ? (
          <div className="card" style={{ padding: '36px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 40 }} aria-hidden="true">🐕</div>
            <p style={{ fontSize: 16, color: 'var(--ink)', margin: '8px 0 16px' }}>עוד אין לכם כלב רשום.</p>
            <Link href="/community/dogs/new" className="btn btn-primary">הוסיפו את הכלב הראשון</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {dogs.map((d) => (
              <Link key={d.id} href={`/community/dogs/${d.id}`} className="card" style={{ padding: '18px 20px', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 34, lineHeight: 1 }} aria-hidden="true">🐾</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)' }}>{d.name}</div>
                  <div style={{ fontSize: 13.5, color: '#5b4d3c', marginTop: 2 }}>
                    {[d.breed, d.age_years != null ? `${d.age_years} שנים` : null, d.temperament]
                      .filter(Boolean).join(' · ') || 'אין פרטים נוספים'}
                  </div>
                </div>
                <span style={{ color: 'var(--brand-dark)', fontSize: 18 }} aria-hidden="true">←</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
