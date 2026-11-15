import type { Metadata } from 'next'
import Link from 'next/link'
import { groupQuestions } from '@/lib/groupQuestions'
import { GroupLink } from '@/components/shared/GroupLink'

const TITLE = 'שאלות מהקבוצה · קהילה על ארבע'

export const metadata: Metadata = {
  title: TITLE,
  description: 'שאלות אמיתיות שעלו בקבוצת הפייסבוק של קהילה על ארבע, עם תשובה קצרה ומקורות.',
  alternates: { canonical: '/questions' },
  // עד שיש שאלות, אין סיבה שהעמוד יופיע בחיפוש
  robots: groupQuestions.length ? undefined : { index: false, follow: true },
}

export default function QuestionsPage() {
  const list = [...groupQuestions].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <main className="page page-narrow" style={{ maxWidth: 820 }}>
      <span className="section-tag">מהקבוצה</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>שאלות מהקבוצה</h1>
      <p className="page-sub" style={{ maxWidth: 640 }}>
        שאלות שעלו בקבוצת הפייסבוק שלנו, עם תשובה קצרה ומקורות. שאלה שחוזרת בקבוצה מקבלת כאן עמוד משלה.
      </p>

      {list.length === 0 ? (
        <p style={{ fontSize: 17, lineHeight: 1.8, color: '#3a3128' }}>
          עדיין אין כאן שאלות. השאלה הראשונה יכולה להיות שלכם.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 12 }}>
          {list.map((q) => (
            <li key={q.slug}>
              <Link href={`/questions/${q.slug}`} style={{ display: 'block', textDecoration: 'none', background: '#fff', border: '1px solid rgba(201,154,91,.3)', borderRadius: 16, padding: '16px 20px', color: 'inherit' }}>
                <span style={{ display: 'block', fontSize: 19, fontWeight: 900, color: 'var(--ink)', lineHeight: 1.4 }}>{q.question}</span>
                <span style={{ display: 'block', fontSize: 16.5, lineHeight: 1.7, color: '#3a3128', marginTop: 4 }}>{q.answer}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section style={{ marginTop: 30, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1b2a44', margin: '0 0 6px' }}>יש לכם שאלה?</h2>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44' }}>שאלו בקבוצת הפייסבוק שלנו. שאלות שחוזרות הופכות לעמוד באתר.</p>
        <GroupLink
          src="questions"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
