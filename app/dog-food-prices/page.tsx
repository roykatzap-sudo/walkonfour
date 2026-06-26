import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { FoodPriceTable } from '@/components/tools/FoodPriceTable'
import { FOOD_PRICES_UPDATED, FOOD_SOURCES } from '@/lib/foodPrices'

export const metadata = buildMetadata({
  title: 'מחירון מזון כלבים בישראל: כמה עולה ואיפה זול',
  description:
    'השוואת מחירי מזון כלבים פופולרי בישראל - רויאל קנין, הילס, אקאנה, פרו פלאן ועוד. מחיר לק״ג, מחשבון השוואה, וקישור להשוואה חיה. מעודכן ' +
    FOOD_PRICES_UPDATED + '.',
  path: '/dog-food-prices',
})

export default function FoodPricesPage() {
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 18px', marginBottom: 12 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מחירון</span>
          <h1 className="page-title" style={{ fontSize: 44 }}>
            כמה עולה <span className="grad-text">מזון לכלב?</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17.5, color: '#6a6155', lineHeight: 1.7 }}>
            השוואת מחירים של מזונות הכלבים הפופולריים בישראל - כולל מחיר לק״ג (השווי האמיתי)
            ומחשבון שיגיד לכם איזה שק באמת זול יותר.
          </p>
        </div>
      </div>

      {/* דיסקליימר */}
      <div
        role="note"
        style={{
          background: 'rgba(201,154,91,.1)',
          borderInlineStart: '4px solid var(--brand)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 22,
          fontSize: 13.5,
          lineHeight: 1.6,
          color: 'var(--text)',
        }}
      >
        💡 המחירים מקורבים ונאספו ממקורות ישראליים ב<strong>{FOOD_PRICES_UPDATED}</strong>. הם משתנים
        בין חנויות ובזמן - לכל מוצר יש קישור ל״השוואה חיה״ בזאפ למחיר המעודכן ביותר.
      </div>

      <FoodPriceTable />

      {/* קבוצת רכישה */}
      <section style={{ marginTop: 30, background: 'linear-gradient(135deg, #fffaf0, #fdf6e9)', border: '2px solid var(--brand)', borderRadius: 22, padding: '24px 26px', textAlign: 'center' }}>
        <div style={{ fontSize: 38, marginBottom: 6 }}>🛒</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink)', margin: '0 0 8px' }}>קבוצת רכישה - קונים יחד, משלמים פחות</h2>
        <p style={{ fontSize: 15.5, color: '#6a6155', lineHeight: 1.7, maxWidth: 520, margin: '0 auto 16px' }}>
          כשמתאחדים על הזמנה גדולה, המחיר יורד. אנחנו בונים קבוצות רכישה לחברי הקהילה -
          כדי שתשלמו על אותו שק פחות ממה שמופיע למעלה.
        </p>
        <Link href="/premium" className="btn btn-primary">לפרטים על הקהילה →</Link>
      </section>

      {/* טיפים */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>איך חוסכים על מזון בלי להתפשר על איכות</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
          {[
            ['השוו לפי מחיר לק״ג, לא לפי מחיר השק', 'שק של 15 ק״ג ב-349 ₪ זול יותר משק של 12 ק״ג ב-300 ₪. תמיד חלקו במשקל.'],
            ['קנו שק גדול יותר', 'ככל שהשק גדול יותר, המחיר לק״ג בדרך כלל יורד - בתנאי שתספיקו לסיים אותו בתוך כמה שבועות מהפתיחה.'],
            ['בדקו מבצעי "2 שקים"', 'הרבה חנויות מציעות זוג שקים במחיר מוזל. אם יש לכם מקום אחסון יבש וקריר - משתלם.'],
            ['אל תרדפו אחרי הזול ביותר בלבד', 'מזון איכותי יותר = פחות כמות נדרשת ובריאות טובה יותר לאורך זמן. הזול לק״ג לא תמיד הזול לאורך חיי הכלב.'],
          ].map(([t, d]) => (
            <li key={t} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15.5, marginBottom: 4 }}>✓ {t}</div>
              <div style={{ fontSize: 14.5, color: '#6a6155', lineHeight: 1.6 }}>{d}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* קישורים פנימיים */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link href="/food-calculator" className="btn btn-ghost">כמה מזון הכלב שלי צריך?</Link>
        <Link href="/calculator" className="btn btn-ghost">כמה עולה כלב בשנה?</Link>
      </div>

      {/* מקורות */}
      <section style={{ marginTop: 40, paddingTop: 20, borderTop: '1px solid rgba(42,32,24,.1)' }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: '#8a7c66', margin: '0 0 8px' }}>מקורות</h2>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {FOOD_SOURCES.map((s) => (
            <li key={s.url} style={{ fontSize: 13 }}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand)' }}>{s.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
