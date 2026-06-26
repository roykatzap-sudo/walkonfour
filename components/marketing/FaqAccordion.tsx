import type { ReactNode } from 'react'

export type FaqItem = {
  q: string
  a: ReactNode
}

export type FaqGroup = {
  title: string
  items: FaqItem[]
}

/**
 * אקורדיון שאלות נפוצות - נגיש לחלוטין.
 * מבוסס על <details>/<summary> מקומיים (פתיחה/סגירה ללא JavaScript,
 * עובד עם מקלדת וקורא מסך כברירת מחדל). הקבוצות מסומנות עם כותרת h2,
 * וכל שאלה היא summary בתוך details. ניתן לפתוח כמה שאלות במקביל.
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="mkt-faq">
      {groups.map((group, gi) => (
        <section className="mkt-faq-group" key={gi} aria-labelledby={`faq-grp-${gi}`}>
          <h2 className="mkt-faq-grp-title" id={`faq-grp-${gi}`}>
            {group.title}
          </h2>
          <div className="mkt-faq-list">
            {group.items.map((item, ii) => (
              <details className="mkt-faq-item" key={ii}>
                <summary className="mkt-faq-q">
                  <span className="mkt-faq-q-text">{item.q}</span>
                  <span className="mkt-faq-chevron" aria-hidden="true" />
                </summary>
                <div className="mkt-faq-a">{item.a}</div>
              </details>
            ))}
          </div>
        </section>
      ))}

      <style>{`
        .mkt-faq { display: flex; flex-direction: column; gap: 40px; }
        .mkt-faq-grp-title {
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -.5px;
          color: var(--ink);
          margin: 0 0 16px;
          padding-inline-start: 14px;
          border-inline-start: 4px solid var(--brand);
          line-height: 1.3;
        }
        .mkt-faq-list { display: flex; flex-direction: column; gap: 12px; }
        .mkt-faq-item {
          background: #fff;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,.04);
          overflow: hidden;
          transition: border-color .2s, box-shadow .2s;
        }
        .mkt-faq-item[open] {
          border-color: var(--brand-light);
          box-shadow: 0 6px 22px rgba(201,154,91,.14);
        }
        .mkt-faq-q {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 22px;
          min-height: var(--tap);
          font-size: 17px;
          font-weight: 700;
          color: var(--ink);
          cursor: pointer;
          list-style: none;
          line-height: 1.45;
        }
        .mkt-faq-q::-webkit-details-marker { display: none; }
        .mkt-faq-q:hover { color: var(--brand-dark); }
        .mkt-faq-q-text { flex: 1; }
        .mkt-faq-chevron {
          flex: 0 0 auto;
          width: 14px;
          height: 14px;
          border-inline-end: 2.5px solid var(--brand-dark);
          border-bottom: 2.5px solid var(--brand-dark);
          transform: rotate(45deg);
          transition: transform .25s ease;
          margin-top: -4px;
        }
        .mkt-faq-item[open] .mkt-faq-chevron { transform: rotate(-135deg); margin-top: 4px; }
        .mkt-faq-a {
          padding: 0 22px 20px;
          font-size: 16px;
          line-height: 1.85;
          color: var(--text);
        }
        .mkt-faq-a a { color: var(--brand-dark); font-weight: 700; text-underline-offset: 2px; }
        .mkt-faq-a a:hover { color: var(--ink); }
        .mkt-faq-a p { margin: 0 0 10px; }
        .mkt-faq-a p:last-child { margin-bottom: 0; }
        @media (max-width: 560px) {
          .mkt-faq-q { padding: 16px 18px; font-size: 16px; }
          .mkt-faq-a { padding: 0 18px 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mkt-faq-chevron { transition: none; }
        }
      `}</style>
    </div>
  )
}
