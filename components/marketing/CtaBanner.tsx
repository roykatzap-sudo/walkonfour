import Link from 'next/link'

export type CtaBannerProps = {
  title: string
  text: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

/**
 * באנר קריאה לפעולה לסיום עמוד - רקע כהה בגוון לברדור, טקסט קריא,
 * שני כפתורים בקונטרסט גבוה. נגיש: כותרת h2, יעדי מגע גדולים, focus-visible גלובלי.
 */
export function CtaBanner({ title, text, primary, secondary }: CtaBannerProps) {
  return (
    <section className="mkt-cta" aria-labelledby="mkt-cta-title">
      <div className="mkt-cta-inner">
        <h2 className="mkt-cta-title" id="mkt-cta-title">
          {title}
        </h2>
        <p className="mkt-cta-text">{text}</p>
        <div className="mkt-cta-actions">
          <Link className="btn btn-primary mkt-cta-btn" href={primary.href}>
            {primary.label}
          </Link>
          {secondary && (
            <Link className="btn mkt-cta-ghost" href={secondary.href}>
              {secondary.label}
            </Link>
          )}
        </div>
      </div>

      <style>{`
        .mkt-cta {
          margin-top: 56px;
          border-radius: 28px;
          background:
            radial-gradient(120% 140% at 100% 0%, rgba(232,200,135,.18) 0%, transparent 55%),
            var(--ink);
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 18px 44px rgba(42,32,24,.22);
        }
        .mkt-cta-inner { max-width: 620px; margin: 0 auto; }
        .mkt-cta-title {
          font-size: clamp(26px, 4vw, 36px);
          font-weight: 900;
          letter-spacing: -1px;
          color: #fff;
          margin: 0 0 12px;
          line-height: 1.25;
        }
        .mkt-cta-text {
          font-size: 17px;
          line-height: 1.7;
          color: #efe6d6;
          margin: 0 0 28px;
        }
        .mkt-cta-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          justify-content: center;
        }
        .mkt-cta-ghost {
          background: transparent;
          color: #fff;
          border: 1.5px solid rgba(255,255,255,.45);
        }
        .mkt-cta-ghost:hover {
          border-color: var(--brand-light);
          color: var(--brand-light);
        }
        .mkt-cta-btn:focus-visible,
        .mkt-cta-ghost:focus-visible {
          outline: 3px solid var(--brand-light);
          outline-offset: 3px;
        }
        @media (max-width: 560px) {
          .mkt-cta { padding: 38px 22px; border-radius: 22px; }
          .mkt-cta-actions { flex-direction: column; }
          .mkt-cta-btn, .mkt-cta-ghost { width: 100%; }
        }
      `}</style>
    </section>
  )
}
