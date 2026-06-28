import { buildMetadata } from '@/lib/seo'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { DogFriendlyBoard } from '@/components/dogfriendly/DogFriendlyBoard'
import { DF_COUNT } from '@/lib/dogFriendly'

export const metadata = buildMetadata({
  title: 'מקומות דוג-פרנדלי בישראל',
  description:
    'דירקטוריון מקומות מאומתים שמקבלים כלבים בישראל: חופי כלבים מוכרזים, מסעדות ובתי קפה דוג-פרנדלי. סינון אינטראקטיבי לפי קטגוריה ואזור, עם ניווט במפות.',
  path: '/dog-friendly',
})

export default function DogFriendlyPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 22px', marginBottom: 8 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">דוג-פרנדלי</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            איפה מקבלים <span className="grad-text">אתכם ואת הכלב?</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 640, fontSize: 17, color: '#6a6155', lineHeight: 1.7 }}>
            {DF_COUNT} מקומות מאומתים שמקבלים כלבים - חופי כלבים, מסעדות ובתי קפה.
            סננו במקרא לפי קטגוריה ואזור, ונווטו ישר במפות. הרשימה תתרחב עם הקהילה.
          </p>
        </div>
      </div>

      <div
        role="note"
        style={{
          background: 'rgba(201,154,91,.1)',
          border: '1px solid var(--brand-light, #e8c887)',
          borderInlineStart: '4px solid var(--brand)',
          borderRadius: 14,
          padding: '12px 16px',
          marginBottom: 24,
          fontSize: 15,
          lineHeight: 1.6,
          color: 'var(--text)',
        }}
      >
        💡 מדיניות עשויה להשתנות - מומלץ לאמת טלפונית לפני הגעה, ולשמור על רצועה והתנהגות נעימה.
        הרשימה תתרחב עם הקהילה.
      </div>

      <DogFriendlyBoard />
    </main>
  )
}
