import { vaccineTimeline } from '@/lib/health'
import { VetDisclaimer } from './VetDisclaimer'

/**
 * ציר זמן חיסונים לגור - מידע כללי בלבד.
 * רכיב שרת (אין אינטראקציה). הגילאים והרכב החיסונים נקבעים תמיד בידי הווטרינר.
 */
export function VaccineTimeline() {
  return (
    <div className="vax">
      <ol className="vax-track" aria-label="ציר זמן חיסונים לגור">
        {vaccineTimeline.map((stage, i) => (
          <li key={stage.id} className="vax-step">
            <span className="vax-node" aria-hidden="true">
              {stage.recurring ? '∞' : i + 1}
            </span>
            <div className="vax-card">
              <span className="vax-age">{stage.age}</span>
              <h3 className="vax-title">{stage.title}</h3>
              <p className="vax-detail">{stage.detail}</p>
              {stage.recurring && (
                <span className="vax-tag">חוזר לאורך כל החיים</span>
              )}
            </div>
          </li>
        ))}
      </ol>

      <VetDisclaimer variant="inline" />
    </div>
  )
}
