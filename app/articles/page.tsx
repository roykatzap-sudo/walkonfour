import { breedArticles } from '@/lib/articles'
import { ArticleSearch } from '@/components/articles/ArticleSearch'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

export const metadata = {
  alternates: { canonical: '/articles' },
  title: 'מדריכי הגזעים · קהילה על ארבע',
  description: 'מדריך מלא לכל גזע כלב - אופי, התאמה למשפחה, בריאות, טיפוח ואילוף. עברית, מקיף ומדויק.',
}

export default function ArticlesPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .article-card-link:focus-visible {
              outline: 3px solid #2a2018;
              outline-offset: 3px;
            }
            .article-card-link:focus-visible h2 { text-decoration: underline; }
          `,
        }}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 28px', marginBottom: 8 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריכי הגזעים</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            מדריך לכל גזע, <span className="grad-text">בלי לייפות</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600, fontSize: 17, color: '#6a6155', lineHeight: 1.7 }}>
            {breedArticles.length} מדריכים לעומק - לא רק החלקים החמודים, אלא גם הבריאות, הטיפוח
            והעצבים שזה דורש. כתבנו אותם כמו שהיינו מספרים לחבר ששוקל לאמץ.
          </p>
        </div>
      </div>

      <ArticleSearch />
    </main>
  )
}
