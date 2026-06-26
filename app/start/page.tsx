import Link from 'next/link'
import { StartSteps, type StartStep } from '@/components/marketing/StartSteps'
import { CtaBanner } from '@/components/marketing/CtaBanner'

export const metadata = {
  title: 'איך מתחילים · כלבניה',
  description:
    'נרשמתם וזהו? לא בדיוק. ארבעה צעדים קצרים מההרשמה ועד הטיול הקבוצתי הראשון בירקון.',
}

const STEPS: StartStep[] = [
  {
    n: 1,
    title: 'פותחים חשבון',
    body: 'דקה אחת: שם, אימייל, אישור מהמייל שמגיע. אין טפסים ארוכים ואין כרטיס אשראי. ברגע שאישרתם - כל הכלים פתוחים לפניכם.',
    cta: { label: 'להרשמה', href: '/auth/register' },
  },
  {
    n: 2,
    title: 'מספרים על הכלב',
    body: 'שם, גזע, גיל, ואיזה טיפוס הוא - אנרגטי שקורע את הסלון או כזה שאוהב את הספה. ככל שהפרופיל מלא יותר, ככה קל יותר למצוא מפגשים ואנשים שמתאימים לכם באזור.',
    cta: { label: 'אל הפרופיל', href: '/profile' },
  },
  {
    n: 3,
    title: 'נכנסים לקבוצת רכישה',
    body: 'מסתכלים אילו קבוצות פתוחות עכשיו ומצטרפים לאחת לפני שהיא נסגרת. ככה שק המזון יורד מ-290 ל-198, בלי לצאת מהבית ובלי לסחוב אותו מהחנות.',
    cta: { label: 'לקבוצות הרכישה', href: '/groups' },
  },
  {
    n: 4,
    title: 'יוצאים מהמסך',
    body: 'מוצאים טיול בוקר קרוב בעמוד האירועים, מאתרים גינה גדורה במפה, וזורקים את השאלה הראשונה בפורום. הקהילה הזו שווה משהו רק כשיוצאים אליה - אז צאו.',
    cta: { label: 'לאירועים', href: '/events' },
  },
]

export default function StartPage() {
  return (
    <main className="page page-narrow">
      <span className="section-tag">מתחילים כאן</span>
      <h1 className="page-title display">ארבעה צעדים, ואתם בפנים</h1>
      <p className="page-sub">
        אין מבחן ואין לחץ. עברו עליהם בקצב שלכם - אפשר גם להתחיל מהסוף.
      </p>

      <StartSteps steps={STEPS} />

      <p className="muted" style={{ marginTop: 28, lineHeight: 1.8 }}>
        רוצים לדעת איך זה עובד לפני שנכנסים? הכול מפורק לפרטים ב{' '}
        <Link className="link" href="/faq">
          שאלות הנפוצות
        </Link>
        .
      </p>

      <CtaBanner
        title="הכלב כבר ליד הדלת"
        text="ההרשמה בחינם ולוקחת דקה. השאר זה כבר אתם והוא."
        primary={{ label: 'מצטרפים עכשיו', href: '/auth/register' }}
        secondary={{ label: 'הסיפור שלנו', href: '/about' }}
      />
    </main>
  )
}
