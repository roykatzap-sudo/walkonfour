import Link from 'next/link'
import { AdoptBoard } from '@/components/adopt/AdoptCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { adoptDogs, adoptCities, urgentCount } from '@/lib/adopt'

export const metadata = {
  title: 'לוח אימוץ קהילתי · קהילה על ארבע',
  description:
    'כלבים מעמותות ופונדקים בכל הארץ שמחכים לבית. סננו לפי גודל ועיר, קראו על כל אחד בכנות, והביעו עניין באימוץ.',
}

export default function AdoptPage() {
  return (
    <main className="page">
      {/* HERO */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 32,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #f6ecd8 0%, #fbf7ef 100%)',
          border: '1px solid rgba(232,200,135,.18)',
        }}
      >
        <FloatingPaws />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">לוח אימוץ קהילתי</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            כל כלב מגיע לו בית
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 580 }}>
            כלבים מעמותות ופונדקים בכל הארץ, כבר מחוסנים ומסורסים, שמחכים שמישהו פשוט יבוא.
            כשאתם מאמצים אחד, מתפנה מקום בכלבייה לעוד אחד. ככה זה עובד.
          </p>

          {/* מדדים מהירים */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              marginTop: 22,
            }}
          >
            <span className="chip3d" style={{ fontWeight: 700 }}>
              {adoptDogs.length} כלבים מחכים
            </span>
            {urgentCount > 0 && (
              <span
                className="chip3d"
                style={{
                  fontWeight: 800,
                  background: '#2a2018',
                  color: '#e8c887',
                  border: '1px solid rgba(232,200,135,.4)',
                }}
              >
                {urgentCount} דחופים לאימוץ
              </span>
            )}
          </div>
        </div>
      </section>

      <DemoBanner />

      {/* באנר לעמותות - פרסום כלב לאימוץ */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#2a2018',
          borderRadius: 20,
          padding: '22px 26px',
          marginBottom: 28,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              color: '#fff',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            <span aria-hidden="true" style={{ color: '#e8c887' }}>
              ♡
            </span>
            עמותה או פונדק? פרסמו כלב לאימוץ
          </div>
          <div style={{ color: '#cbb89f', fontSize: 14, marginTop: 4, maxWidth: 560 }}>
            תעלו את הכלבים שלכם ללוח, בחינם, ותגיעו ל-4,800 בעלי כלבים - אנשים שכבר יודעים מה זה
            להחזיק כלב, לא מאמצים מהאינסטגרם.
          </div>
        </div>
        <Link
          href="/contact"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
          aria-label="פרסום כלב לאימוץ בלוח הקהילתי"
        >
          פרסמו כלב לאימוץ ←
        </Link>
      </div>

      {/* לוח האימוץ - סינון + גריד (client) */}
      <AdoptBoard dogs={adoptDogs} cities={adoptCities} />
    </main>
  )
}
