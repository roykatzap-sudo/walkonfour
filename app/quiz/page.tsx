import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd'
import { ogImageUrl } from '@/lib/seo'
import { lawQuiz } from '@/lib/lawQuiz'
import { LawQuiz } from '@/components/quiz/LawQuiz'

const TITLE = 'חידון: כמה אתם מכירים את חוקי הכלבים בישראל?'
const DESC =
  'עשר שאלות קצרות על רישיון, שבב, רצועה, כלב שנתפס ואוטובוס. אחרי כל תשובה מקבלים הסבר קצר ואת הסעיף בחוק, ובסוף ציון שאפשר לשתף.'
const OG = ogImageUrl({ title: 'כמה אתם מכירים את חוקי הכלבים?', subtitle: 'עשר שאלות, שתי דקות', tag: 'חידון' })

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/quiz' },
  openGraph: { title: TITLE, description: DESC, url: '/quiz', type: 'website', locale: 'he_IL', images: [{ url: OG, width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
}

export default function QuizPage() {
  return (
    <main className="page page-narrow" style={{ maxWidth: 760 }}>
      <JsonLd data={[breadcrumbSchema([{ name: 'דף הבית', path: '/' }, { name: 'חידון חוקי הכלבים', path: '/quiz' }])]} />
      <span className="section-tag">חידון</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(28px,4.4vw,42px)' }}>כמה אתם מכירים את חוקי הכלבים?</h1>
      <p className="page-sub" style={{ maxWidth: 640 }}>
        {lawQuiz.length} שאלות, בערך שתי דקות. אחרי כל תשובה מופיעים הסבר קצר והסעיף בחוק שעליו היא נשענת.
      </p>

      <LawQuiz questions={lawQuiz} />

      <p className="muted" style={{ marginTop: 18, fontSize: 14.5, lineHeight: 1.7 }}>
        השאלות מבוססות על נוסח החוק להסדרת הפיקוח על כלבים, התשס&quot;ג-2002, ועל תקנות התעבורה, כפי שנבדקו בנובמבר 2026. החידון הוא מידע כללי ואינו ייעוץ משפטי.
        להרחבה: <Link href="/laws" className="link">חוקים על כלבים בישראל</Link> ו<Link href="/glossary" className="link">המילון</Link>.
      </p>
    </main>
  )
}
