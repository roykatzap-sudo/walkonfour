import { Icon, type IconName } from '@/components/shared/Icon'
import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'

export const metadata = {
  alternates: { canonical: '/tools' },
  title: 'כלים חינמיים · קהילה על ארבע',
  description:
    '13 כלים שבנינו כי חיפשנו אותם בעצמנו: כמה באמת עולה כלב בחודש, איזה גזע יסתדר עם הסלון שלכם, כמה אוכל למדוד, מתי לרוץ לווטרינר. בלי הרשמה, בלי תשלום.',
}

type Tool = {
  href: string
  icon: IconName
  title: string
  desc: string
  tag: string
  d: 1 | 2 | 3 | 4
}

const TOOLS: Tool[] = [
  {
    href: '/tools/vaccine-reminder',
    icon: 'calendar',
    title: 'תזכורת חיסון ליומן',
    desc: 'מזינים מתי היה החיסון האחרון, ומקבלים תזכורת ליומן שבועיים לפני הבא. עובד עם יומן הטלפון ועם יומן גוגל.',
    tag: 'שלא תשכחו',
    d: 1,
  },
  {
    href: '/near-me',
    icon: 'pin',
    title: 'הגינה הקרובה אליי',
    desc: 'כפתור אחד, והגינות הקרובות אליכם מופיעות עם מרחק וכפתור ניווט. המיקום נשאר במכשיר שלכם.',
    tag: 'לפי המיקום',
    d: 1,
  },
  {
    href: '/tools/dog-id-card',
    icon: 'idcard',
    title: 'תעודת זהות לכלב',
    desc: 'כרטיס עם תמונה, מספר שבב, הטלפון שלכם ופרטי הווטרינר. שומרים בטלפון ושולחים לפנסיון או לדוגווקר.',
    tag: 'דקה אחת',
    d: 2,
  },
  {
    href: '/quiz',
    icon: 'scale',
    title: 'חידון חוקי הכלבים',
    desc: 'עשר שאלות על רישיון, רצועה, שבב ואוטובוס. אחרי כל תשובה מופיע הסעיף בחוק.',
    tag: 'שתי דקות',
    d: 3,
  },
  {
    href: '/checklists',
    icon: 'checklist',
    title: 'רשימות להדפסה',
    desc: 'תיק חירום לכלב, ושבוע ראשון עם גור. מסמנים על המסך או מדפיסים.',
    tag: 'להדפסה',
    d: 4,
  },
  {
    href: '/tools/lost-dog-poster',
    icon: 'megaphone',
    title: 'מודעת כלב אבד',
    desc: 'תמונה, תיאור וטלפון, ותוך דקה יש מודעה להדפסה ותמונה לשיתוף בוואטסאפ ובקבוצות פייסבוק. מתאים גם למי שמצא כלב. הפרטים נשארים במכשיר שלכם.',
    tag: 'כשכל דקה חשובה',
    d: 1,
  },
  {
    href: '/match',
    icon: 'compass',
    title: 'איזה גזע מתאים לכם',
    desc: 'שמונה שאלות על הבית, הילדים, הזמן והקיץ שלכם, ובסוף שלושה גזעים שלא תתחרטו עליהם. בלי "כל כלב מקסים בדרכו" - אנחנו אומרים מה אנחנו חושבים.',
    tag: 'שמונה שאלות, שלוש תשובות',
    d: 1,
  },
  {
    href: '/names',
    icon: 'tag',
    title: 'שמות לכלב',
    desc: 'נגמרו לכם הרעיונות אחרי "מקס" ו"לונה"? הגרילו שמות בעברית ובלעז לפי אופי, ראו מה כל שם אומר, ושמרו את אלה שגרמו לכם לחייך.',
    tag: 'החלק הכיפי',
    d: 2,
  },
  {
    href: '/calculator',
    icon: 'calculator',
    title: 'כמה כלב עולה בחודש',
    desc: 'מזון, וטרינר, ביטוח, טיפוח, אבזור. בוחרים גודל וסגנון ורואים מספר חודשי ושנתי אמיתי, לפני שהגור כבר בבית והחשבון מפתיע.',
    tag: 'המספר שלפני ההחלטה',
    d: 3,
  },
  {
    href: '/health',
    icon: 'health',
    title: 'מתי לרוץ לווטרינר',
    desc: 'סימני אזהרה לפי דחיפות, ציר חיסונים לגור, מה משתנה בקיץ הישראלי, ומה כדאי שיהיה בארון. מידע כללי - לא תחליף לווטרינר שמכיר את הכלב.',
    tag: 'לדעת מתי לדאוג',
    d: 4,
  },
  {
    href: '/walks',
    icon: 'route',
    title: 'איפה מטיילים',
    desc: 'חופים, נחלים, יערות ומתחמים מגודרים בכל הארץ. מסננים לפי עיר ורמת קושי, רואים אם יש צל ומים בדרך, ולוחצים ניווט לבוקר הבא.',
    tag: 'יוצאים החוצה',
    d: 1,
  },
  {
    href: '/dog-age',
    icon: 'cake',
    title: 'בן כמה הכלב באמת',
    desc: '"להכפיל בשבע" זו אגדה. כלב גדול מזדקן אחרת מכלב קטן, והמחשבון יודע את ההבדל ואומר לכם באיזה שלב חיים הכלב שלכם נמצא עכשיו.',
    tag: 'לא מה שחשבתם',
    d: 4,
  },
  {
    href: '/food-calculator',
    icon: 'bowl',
    title: 'כמה אוכל למדוד',
    desc: 'הכמות על השק היא ניחוש גס. לפי משקל, גיל ורמת פעילות מקבלים מנה יומית בגרמים, על בסיס הנוסחה שווטרינרים עובדים איתה.',
    tag: 'הקערה הנכונה',
    d: 2,
  },
]

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '28px 26px',
  borderRadius: 24,
  background: 'linear-gradient(160deg, #fff, #fdf8ef)',
  border: '1px solid rgba(201,154,91,.14)',
  boxShadow: 'var(--shadow-sm)',
  textDecoration: 'none',
  color: 'var(--text)',
}

export default function ToolsPage() {
  return (
    <main className="page" style={{ maxWidth: 1080 }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '56px 28px 48px',
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
          <span className="section-tag">עשרה כלים, אפס תשלום</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            הכלים שחיפשנו בעצמנו
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, margin: '12px auto 0' }}>
            כל אחד מהם נולד משאלה אמיתית שעלתה בגינה. כמה כלב עולה בחודש. איזה גזע
            יסתדר עם הבית. כמה אוכל למדוד. אין הרשמה, אין תשלום. בוחרים את מה
            שמעניין אתכם עכשיו.
          </p>
        </div>
      </section>

      {/* ── גריד הכלים ── */}
      <section aria-labelledby="tools-grid-h">
        <h2 id="tools-grid-h" className="sr-only-h" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
          רשימת הכלים
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 22,
          }}
        >
          {TOOLS.map((t) => (
            <Reveal3D as="div" key={t.href} delay={t.d}>
              <Tilt3D max={9} className="kv-fill-h">
                <Link
                  href={t.href}
                  className="lift-3d"
                  style={cardStyle}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      color: '#7a5a2e',
                      width: 72,
                      height: 72,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 20,
                      marginBottom: 18,
                      background: 'linear-gradient(160deg, #fdf0d8, #f6e3c2)',
                      border: '1px solid rgba(201,154,91,.2)',
                    }}
                  >
                    <Icon name={t.icon} size={36} />
                  </div>
                  <span
                    className="section-tag"
                    style={{ marginBottom: 8, alignSelf: 'flex-start' }}
                  >
                    {t.tag}
                  </span>
                  <h3
                    style={{
                      fontSize: 'clamp(20px, 2.4vw, 26px)',
                      fontWeight: 800,
                      margin: '0 0 8px',
                      color: 'var(--ink)',
                    }}
                  >
                    {t.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.75,
                      color: 'var(--text-muted)',
                      flex: 1,
                    }}
                  >
                    {t.desc}
                  </p>
                  <span
                    aria-hidden="true"
                    style={{
                      marginTop: 18,
                      fontWeight: 700,
                      color: 'var(--brand-dark)',
                    }}
                  >
                    לכלי ←
                  </span>
                </Link>
              </Tilt3D>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* ── פס סיום ── */}
      <Reveal3D>
        <section
          style={{
            marginTop: 48,
            padding: '36px 28px',
            borderRadius: 24,
            textAlign: 'center',
            background: 'linear-gradient(160deg, #2a2018, #3a2c20)',
            color: '#fbf7ef',
          }}
        >
          <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 34px)', fontWeight: 800, margin: '0 0 10px' }}>
            הכלים זה רק הקצה
          </h2>
          <p style={{ margin: '0 auto 22px', maxWidth: 560, lineHeight: 1.8, opacity: 0.92 }}>
            מאחורי הכלים יש אנשים. אנחנו בונים קבוצות רכישה שיוזילו את שק המזון,
            מישהו שישמור על הכלב כשאתם בחו"ל, ופורום ששואלים בו את מה שלא נעים
            לשאול את הווטרינר. ההצטרפות בחינם.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/waitlist" className="btn btn-primary">
              להצטרפות חינם
            </Link>
            <Link href="/breeds" className="btn btn-ghost" style={{ color: '#fbf7ef', borderColor: 'rgba(251,247,239,.4)' }}>
              לכל הגזעים
            </Link>
          </div>
        </section>
      </Reveal3D>
    </main>
  )
}
