import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { changelog } from '@/lib/changelog'
import { GroupLink } from '@/components/shared/GroupLink'

export const metadata: Metadata = {
  title: 'מה חדש באתר · קהילה על ארבע',
  description: 'רשימת העדכונים באתר קהילה על ארבע, לפי תאריך: כלים חדשים, מדריכים חדשים ושיפורים.',
  alternates: { canonical: '/whats-new' },
}

const heDate = (iso: string) => new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))

export default function WhatsNewPage() {
  const days = Array.from(new Set(changelog.map((c) => c.date))).sort((a, b) => b.localeCompare(a))
  return (
    <main className="page page-narrow" style={{ maxWidth: 820 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'מה חדש', path: '/whats-new' }])]} />
      <span className="section-tag">עדכונים</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.600vw,44px)' }}>מה חדש באתר</h1>
      <p className="page-sub" style={{ maxWidth: 640 }}>
        האתר מתעדכן כל הזמן. כאן רשום כל מה שעלה לאוויר, לפי תאריך.
      </p>

      {days.map((day) => (
        <section key={day} style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#7a5a2e', margin: '0 0 10px' }}>
            <time dateTime={day}>{heDate(day)}</time>
          </h2>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
            {changelog.filter((c) => c.date === day).map((c) => (
              <li key={c.title} style={{ background: '#fff', border: '1px solid rgba(201,154,91,.3)', borderRadius: 16, padding: '14px 18px' }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: 'var(--ink)' }}>{c.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 16.500, lineHeight: 1.700, color: '#3a3128' }}>{c.text}</p>
                {c.href && (
                  <p style={{ margin: '6px 0 0' }}>
                    <Link href={c.href} className="link" style={{ fontWeight: 800, fontSize: 16 }}>{c.cta ?? 'לעמוד'}</Link>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section style={{ marginTop: 8, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>מה לבנות עכשיו?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.500, lineHeight: 1.750, color: '#1b2a44' }}>
          חסר לכם משהו באתר? כתבו בקבוצת הפייסבוק שלנו, וזה ייכנס לרשימה.
        </p>
        <GroupLink
          src="whats-new"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.500, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
