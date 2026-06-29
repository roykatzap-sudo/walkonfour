import { buildMetadata } from '@/lib/seo'
import { OnboardingFlow } from '@/components/community/OnboardingFlow'

export const metadata = buildMetadata({
  title: 'הצטרפות לקהילה · קהילה על ארבע',
  description: 'מסך הסכמה וייצירת חשבון בקהילה הסגורה',
  path: '/community/onboarding',
  noindex: true,
})

export default function OnboardingPage() {
  return (
    <main style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: '80px 20px 40px' }}>
      <div className="card" style={{ maxWidth: 480, width: '100%', padding: '32px 26px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 38, marginBottom: 4 }} aria-hidden="true">🐾</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px', letterSpacing: '-.5px' }}>
            ברוכים הבאים לקהילה
          </h1>
          <p style={{ fontSize: 14.5, color: '#5b4d3c', margin: 0, lineHeight: 1.55 }}>
            רגע לפני שאתם בפנים - שני דברים קטנים.
          </p>
        </div>
        <OnboardingFlow />
      </div>
    </main>
  )
}
