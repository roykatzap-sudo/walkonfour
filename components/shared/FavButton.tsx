'use client'

/* ════════════════════════════════════════════════════════════
   FavButton - כפתור לב לשמירה למועדפים
   ────────────────────────────────────────────────────────────
   קטן, עדין ועצמאי: לא תלוי בעיצוב הכרטיס שמסביבו. מיועד לשבת
   בפינת כרטיס (position:absolute אצל הקורא). נגיש לחלוטין -
   <button> אמיתי עם aria-pressed + aria-label דינמי, ועוצר
   הסחת קליקים/מקלדת מהכרטיס (כדי לא לפתוח flip / לינק).
   צבעים מתוך פלטת הקרם-לברדור בלבד.
   ════════════════════════════════════════════════════════════ */

import { useFavorites, type FavType } from '@/lib/useFavorites'

export function FavButton({
  type,
  id,
  label,
  className,
  style,
}: {
  type: FavType
  /** מזהה הפריט - slug לגזע, id למודעה/אימוץ. */
  id: string
  /** שם הפריט לתווית הנגישות ("שמירת לונה למועדפים"). */
  label?: string
  className?: string
  style?: React.CSSProperties
}) {
  const { isFav, toggle, ready } = useFavorites()
  const saved = isFav(type, id)

  // עד שה-localStorage נטען, מתייחסים כ"לא שמור" (מצב ניטרלי) -
  // כך אין הבדל בין השרת ללקוח ברינדור הראשון, וההבהוב נמנע.
  const active = ready && saved

  const what = label ? ` ${label}` : ''
  const aria = active ? `הסרת${what} מהמועדפים` : `שמירת${what} למועדפים`

  return (
    <button
      type="button"
      className={`kv-fav${active ? ' is-fav' : ''}${className ? ` ${className}` : ''}`}
      aria-pressed={active}
      aria-label={aria}
      title={aria}
      onClick={(e) => {
        // הכרטיס לרוב לחיץ (flip / לינק) - עוצרים את ההתפשטות
        // כדי שהשמירה לא תפתח אותו בטעות.
        e.preventDefault()
        e.stopPropagation()
        toggle(type, id)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') e.stopPropagation()
      }}
      style={style}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 21s-6.7-4.35-9.3-8.05C.9 10.2 1.4 6.9 4 5.4c2.05-1.18 4.5-.5 5.7 1.2L12 9l2.3-2.4c1.2-1.7 3.65-2.38 5.7-1.2 2.6 1.5 3.1 4.8 1.3 7.55C18.7 16.65 12 21 12 21z" />
      </svg>
    </button>
  )
}
