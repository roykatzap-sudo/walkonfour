import { CostCalculator } from '@/components/tools/CostCalculator'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata = {
  alternates: { canonical: '/calculator' },
  title: 'כמה עולה כלב בחודש · קהילה על ארבע',
  description:
    'מזון, וטרינר, ביטוח, טיפוח ואבזור - המספר האמיתי שאף אחד לא אומר לכם לפני שהגור בבית. בוחרים גודל וסגנון, ומקבלים עלות חודשית ושנתית עם פירוק מלא.',
}

export default function CalculatorPage() {
  return (
    <main className="page">
      <JsonLd
        data={softwareAppSchema({
          name: 'מחשבון עלות גידול כלב',
          description: 'מחשב עלות חודשית ושנתית של גידול כלב בישראל - מזון, וטרינר, ביטוח, טיפוח ואבזור.',
          path: '/calculator',
          category: 'FinanceApplication',
        })}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 20px', marginBottom: 10 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">המספר שלפני ההחלטה</span>
          <h1 className="page-title">כמה כלב עולה בחודש</h1>
          <p className="page-sub" style={{ maxWidth: 560 }}>
            מזון, וטרינר, ביטוח, טיפוח, אבזור - כל מה שאף אחד לא מסכם לכם לפני שהגור
            כבר בבית. בחרו גודל וסגנון, ותראו מספר חודשי ושנתי עם פירוק מלא. הערכה, לא
            חשבונית, אבל מספיק קרובה כדי לתכנן.
          </p>
        </div>
      </div>

      <CostCalculator />
    </main>
  )
}
