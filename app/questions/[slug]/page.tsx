import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/seo'
import { groupQuestions, getGroupQuestion } from '@/lib/groupQuestions'
import { GroupLink } from '@/components/shared/GroupLink'

export const dynamicParams = false

export function generateStaticParams() {
  return groupQuestions.map((q) => ({ slug: q.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const q = getGroupQuestion(params.slug)
  if (!q) return { title: 'השאלה לא נמצאה', robots: { index: false } }
  return { title: `${q.question} · קהילה על ארבע`, description: q.answer.slice(0, 155), alternates: { canonical: `/questions/${q.slug}` } }
}

export default function QuestionPage({ params }: { params: { slug: string } }) {
  const q = getGroupQuestion(params.slug)
  if (!q) notFound()
  const qa = {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: q.question,
      answerCount: 1,
      acceptedAnswer: { '@type': 'Answer', text: [q.answer, ...q.body].join(' '), url: `${SITE_URL}/questions/${q.slug}` },
    },
  }
  return (
    <main className="page page-narrow" style={{ maxWidth: 820 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'שאלות מהקבוצה', path: '/questions' }, { name: q.question, path: `/questions/${q.slug}` }]), qa]} />
      <Link href="/questions" className="link" style={{ fontWeight: 700 }}>כל השאלות מהקבוצה</Link>
      <span className="section-tag" style={{ display: 'block', marginTop: 14 }}>שאלה מהקבוצה</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(28px,4.2vw,40px)' }}>{q.question}</h1>
      <div style={{ background: '#fdf6e9', border: '1px solid rgba(201,154,91,.3)', borderInlineStart: '5px solid var(--brand)', borderRadius: 16, padding: '18px 22px', margin: '0 0 22px' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: '#7a5a2e', marginBottom: 4 }}>בקצרה</div>
        <p style={{ margin: 0, fontSize: 17.5, lineHeight: 1.75, color: '#2a2018', fontWeight: 600 }}>{q.answer}</p>
      </div>
      {q.body.map((p, i) => (
        <p key={i} style={{ fontSize: 17, lineHeight: 1.9, color: '#3a3128', margin: '0 0 14px' }}>{p}</p>
      ))}
      {q.voices && q.voices.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--ink)', margin: '0 0 10px' }}>מה ענו בקבוצה</h2>
          {q.voices.map((v, i) => (
            <blockquote key={i} style={{ margin: '0 0 10px', background: '#fff', border: '1px solid rgba(201,154,91,.3)', borderRadius: 14, padding: '14px 18px', fontSize: 16.5, lineHeight: 1.75, color: '#2a2018' }}>
              {v.text}
              {v.name && <footer style={{ marginTop: 6, fontSize: 15, color: '#5b4d3c', fontWeight: 700 }}>{v.name}</footer>}
            </blockquote>
          ))}
        </section>
      )}
      {q.more && (
        <p style={{ marginTop: 16, fontSize: 16.5 }}>
          להרחבה: <Link href={q.more.href} className="link" style={{ fontWeight: 800 }}>{q.more.label}</Link>
        </p>
      )}
      {q.sources && q.sources.length > 0 && (
        <section style={{ marginTop: 22 }}>
          <h2 style={{ fontSize: 19, fontWeight: 900, color: 'var(--ink)', margin: '0 0 8px' }}>מקורות</h2>
          <ul style={{ margin: 0, paddingInlineStart: 20, display: 'grid', gap: 6 }}>
            {q.sources.map((s) => (
              <li key={s.url} style={{ fontSize: 15.5 }}><a href={s.url} target="_blank" rel="noopener noreferrer" className="link">{s.label}</a></li>
            ))}
          </ul>
        </section>
      )}
      <section style={{ marginTop: 28, background: '#eef4ff', border: '1px solid rgba(24,119,242,.28)', borderRadius: 18, padding: '20px 22px' }}>
        <p style={{ margin: '0 0 12px', fontSize: 16.5, lineHeight: 1.75, color: '#1b2a44' }}>השאלה הזאת עלתה בקבוצת הפייסבוק שלנו. יש לכם עוד אחת? שאלו שם.</p>
        <GroupLink
          src="question"
          className="kv-press"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 50, padding: '12px 26px', borderRadius: 999, background: '#1565d8', color: '#fff', fontWeight: 800, fontSize: 16.5, textDecoration: 'none' }}
        >
          לקבוצת הפייסבוק
        </GroupLink>
      </section>
    </main>
  )
}
