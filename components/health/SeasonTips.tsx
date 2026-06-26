'use client'

import { useState } from 'react'
import { seasonGuides, type SeasonId } from '@/lib/health'

/**
 * טיפים לפי עונה - דגש על חום הקיץ הישראלי.
 * מתג בין קיץ לחורף, עם אזהרת חום/קור מודגשת. מידע כללי בלבד.
 */
export function SeasonTips() {
  const [season, setSeason] = useState<SeasonId>('summer')
  const active = seasonGuides.find((g) => g.id === season)!

  return (
    <div className="season">
      <div className="season-switch" role="tablist" aria-label="בחירת עונה">
        {seasonGuides.map((g) => (
          <button
            key={g.id}
            type="button"
            role="tab"
            id={`season-tab-${g.id}`}
            aria-selected={season === g.id}
            aria-controls={`season-panel-${g.id}`}
            className={`season-tab${season === g.id ? ' on' : ''}`}
            onClick={() => setSeason(g.id)}
          >
            {g.title}
          </button>
        ))}
      </div>

      <div
        id={`season-panel-${active.id}`}
        role="tabpanel"
        aria-labelledby={`season-tab-${active.id}`}
        className="season-panel"
      >
        <p className="season-intro">{active.intro}</p>

        <ul className="season-tips">
          {active.tips.map((tip, i) => (
            <li key={i} className="season-tip">
              <span className="season-check" aria-hidden="true">
                ✓
              </span>
              <span>{tip.text}</span>
            </li>
          ))}
        </ul>

        <p className="season-flag" role="note" aria-live="polite">
          <span className="season-flag-label" aria-hidden="true">
            שימו לב
          </span>
          {active.redFlag}
        </p>
      </div>
    </div>
  )
}
