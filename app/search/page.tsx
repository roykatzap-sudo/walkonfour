import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteSearch } from '@/components/search/SiteSearch'
import { GroupLink } from '@/components/shared/GroupLink'

export const metadata: Metadata = {
  title: 'חיפוש באתר · קהילה על ארבע',
  description: 'חיפוש במדריכים, בגזעים, בערים, בחוקים ובכלים של קהילה על ארבע.',
  alternates: { canonical: '/search' },
  robots: { index: false, follow: true },
}

const SHORTCUTS: { href: string; label: string }[] = [
  { href: '/emergency', label: 'מצבי חירום' },
  { href: '/near-me', label: 'הגינה הקרובה אליי' },
  { href: '/cities', label: 'מדריכי ערים' },
  { href: '/guides', label: 'כל המדריכים' },
  { href: '/breeds', label: 'גזעים' },
  { href: '/tools', label: 'כלים' },
]

export default function SearchPage() {
  return (
    <main className="page page-narrow" style={{ maxWidth: 760 }}>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,42px)' }}>חיפוש באתר</h1>
      <SiteSearch />

      <section style={{ marginTop: 34 }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>קיצורי דרך</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SHORTCUTS.map((s) => (
            <Link key={s.href} href={s.href} className="chip3d" style={{ textDecoration: 'none' }}>{s.label}</Link>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 28, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>לא מצאתם תשובה?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44' }}>
          שאלו בקבוצת הפייסבוק שלנו. בעלי כלבים אחרים עברו כנראה את אותו דבר.
        </p>
        <GroupLink
          src="search"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
