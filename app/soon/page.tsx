import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'הקהילה בדרך',
  description: 'אזור הקהילה של קהילה על ארבע ייפתח בקרוב. בינתיים, כל התוכן והכלים פתוחים וחינמיים.',
  path: '/soon',
  noindex: true,
})

const OPEN = [
  { href: '/breeds', label: '🐕 גזעי הכלבים' },
  { href: '/articles', label: '📚 מדריכי הגזעים' },
  { href: '/vet', label: '🩺 שאלות לווטרינר' },
  { href: '/tools', label: '🧰 הכלים החינמיים' },
  { href: '/match', label: '🎯 איזה כלב מתאים לי' },
  { href: '/map', label: '📍 מפת גינות כלבים' },
]

export default function SoonPage() {
  return (
    <main className="page" style={{ maxWidth: 680, textAlign: 'center', paddingTop: 40 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/breeds-wc/goldendoodle.png"
        alt="איור צבעי-מים של כלב"
        width={160}
        height={224}
        style={{ display: 'block', margin: '0 auto 10px', borderRadius: 20 }}
      />
      <span className="section-tag">בקרוב</span>
      <h1 className="page-title" style={{ fontSize: 42 }}>
        אזור הקהילה <span className="grad-text">בדרך אלינו</span>
      </h1>
      <p className="page-sub" style={{ maxWidth: 540, margin: '0 auto 28px' }}>
        אנחנו בונים את הקהילה בזהירות - פורום, אירועים, קבוצות רכישה ויד שנייה ייפתחו בקרוב.
        בינתיים, <strong>כל התוכן והכלים פתוחים וחינמיים</strong>:
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          maxWidth: 560,
          margin: '0 auto 32px',
        }}
      >
        {OPEN.map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className="card"
            style={{ padding: '16px 14px', textDecoration: 'none', color: 'var(--ink)', fontWeight: 800, fontSize: 15.5 }}
          >
            {o.label}
          </Link>
        ))}
      </div>

      <Link href="/" className="btn btn-primary">← חזרה לדף הבית</Link>
    </main>
  )
}
