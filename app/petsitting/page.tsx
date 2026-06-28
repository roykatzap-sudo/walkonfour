import Link from 'next/link'
import { SitterCard } from '@/components/petsitting/SitterCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { demoSitters } from '@/lib/petsitting'

export const metadata = {
  title: 'פינסיטינג קהילתי · קהילה על ארבע',
  description: 'מצאו שומר כלבים מאומת מתוך הקהילה - לינה, טיולים, דוג ווקינג וביקורי בית. דירוגים אמיתיים ומחירים הוגנים.',
}

/**
 * שומרים שהומלצו על ידי חברי קהילה (תוכנית ההמלצות) - מציג תג "שותף על ידי".
 * במצב אמיתי הנתון יגיע מה-DB; כאן מפה סטטית להמחשה.
 */
const sharedBySitters: Record<string, string> = {
  'yossi-haifa': 'דנה מחיפה',
  'tal-netanya': 'רון מנתניה',
}

export default function PetsittingPage() {
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
          <span className="section-tag">פינסיטינג קהילתי</span>
          <h1 className="page-title grad-text" style={{ marginTop: 8 }}>
            מי ישמור על הכלב כשאתם בחופש?
          </h1>
          <p className="page-sub" style={{ margin: '0 auto', maxWidth: 560 }}>
            שומרים מאומתים מתוך הקהילה, אנשים אמיתיים עם דירוגים אמיתיים. לינה, טיולים, דוג ווקינג
            וביקורי בית - במחירים הוגנים וקרוב אליכם.
          </p>
        </div>
      </section>

      <DemoBanner />

      {/* באנר הצטרפות כשומרים */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          background: '#2a2018',
          borderRadius: 20,
          padding: '20px 26px',
          marginBottom: 28,
        }}
      >
        <div>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: 18 }}>
            🏠 אוהבים כלבים? הצטרפו כשומרים
          </div>
          <div style={{ color: '#9fb3a6', fontSize: 14, marginTop: 4 }}>
            להרוויח מהבית, לפגוש כלבים מקסימים ולעזור לקהילה.
          </div>
        </div>
        <Link
          href="/auth/register"
          className="btn btn-primary"
          style={{ whiteSpace: 'nowrap', textDecoration: 'none' }}
        >
          הצטרפו כשומרים →
        </Link>
      </div>

      {/* גריד שומרים */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}
      >
        {demoSitters.map((s, i) => (
          <Reveal3D key={s.id} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <SitterCard sitter={s} sharedBy={sharedBySitters[s.id]} />
          </Reveal3D>
        ))}
      </div>
    </main>
  )
}
