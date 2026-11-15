import Link from 'next/link'
import { GroupLink } from '@/components/shared/GroupLink'

export default function NotFound() {
  return (
    <main className="page" style={{ maxWidth: 640, textAlign: 'center', paddingTop: 48 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/breeds-wc/pomeranian.webp"
        alt=""
        width={170}
        height={238}
        style={{ display: 'block', margin: '0 auto 14px', borderRadius: 20 }}
      />
      <span className="section-tag">404</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,5vw,44px)' }}>
        העמוד הזה <span className="grad-text">ברח מהחצר</span>
      </h1>
      <p className="page-sub" style={{ maxWidth: 480, margin: '0 auto 22px' }}>
        לא מצאנו את הדף שחיפשתם. אולי הקישור ישן, או שהכלב לעס אותו. הנה כמה דרכים לחזור למסלול:
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/search" className="btn btn-primary">חיפוש באתר</Link>
        <Link href="/" className="btn btn-ghost">לדף הבית</Link>
      </div>
      <nav aria-label="עמודים שימושיים" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 22 }}>
        <Link href="/emergency" className="chip3d" style={{ textDecoration: 'none' }}>מצבי חירום</Link>
        <Link href="/near-me" className="chip3d" style={{ textDecoration: 'none' }}>הגינה הקרובה אליי</Link>
        <Link href="/cities" className="chip3d" style={{ textDecoration: 'none' }}>מדריכי ערים</Link>
        <Link href="/guides" className="chip3d" style={{ textDecoration: 'none' }}>מדריכים</Link>
        <Link href="/breeds" className="chip3d" style={{ textDecoration: 'none' }}>גזעים</Link>
        <Link href="/tools" className="chip3d" style={{ textDecoration: 'none' }}>כלים</Link>
      </nav>
      <p style={{ marginTop: 26, fontSize: 16.5, lineHeight: 1.7, color: '#5b4d3c' }}>
        חיפשתם משהו שאין באתר? <GroupLink src="not-found">שאלו בקבוצת הפייסבוק שלנו</GroupLink>.
      </p>
    </main>
  )
}
