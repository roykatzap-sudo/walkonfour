import { LostFoundBoard } from '@/components/lostfound/LostFoundBoard'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { lostCount, foundCount } from '@/lib/lostfound'

export const metadata = {
  title: 'כלב אבד או נמצא · כלבניה',
  description:
    'לוח קהילתי לכלבים שאבדו ונמצאו בישראל. פרסמו דיווח וקבלו עזרה מהקהילה כדי להחזיר כלבים הביתה.',
}

export default function LostFoundPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 24px', marginBottom: 10 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">קהילה שעוזרת</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            כלב <span className="grad-text">אבד או נמצא</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 580 }}>
            כשכלב אובד, מהירות וכמות עיניים זה הכול. כאן מפרסמים, מחפשים ומשיבים הביתה -
            כרגע {lostCount} מחפשים את דרכם ו-{foundCount} ממתינים לבעליהם.
          </p>
        </div>
      </div>

      <LostFoundBoard />
    </main>
  )
}
