'use client'

import { useToast } from '@/components/shared/Toast'
import { emergencyKit } from '@/lib/health'

/**
 * ערכת חירום ביתית - צ'קליסט של מה כדאי שיהיה בבית.
 * כולל פעולת דמו "שמירת מספר חירום" שמפעילה toast. מידע כללי בלבד.
 */
export function EmergencyKit() {
  const toast = useToast()

  return (
    <div className="kit">
      <ul className="kit-list">
        {emergencyKit.map((item, i) => (
          <li key={i} className="kit-item">
            <span className="kit-mark" aria-hidden="true">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="btn btn-dark kit-cta"
        onClick={() => toast('הוספנו לכם תזכורת לשמור את מספר הווטרינר בטלפון')}
      >
        תזכורת - לשמור את מספר הווטרינר
      </button>
    </div>
  )
}
