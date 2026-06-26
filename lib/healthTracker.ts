/**
 * מעקב בריאות אישי לכלב - לוגיקה, טיפוסים ושמירה מקומית.
 *
 * חשוב: כל המידע כאן הוא כללי ולמטרת ארגון ותזכורת בלבד. אין כאן אבחנה,
 * מינון, מרשם או הנחיה רפואית. תדירויות התזכורת הן ברירת מחדל נפוצה בלבד
 * ואינן פרוטוקול מחייב - הווטרינר קובע לכל כלב את לוח הזמנים האישי.
 * אין תחליף לייעוץ וטרינר.
 *
 * אין backend: הכול נשמר ב-localStorage תחת המפתח 'kalbaniya:health'.
 */

/** מפתח האחסון המקומי. כל הנתונים של המעקב נשמרים תחתיו כ-JSON אחד. */
export const HEALTH_STORAGE_KEY = 'kalbaniya:health'

/** גרסת סכמה לנתונים השמורים - מאפשרת זיהוי וניקוי בטוח של מבנה ישן. */
export const HEALTH_SCHEMA_VERSION = 1

/** סוגי אירוע הבריאות הנתמכים במעקב. */
export type HealthEventType =
  | 'vaccine'
  | 'vet'
  | 'deworm'
  | 'flea_tick'
  | 'treatment'

/** מטא-נתונים לכל סוג אירוע: תווית, צבע תג, ותדירות תזכורת ברירת מחדל. */
export type HealthEventMeta = {
  id: HealthEventType
  label: string
  /** תיאור קצר לבחירה בטופס. */
  hint: string
  /**
   * מספר חודשים עד התזכורת הבאה כברירת מחדל, או null אם לא מחושבת תזכורת
   * (למשל ביקור וטרינר חד-פעמי שאינו מחזורי מטבעו).
   */
  defaultReminderMonths: number | null
  /** תווית קצרה לתיאור התדירות, לתצוגה בלבד. */
  cadenceLabel: string
}

/**
 * מטא-נתונים לכל סוג אירוע.
 *
 * תדירויות ברירת המחדל הן הערכה נפוצה בלבד (למשל חיסון דחף שנתי, תילוע
 * רבעוני). הן ניתנות לעריכה בכל רישום, והווטרינר תמיד גובר. אין כאן מינון.
 */
export const EVENT_META: Record<HealthEventType, HealthEventMeta> = {
  vaccine: {
    id: 'vaccine',
    label: 'חיסון',
    hint: 'חיסון דחף, כלבת או חיסון אחר',
    defaultReminderMonths: 12,
    cadenceLabel: 'בדרך כלל שנתי',
  },
  vet: {
    id: 'vet',
    label: 'ביקור וטרינר',
    hint: 'בדיקה תקופתית או ביקור יזום',
    defaultReminderMonths: 12,
    cadenceLabel: 'בדיקה שנתית מומלצת',
  },
  deworm: {
    id: 'deworm',
    label: 'תילוע',
    hint: 'טיפול נגד תולעים',
    defaultReminderMonths: 3,
    cadenceLabel: 'לרוב כל שלושה חודשים',
  },
  flea_tick: {
    id: 'flea_tick',
    label: 'הדברת פרעושים וקרציות',
    hint: 'טיפול חיצוני נגד טפילים',
    defaultReminderMonths: 1,
    cadenceLabel: 'לרוב חודשי',
  },
  treatment: {
    id: 'treatment',
    label: 'טיפול',
    hint: 'טיפול אחר, מעקב או נטילת תרופה',
    defaultReminderMonths: null,
    cadenceLabel: 'ללא תזכורת אוטומטית',
  },
}

/** רשימת סוגי האירועים לפי סדר תצוגה בטופס. */
export const EVENT_TYPES: HealthEventType[] = [
  'vaccine',
  'vet',
  'deworm',
  'flea_tick',
  'treatment',
]

/** כלב יחיד במעקב. */
export type Dog = {
  id: string
  name: string
  /** גזע - חופשי, יכול להיות ריק (לא ידוע / מעורב). */
  breed: string
  /** תאריך לידה בפורמט ISO 'YYYY-MM-DD', יכול להיות ריק אם לא ידוע. */
  birthDate: string
  createdAt: string
}

/** אירוע בריאות יחיד שמשויך לכלב. */
export type HealthEvent = {
  id: string
  dogId: string
  type: HealthEventType
  /** תאריך האירוע בפורמט ISO 'YYYY-MM-DD'. */
  date: string
  /** הערה חופשית - שם החיסון, שם הווטרינר וכו'. רשות. */
  note: string
  /**
   * מספר חודשים לתזכורת הבאה, או null אם אין תזכורת.
   * נקבע מברירת המחדל של הסוג, וניתן לשינוי בכל רישום.
   */
  reminderMonths: number | null
  createdAt: string
}

/** מצב מלא שנשמר ב-localStorage. */
export type HealthState = {
  version: number
  dogs: Dog[]
  events: HealthEvent[]
}

/** מצב התחלתי ריק. */
export function emptyState(): HealthState {
  return { version: HEALTH_SCHEMA_VERSION, dogs: [], events: [] }
}

/** סוג תקלת אחסון: ללא / גישה חסומה (מצב פרטי) / אחסון מלא (מכסה). */
export type StorageError = 'none' | 'access' | 'quota'

/** סיווג חריגת localStorage לסוג תקלה ידידותי למשתמש. */
export function classifyStorageError(err: unknown): StorageError {
  if (err instanceof DOMException) {
    // 22 = QuotaExceededError, 1014 = NS_ERROR_DOM_QUOTA_REACHED (Firefox).
    if (err.code === 22 || err.code === 1014 || err.name === 'QuotaExceededError') {
      return 'quota'
    }
    return 'access'
  }
  return 'access'
}

/** מזהה אקראי קצר ויציב - מספיק לשימוש מקומי (אין התנגשות בין מכשירים). */
export function makeId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** האם הערך עונה על מבנה Dog בסיסי (לאחר JSON.parse). */
function isDog(v: unknown): v is Dog {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return typeof o.id === 'string' && typeof o.name === 'string'
}

/** האם הערך עונה על מבנה HealthEvent בסיסי (לאחר JSON.parse). */
function isEvent(v: unknown): v is HealthEvent {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.dogId === 'string' &&
    typeof o.type === 'string' &&
    typeof o.date === 'string'
  )
}

/**
 * נרמול אירוע גולמי למבנה תקין - ממלא ברירות מחדל לשדות חסרים ומסנן
 * סוגים לא מוכרים. מחזיר null אם האירוע פגום מכדי לשחזר.
 */
function normalizeEvent(v: unknown): HealthEvent | null {
  if (!isEvent(v)) return null
  const type = (EVENT_TYPES as string[]).includes(v.type) ? v.type : 'treatment'
  const reminder =
    typeof v.reminderMonths === 'number' && v.reminderMonths > 0
      ? v.reminderMonths
      : v.reminderMonths === null
        ? null
        : EVENT_META[type].defaultReminderMonths
  return {
    id: v.id,
    dogId: v.dogId,
    type,
    date: v.date,
    note: typeof v.note === 'string' ? v.note : '',
    reminderMonths: reminder,
    createdAt: typeof v.createdAt === 'string' ? v.createdAt : new Date().toISOString(),
  }
}

/**
 * קריאה בטוחה של המצב מ-localStorage (גם אם הדפדפן חוסם / JSON שבור /
 * מבנה ישן). מחזיר את המצב ואת סוג התקלה (אם הייתה).
 */
export function readState(): { state: HealthState; error: StorageError } {
  if (typeof window === 'undefined') return { state: emptyState(), error: 'none' }
  try {
    const raw = window.localStorage.getItem(HEALTH_STORAGE_KEY)
    if (!raw) return { state: emptyState(), error: 'none' }
    const parsed = JSON.parse(raw) as Partial<HealthState>
    const dogs = Array.isArray(parsed?.dogs) ? parsed.dogs.filter(isDog) : []
    const events = Array.isArray(parsed?.events)
      ? parsed.events
          .map(normalizeEvent)
          .filter((e): e is HealthEvent => e !== null)
      : []
    return {
      state: { version: HEALTH_SCHEMA_VERSION, dogs, events },
      error: 'none',
    }
  } catch (err) {
    // JSON שבור הוא לא תקלת אחסון - אין צורך להפחיד את המשתמש.
    if (err instanceof SyntaxError) return { state: emptyState(), error: 'none' }
    return { state: emptyState(), error: classifyStorageError(err) }
  }
}

/**
 * כתיבה בטוחה של המצב ל-localStorage.
 * מחזיר את סוג התקלה (אם הייתה) כדי שה-UI יוכל להציג חיווי.
 */
export function writeState(state: HealthState): StorageError {
  if (typeof window === 'undefined') return 'none'
  try {
    window.localStorage.setItem(HEALTH_STORAGE_KEY, JSON.stringify(state))
    return 'none'
  } catch (err) {
    return classifyStorageError(err)
  }
}

/* ── עזרי תאריך ── */

/** היום בפורמט ISO 'YYYY-MM-DD' (לפי אזור הזמן המקומי). */
export function todayISO(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60_000)
  return local.toISOString().slice(0, 10)
}

/** הוספת חודשים לתאריך ISO, מחזיר ISO. בטוח לסוף-חודש (נצמד לחודש). */
export function addMonths(iso: string, months: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const base = new Date(Date.UTC(y, m - 1, d))
  const targetMonth = base.getUTCMonth() + months
  const target = new Date(Date.UTC(base.getUTCFullYear(), targetMonth, 1))
  // נצמדים ליום המקורי, אך לא חורגים מאורך חודש היעד.
  const lastDay = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate()
  target.setUTCDate(Math.min(d, lastDay))
  return target.toISOString().slice(0, 10)
}

/** הפרש ימים שלם בין שני תאריכי ISO (b פחות a). חיובי = b אחרי a. */
export function daysBetween(aISO: string, bISO: string): number {
  const a = Date.parse(`${aISO}T00:00:00Z`)
  const b = Date.parse(`${bISO}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return 0
  return Math.round((b - a) / 86_400_000)
}

/** תצוגת תאריך עברית קצרה, למשל "3 ביוני 2026". */
export function formatDateHe(iso: string): string {
  const t = Date.parse(`${iso}T00:00:00`)
  if (Number.isNaN(t)) return iso
  return new Date(t).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** ניסוח גיל הכלב מתאריך לידה, או מחרוזת ריקה אם אין/לא תקין. */
export function describeAge(birthDate: string, refISO = todayISO()): string {
  if (!birthDate) return ''
  const days = daysBetween(birthDate, refISO)
  if (days < 0) return ''
  const months = Math.floor(days / 30.44)
  if (months < 1) {
    const weeks = Math.floor(days / 7)
    if (weeks < 1) return 'פחות משבוע'
    return weeks === 1 ? 'שבוע' : `${weeks} שבועות`
  }
  if (months < 12) {
    return months === 1 ? 'חודש' : `${months} חודשים`
  }
  const years = Math.floor(months / 12)
  const remMonths = months % 12
  const yearsLabel = years === 1 ? 'שנה' : years === 2 ? 'שנתיים' : `${years} שנים`
  if (remMonths === 0) return yearsLabel
  const monthsLabel = remMonths === 1 ? 'חודש' : `${remMonths} חודשים`
  return `${yearsLabel} ו-${monthsLabel}`
}

/* ── תזכורות ── */

/** מצב תזכורת ביחס לתאריך הייחוס. */
export type ReminderStatus = 'overdue' | 'soon' | 'upcoming'

/** תזכורת מחושבת אחת. */
export type Reminder = {
  /** מזהה ייחודי (משולב מזהה האירוע) - שימושי כ-key. */
  id: string
  dogId: string
  dogName: string
  type: HealthEventType
  /** תאריך האירוע האחרון שעליו מבוססת התזכורת. */
  basedOnDate: string
  /** תאריך התזכורת המחושב. */
  dueDate: string
  /** ימים עד התזכורת (שלילי = עבר). */
  daysUntil: number
  status: ReminderStatus
  note: string
}

/** טווח (בימים) שבו תזכורת נחשבת "קרובה" ומופיעה בכרטיס הסיכום. */
export const SOON_WINDOW_DAYS = 30

/**
 * חישוב תזכורות קרובות לכל הכלבים.
 *
 * לכל סוג אירוע מחזורי (כזה עם reminderMonths) לוקחים את הרישום האחרון
 * של אותו סוג לאותו כלב, ומחשבים תאריך תזכורת = תאריך האירוע + החודשים.
 * מחזירים רק תזכורות שכבר עברו או שיגיעו בתוך horizonDays.
 *
 * זוהי עזרה לארגון בלבד - לא הנחיה רפואית. הווטרינר קובע מתי באמת לחזור.
 */
export function computeReminders(
  dogs: Dog[],
  events: HealthEvent[],
  refISO = todayISO(),
  horizonDays = 120,
): Reminder[] {
  const dogById = new Map(dogs.map((d) => [d.id, d]))

  // הרישום האחרון לכל צירוף (כלב + סוג), כדי לחשב את התזכורת הבאה ממנו.
  const latest = new Map<string, HealthEvent>()
  for (const ev of events) {
    if (ev.reminderMonths == null) continue
    if (!dogById.has(ev.dogId)) continue
    const key = `${ev.dogId}:${ev.type}`
    const prev = latest.get(key)
    if (!prev || ev.date > prev.date) latest.set(key, ev)
  }

  const reminders: Reminder[] = []
  for (const ev of Array.from(latest.values())) {
    const dog = dogById.get(ev.dogId)
    if (!dog || ev.reminderMonths == null) continue
    const dueDate = addMonths(ev.date, ev.reminderMonths)
    const daysUntil = daysBetween(refISO, dueDate)
    if (daysUntil > horizonDays) continue
    const status: ReminderStatus =
      daysUntil < 0 ? 'overdue' : daysUntil <= SOON_WINDOW_DAYS ? 'soon' : 'upcoming'
    reminders.push({
      id: `rem-${ev.id}`,
      dogId: dog.id,
      dogName: dog.name,
      type: ev.type,
      basedOnDate: ev.date,
      dueDate,
      daysUntil,
      status,
      note: ev.note,
    })
  }

  // הכי דחוף קודם.
  reminders.sort((a, b) => a.daysUntil - b.daysUntil)
  return reminders
}

/** ניסוח טקסט "בעוד X" / "באיחור של X" / "היום" לתצוגת תזכורת. */
export function describeDueIn(daysUntil: number): string {
  if (daysUntil === 0) return 'היום'
  if (daysUntil < 0) {
    const n = Math.abs(daysUntil)
    if (n === 1) return 'באיחור של יום'
    if (n < 30) return `באיחור של ${n} ימים`
    const months = Math.round(n / 30.44)
    return months === 1 ? 'באיחור של כחודש' : `באיחור של כ-${months} חודשים`
  }
  if (daysUntil === 1) return 'מחר'
  if (daysUntil < 30) return `בעוד ${daysUntil} ימים`
  const months = Math.round(daysUntil / 30.44)
  return months === 1 ? 'בעוד כחודש' : `בעוד כ-${months} חודשים`
}

/** מיון אירועים מהחדש לישן (לציר זמן). שובר שוויון לפי זמן יצירה. */
export function sortEventsDesc(events: HealthEvent[]): HealthEvent[] {
  return [...events].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return a.createdAt < b.createdAt ? 1 : -1
  })
}
