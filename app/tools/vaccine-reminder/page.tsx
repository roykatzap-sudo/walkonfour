import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { VaccineReminder } from '@/components/tools/VaccineReminder'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'תזכורת חיסון לכלב: מוסיפים ליומן בדקה'
const DESC =
  'מזינים מתי היה החיסון האחרון ומקבלים תזכורת ליומן שבועיים לפני החיסון הבא. עובד עם יומן הטלפון ועם יומן גוגל. שום פרט לא נשלח לאתר.'
const OG = ogImageUrl({ title: 'תזכורת חיסון לכלב', subtitle: 'ליומן, שבועיים לפני', tag: 'כלי' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/tools/vaccine-reminder' },
  openGraph: { title: TITLE, description: DESC, url: '/tools/vaccine-reminder', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

export default function VaccineReminderPage() {
  return (
    <main className="page" style={{ maxWidth: 1000 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'כלים', path: '/tools' }, { name: 'תזכורת חיסון', path: '/tools/vaccine-reminder' }])]} />
      <span className="section-tag">כלי</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.600vw,44px)' }}>תזכורת חיסון, ישר ליומן</h1>
      <p className="page-sub" style={{ maxWidth: 680 }}>
        רישיון הכלב בתוקף רק כשחיסון הכלבת בתוקף, וקל לשכוח את התאריך. מזינים פעם אחת, והיומן מזכיר שבועיים לפני.
      </p>

      <VaccineReminder />

      <p style={{ margin: '26px 0 0', fontSize: 16.500, lineHeight: 1.800, color: '#3a3128', maxWidth: 720 }}>
        להרחבה: <Link href="/guides/vaccinations-2026" className="link" style={{ fontWeight: 800 }}>חיסונים לכלב, מחירון ולוח זמנים</Link>,{' '}
        <Link href="/guides/rabies-israel-2026" className="link" style={{ fontWeight: 800 }}>כלבת בישראל 2026</Link>, ו
        <Link href="/glossary#rabies-vaccine" className="link" style={{ fontWeight: 800 }}>חיסון כלבת במילון</Link>.
      </p>

      <section style={{ marginTop: 30, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>איפה מחסנים אצלכם?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.500, lineHeight: 1.750, color: '#1b2a44', maxWidth: 640 }}>
          עירייה או קליניקה פרטית, וכמה זה עלה. ספרו בקבוצת הפייסבוק שלנו, וזה יעזור למי שקובע תור עכשיו.
        </p>
        <GroupLink
          src="vaccine-reminder"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.500, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
