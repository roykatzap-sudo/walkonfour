import Link from 'next/link'
import { FaqAccordion, type FaqGroup } from '@/components/marketing/FaqAccordion'
import { JsonLd, faqSchema, type FaqItem } from '@/components/seo/JsonLd'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { buildMetadata } from '@/lib/seo'
import { VET_GROUPS, VET_QA_COUNT } from '@/lib/vetqa'

export const metadata = buildMetadata({
  title: 'שאלות נפוצות לווטרינר - מדריך בריאות הכלב',
  description:
    'תשובות לשאלות הנפוצות ביותר על בריאות כלבים: הקאות, מאכלים רעילים, חיסונים וכלבת, קרציות ולישמניאזיס, מכת חום, תזונה ועיקור. מתי זה חירום ומתי אפשר להמתין.',
  path: '/vet',
})

// קבוצות לאקורדיון - התשובה כוללת פסקה ובמידת הצורך קופסת "דגל אדום".
const groups: FaqGroup[] = VET_GROUPS.map((g) => ({
  title: `${g.icon} ${g.title}`,
  items: g.items.map((it) => ({
    q: it.q,
    a: (
      <>
        <p>{it.a}</p>
        {it.redFlag && (
          <div className="vet-redflag">
            <span aria-hidden="true">🚨</span>
            <span>
              <strong>דגל אדום: </strong>
              {it.redFlag}
            </span>
          </div>
        )}
      </>
    ),
  })),
}))

// פריטים ל-FAQ JSON-LD (טקסט בלבד; הדגל האדום מצורף לתשובה).
const schemaItems: FaqItem[] = VET_GROUPS.flatMap((g) =>
  g.items.map((it) => ({
    q: it.q,
    a: it.redFlag ? `${it.a} דגל אדום: ${it.redFlag}` : it.a,
  })),
)

export default function VetPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <JsonLd data={faqSchema(schemaItems)} />

      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 24px', marginBottom: 8 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">שאלות נפוצות לווטרינר</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            בריאות הכלב, <span className="grad-text">בשפה פשוטה</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, fontSize: 17, color: '#6a6155', lineHeight: 1.7 }}>
            {VET_QA_COUNT} השאלות שבעלי כלבים הכי שואלים - מה דחוף ומה יכול לחכות, עם דגש על מה שרלוונטי
            דווקא כאן: חום הקיץ, קרציות, לישמניאזיס וחיסון הכלבת שחובה בחוק.
          </p>
        </div>
      </div>

      {/* באנר אזהרה - חינוכי, לא תחליף לבדיקה */}
      <div className="vet-disclaimer" role="note">
        <span className="vet-disclaimer-ico" aria-hidden="true">⚕️</span>
        <p>
          המידע כאן חינוכי בלבד ואינו תחליף לבדיקה, אבחנה או טיפול וטרינרי. כל כלב שונה - בכל מצב חירום,
          החמרה או ספק, פנו לווטרינר שלכם או למרפאת חירום מיד.
        </p>
      </div>

      <FaqAccordion groups={groups} />

      <div className="vet-cta">
        <p>רוצים להבין יותר על הגזע שלכם או לבחור גור?</p>
        <div className="vet-cta-links">
          <Link href="/articles" className="btn btn-dark">מדריכי הגזעים</Link>
          <Link href="/match" className="btn btn-ghost">איזה כלב מתאים לי</Link>
        </div>
      </div>

      <style>{`
        .vet-disclaimer {
          display: flex; gap: 14px; align-items: flex-start;
          background: rgba(201,154,91,.12);
          border: 1px solid var(--brand-light);
          border-inline-start: 4px solid var(--brand);
          border-radius: 16px; padding: 16px 20px; margin: 0 0 36px;
        }
        .vet-disclaimer-ico { font-size: 26px; line-height: 1.2; }
        .vet-disclaimer p { margin: 0; font-size: 15.5px; line-height: 1.7; color: var(--text); font-weight: 600; }
        .vet-redflag {
          display: flex; gap: 10px; align-items: flex-start;
          background: #fbeceb; border: 1px solid #f1c6c2;
          border-radius: 12px; padding: 12px 14px; margin-top: 12px;
          font-size: 15px; line-height: 1.6; color: #8a2f2a;
        }
        .vet-redflag strong { color: #7a241f; }
        .vet-cta {
          text-align: center; margin: 48px auto 0; max-width: 560px;
          background: #fff; border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px; padding: 28px 24px;
          box-shadow: 0 4px 18px rgba(42,32,24,.06);
        }
        .vet-cta p { margin: 0 0 16px; font-size: 18px; font-weight: 800; color: var(--ink); }
        .vet-cta-links { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
      `}</style>
    </main>
  )
}
