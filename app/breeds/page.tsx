import { breeds } from '@/lib/breeds'
import { BreedGallery } from '@/components/breeds/BreedGallery'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

export const metadata = {
  title: 'גזעי כלבים - כל הגזעים הנפוצים בישראל | כלבניה',
  description:
    'מדריך גזעי כלבים מלא: סוגי כלבים, איזה כלב מתאים לכם, כלב לדירה, כלב לילדים - אופי, גודל, נטייה לתוקפנות, טיפוח ואילוף ל-27 הגזעים הנפוצים בישראל.',
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">מדריך הגזעים</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            איזה כלב באמת מתאים לכם?
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, margin: '12px auto 0' }}>
            28 גזעים, מהכלב הכנעני שגדל פה ועד הסנט ברנרד הענק. על כל אחד כתבנו בכנות -
            כולל מי שאתו תתמודדו עם נחירות, מי שלא ישרוד את הקיץ בלי מיזוג, ומי שישתעמם
            ויפרק לכם את הסלון. תסננו לפי גודל, ולחצו על כרטיס כדי להפוך אותו.
          </p>
        </div>
      </section>

      {/* ── הגלריה ── */}
      <BreedGallery breeds={breeds} />
    </main>
  )
}
