import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'צרו קשר',
  description:
    'יצרו קשר עם קהילה על ארבע בכל שאלה, רעיון או הצעה לשיתוף פעולה.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <main className="page page-narrow">
      <span className="section-tag">דברו איתנו</span>
      <h1 className="page-title display">יש משהו על הלב? כתבו</h1>
      <p className="page-sub">
        שאלה, רעיון, באג שמצאתם, או סתם תמונה של הכלב שלכם. אדם אמיתי קורא ועונה.
      </p>
      <div className="card">
        <p style={{ lineHeight: 1.9, color: '#2a2018', fontSize: 16 }}>
          אימייל:{' '}
          <a className="link" href="mailto:hello@kelvanya.co.il">
            hello@kelvanya.co.il
          </a>
        </p>
        <p style={{ lineHeight: 1.9, color: '#2a2018', fontSize: 16, marginTop: 10 }}>
          אינסטגרם: <span style={{ fontWeight: 700 }}>@kelvanya</span> - שם אנחנו
          מעלים את הכלבים שלכם (באישור, כמובן).
        </p>
      </div>
    </main>
  )
}
