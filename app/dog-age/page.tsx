import { DogAgeCalculator } from '@/components/tools/DogAgeCalculator'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { JsonLd, softwareAppSchema } from '@/components/seo/JsonLd'

export const metadata = {
  alternates: { canonical: '/dog-age' },
  title: 'בן כמה הכלב באמת · קהילה על ארבע',
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
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '34px 28px',
          marginBottom: 22,
          background:
            'radial-gradient(560px 280px at 50% 0%, rgba(232,200,135,.22), transparent 70%), linear-gradient(160deg, #fdf6e9, #fbf7ef)',
          border: '1px solid rgba(201,154,91,.14)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
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
