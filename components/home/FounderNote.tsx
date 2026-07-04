/**
 * פתק מייסד קצר - שובר את הסימטריה הנקייה של עמודת ה-hero ומוסיף קול אנושי אחד אמיתי.
 * בלי גרדיאנט, בלי אמוג'י. כרטיס סנד רך עם רוטציה קלה, כמו פתק שמישהו השאיר.
 */
export function FounderNote() {
  return (
    <aside className="fn-card" aria-label="מילה מהמייסד">
      <p className="fn-text">
        התחלתי את זה כי נמאס לי לקנות שק מזון לבד, כשעוד מאה אנשים בשכונה
        קונים בדיוק אותו דבר. אז בניתי את המקום שהייתי רוצה שיהיה לי. זו ההתחלה.
      </p>
      <p className="fn-sign">חגי, ולונה (לברדור)</p>
      <p className="fn-fb">
        בינתיים אנחנו כבר מדברים ב
        <a href="https://www.facebook.com/share/g/18wnLhr9tn/" target="_blank" rel="noopener noreferrer">קבוצת הפייסבוק</a>.
      </p>
    </aside>
  )
}
