import { DogAgeCalculator } from '@/components/tools/DogAgeCalculator'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata = {
  title: 'בן כמה הכלב באמת · כלבניה',
  description:
    '"להכפיל בשבע" זו אגדה. כלב גדול מזדקן אחרת מכלב קטן, והמחשבון יודע את ההבדל - מהיר, ומותאם לגודל הגזע.',
}

export default function DogAgePage() {
  return (
    <main className="page page-narrow">
      <JsonLd
        data={softwareAppSchema({
          name: 'מחשבון גיל הכלב בשנות אדם',
          description: 'ממיר את גיל הכלב לשנות אדם לפי גודל הגזע - מהיר וחינמי.',
          path: '/dog-age',
        })}
      />
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 20px', marginBottom: 10 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">לא מה שחשבתם</span>
          <h1 className="page-title">
            בן כמה הכלב שלכם <span className="grad-text">בשנות אדם?</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 520 }}>
            "להכפיל בשבע" זו אגדה שכולנו גדלנו עליה. האמת: כלב גדול מזדקן הרבה יותר
            מהר מכלב קטן. המחשבון מתאים את החישוב לגודל הגזע, ואומר לכם באיזה שלב
            חיים אתם באמת נמצאים.
          </p>
        </div>
      </div>

      <DogAgeCalculator />
    </main>
  )
}
