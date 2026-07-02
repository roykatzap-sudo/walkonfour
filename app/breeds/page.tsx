import { breeds } from '@/lib/breeds'
import { BreedGallery } from '@/components/breeds/BreedGallery'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

export const metadata = {
  alternates: { canonical: '/breeds' },
  title: 'גזעי כלבים - כל הגזעים הנפוצים בישראל | קהילה על ארבע',
  description:
    `מדריך גזעי כלבים מלא: סוגי כלבים, איזה כלב מתאים לכם, כלב לדירה, כלב לילדים - אופי, גודל, נטייה לתוקפנות, טיפוח ואילוף ל-${breeds.length} הגזעים הנפוצים בישראל.`,
  keywords: ['גזעי כלבים', 'סוגי כלבים', 'איזה כלב מתאים לי', 'כלב לדירה', 'כלב לילדים', 'מדריך גזעי כלבים'],
}

export default function BreedsPage() {
  return (
    <main className="page">
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px',
          marginBottom: 40,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
        }}
      >
        <FloatingShapes />
        <div className="kv-fade-in" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">מדריך הגזעים</span>
          <h1 className="page-title" style={{ marginTop: 10 }}>
            איזה כלב באמת מתאים לכם?
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, margin: '12px auto 0' }}>
            {breeds.length} גזעים, מהכנעני שגדל פה ועד הסנט ברנרד הענק. כתבנו על כל אחד בכנות -
            כולל הנחירות, מי לא ישרוד את אוגוסט בלי מיזוג, ומי יפרק לכם את הסלון מרוב שעמום.
            סננו לפי גודל, אנרגיה והתאמה לילדים.
          </p>
        </div>
      </section>

      {/* ── הגלריה ── */}
      <BreedGallery breeds={breeds} />
    </main>
  )
}
