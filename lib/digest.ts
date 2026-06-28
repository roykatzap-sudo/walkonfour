/**
 * "קהילה על ארבע החודש" - שכבת אגרגציה לדייג׳סט הקהילתי.
 *
 * אין כאן מקור-אמת חדש ואין נתוני דמו משלנו. הקובץ קורא **read-only**
 * מה-lib הקיים (demo / leaderboard / adopt) ומרכיב ממנו "תמונת חודש"
 * אחת: דיונים חמים, אירועים קרובים, קבוצות רכישה פעילות, חברים מובילים
 * וכלבים חדשים לאימוץ. כל פונקציה כאן היא צירוף/מיון/חיתוך בלבד - אם
 * הנתון משתנה ב-lib המקורי, הוא משתנה כאן אוטומטית.
 *
 * הכול דטרמיניסטי (בלי Math.random / Date.now בזמן בנייה) כדי שיהיה בטוח
 * ל-Server Component ועקבי בין רינדורים.
 */

import {
  demoPosts,
  demoCategories,
  demoEvents,
  demoGroups,
} from '@/lib/demo'
import {
  nationalLeaderboard,
  type RankedLeader,
} from '@/lib/leaderboard'
import {
  sortByUrgency,
  adoptDogs,
  type AdoptDog,
} from '@/lib/adopt'
import type { Event, ForumPost, GroupPurchase, ForumCategory } from '@/types'
import { savingsPercent } from '@/lib/utils'

/* ───────────────────────── דיונים חמים ───────────────────────── */

/**
 * פוסט מועשר עם הקטגוריה שלו ומדד "חום" מחושב. דורסים את שדה `category`
 * האופציונלי של ForumPost ל-`ForumCategory | null` (תמיד מחושב כאן).
 */
export type HotDiscussion = Omit<ForumPost, 'category'> & {
  /** הקטגוריה שאליה שייך הפוסט (null אם לא נמצאה). */
  category: ForumCategory | null
  /** מדד חום: שילוב צפיות, תגובות ולייקים. גבוה = חם יותר. */
  heat: number
}

/** משקלות מדד החום - תגובה שווה יותר מצפייה, לייק באמצע. */
const HEAT_WEIGHTS = { comments: 8, likes: 5, views: 1 } as const

/** מחשב את מדד החום של פוסט מתוך המעורבות שלו. */
function postHeat(p: ForumPost): number {
  return (
    (p.comments_count ?? 0) * HEAT_WEIGHTS.comments +
    (p.likes_count ?? 0) * HEAT_WEIGHTS.likes +
    (p.views ?? 0) * HEAT_WEIGHTS.views
  )
}

/**
 * הדיונים החמים של החודש - כל פוסטי הדמו, מועשרים בקטגוריה ובמדד חום
 * וממוינים מהחם לקריר. read-only מ-demoPosts/demoCategories.
 */
export function hotDiscussions(limit = 3): HotDiscussion[] {
  return demoPosts
    .map((p) => ({
      ...p,
      category: demoCategories.find((c) => c.id === p.category_id) ?? null,
      heat: postHeat(p),
    }))
    .sort((a, b) => b.heat - a.heat)
    .slice(0, limit)
}

/* ───────────────────────── אירועים קרובים ───────────────────────── */

/**
 * האירועים הקרובים - demoEvents הפעילים, ממוינים לפי תאריך עולה.
 * הנתון לא נחתך לפי "מהיום" כדי להישאר עקבי ל-SSR ולנתוני הדמו הסטטיים.
 */
export function upcomingEvents(limit = 4): Event[] {
  return demoEvents
    .filter((e) => e.is_active)
    .slice()
    .sort(
      (a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime(),
    )
    .slice(0, limit)
}

/* ───────────────────────── קבוצות רכישה פעילות ───────────────────────── */

/** קבוצת רכישה מועשרת באחוז חיסכון ובאחוז התקדמות אל היעד. */
export type ActiveGroup = GroupPurchase & {
  /** אחוז חיסכון מול המחיר המקורי. */
  savings: number
  /** אחוז ההתקדמות אל מספר המשתתפים המקסימלי (0-100). */
  progress: number
}

/**
 * קבוצות הרכישה הפעילות - demoGroups הפעילות, מועשרות בחיסכון ובהתקדמות,
 * ממוינות מהחיסכון הגבוה לנמוך כדי להבליט את ההזדמנות הטובה ביותר.
 */
export function activeGroups(limit = 3): ActiveGroup[] {
  return demoGroups
    .filter((g) => g.is_active)
    .map((g) => {
      const savings =
        g.savings_percent ?? savingsPercent(g.original_price, g.group_price)
      const members = g.members_count ?? 0
      const cap = g.max_participants || g.min_participants || 1
      const progress = Math.min(100, Math.round((members / cap) * 100))
      return { ...g, savings, progress }
    })
    .sort((a, b) => b.savings - a.savings)
    .slice(0, limit)
}

/* ───────────────────────── חברים מובילים ───────────────────────── */

/**
 * החברים המובילים של החודש - שלושת הראשונים מלוח המובילים הארצי.
 * read-only דרך nationalLeaderboard() (שמחשב נקודות, דרגות וקהילה).
 */
export function topMembers(limit = 3): RankedLeader[] {
  return nationalLeaderboard().slice(0, limit)
}

/* ───────────────────────── כלבים חדשים לאימוץ ───────────────────────── */

/**
 * הכלבים החדשים לאימוץ - מיון לפי דחיפות (דחוף → חדש → רגיל) דרך
 * sortByUrgency, וחיתוך לכמה הכרטיסים הראשונים. read-only מ-adoptDogs.
 */
export function freshAdoptions(limit = 4): AdoptDog[] {
  return sortByUrgency(adoptDogs).slice(0, limit)
}

/* ───────────────────────── מדדי החודש (hero) ───────────────────────── */

/** מספר/תווית למדד יחיד בכותרת הדייג׳סט. */
export type DigestStat = {
  id: string
  value: string
  label: string
}

/**
 * ארבעה מדדים מצטברים ל-hero - כולם נגזרים מאותם מקורות read-only,
 * כך שהמספרים תמיד מסתנכרנים עם שאר העמוד והאתר.
 */
export function digestStats(): DigestStat[] {
  const totalPosts = demoCategories.reduce(
    (sum, c) => sum + (c.posts_count ?? 0),
    0,
  )
  const eventRegistrations = demoEvents.reduce(
    (sum, e) => sum + (e.registrations_count ?? 0),
    0,
  )
  const groupMembers = demoGroups.reduce(
    (sum, g) => sum + (g.members_count ?? 0),
    0,
  )

  return [
    { id: 'posts', value: totalPosts.toLocaleString('he-IL'), label: 'דיונים בפורום' },
    { id: 'events', value: eventRegistrations.toLocaleString('he-IL'), label: 'נרשמים לאירועים' },
    { id: 'groups', value: groupMembers.toLocaleString('he-IL'), label: 'חברים בקבוצות רכישה' },
    { id: 'adopt', value: adoptDogs.length.toLocaleString('he-IL'), label: 'כלבים מחכים לבית' },
  ]
}

/**
 * שם החודש הנוכחי בעברית - לכותרת המשנה ("יוני 2026"). מחושב בזמן ריצה
 * אך אינו משפיע על שאר הנתונים (שהם סטטיים), כך שזה בטוח ל-SSR.
 */
export function currentMonthLabel(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('he-IL', {
    month: 'long',
    year: 'numeric',
  }).format(now)
}
