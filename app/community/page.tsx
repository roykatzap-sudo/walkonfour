import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/community/auth'
import { withCommunityDb } from '@/lib/community/db'
import { CommunityHeader } from '@/components/community/CommunityHeader'

export const dynamic = 'force-dynamic'
export const metadata = buildMetadata({
  title: 'הקהילה · קהילה על ארבע',
  description: 'הקהילה הסגורה לבעלי כלבים',
  path: '/community',
  noindex: true,
})

export default async function CommunityHome() {
  const user = await getCurrentUser()
  if (!user) redirect('/community/login')

  // ספירת כלבים של המשתמש - אם 0, ננחה ליצור כלב
  const dogCount = await withCommunityDb(async (c) => {
    const r = await c.query('select count(*)::int as n from dogs where user_id = $1', [user.id])
    return Number(r.rows[0]?.n ?? 0)
  })

  return (
    <main style={{ minHeight: '100dvh', paddingTop: 80 }}>
      <CommunityHeader nickname={user.nickname} />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '30px 20px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden="true">🐾</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--ink)', margin: '0 0 8px', letterSpacing: '-.5px' }}>
            שלום {user.nickname}
          </h1>
          <p style={{ fontSize: 16, color: '#5b4d3c', margin: 0, lineHeight: 1.6 }}>
            ברוכים הבאים לקהילה הסגורה של "קהילה על ארבע".
          </p>
        </div>

        {/* כלב ראשון - hero card */}
        {dogCount === 0 ? (
          <div className="card" style={{ padding: '28px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #fff7e9, #fbeece)' }}>
            <div style={{ fontSize: 38, marginBottom: 4 }} aria-hidden="true">🐕</div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>בואו נכיר את הכלב שלכם</h2>
            <p style={{ fontSize: 15, color: '#5b4d3c', margin: '0 auto 18px', maxWidth: 420, lineHeight: 1.6 }}>
              שם, גזע, גיל ומזג - בלי זה אנשים בקהילה לא יודעים מי מגיע לגינה. אפשר גם תמונה (לא חובה).
            </p>
            <Link href="/community/dogs/new" className="btn btn-primary" style={{ fontSize: 16, padding: '12px 32px' }}>
              הוסיפו את הכלב שלכם 🐾
            </Link>
          </div>
        ) : (
          <div className="card" style={{ padding: '24px 22px', textAlign: 'center' }}>
            <p style={{ fontSize: 16, color: 'var(--ink)', margin: 0, lineHeight: 1.6 }}>
              <strong>{dogCount === 1 ? 'הכלב שלכם רשום בקהילה.' : `${dogCount} כלבים שלכם רשומים בקהילה.`}</strong>
            </p>
            <Link href="/community/dogs" className="btn btn-ghost" style={{ marginTop: 14, fontSize: 14.5 }}>
              לעריכת פרופיל הכלב/ים
            </Link>
          </div>
        )}

        {/* כרטיסי "בקרוב" - תיאומים וצ'אט */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14, marginTop: 22 }}>
          <PlaceholderCard
            emoji="⏰"
            title="תיאום הגעה לגינה"
            subtitle="בחרו גינה ושעה - מי שמסמן את אותה גינה יראה את התיאום."
            badge="בקרוב"
          />
          <PlaceholderCard
            emoji="💬"
            title="צ'אט פר גינה"
            subtitle="הודעות בזמן אמת בין מי שמתכנן הגעה לאותה גינה. נמחק אוטומטית אחרי 24 שעות."
            badge="בקרוב"
          />
        </div>

        <p style={{ fontSize: 13, color: '#8a7c66', marginTop: 30, textAlign: 'center', lineHeight: 1.6 }}>
          הקהילה בהקמה. אנו מוסיפים פיצ'רים בהדרגה אחרי בדיקות איכות ופרטיות.
        </p>
      </div>
    </main>
  )
}

function PlaceholderCard({ emoji, title, subtitle, badge }: { emoji: string; title: string; subtitle: string; badge: string }) {
  return (
    <div className="card" style={{ padding: '20px 20px', opacity: 0.75 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{ fontSize: 28 }} aria-hidden="true">{emoji}</div>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)', margin: 0, flex: 1 }}>{title}</h3>
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--brand-dark)', background: 'rgba(201,154,91,.15)', padding: '4px 10px', borderRadius: 999 }}>{badge}</span>
      </div>
      <p style={{ fontSize: 14, color: '#5b4d3c', margin: 0, lineHeight: 1.55 }}>{subtitle}</p>
    </div>
  )
}
