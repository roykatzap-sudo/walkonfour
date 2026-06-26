'use client'

import { useMemo, useState } from 'react'
import { warningSigns, urgencyLevels, type Urgency } from '@/lib/health'
import { VetDisclaimer } from './VetDisclaimer'

type FilterId = Urgency | 'all'

const filterLabels: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'כל הסימנים' },
  ...urgencyLevels.map((u) => ({ id: u.id as FilterId, label: u.label })),
]

/**
 * מדריך טריאז' אחראי - "מתי לרוץ לווטרינר".
 * סינון לפי דרגת דחיפות + אקורדיונים נגישים (<details>/<summary>).
 * מידע כללי בלבד; כל פריט מסתיים בתזכורת לפנות לווטרינר.
 */
export function TriageGuide() {
  const [filter, setFilter] = useState<FilterId>('all')

  const visible = useMemo(
    () => (filter === 'all' ? warningSigns : warningSigns.filter((s) => s.urgency === filter)),
    [filter]
  )

  const meta = (u: Urgency) => urgencyLevels.find((l) => l.id === u)!

  return (
    <div className="triage">
      <div
        className="triage-filters"
        role="group"
        aria-label="סינון סימנים לפי דרגת דחיפות"
      >
        {filterLabels.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`triage-filter${filter === f.id ? ' on' : ''}`}
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* מקרא דרגות הדחיפות */}
      <ul className="triage-legend" aria-label="מקרא דרגות דחיפות">
        {urgencyLevels.map((u) => (
          <li key={u.id} className="triage-legend-item">
            <span className={`u-dot u-${u.id}`} aria-hidden="true" />
            <span className="triage-legend-label">{u.label}</span>
            <span className="triage-legend-timing">{u.timing}</span>
          </li>
        ))}
      </ul>

      <div className="triage-list">
        {visible.map((s) => {
          const m = meta(s.urgency)
          return (
            <details key={s.id} className={`triage-item u-border-${s.urgency}`}>
              <summary className="triage-summary">
                <span className={`u-pill u-${s.urgency}`}>{m.label}</span>
                <span className="triage-sign">{s.sign}</span>
                <span className="triage-chevron" aria-hidden="true">
                  ▾
                </span>
              </summary>
              <div className="triage-body">
                <p className="triage-detail">{s.detail}</p>
                <p className="triage-action">
                  <span className="u-dot-sm" aria-hidden="true" />
                  {m.hint}
                </p>
              </div>
            </details>
          )
        })}
      </div>

      <VetDisclaimer variant="inline" />
    </div>
  )
}
