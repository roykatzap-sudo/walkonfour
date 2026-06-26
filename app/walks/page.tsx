import Link from 'next/link'
import { WalkBoard } from '@/components/walks/WalkCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { demoWalks, walkCities, fencedCount, totalKm } from '@/lib/walks'

export const metadata = {
  title: 'איפה מטיילים עם הכלב · כלבניה',
  description:
    'חופים, נחלים, יערות מוצלים ומתחמים מגודרים בכל הארץ. סננו לפי עיר ורמת קושי, בדקו אם יש צל ומים בדרך, ולחצו ניווט ישר לנקודת ההתחלה.',
}

export default function WalksPage() {
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
          <span className="section-tag">יוצאים החוצה</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            איפה מטיילים השבת?
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 580 }}>
            נמאס מאותו סיבוב שכונה? אספנו מסלולים אמיתיים בכל הארץ - חופים, נחלים,
            יערות מוצלים ומתחמים מגודרים. לכל אחד יש אורך, רמת קושי, וסימון אם יש
            בדרך צל ומים בקיץ. לוחצים ניווט, ויוצאים.
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
              {demoWalks.length} מסלולים בארץ
            </span>
            <span className="chip3d" style={{ fontWeight: 700 }}>
              {totalKm} ק״מ של טיולים
            </span>
            {fencedCount > 0 && (
              <span
                className="chip3d"
                style={{
                  fontWeight: 800,
                  background: '#2a2018',
                  color: '#e8c887',
                  border: '1px solid rgba(232,200,135,.4)',
                }}
              >
                {fencedCount} מסלולים מגודרים
              </span>
            )}
          </div>
        </div>
      </section>

      <DemoBanner />

      {/* באנר קהילתי - שיתוף מסלול */}
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
              ⌖
            </span>
            יש לכם שביל סודי? אל תשמרו אותו לעצמכם
          </div>
          <div style={{ color: '#cbb89f', fontSize: 14, marginTop: 4, maxWidth: 560 }}>
            ספרו לנו על המקום שאתם והכלב חוזרים אליו שוב ושוב, ונוסיף אותו למפה
            כדי שעוד מישהו יגלה אותו בשבת הבאה.
          </div>
        </div>
        <Link
          href="/contact"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
          aria-label="שיתוף מסלול טיול חדש עם הקהילה"
        >
          שתפו מסלול ←
        </Link>
      </div>

      {/* לוח המסלולים - סינון + גריד (client) */}
      <WalkBoard walks={demoWalks} cities={walkCities} />
    </main>
  )
}
