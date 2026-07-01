import Link from 'next/link'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'

export const metadata = {
  alternates: { canonical: '/tools' },
  title: 'כלים חינמיים · קהילה על ארבע',
  description:
    'עשרה כלים שבנינו כי חיפשנו אותם בעצמנו: כמה באמת עולה כלב בחודש, איזה גזע יסתדר עם הסלון שלכם, כמה אוכל למדוד, מתי לרוץ לווטרינר. בלי הרשמה, בלי תשלום.',
}

type Tool = {
  href: string
  icon: string
  title: string
  desc: string
  tag: string
  d: 1 | 2 | 3 | 4
}

const TOOLS: Tool[] = [
  {
    href: '/match',
    icon: '🧭',
    title: 'איזה גזע מתאים לכם',
    desc: 'שש שאלות על הבית, הילדים והסבלנות שלכם, ובסוף שלושה גזעים שלא תתחרטו עליהם. בלי "כל כלב מקסים בדרכו" - אנחנו אומרים מה אנחנו חושבים.',
    tag: 'שש שאלות, שלוש תשובות',
    d: 1,
  },
  {
    href: '/names',
    icon: '🏷️',
    title: 'שמות לכלב',
    desc: 'נגמרו לכם הרעיונות אחרי "מקס" ו"לונה"? הגרילו שמות בעברית ובלעז לפי אופי, ראו מה כל שם אומר, ושמרו את אלה שגרמו לכם לחייך.',
    tag: 'החלק הכיפי',
    d: 2,
  },
  {
    href: '/calculator',
    icon: '🧮',
    title: 'כמה כלב עולה בחודש',
    desc: 'מזון, וטרינר, ביטוח, טיפוח, אבזור. בוחרים גודל וסגנון ורואים מספר חודשי ושנתי אמיתי, לפני שהגור כבר בבית והחשבון מפתיע.',
    tag: 'המספר שלפני ההחלטה',
    d: 3,
  },
  {
    href: '/health',
    icon: '🩺',
    title: 'מתי לרוץ לווטרינר',
    desc: 'סימני אזהרה לפי דחיפות, ציר חיסונים לגור, מה משתנה בקיץ הישראלי, ומה כדאי שיהיה בארון. מידע כללי - לא תחליף לווטרינר שמכיר את הכלב.',
    tag: 'לדעת מתי לדאוג',
    d: 4,
  },
  {
    href: '/walks',
    icon: '🐾',
    title: 'איפה מטיילים',
    desc: 'חופים, נחלים, יערות ומתחמים מגודרים בכל הארץ. מסננים לפי עיר ורמת קושי, רואים אם יש צל ומים בדרך, ולוחצים ניווט לבוקר הבא.',
    tag: 'יוצאים החוצה',
    d: 1,
  },
  {
    href: '/health-tracker',
    icon: '📋',
    title: 'יומן הבריאות',
    desc: 'חיסונים, משקל, ביקורי וטרינר ותזכורות, מתועדים במקום שתמצאו אותו כשהווטרינר שואל "מתי הזריקה האחרונה?" ואתם לא זוכרים.',
    tag: 'כי המוח לא זוכר',
    d: 2,
  },
  {
    href: '/saved',
    icon: '❤️',
    title: 'מה ששמרתם',
    desc: 'שמות, גזעים, מודעות וכלבים לאימוץ שסימנתם לעצמכם ברחבי קהילה על ארבע. חוזרים אליהם בלי לחפש שוב מה זה היה שאהבתם לפני שבועיים.',
    tag: 'האוסף שלכם',
    d: 3,
  },
  {
    href: '/dog-age',
    icon: '🎂',
    title: 'בן כמה הכלב באמת',
    desc: '"להכפיל בשבע" זו אגדה. כלב גדול מזדקן אחרת מכלב קטן, והמחשבון יודע את ההבדל ואומר לכם באיזה שלב חיים הכלב שלכם נמצא עכשיו.',
    tag: 'לא מה שחשבתם',
    d: 4,
  },
  {
    href: '/lost-found',
    icon: '🆘',
    title: 'כלב אבד או נמצא',
    desc: 'הסיוט של כל בעל כלב. לוח קהילתי לדיווח ולחיפוש לפי עיר, כי בשעה הראשונה כל זוג עיניים נוסף יכול להחזיר כלב הביתה.',
    tag: 'כשצריך את כולם',
    d: 1,
  },
  {
    href: '/food-calculator',
    icon: '🦴',
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
  boxShadow: '0 10px 30px rgba(42,32,24,.06)',
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
          background: 'linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.12)',
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
                  aria-label={`${t.title} - ${t.desc}`}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      fontSize: 40,
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
                    {t.icon}
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
            <Link href="/auth/register" className="btn btn-primary">
              להצטרפות חינם
            </Link>
            <Link href="/start" className="btn btn-ghost" style={{ color: '#fbf7ef', borderColor: 'rgba(251,247,239,.4)' }}>
              איך מתחילים
            </Link>
          </div>
        </section>
      </Reveal3D>
    </main>
  )
}
