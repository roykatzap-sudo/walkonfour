import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { VetDisclaimer } from '@/components/health/VetDisclaimer'
import { TriageGuide } from '@/components/health/TriageGuide'
import { VaccineTimeline } from '@/components/health/VaccineTimeline'
import { SeasonTips } from '@/components/health/SeasonTips'
import { EmergencyKit } from '@/components/health/EmergencyKit'
import './health.css'

export const metadata = {
  title: 'מתי לרוץ לווטרינר · קהילה על ארבע',
  description:
    'מדריך כללי לרגעים שמפחידים: סימני אזהרה לפי דחיפות, ציר חיסונים לגור, וטיפים לקיץ הישראלי. מידע כללי בלבד - לא תחליף לווטרינר שמכיר את הכלב שלכם.',
}

export default function HealthPage() {
  return (
    <main className="page">
      {/* ── Hero ── */}
      <section className="health-hero">
        <FloatingShapes />
        <div className="health-hero-inner">
          <span className="section-tag">לדעת מתי לדאוג</span>
          <h1 className="page-title grad-text" style={{ marginTop: 10 }}>
            מתי לרוץ לווטרינר
          </h1>
          <p className="page-sub" style={{ maxWidth: 660, margin: '12px auto 0' }}>
            כל בעל כלב מכיר את הרגע הזה: משהו נראה לא בסדר, ואתם לא בטוחים אם זה
            כלום או שעת חירום. המדריך עוזר לזהות סימנים, להבין את ציר החיסונים של
            הגור, ולהתכונן לחום של אוגוסט. בשפה של בני אדם.
          </p>
        </div>
      </section>

      {/* ── הצהרה ראשית ── */}
      <Reveal3D>
        <VetDisclaimer />
      </Reveal3D>

      {/* ── טריאז': מתי לרוץ לווטרינר ── */}
      <Reveal3D>
        <section className="health-section" aria-labelledby="triage-h">
          <header className="health-head">
            <span className="section-tag">טריאז' אחראי</span>
            <h2 id="triage-h" className="section-title">
              מתי לרוץ לווטרינר
            </h2>
            <p className="health-head-sub">
              סימנים שכדאי להכיר, מסודרים לפי דחיפות. סננו לפי דרגה, ופתחו כל פריט להסבר.
              זו אינה רשימה ממצה - בכל ספק, הקול שאומר לכם להתקשר לווטרינר צודק.
            </p>
          </header>
          <TriageGuide />
        </section>
      </Reveal3D>

      {/* ── חיסונים לגור ── */}
      <Reveal3D>
        <section className="health-section" aria-labelledby="vax-h">
          <header className="health-head">
            <span className="section-tag">גור בבית</span>
            <h2 id="vax-h" className="section-title">
              ציר זמן חיסונים לגור
            </h2>
            <p className="health-head-sub">
              מבט-על על השלבים הנפוצים בשנה הראשונה. הגילאים והרכב החיסונים נקבעים תמיד
              בידי הווטרינר ומשתנים מכלב לכלב.
            </p>
          </header>
          <VaccineTimeline />
        </section>
      </Reveal3D>

      {/* ── טיפים לעונות ── */}
      <Reveal3D>
        <section className="health-section" aria-labelledby="season-h">
          <header className="health-head">
            <span className="section-tag">לאורך השנה</span>
            <h2 id="season-h" className="section-title">
              טיפים לעונות
            </h2>
            <p className="health-head-sub">
              החום הישראלי דורש תשומת לב מיוחדת. עברו בין הכרטיסיות וקבלו את עיקרי
              ההמלצות לקיץ ולחורף.
            </p>
          </header>
          <SeasonTips />
          <VetDisclaimer variant="inline" />
        </section>
      </Reveal3D>

      {/* ── ערכת חירום ── */}
      <Reveal3D>
        <section className="health-section" aria-labelledby="kit-h">
          <header className="health-head">
            <span className="section-tag">להיות מוכנים</span>
            <h2 id="kit-h" className="section-title">
              ערכת חירום ביתית
            </h2>
            <p className="health-head-sub">
              הרגע הלא נכון תמיד מגיע בשבת בלילה. צ'קליסט קצר של מה כדאי שיהיה
              בארון מראש, כדי שלא תחפשו אותו כשהידיים רועדות.
            </p>
          </header>
          <EmergencyKit />
          <VetDisclaimer variant="inline" />
        </section>
      </Reveal3D>

      {/* ── הצהרת סיום ── */}
      <Reveal3D>
        <VetDisclaimer>
          חזרנו על זה לאורך כל העמוד מסיבה אחת: שום מדריך ברשת לא מכיר את הכלב שלכם כמו
          הווטרינר. השתמשו במידע כאן כדי לדעת מתי ואיך לפנות - לא במקום לפנות. אין תחליף
          לבדיקה אצל וטרינר.
        </VetDisclaimer>
      </Reveal3D>
    </main>
  )
}
