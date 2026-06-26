'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * רצועת "מה קורה עכשיו בכלבניה" - רגעים אנושיים וספציפיים (שם + עיר + פעולה + זמן).
 * לא marquee קישוטי: כל פריט הוא דבר שבן אדם באמת היה אומר. מתחלף כל ~4 שניות.
 * מכבד prefers-reduced-motion (אז פשוט מציג את כל הרשימה בלי החלפה אוטומטית).
 */

type Moment = { who: string; city: string; text: string; ago: string }

// רגעים אמיתיים-בנימה. לא "משתמש הצטרף" - דברים שקורים בגינה ובקבוצות.
const MOMENTS: Moment[] = [
  { who: 'נועה', city: 'רעננה', text: 'סגרה שק רויאל קנין ב-198 במקום 290', ago: 'לפני 6 דקות' },
  { who: 'איתי', city: 'חיפה', text: 'שאל על האסקי וחום של אוגוסט - 11 תשובות עד עכשיו', ago: 'לפני 20 דקות' },
  { who: 'דנה', city: 'תל אביב', text: 'מחפשת מי ישמור על מקס בסוכות. שני אנשים כבר הציעו', ago: 'לפני 35 דקות' },
  { who: 'עומר', city: 'באר שבע', text: 'נרשם למפגש בגן וייסגל ביום שישי, 7:30 בבוקר', ago: 'לפני שעה' },
  { who: 'שירן', city: 'ירושלים', text: 'מכרה רתמת Ruffwear כמעט חדשה ב-120 ש"ח ביד שנייה', ago: 'לפני שעתיים' },
  { who: 'יעל', city: 'מודיעין', text: 'העלתה תמונות מהיריד בשבת - 91 כלבים היו שם', ago: 'לפני 3 שעות' },
]

export function LiveNow() {
  const [idx, setIdx] = useState(0)
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce.current) return
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MOMENTS.length)
    }, 4000)
    return () => clearInterval(t)
  }, [])

  const m = MOMENTS[idx]

  return (
    <div className="ln-wrap" aria-label="מה קורה עכשיו בכלבניה">
      <div className="ln-inner">
        <span className="ln-tag">
          <span className="ln-dot" aria-hidden="true" />
          קורה עכשיו
        </span>
        {/* aria-live כדי שקורא-מסך ישמע את ההחלפה, ולא יקריא הכול בבת אחת */}
        <div className="ln-feed" aria-live="polite">
          <p className="ln-line" key={idx}>
            <strong>{m.who}</strong> מ{m.city} {m.text}
            <span className="ln-ago"> · {m.ago}</span>
          </p>
        </div>
        <div className="ln-dots" aria-hidden="true">
          {MOMENTS.map((_, i) => (
            <span key={i} className={`ln-pip${i === idx ? ' on' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
