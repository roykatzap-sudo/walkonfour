import { NameGenerator } from '@/components/tools/NameGenerator'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

export const metadata = {
  alternates: { canonical: '/names' },
  title: 'שמות לכלב · קהילה על ארבע',
  description:
    'נגמרו הרעיונות אחרי "מקס" ו"לונה"? הגרילו שמות בעברית ובלעז לפי אופי - חמוד, קשוח, מצחיק או קלאסי - ראו מה כל שם אומר ושמרו את האהובים.',
}

export default function NamesPage() {
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
          background:
            'radial-gradient(560px 280px at 50% 0%, rgba(232,200,135,.22), transparent 70%), linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.14)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-tag">החלק הכיפי</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            שם לכלב
          </h1>
          <p className="page-sub" style={{ maxWidth: 620, margin: '12px auto 0' }}>
            את השם הזה תקראו בקול בפארק עשרים פעם ביום, אז שווה שיתאים. הגרילו
            שמות בעברית ובלעז לפי אופי, ראו מה כל אחד אומר, ושמרו את אלה שגרמו
            לכם לחייך.
          </p>
        </div>
      </section>

      {/* ── המחולל ── */}
      <NameGenerator />
    </main>
  )
}
