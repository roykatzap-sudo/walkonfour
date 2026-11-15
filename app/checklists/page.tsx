import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { Checklist, type ChecklistGroup } from '@/components/checklists/Checklist'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'צ\'קליסטים להדפסה: תיק חירום לכלב ושבוע ראשון עם גור'
const DESC =
  'שתי רשימות מוכנות לסימון ולהדפסה: מה שמים בתיק החירום של הכלב לפי המלצות השירותים הווטרינריים, ומה עושים בשבוע הראשון עם גור חדש.'
const OG = ogImageUrl({ title: 'צ\'קליסטים לבעלי כלבים', subtitle: 'תיק חירום · שבוע ראשון עם גור', tag: 'להדפסה' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/checklists' },
  openGraph: { title: TITLE, description: DESC, url: '/checklists', type: 'article', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

/* המקור לרשימת תיק החירום: המלצות השירותים הווטרינריים במשרד החקלאות וארגון הרופאים
   הווטרינרים לחיות הבית, כפי שהן מובאות ונבדקו במדריך /guides/dog-sirens-safe-room. */
const EMERGENCY_BAG: ChecklistGroup[] = [
  {
    title: 'אוכל ומים',
    items: ['מים בכלי מתאים', 'מזון בכלי מתאים', 'חטיפים וצעצוע לעיסה'],
  },
  {
    title: 'שליטה וביטחון',
    items: ['רצועה קצרה', 'רצועה או רתמה נוספת', 'מחסום פה', 'כלוב נשיאה'],
  },
  {
    title: 'ניקיון',
    items: ['משטח סופג', 'שקיות אשפה'],
  },
  {
    title: 'בריאות וזיהוי',
    items: [
      'תרופות קבועות, מלאי של שלושה ימים לפחות',
      'על כלוב הנשיאה: השם שלכם, כתובת, טלפון, שם הכלב ומספר השבב',
      'לבדוק שהפרטים שלכם מעודכנים במרכז הארצי לרישום כלבים',
    ],
  },
]

/* המקור: המדריך /guides/puppy-first-week, וסעיפים 2 ו-3 לחוק להסדרת הפיקוח על כלבים לעניין הרישוי. */
const PUPPY_WEEK: ChecklistGroup[] = [
  {
    title: 'לפני שהגור מגיע',
    items: [
      'לבחור מקום קבוע למיטה, לקערות ולפינת הצרכים',
      'לקבוע תור לווטרינר בשבוע הראשון: בדיקה כללית ותוכנית חיסונים',
    ],
  },
  {
    title: 'היום הראשון',
    items: ['פינה שקטה, מים ושקט', 'בלי סבב מבקרים ביום הראשון', 'לתת לו לחקור את הבית בקצב שלו'],
  },
  {
    title: 'הלילה הראשון',
    items: ['המיטה שלו ליד המיטה שלכם', 'נוכחות שקטה ורגועה כשהוא בוכה, בלי עונשים'],
  },
  {
    title: 'שגרה מהיום הראשון',
    items: [
      'אוכל בשעות קבועות',
      'יציאה לצרכים אחרי כל שינה, כל ארוחה וכל משחק',
      'להרגיל למגע: כפות, אוזניים, ישיבה שקטה ליד הקערה',
      'היכרות עדינה עם קולות, אנשים ומשטחים חדשים',
    ],
  },
  {
    title: 'לזכור',
    items: [
      'לא לקחת גור שעוד לא חוסן לגינות כלבים ציבוריות',
      'מגיל שלושה חודשים נדרש רישיון: שבב, חיסון כלבת ותשלום אגרה',
    ],
  },
]

export default function ChecklistsPage() {
  return (
    <main className="page page-narrow" style={{ maxWidth: 820 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'צ\'קליסטים', path: '/checklists' }])]} />
      <div className="no-print">
        <span className="section-tag">להדפסה</span>
        <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>צ&#39;קליסטים לבעלי כלבים</h1>
        <p className="page-sub" style={{ maxWidth: 640 }}>
          שתי רשימות קצרות. מסמנים על המסך או מדפיסים ותולים על המקרר.
        </p>
        <nav aria-label="קפיצה לרשימה" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '0 0 26px' }}>
          <a href="#emergency-bag" className="chip3d" style={{ textDecoration: 'none' }}>תיק חירום לכלב</a>
          <a href="#puppy-week" className="chip3d" style={{ textDecoration: 'none' }}>שבוע ראשון עם גור</a>
        </nav>
      </div>

      <section id="emergency-bag" style={{ scrollMarginTop: 96, marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>תיק חירום לכלב</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.75, color: '#3a3128' }}>
          מה שכדאי שיהיה מוכן ליד הדלת, לפי המלצות השירותים הווטרינריים במשרד החקלאות וארגון הרופאים הווטרינרים לחיות הבית.
          ההסבר המלא במדריך <Link href="/guides/dog-sirens-safe-room" className="link">כלב, אזעקה וממ&quot;ד</Link>.
        </p>
        <Checklist id="emergency-bag" groups={EMERGENCY_BAG} />
      </section>

      <section id="puppy-week" style={{ scrollMarginTop: 96 }}>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'var(--ink)', margin: '0 0 6px' }}>שבוע ראשון עם גור</h2>
        <p style={{ margin: '0 0 14px', fontSize: 16.5, lineHeight: 1.75, color: '#3a3128' }}>
          הדברים הקטנים שעושים את השבוע הראשון רגוע יותר. ההסבר המלא במדריך{' '}
          <Link href="/guides/puppy-first-week" className="link">השבוע הראשון עם גור</Link>.
        </p>
        <Checklist id="puppy-week" groups={PUPPY_WEEK} />
      </section>

      <section className="no-print" style={{ marginTop: 34, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>מה חסר ברשימה?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44' }}>
          ספרו בקבוצת הפייסבוק שלנו מה אתם שמים בתיק החירום, ומה הציל אתכם בשבוע הראשון עם הגור.
        </p>
        <GroupLink
          src="checklists"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
