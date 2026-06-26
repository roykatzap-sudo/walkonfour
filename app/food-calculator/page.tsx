import { FoodCalculator } from '@/components/tools/FoodCalculator'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata = {
  title: 'כמה אוכל למדוד לכלב · כלבניה',
  description:
    'הכמות על השק היא ניחוש גס. המחשבון נותן מנה יומית בגרמים לפי משקל, גיל ורמת פעילות - על בסיס נוסחת RER/MER שווטרינרים עובדים איתה.',
}

export default function FoodCalculatorPage() {
  return (
    <main className="page page-narrow">
      <JsonLd
        data={softwareAppSchema({
          name: 'מחשבון מנת מזון יומית לכלב',
          description: 'מחשב כמה אוכל הכלב צריך ביום לפי משקל, גיל ופעילות, על בסיס נוסחת RER/MER.',
          path: '/food-calculator',
        })}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 20px', marginBottom: 10 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">הקערה הנכונה</span>
          <h1 className="page-title">
            כמה אוכל הכלב שלכם <span className="grad-text">באמת צריך?</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 540 }}>
            הכמות שכתובה על השק היא ניחוש גס, ולרוב נדיב מדי. המחשבון מודד מנה
            יומית בגרמים לפי משקל הכלב, הגיל ורמת הפעילות, על בסיס הנוסחה
            שווטרינרים עובדים איתה. כי כלב רעב וכלב שמן זה לא אותו סיפור.
          </p>
        </div>
      </div>

      <FoodCalculator />
    </main>
  )
}
