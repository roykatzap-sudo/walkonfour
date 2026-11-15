/* ════════════════════════════════════════════════════════════
   "שאלה מהקבוצה" - שאלות אמיתיות שעלו בקבוצת הפייסבוק והפכו לעמוד קצר.
   הרשימה ריקה עד שמגיעה שאלה אמיתית. כללים:
   - רק שאלה שבאמת נשאלה בקבוצה. לא ממציאים שאלות ולא ממציאים תשובות של חברים.
   - ציטוט של חבר קבוצה נכנס רק אחרי שהוא נתן רשות, ובשם שהוא בחר (או בלי שם).
   - כל עובדה בתשובה צריכה מקור, כמו במדריכים.
   כל עוד הרשימה ריקה, העמוד /questions לא מקושר, לא במפת האתר, ומסומן noindex.
   ════════════════════════════════════════════════════════════ */

export type GroupQuestion = {
  slug: string
  /** השאלה כפי שנשאלה, בניסוח נקי */
  question: string
  /** תשובה קצרה, 2-3 משפטים */
  answer: string
  /** פירוט, פסקה או שתיים */
  body: string[]
  /** ציטוטים של חברי קבוצה - רק ברשות */
  voices?: { text: string; name?: string }[]
  sources?: { label: string; url: string }[]
  /** תאריך ISO שבו השאלה עלתה לאתר */
  date: string
  /** מדריך להרחבה */
  more?: { href: string; label: string }
}

export const groupQuestions: GroupQuestion[] = []

export const getGroupQuestion = (slug: string): GroupQuestion | null => groupQuestions.find((q) => q.slug === slug) ?? null
