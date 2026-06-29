import { redirect } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'
import { getCurrentUser } from '@/lib/community/auth'
import { CommunityHeader } from '@/components/community/CommunityHeader'
import { AccountSettings } from '@/components/community/AccountSettings'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'החשבון שלי · קהילה על ארבע',
  description: 'ניהול החשבון, העדפות דיוור וזכויות פרטיות',
  path: '/community/account',
  noindex: true,
})

export default async function AccountPage() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: 0, letterSpacing: '-.5px' }}>
            ⚙️ החשבון שלי
          </h1>
          <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: '6px 0 0', lineHeight: 1.55 }}>
            ניהול פרטים, התראות, וזכויות הפרטיות שלכם.
          </p>
        </div>
        <AccountSettings />
      </div>
    </main>
  )
}
