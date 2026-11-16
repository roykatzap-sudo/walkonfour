/* ════════════════════════════════════════════════════════════
   מאיפה המבקר הגיע בביקור הזה (למשל "fb_post:city-ashdod").
   משמש לשני דברים:
   1. מי שהגיע מפייסבוק רואה את ההזמנה לקבוצה מוקדם יותר, כי הוא כבר שם.
   2. כשמישהו לוחץ על הקישור לקבוצה, נרשם מאיזה פוסט הוא הגיע, כדי לדעת
      אילו פוסטים באמת מביאים אנשים לקבוצה ולא רק לאתר.
   נשמר רק בזיכרון של הלשונית (sessionStorage) ונמחק כשסוגרים אותה.
   זה תיוג של הפוסט, לא של האדם: אין כאן שום מזהה של המבקר.
   ════════════════════════════════════════════════════════════ */

const KEY = 'kv-arrival'

function clean(v: string | null): string {
  return (v || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40)
}

/** מחזיר "מקור:קמפיין", או null אם אין מידע. בטוח לקריאה רק בדפדפן. */
export function getArrival(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const sp = new URLSearchParams(window.location.search)
    const src = clean(sp.get('utm_source'))
    if (src) {
      const v = `${src}:${clean(sp.get('utm_campaign'))}`
      try { window.sessionStorage.setItem(KEY, v) } catch { /* גלישה פרטית */ }
      return v
    }
    try {
      const saved = window.sessionStorage.getItem(KEY)
      if (saved) return saved
    } catch { /* גלישה פרטית */ }
    if (/(^|\.)facebook\.com$/i.test(new URL(document.referrer || 'https://x.invalid').hostname)) {
      const v = 'fb_ref:'
      try { window.sessionStorage.setItem(KEY, v) } catch { /* גלישה פרטית */ }
      return v
    }
  } catch {
    /* כתובת לא תקינה - מתעלמים */
  }
  return null
}

export function cameFromFacebook(): boolean {
  return (getArrival() || '').startsWith('fb')
}
