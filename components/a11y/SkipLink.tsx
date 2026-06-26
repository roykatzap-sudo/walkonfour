/**
 * SkipLink - קישור "דלג לתוכן ראשי" לניווט מקלדת/קוראי מסך.
 * מוסתר ויזואלית עד שמקבל פוקוס במקלדת, אז קופץ לפינה העליונה.
 * הסגנון עצמאי (scoped) כדי לא לגעת ב-globals.css.
 */
export function SkipLink() {
  return (
    <>
      <a href="#main" className="kv-skip-link">
        דלג לתוכן ראשי
      </a>
      <style>{`
        .kv-skip-link {
          position: fixed;
          top: 0;
          right: 0;
          transform: translateY(-120%);
          z-index: 9999;
          margin: 12px;
          padding: 12px 22px;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          background: #241a12;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          border-radius: 12px;
          border: 2px solid #e8c887;
          box-shadow: 0 8px 24px rgba(40, 28, 12, .35);
          transition: transform .18s ease;
        }
        .kv-skip-link:focus,
        .kv-skip-link:focus-visible {
          transform: translateY(0);
          outline: 3px solid #c99a5b;
          outline-offset: 2px;
        }
      `}</style>
    </>
  )
}
