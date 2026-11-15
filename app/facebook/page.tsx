import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { FB_GROUP_URL } from '@/lib/social'

const TITLE = 'קבוצת הפייסבוק של קהילה על ארבע - בעלי כלבים מכל הארץ'
const DESC =
  'קבוצת הפייסבוק של בעלי הכלבים בישראל: שואלים, ממליצים על וטרינרים ומאלפים לפי עיר, מזהירים בזמן אמת ומוצאים חברים לטיול. כך מצטרפים ולמה זה שווה.'
const OG = ogImageUrl({ title: 'הקהילה שלנו בפייסבוק', subtitle: 'בעלי כלבים מכל הארץ, במקום אחד', tag: 'קהילה' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/facebook' },
  openGraph: { title: TITLE, description: DESC, url: '/facebook', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

const BENEFITS: { title: string; body: string }[] = [
  {
    title: 'תשובה מאנשים שכבר עברו את זה',
    body: 'הגור לא מפסיק לנשוך? הכלב מושך ברצועה? בקבוצה שואלים בעלי כלבים אחרים ומקבלים תשובות מניסיון, לא מתיאוריה.',
  },
  {
    title: 'המלצות לפי העיר שלכם',
    body: 'וטרינר שעונה גם בלילה, מאלף שבאמת עוזר, פנסיון שאפשר לסמוך עליו. המלצה מבעל כלב מהשכונה שווה יותר מכל פרסומת.',
  },
  {
    title: 'אזהרות בזמן אמת',
    body: 'רעל בגינה, פח שנפתח, כלב משוחרר ותוקפני באזור. מה שחשוב לדעת לפני שיוצאים לטיול, מאנשים שנמצאים שם עכשיו.',
  },
  {
    title: 'כלב אבד או נמצא',
    body: 'כשכלב נעלם, כל דקה חשובה. פוסט אחד בקבוצה מגיע לבעלי כלבים באזור שיודעים לחפש ולזהות.',
  },
  {
    title: 'חברים לטיול ולגינה',
    body: 'מי בגינה עכשיו, איזו גינה מוצלת בקיץ, ומי מחפש שותף לטיול של שבת. גם לכלב מגיעים חברים.',
  },
  {
    title: 'אתם קובעים מה נבנה',
    body: 'האתר נבנה לפי מה שהקהילה מבקשת. הצעות ורעיונות שעולים בקבוצה הופכים לכלים ולמדריכים חדשים.',
  },
]

const FAQ = [
  {
    q: 'מה ההבדל בין הקבוצה לאתר?',
    a: 'האתר נותן מידע מסודר: מדריכי גזעים, מחשבונים, מפת גינות ומדריכי ערים. הקבוצה נותנת אנשים: שאלות ותשובות, המלצות מקומיות ועדכונים בזמן אמת. הם משלימים זה את זה.',
  },
  {
    q: 'איך מצטרפים לקבוצה?',
    a: 'לוחצים על כפתור ההצטרפות בעמוד הזה, עוברים לפייסבוק ומצטרפים לקבוצה "קהילה על ארבע".',
  },
  {
    q: 'אין לי פייסבוק. מה אפשר לעשות?',
    a: 'כל המדריכים והכלים באתר פתוחים לכולם. אפשר גם להצטרף לרשימת ההמתנה ולקבל עדכון כשהקהילה נפתחת בעיר שלכם.',
  },
  {
    q: 'הקבוצה מחליפה וטרינר?',
    a: 'לא. הקבוצה היא מקום לניסיון של בעלי כלבים אחרים ולהמלצות. במצב רפואי, ובוודאי במצב חירום, פונים לווטרינר.',
  },
]

const fbBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
  minHeight: 60, padding: '16px 34px', borderRadius: 100,
  background: '#1877f2', color: '#fff', fontWeight: 800, fontSize: 19, textDecoration: 'none',
  boxShadow: '0 10px 30px rgba(24,119,242,.32)',
}

function FbButton({ label = 'להצטרפות לקבוצה בפייסבוק' }: { label?: string }) {
  return (
    <a href={FB_GROUP_URL} target="_blank" rel="noopener noreferrer" className="kv-press" style={fbBtn}>
      <svg viewBox="0 0 24 24" width="26" height="26" fill="#fff" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94z" />
      </svg>
      {label}
    </a>
  )
}

export default function FacebookCommunityPage() {
  return (
    <main className="page" style={{ maxWidth: 980 }}>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: 'בית', path: '/' },
            { name: 'הקהילה בפייסבוק', path: '/facebook' },
          ]),
          faqSchema(FAQ),
        ]}
      />

      {/* ── פתיח ── */}
      <section
        style={{
          borderRadius: 28, padding: '56px 28px', marginBottom: 44, textAlign: 'center',
          background: 'linear-gradient(160deg, #2a2018, #3a2c1d)', color: '#fff',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <span className="section-tag" style={{ color: '#e8c887' }}>הקהילה שלנו</span>
        <h1 className="page-title" style={{ marginTop: 10, color: '#fff' }}>
          לכלב שלכם מגיעה קהילה. <span style={{ color: '#e8c887' }}>היא מחכה בפייסבוק.</span>
        </h1>
        <p style={{ maxWidth: 640, margin: '14px auto 28px', fontSize: 18, lineHeight: 1.65, color: 'rgba(255,255,255,.82)' }}>
          בעלי כלבים מכל הארץ בקבוצה אחת: שואלים, ממליצים, מזהירים ומוצאים חברים לטיול.
          מדריך יכול להסביר איך מאלפים גור. רק שכן מהגינה יגיד לכם איזה וטרינר באזור באמת שווה.
        </p>
        <FbButton />
        <p style={{ margin: '16px 0 0', fontSize: 15, color: 'rgba(255,255,255,.62)' }}>
          הקבוצה חדשה, ומי שנכנס עכשיו הוא מהראשונים שמעצבים אותה.
        </p>
      </section>

      {/* ── למה קבוצה ── */}
      <section style={{ marginBottom: 44 }}>
        <span className="section-tag">למה זה חשוב</span>
        <h2 className="section-title display" style={{ marginTop: 8 }}>
          מידע יש באתר. <em>אנשים יש בקבוצה.</em>
        </h2>
        <p style={{ maxWidth: 720, fontSize: 17, lineHeight: 1.75, color: '#5b4d3c', margin: '14px 0 0' }}>
          כל מי שגידל כלב יודע: השאלות האמיתיות צצות בעשר בלילה, כשהגור אכל משהו מהרצפה או כשהמאלף ביטל ברגע האחרון.
          בשביל הרגעים האלה בנינו קהילה. מקום אחד שבו בעלי כלבים בישראל עוזרים אחד לשני, כל אחד מהניסיון שלו ומהעיר שלו.
        </p>
      </section>

      {/* ── היתרונות ── */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="section-title display" style={{ marginBottom: 22 }}>
          מה מקבלים <em>בקבוצה</em>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
          {BENEFITS.map((b, i) => (
            <div key={b.title} className="card" style={{ padding: 24 }}>
              <div
                aria-hidden="true"
                style={{
                  width: 42, height: 42, borderRadius: 12, display: 'grid', placeItems: 'center', marginBottom: 14,
                  background: 'linear-gradient(180deg, #f2d89e, #c99a5b)', color: '#241a12', fontWeight: 900, fontSize: 18,
                }}
              >
                {i + 1}
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 19, fontWeight: 800, color: 'var(--ink)' }}>{b.title}</h3>
              <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.65, color: '#5b4d3c' }}>{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section
        style={{
          borderRadius: 24, padding: '40px 26px', marginBottom: 48, textAlign: 'center',
          background: '#fdf6e9', border: '1px solid rgba(201,154,91,.25)',
        }}
      >
        <h2 style={{ margin: '0 0 10px', fontSize: 26, fontWeight: 900, color: 'var(--ink)' }}>שאלה אחת מספיקה כדי להתחיל</h2>
        <p style={{ maxWidth: 560, margin: '0 auto 24px', fontSize: 16.5, lineHeight: 1.65, color: '#5b4d3c' }}>
          הצטרפו, הציגו את הכלב שלכם, ושאלו את מה שתמיד רציתם לדעת. מישהו בקבוצה כבר היה שם.
        </p>
        <FbButton label="להצטרפות לקבוצה" />
      </section>

      {/* ── שאלות נפוצות ── */}
      <section style={{ marginBottom: 48 }}>
        <h2 className="section-title display" style={{ marginBottom: 18 }}>
          שאלות <em>נפוצות</em>
        </h2>
        <div style={{ display: 'grid', gap: 12 }}>
          {FAQ.map((f) => (
            <details key={f.q} className="card" style={{ padding: '18px 22px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: 17, color: 'var(--ink)' }}>{f.q}</summary>
              <p style={{ margin: '12px 0 0', fontSize: 16, lineHeight: 1.7, color: '#5b4d3c' }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── המשך באתר ── */}
      <section style={{ marginBottom: 20 }}>
        <h2 style={{ margin: '0 0 14px', fontSize: 20, fontWeight: 900, color: 'var(--ink)' }}>ובינתיים, באתר</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/breeds" className="chip3d" style={{ textDecoration: 'none', fontSize: 15 }}>מדריך הגזעים →</Link>
          <Link href="/map" className="chip3d" style={{ textDecoration: 'none', fontSize: 15 }}>מפת גינות הכלבים →</Link>
          <Link href="/businesses" className="chip3d" style={{ textDecoration: 'none', fontSize: 15 }}>בעלי מקצוע לכלבים →</Link>
          <Link href="/tools" className="chip3d" style={{ textDecoration: 'none', fontSize: 15 }}>הכלים →</Link>
          <Link href="/waitlist" className="chip3d" style={{ textDecoration: 'none', fontSize: 15 }}>רשימת ההמתנה →</Link>
        </div>
      </section>
    </main>
  )
}
