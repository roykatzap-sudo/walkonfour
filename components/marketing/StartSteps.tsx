import Link from 'next/link'

export type StartStep = {
  /** מספר הצעד (1, 2, 3 …) - מוצג בעיגול הממוספר */
  n: number
  title: string
  body: string
  /** קישור פעולה אופציונלי לצעד */
  cta?: { label: string; href: string }
}

/**
 * רשימת צעדים ממוספרת לחבר חדש - "איך מתחילים".
 * מבנה סמנטי: רשימה מסודרת <ol> כך שקורא מסך מכריז על מספר הצעד
 * ועל סך הצעדים. כל צעד הוא כרטיס עם עיגול מספור, כותרת h3, טקסט וקריאה לפעולה.
 */
export function StartSteps({ steps }: { steps: StartStep[] }) {
  return (
    <ol className="mkt-steps" aria-label="צעדים להצטרפות לקהילה">
      {steps.map((step) => (
        <li className="mkt-step" key={step.n}>
          <div className="mkt-step-num" aria-hidden="true">
            {step.n}
          </div>
          <div className="mkt-step-body">
            <h3 className="mkt-step-title">
              <span className="mkt-step-label">צעד {step.n}</span>
              {step.title}
            </h3>
            <p className="mkt-step-text">{step.body}</p>
            {step.cta && (
              <Link className="btn btn-primary mkt-step-cta" href={step.cta.href}>
                {step.cta.label}
              </Link>
            )}
          </div>
        </li>
      ))}

      <style>{`
        .mkt-steps {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 18px;
          counter-reset: none;
        }
        .mkt-step {
          display: flex;
          align-items: flex-start;
          gap: 20px;
          background: #fff;
          border: 1px solid rgba(0,0,0,.08);
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 2px 12px rgba(0,0,0,.04);
          position: relative;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
        }
        .mkt-step:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(201,154,91,.16);
          border-color: var(--brand-light);
        }
        .mkt-step-num {
          flex: 0 0 auto;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--brand) 0%, var(--brand-dark) 100%);
          color: #fff;
          font-size: 26px;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(201,154,91,.35);
        }
        .mkt-step-body { flex: 1; min-width: 0; }
        .mkt-step-title {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.4px;
          color: var(--ink);
          margin: 4px 0 8px;
          line-height: 1.35;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .mkt-step-label {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--brand-dark);
          font-weight: 700;
        }
        .mkt-step-text {
          font-size: 16px;
          line-height: 1.8;
          color: var(--text);
          margin: 0;
        }
        .mkt-step-cta { margin-top: 16px; }
        @media (max-width: 560px) {
          .mkt-step { gap: 16px; padding: 22px 18px; }
          .mkt-step-num { width: 48px; height: 48px; font-size: 22px; }
          .mkt-step-title { font-size: 19px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mkt-step { transition: none; }
          .mkt-step:hover { transform: none; }
        }
      `}</style>
    </ol>
  )
}
