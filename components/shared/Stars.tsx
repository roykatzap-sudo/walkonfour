/**
 * רכיב דירוג כוכבים משותף - מוצג ב-BizCard וב-SitterCard.
 *
 * נגישות: ה-<span> העוטף נושא aria-label עם הדירוג המספרי, וכל
 * כוכב בודד הוא aria-hidden (קישוט בלבד). הצבעים מתוך פלטת
 * קרם-לברדור: כוכב מלא = var(--brand-light) (#e8c887), כוכב ריק
 * = #e2ddd2 (אפור-ניטרלי לסטטוס מושבת).
 */
export function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating)
  return (
    <span aria-label={`דירוג ${rating} מתוך 5`} style={{ letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          aria-hidden
          style={{ color: i <= full ? 'var(--brand-light)' : '#e2ddd2' }}
        >
          ★
        </span>
      ))}
    </span>
  )
}
