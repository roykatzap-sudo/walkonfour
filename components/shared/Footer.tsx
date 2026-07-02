import Link from 'next/link'
import type { CSSProperties } from 'react'

// קיבוץ קישורי הפוטר לעמודות עם כותרת - קריאות טובה יותר לקהל 40+
const footerGroupStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 150,
}
const footerHeadingStyle: CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: 'var(--brand-light)',
  letterSpacing: '.02em',
  marginBottom: 6,
}
// override ל-kv-footer-links: עמודה אנכית במקום שורה, מרווח קטן יותר
const footerColStyle: CSSProperties = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 2,
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="kv-footer">
      <div className="kv-footer-logo">
        קהילה על <em>ארבע</em>
      </div>

      {/* CTA ראשי - רשימת ההמתנה, נוכח בכל עמוד */}
      <Link
        href="/waitlist"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--brand)', color: '#fff', fontWeight: 900, fontSize: 15,
          padding: '12px 24px', borderRadius: 999, textDecoration: 'none',
          margin: '6px 0 6px', boxShadow: '0 8px 22px rgba(201,154,91,.32)',
        }}
      >
        🐾 הצטרפו לרשימת ההמתנה
      </Link>

      {/* פייסבוק - משני, "בינתיים" */}
      <a
        href="https://www.facebook.com/share/g/18wnLhr9tn/"
        target="_blank"
        rel="noopener noreferrer"
        className="kv-footer-fb"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#1877f2', fontWeight: 700, fontSize: 14, padding: '8px 16px', borderRadius: 999, textDecoration: 'none', border: '1.5px solid rgba(24,119,242,.4)', margin: '2px 0 18px' }}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877f2" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94Z"/></svg>
        בינתיים - קבוצת הפייסבוק שלנו
      </a>
      <div style={footerGroupStyle}>
        <div style={footerHeadingStyle} aria-hidden="true">תוכן וקהילה</div>
        <nav className="kv-footer-links" aria-label="ניווט תחתון" style={footerColStyle}>
          <Link href="/waitlist">רשימת המתנה</Link>
          <Link href="/breeds">גזעים</Link>
          <Link href="/articles">מדריכי גזעים</Link>
          <Link href="/guides">אילוף וטיפול</Link>
          <Link href="/vet">שאלות לווטרינר</Link>
          <Link href="/faq">שאלות נפוצות</Link>
          <Link href="/about">אודות</Link>
          <Link href="/contact">צרו קשר</Link>
        </nav>
      </div>
      <div style={footerGroupStyle}>
        <div style={footerHeadingStyle} aria-hidden="true">כלים ושירותים</div>
        <nav className="kv-footer-links" aria-label="כלים ושירותים" style={footerColStyle}>
          <Link href="/tools">כלים</Link>
          <Link href="/match">איזה כלב מתאים לי</Link>
          <Link href="/calculator">מחשבון עלויות</Link>
          <Link href="/food-calculator">מחשבון מזון</Link>
          <Link href="/dog-food-prices">מחירון מזון</Link>
          <Link href="/map">מפת גינות</Link>
          <Link href="/walks">מסלולי טיול</Link>
          <Link href="/cities">מדריכי ערים</Link>
          <Link href="/laws">חוקים על כלבים</Link>
          <Link href="/compare">השוואות גזעים</Link>
          <Link href="/canaan-dog">סיפור הכלב הכנעני</Link>
        </nav>
      </div>
      <div style={footerGroupStyle}>
        <div style={footerHeadingStyle} aria-hidden="true">מידע משפטי</div>
        <nav className="kv-footer-links" aria-label="מידע משפטי" style={footerColStyle}>
          <Link href="/privacy">פרטיות</Link>
          <Link href="/terms">תקנון</Link>
          <Link href="/cookies">מדיניות עוגיות</Link>
          <Link href="/accessibility">נגישות</Link>
        </nav>
      </div>
      <div className="kv-footer-copy" style={{ marginTop: 14 }}>
        נבנה בין טיולי בוקר · © {year} קהילה על ארבע
      </div>
    </footer>
  )
}
