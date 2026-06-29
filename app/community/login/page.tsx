import { buildMetadata } from '@/lib/seo'
import { LoginFlow } from '@/components/community/LoginFlow'

export const metadata = buildMetadata({
  title: 'כניסה לקהילה · קהילה על ארבע',
  description: 'כניסה לקהילה הסגורה - רק לרשומים ברשימת ההמתנה',
  path: '/community/login',
  noindex: true,
})

export default function CommunityLoginPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '80px 20px 40px' }}>
      <div className="card" style={{ maxWidth: 420, width: '100%', padding: '32px 26px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 38, marginBottom: 4 }} aria-hidden="true">🐾</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-.5px' }}>
            כניסה לקהילה
          </h1>
          <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: 0, lineHeight: 1.55 }}>
            הקהילה פתוחה כרגע רק לרשומים ברשימת ההמתנה. נכנסים עם המייל שאיתו נרשמתם.
          </p>
        </div>
        <LoginFlow />
      </div>
    </main>
  )
}
