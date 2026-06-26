import { BreedMatcher } from '@/components/tools/BreedMatcher'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata = {
  title: 'איזה גזע מתאים לכם · כלבניה',
  description:
    'שש שאלות על הבית, הילדים, הזמן והסבלנות שלכם, ובסוף שלושה גזעים שיסתדרו אצלכם באמת - עם הסבר כן למה דווקא הם, ולא רק אחוז.',
}

export default function MatchPage() {
  return (
    <main className="page" style={{ maxWidth: 980 }}>
      <JsonLd
        data={softwareAppSchema({
          name: 'מתאם הגזע - איזה כלב מתאים לכם',
          description: 'חידון של שש שאלות שממליץ על שלושה גזעי כלבים שמתאימים לאורח החיים שלכם.',
          path: '/match',
        })}
      />
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '52px 28px 44px',
          marginBottom: 36,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">שש שאלות, שלוש תשובות</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            איזה גזע מתאים לכם?
          </h1>
          <p className="page-sub" style={{ maxWidth: 620, margin: '12px auto 0' }}>
            ענו על שש שאלות על גודל הבית, הילדים, הזמן והסבלנות שלכם, ונגיד לכם
            בכנות אילו שלושה גזעים יסתדרו אצלכם באמת. עם הסבר למה דווקא הם, לא רק
            אחוז יבש.
          </p>
        </div>
      </section>

      {/* ── החידון ── */}
      <BreedMatcher />
    </main>
  )
}
