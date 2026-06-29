/* כרטיס הזמנה inline לקבוצת הפייסבוק - מתאים להטמעה באמצע עמודי תוכן
   (מסלולים, גינות, מדריכים). מציג טון ספציפי לפי context. */

type Tone = 'walks' | 'parks' | 'guides' | 'general'

const COPY: Record<Tone, { title: string; sub: string; cta: string }> = {
  walks: {
    title: 'הייתם במסלול הזה? ספרו בקבוצה',
    sub: 'בעלי הכלבים בקבוצת הפייסבוק שלנו משתפים מסלולים שעובדים, אזהרות (פחים, חתולים, יתושים), וטיפים שאי אפשר למצוא בשום אתר.',
    cta: 'הצטרפו לקבוצה לפני הטיול הבא 🐾',
  },
  parks: {
    title: 'איזו גינה הכי שווה אצלכם?',
    sub: 'בקבוצת הפייסבוק שלנו אנשים משתפים בזמן אמת איפה יש חבר\'ה עכשiv, איזו גינה מוצלת בקיץ, ואיפה הכלב באמת בטוח.',
    cta: 'בואו לקבוצה לקבל המלצות מקומיות 🐕',
  },
  guides: {
    title: 'יש לכם שאלה? לבקש בקהילה',
    sub: 'הקבוצה שלנו בפייסבוק מלאה בבעלי כלבים מנוסים שעונים תוך דקות - מאילוף ועד וטרינרים מומלצים בעיר שלכם.',
    cta: 'הצטרפו לקהילה בפייסבוק 💬',
  },
  general: {
    title: 'הקהילה האמיתית היא בפייסבוק',
    sub: 'מאות בעלי כלבים מכל הארץ - שואלים, ממליצים, מזהירים, ומחפשים חברה לטיול. בלי אלגוריתם, בלי פרסומות, רק חבר\'ה אמיתיים.',
    cta: 'הצטרפו עכשiv 🐾',
  },
}

const FB_GROUP = 'https://www.facebook.com/share/g/18wnLhr9tn/'

export function JoinCommunityCard({ tone = 'general' }: { tone?: Tone }) {
  const c = COPY[tone]
  return (
    <aside
      style={{
        margin: '40px 0',
        padding: '28px 24px',
        borderRadius: 22,
        background: 'linear-gradient(135deg, #1877f2 0%, #1565d8 100%)',
        color: '#fff',
        textAlign: 'center',
        boxShadow: '0 18px 50px rgba(24,119,242,.28)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-label="הזמנה לקבוצת הפייסבוק"
    >
      <div style={{ fontSize: 38, marginBottom: 4 }} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="46" height="46" fill="#fff" style={{ verticalAlign: 'middle' }}>
          <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z" />
        </svg>
      </div>
      <h3 style={{ fontSize: 22, fontWeight: 900, margin: '6px 0 8px', color: '#fff', letterSpacing: '-.3px' }}>{c.title}</h3>
      <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,.94)', maxWidth: 520, margin: '0 auto', lineHeight: 1.65 }}>{c.sub}</p>
      <a
        href={FB_GROUP}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: 18,
          background: '#fff',
          color: '#1565d8',
          padding: '13px 28px',
          borderRadius: 999,
          fontWeight: 900,
          fontSize: 16,
          textDecoration: 'none',
          boxShadow: '0 6px 16px rgba(0,0,0,.18)',
        }}
      >
        {c.cta}
      </a>
    </aside>
  )
}
