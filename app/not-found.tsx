import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="page" style={{ maxWidth: 600, textAlign: 'center', paddingTop: 48 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/breeds-wc/pomeranian.png"
        alt="איור צבעי-מים של כלב מבולבל"
        width={170}
        height={238}
        style={{ display: 'block', margin: '0 auto 14px', borderRadius: 20 }}
      />
      <span className="section-tag">404</span>
      <h1 className="page-title" style={{ fontSize: 44 }}>
        העמוד הזה <span className="grad-text">ברח מהחצר</span>
      </h1>
      <p className="page-sub" style={{ maxWidth: 460, margin: '0 auto 28px' }}>
        לא מצאנו את הדף שחיפשתם. אולי הקישור ישן, או שהכלב לעס אותו. בואו נחזור למסלול:
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" className="btn btn-primary">← לדף הבית</Link>
        <Link href="/breeds" className="btn btn-ghost">לכל הגזעים</Link>
      </div>
    </main>
  )
}
