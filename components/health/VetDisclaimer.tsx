/**
 * הדגשה חוזרת - "אין תחליף לייעוץ וטרינר".
 * רכיב הצהרה שמופיע שוב ושוב לאורך מרכז הבריאות. שרת בלבד (אין אינטראקציה).
 *
 * variant:
 *  - 'banner' - באנר בולט (ברירת מחדל), מתאים לראש סקשן.
 *  - 'inline' - שורה דקה וענווה, מתאימה לסוף כרטיס/אקורדיון.
 */
export function VetDisclaimer({
  variant = 'banner',
  children,
}: {
  variant?: 'banner' | 'inline'
  children?: React.ReactNode
}) {
  const text =
    children ??
    'המידע במרכז הבריאות הוא כללי ונועד להעלאת מודעות בלבד. אין בו אבחנה, מינון או טיפול, ואין הוא תחליף לייעוץ וטרינר. בכל ספק או מצב מדאיג - פנו לווטרינר.'

  if (variant === 'inline') {
    return (
      <p className="vet-disc-inline" role="note">
        <span aria-hidden="true" className="vet-disc-dot" />
        אין תחליף לבדיקה אצל וטרינר.
      </p>
    )
  }

  return (
    <aside className="vet-disc" role="note" aria-label="הבהרה רפואית">
      <span className="vet-disc-badge" aria-hidden="true">
        חשוב לדעת
      </span>
      <p className="vet-disc-text">{text}</p>
    </aside>
  )
}
