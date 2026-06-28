import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'מדיניות עוגיות (Cookies)',
  description:
    'מדיניות העוגיות והאחסון המקומי של קהילה על ארבע: באילו עוגיות אנו משתמשים, מדוע, ואיך לשלוט בהן.',
  path: '/cookies',
})

const UPDATED = 'יוני 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 30 }}>
      <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>{title}</h2>
      <div style={{ fontSize: 16, lineHeight: 1.8, color: '#473d30' }}>{children}</div>
    </section>
  )
}

export default function CookiesPage() {
  return (
    <main className="page" style={{ maxWidth: 760 }}>
      <span className="section-tag">משפטי</span>
      <h1 className="page-title" style={{ fontSize: 40, marginBottom: 6 }}>מדיניות עוגיות</h1>
      <p style={{ fontSize: 14, color: '#8a7c66', marginBottom: 8 }}>עודכן: {UPDATED}</p>
      <p style={{ fontSize: 16.5, lineHeight: 1.8, color: '#473d30' }}>
        אנחנו ב<strong>קהילה על ארבע</strong> מאמינים בפרטיות. האתר בנוי להיות רזה מבחינת מעקב -
        איננו משתמשים בעוגיות פרסום או מעקב צד-שלישי. הדף הזה מסביר בדיוק במה כן אנחנו משתמשים.
      </p>

      <Section title="מה זה בכלל עוגיות ואחסון מקומי?">
        <p>
          <strong>עוגייה (Cookie)</strong> היא קובץ טקסט קטן שאתר שומר בדפדפן שלכם.
          <strong> אחסון מקומי (localStorage)</strong> הוא מנגנון דומה שבו מידע נשמר במכשיר שלכם
          בלבד - ולא נשלח אלינו בכל פנייה לשרת.
        </p>
      </Section>

      <Section title="במה אנחנו משתמשים">
        <ul style={{ margin: 0, paddingInlineStart: 20, display: 'grid', gap: 14 }}>
          <li>
            <strong>אנליטיקה ללא עוגיות (Vercel Analytics):</strong> אנחנו מודדים תנועה באתר בכלי
            שעובד <strong>בלי עוגיות ובלי זיהוי אישי</strong>. הוא אוסף נתונים מצרפיים בלבד (כמה
            ביקורים, אילו עמודים) - לא ניתן לזהות דרכו אתכם אישית.
          </li>
          <li>
            <strong>אחסון מקומי (localStorage) לתפקוד האתר:</strong> שומרים במכשיר שלכם העדפות
            כמו הגדרות נגישות (גודל טקסט, ניגודיות), גזעים ששמרתם למועדפים, וסגירה של חלונות
            (כדי לא להציג שוב). <strong>המידע הזה נשאר אצלכם בדפדפן ולא מועבר אלינו.</strong>
          </li>
          <li>
            <strong>עוגיות תפקודיות חיוניות:</strong> פלטפורמת האחסון שלנו (Vercel) עשויה להציב
            עוגיות טכניות הכרחיות לאבטחה ולתפקוד תקין. אלה לא משמשות למעקב שיווקי.
          </li>
        </ul>
      </Section>

      <Section title="קישורים לשירותים חיצוניים (פייסבוק, גוגל מפות)">
        <p>
          באתר יש קישורים לשירותים חיצוניים - למשל <strong>קבוצת הפייסבוק</strong> שלנו או
          <strong> Google Maps</strong> לניווט לגינות. כשאתם לוחצים על קישור כזה ועוברים לאתר
          החיצוני, אותו שירות עשוי להציב עוגיות משלו לפי מדיניות הפרטיות שלו. אין לנו שליטה על
          העוגיות של שירותים חיצוניים, ומומלץ לעיין במדיניות שלהם.
        </p>
      </Section>

      <Section title="מה אנחנו לא עושים">
        <ul style={{ margin: 0, paddingInlineStart: 20, display: 'grid', gap: 8 }}>
          <li>❌ אין עוגיות פרסום או רימרקטינג.</li>
          <li>❌ אין מכירה או שיתוף של המידע שלכם עם מפרסמים.</li>
          <li>❌ אין מעקב חוצה-אתרים אחריכם.</li>
        </ul>
      </Section>

      <Section title="איך לשלוט בעוגיות ובאחסון">
        <p>
          אתם בשליטה מלאה. בכל דפדפן אפשר <strong>למחוק או לחסום עוגיות ואחסון מקומי</strong> דרך
          ההגדרות (בדרך כלל: הגדרות → פרטיות → ניקוי נתוני גלישה). אפשר גם לגלוש ב<strong>מצב
          פרטי / incognito</strong>, שבו הכל נמחק בסיום. שימו לב שחסימה מלאה עלולה לפגוע בחלק
          מהפיצ'רים (למשל שמירת מועדפים או העדפות נגישות).
        </p>
      </Section>

      <Section title="עדכונים ויצירת קשר">
        <p>
          ייתכן שנעדכן את המדיניות הזו מעת לעת. תאריך העדכון מופיע למעלה. לשאלות בנושא פרטיות
          ועוגיות אפשר לפנות דרך <Link href="/contact" style={{ color: 'var(--brand)', fontWeight: 700 }}>עמוד צרו קשר</Link>.
          מדיניות זו משלימה את <Link href="/privacy" style={{ color: 'var(--brand)', fontWeight: 700 }}>מדיניות הפרטיות</Link> שלנו.
        </p>
      </Section>
    </main>
  )
}
