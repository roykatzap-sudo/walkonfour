import Link from 'next/link'

export function Footer() {
  return (
    <footer className="kv-footer">
      <div className="kv-footer-logo">
        כלב<em>ניה</em>
      </div>
      <div className="kv-footer-copy">
        נבנה בין טיולי בוקר · © 2025 כלבניה
      </div>
      <nav className="kv-footer-links" aria-label="ניווט תחתון">
        <Link href="/breeds">גזעים</Link>
        <Link href="/articles">מדריכי גזעים</Link>
        <Link href="/guides">אילוף וטיפול</Link>
        <Link href="/vet">שאלות לווטרינר</Link>
        <Link href="/faq">שאלות נפוצות</Link>
        <Link href="/about">אודות</Link>
        <Link href="/privacy">פרטיות</Link>
        <Link href="/terms">תקנון</Link>
        <Link href="/accessibility">נגישות</Link>
        <Link href="/contact">צרו קשר</Link>
      </nav>
      <nav className="kv-footer-links" aria-label="כלים ושירותים">
        <Link href="/tools">כלים</Link>
        <Link href="/match">איזה כלב מתאים לי</Link>
        <Link href="/calculator">מחשבון עלויות</Link>
        <Link href="/food-calculator">מחשבון מזון</Link>
        <Link href="/dog-food-prices">מחירון מזון</Link>
        <Link href="/map">מפת גינות</Link>
        <Link href="/walks">מסלולי טיול</Link>
        <Link href="/dog-friendly">דוג-פרנדלי</Link>
        <Link href="/cities">מדריכי ערים</Link>
        <Link href="/canaan-dog">סיפור הכלב הכנעני</Link>
      </nav>
    </footer>
  )
}
