import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { WaitlistForm } from '@/components/waitlist/WaitlistForm'
import { waitlistConfigured, waitlistCount } from '@/lib/waitlist'

export const metadata = buildMetadata({
  title: 'הצטרפו לקהילת קהילה על ארבע',
  description:
    'קהילת בעלי הכלבים של קהילה על ארבע בהקמה: קבוצות רכישה, מפגשים, המלצות ותשובות מבעלי כלבים. הצטרפו לרשימת ההמתנה ותהיו מהראשונים.',
  path: '/waitlist',
})

export const dynamic = 'force-dynamic'

// מתחת לסף הזה לא מציגים מספר - מספר קטן פוגע בהמרה. תואם ל-WaitlistForm.
const COUNT_DISPLAY_MIN = 25

const INSIDE = [
  ['🛒', 'קונים יחד, משלמים פחות', 'מתאחדים על שק מזון, ציוד ומיטה - וכשקונים בכמות, המחיר יורד.'],
  ['📍', 'מוצאים אנשים עם כלבים באזור', 'חברים לטיול בוקר, שכנים עם כלב, וקבוצה שמבינה אתכם.'],
  ['💬', 'שואלים בלי להרגיש שמגזימים', 'למה הוא לא אוכל? כמה טיולים צריך? כאן עונים אנשים שעברו בדיוק את זה.'],
  ['⭐', 'המלצות אמיתיות', 'על גינות, חופים, בתי קפה, דוגסיטרים ומסלולים - מאנשים, לא מפרסומות.'],
]

export default async function WaitlistPage() {
  const configured = waitlistConfigured()
  const count = await waitlistCount()

  return (
    <main className="page" style={{ maxWidth: 640 }}>
      {/* HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '6px 4px 14px', marginBottom: 12 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <span className="section-tag">הקהילה · בהקמה</span>
          <h1 className="page-title" style={{ fontSize: 42 }}>
            החיים עם כלב יקרים.<br />ביחד הם קלים יותר.
          </h1>
          <p className="page-sub" style={{ maxWidth: 520, margin: '0 auto', fontSize: 17, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            אנחנו בונים את הקהילה בזהירות, ושם כל מי שמצטרף עכשיו ייכנס מהראשונים -
            עם ההטבות של ההתחלה.
          </p>
        </div>
      </div>

      {/* טופס / בקרוב */}
      <section style={{ background: '#fff', border: '1px solid rgba(201,154,91,.2)', borderRadius: 22, padding: '24px 22px', marginBottom: 28, boxShadow: '0 14px 40px rgba(42,32,24,.08)' }}>
        {configured ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 14, fontSize: 14.5, fontWeight: 800, color: 'var(--brand)' }}>
              {count >= COUNT_DISPLAY_MIN
                ? `${count.toLocaleString('he-IL')} בעלי כלבים כבר ברשימה`
                : 'הראשונים נרשמים עכשיו - הצטרפו אליהם'}
            </div>
            <WaitlistForm initialCount={count} />
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🐾</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>רשימת ההמתנה נפתחת ממש בקרוב</div>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>
              אנחנו מסיימים את ההכנות האחרונות. בינתיים - כל התוכן והכלים פתוחים וחינמיים:
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: 16 }}>
              <Link href="/cities" className="btn btn-primary">מה יש בעיר שלי</Link>
              <Link href="/match" className="btn btn-ghost">איזה כלב מתאים לי</Link>
            </div>
          </div>
        )}
      </section>

      {/* שורת אמון - הבטחות פשוטות, בלי מספרים מומצאים */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', margin: '-14px 0 30px' }}>
        {[
          ['🔒', 'הפרטים שלכם נשמרים אצלנו בלבד'],
          ['✉️', 'עדכון אחד כשנפתחים - בלי הצפה'],
          ['🎁', 'חינם, ותמיד יישאר חינם'],
        ].map(([icon, label]) => (
          <span
            key={label}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: '#fff', border: '1px solid rgba(201,154,91,.22)',
              borderRadius: 999, padding: '8px 16px',
              fontSize: 14, fontWeight: 700, color: 'var(--ink)',
              boxShadow: '0 4px 14px rgba(42,32,24,.05)',
            }}
          >
            <span aria-hidden="true" style={{ fontSize: 16 }}>{icon}</span>
            {label}
          </span>
        ))}
      </div>

      {/* מה קורה בפנים */}
      <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--ink)', textAlign: 'center', margin: '0 0 18px' }}>מה קורה בפנים?</h2>
      <div style={{ display: 'grid', gap: 12 }}>
        {INSIDE.map(([icon, title, desc]) => (
          <div key={title} className="kv-lift" style={{ display: 'flex', gap: 14, background: '#fff', border: '1px solid rgba(201,154,91,.18)', borderRadius: 16, padding: '16px 18px' }}>
            <div style={{ fontSize: 28, flexShrink: 0 }} aria-hidden="true">{icon}</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: 16.5, color: 'var(--ink)' }}>{title}</div>
              <div style={{ fontSize: 14.5, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.6 }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* בינתיים - מה שכבר חי */}
      <section style={{ marginTop: 32, textAlign: 'center' }}>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 12 }}>בינתיים, כל אלה כבר פתוחים וחינמיים:</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/breeds" className="chip3d" style={{ textDecoration: 'none' }}>מדריכי גזעים</Link>
          <Link href="/map" className="chip3d" style={{ textDecoration: 'none' }}>מפת גינות</Link>
          <Link href="/walks" className="chip3d" style={{ textDecoration: 'none' }}>מסלולי טיול</Link>
          <Link href="/dog-food-prices" className="chip3d" style={{ textDecoration: 'none' }}>מחירון מזון</Link>
          <Link href="/cities" className="chip3d" style={{ textDecoration: 'none' }}>מדריכי ערים</Link>
        </div>
      </section>
    </main>
  )
}
