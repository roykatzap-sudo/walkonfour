import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { VetDisclaimer } from '@/components/health/VetDisclaimer'
import { HealthTracker } from '@/components/healthtracker/HealthTracker'
import '../health/health.css'

export const metadata = {
  title: 'מעקב בריאות אישי לכלב · קהילה על ארבע',
  description:
    'נהלו את תיק הבריאות של הכלב במקום אחד: חיסונים, ביקורי וטרינר, תילוע וטיפולים, עם ציר זמן ותזכורות קרובות מחושבות. הכול נשמר בדפדפן בלבד. מידע כללי - אין תחליף לייעוץ וטרינר.',
}

export default function HealthTrackerPage() {
  return (
    <main className="page">
      {/* ── Hero ── */}
      <section className="health-hero">
        <FloatingShapes />
        <div className="health-hero-inner">
          <span className="section-tag">המעקב שלי</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            מעקב בריאות אישי לכלב
          </h1>
          <p className="page-sub" style={{ maxWidth: 680, margin: '12px auto 0' }}>
            מקום אחד מסודר לחיסונים, לביקורי הווטרינר, לתילוע ולטיפולים. רשמו כל
            אירוע עם תאריך, ראו ציר זמן ברור, וקבלו תזכורות קרובות מחושבות - למשל
            חיסון שנה אחרי האחרון. הכול נשמר בדפדפן שלכם בלבד, בלי חשבון ובלי שרת.
          </p>
        </div>
      </section>

      {/* ── הצהרה ראשית ── */}
      <Reveal3D>
        <VetDisclaimer>
          המעקב הזה הוא כלי ארגון אישי בלבד. התזכורות מבוססות על תדירויות נפוצות
          וכלליות, ואינן אבחנה, מינון או הנחיה רפואית. הווטרינר קובע לכל כלב את
          לוח החיסונים והטיפולים האישי שלו. אין תחליף לייעוץ וטרינר.
        </VetDisclaimer>
      </Reveal3D>

      {/* ── הכלי ── */}
      <div style={{ marginTop: 36 }}>
        <HealthTracker />
      </div>

      {/* ── הצהרת סיום ── */}
      <div style={{ marginTop: 44 }}>
        <Reveal3D>
          <VetDisclaimer variant="inline" />
        </Reveal3D>
      </div>
    </main>
  )
}
