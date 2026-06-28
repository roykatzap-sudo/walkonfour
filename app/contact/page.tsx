import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'צרו קשר',
  description:
    'שאלה, רעיון או תמונה של הכלב שלכם? הצטרפו לקבוצת הפייסבוק של קהילה על ארבע - שם משתפים, שואלים ומקבלים תשובות.',
  path: '/contact',
})

// קבוצת הפייסבוק הרשמית - הערוץ החי לשיתוף, שאלות ותגובות.
const FB_GROUP = 'https://www.facebook.com/share/g/18wnLhr9tn/'

export default function ContactPage() {
  return (
    <main className="page page-narrow">
      <span className="section-tag">דברו איתנו</span>
      <h1 className="page-title display">יש משהו על הלב? בואו לקבוצה</h1>
      <p className="page-sub">
        שאלה, רעיון, באג שמצאתם, או סתם תמונה של הכלב שלכם - הכי קל לשתף בקבוצת הפייסבוק
        שלנו. שם הקהילה רואה, מגיבה ועונה, ואנחנו קוראים כל פוסט.
      </p>

      <div className="card" style={{ textAlign: 'center', padding: '28px 22px' }}>
        <div style={{ fontSize: 40, marginBottom: 6 }} aria-hidden="true">🐾</div>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: 'var(--ink)', margin: '0 0 8px' }}>
          קבוצת הפייסבוק של קהילה על ארבע
        </h2>
        <p style={{ fontSize: 15.5, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 auto 20px', maxWidth: 460 }}>
          המקום לשתף תמונות, לשאול שאלות על גידול, אילוף ובריאות, ולפגוש בעלי כלבים
          אחרים. כל פוסט ותגובה נקראים - אנחנו שם.
        </p>
        <a
          href={FB_GROUP}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 16, padding: '14px 30px' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.43-4.94 8.43-9.94Z" />
          </svg>
          להצטרפות לקבוצה
        </a>
      </div>

      <p style={{ textAlign: 'center', fontSize: 14.5, color: 'var(--text-muted)', marginTop: 18, lineHeight: 1.7 }}>
        מעדיפים להמתין להשקה הרשמית?{' '}
        <a className="link" href="/waitlist">הצטרפו לרשימת ההמתנה</a> ונעדכן אתכם.
      </p>
    </main>
  )
}
