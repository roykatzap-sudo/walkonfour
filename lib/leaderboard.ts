import { communities, type Community } from '@/lib/communities'

/**
 * לוח המובילים - שכבת נתונים (דוגמה בלבד).
 *
 * אין backend אמיתי: רשימת 20 רשומות דוגמה נשמרת כאן כדאטה סטטי, והעמוד
 * מחשב מתוכה דרגות, פודיום וסינון לפי עיר. הערים נגזרות מ-`communities.ts`
 * כך שאין כפילות מקור אמת - כל `citySlug` חייב להתאים ל-slug קיים שם.
 *
 * חשוב: אלה אינם חברים אמיתיים. כל עוד אין קהילה פעילה, עמוד /leaderboard
 * מציג מצב "ייפתח עם ההשקה" ולא מרנדר את הרשומות האלה כאנשים אמיתיים.
 * השמות כאן הם תוויות גנריות ("חבר/ה בקהילה") בלי שמות פרטיים מומצאים,
 * כך שגם אם הדאטה מוצגת היכן שהוא (למשל בתצוגה מקדימה של הדייג׳סט) היא
 * נקראת כדוגמה ולא כהוכחה חברתית מומצאת.
 *
 * הצבירה נשענת על שלוש פעולות ערך בקהילה, וכל אחת שווה מספר נקודות קבוע
 * (ראו POINT_RULES). השדה `points` הוא הסכום המוצג, ו-`breakdown` מפרק
 * אותו לשקיפות מלאה למשתמש.
 */

/** דרגות חברות - מסודרות מהגבוהה לנמוכה לפי סף נקודות. */
export type LeaderRankTier = {
  /** מזהה פנימי יציב. */
  id: 'legend' | 'expert' | 'active' | 'rising' | 'member'
  /** שם הדרגה בעברית, כפי שמוצג למשתמש. */
  name: string
  /** סף הנקודות המינימלי לדרגה. */
  min: number
  /** אייקון יחיד שמלווה את הדרגה (קישוט בלבד - תמיד aria-hidden). */
  icon: string
}

/**
 * סולם הדרגות, מהגבוהה לנמוכה. `rankTierFor` סורק אותו ומחזיר את
 * הראשונה שסף הנקודות שלה מתקיים.
 */
export const RANK_TIERS: LeaderRankTier[] = [
  { id: 'legend', name: 'אגדת הקהילה', min: 5000, icon: '👑' },
  { id: 'expert', name: 'מומחה גזע', min: 3000, icon: '🎓' },
  { id: 'active', name: 'חבר פעיל', min: 1500, icon: '⭐' },
  { id: 'rising', name: 'כוכב עולה', min: 600, icon: '🌱' },
  { id: 'member', name: 'חבר קהילה', min: 0, icon: '🐾' },
]

/** מחזירה את דרגת החברות המתאימה למספר נקודות נתון. */
export function rankTierFor(points: number): LeaderRankTier {
  return RANK_TIERS.find((t) => points >= t.min) ?? RANK_TIERS[RANK_TIERS.length - 1]
}

/**
 * כללי צבירת הנקודות - מקור האמת ל"איך צוברים נקודות".
 * מוצגים למשתמש בעמוד וגם משמשים לחישוב ה-breakdown של כל חבר.
 */
export type PointRule = {
  id: 'post' | 'help' | 'event'
  /** שם הפעולה. */
  label: string
  /** הסבר קצר וברור. */
  detail: string
  /** נקודות לכל פעולה. */
  per: number
  /** אייקון קישוטי בלבד. */
  icon: string
}

export const POINT_RULES: PointRule[] = [
  { id: 'post', label: 'פוסט בפורום', detail: 'כל פוסט או שאלה שמעשירים את הקהילה', per: 25, icon: '✍️' },
  { id: 'help', label: 'עזרה לחבר', detail: 'תשובה מועילה או לייק שקיבלתם על תגובה', per: 15, icon: '🤝' },
  { id: 'event', label: 'השתתפות באירוע', detail: 'הגעה למפגש, טיול או סדנה קהילתית', per: 60, icon: '🎉' },
]

/** מפת חיפוש מהירה id → per, נוחה לחישוב ה-breakdown. */
const PER: Record<PointRule['id'], number> = POINT_RULES.reduce(
  (acc, r) => ({ ...acc, [r.id]: r.per }),
  {} as Record<PointRule['id'], number>
)

/** תג הישג שמופיע לצד שם החבר. האייקון תמיד נפרד מהטקסט (aria-hidden). */
export type LeaderBadge = {
  label: string
  icon: string
}

/** מגמת התנועה בדירוג מאז התקופה הקודמת. */
export type LeaderTrend = 'up' | 'down' | 'same'

export type LeaderEntry = {
  id: string
  name: string
  /** שם הכלב - צובע אופי לקהילה. */
  dog: string
  citySlug: string // חייב להתאים ל-slug ב-communities.ts
  /** ספירת הפעולות שצברו את הנקודות. */
  posts: number
  helps: number
  events: number
  /** תגי הישג מוצגים. */
  badges: LeaderBadge[]
  /** מגמה + מספר המקומות שזז (0 כשאין שינוי). */
  trend: LeaderTrend
  trendBy: number
}

/**
 * 20 חברי הקהילה המובילים (דמו). הספירות נבחרו כך שהנקודות יורדות
 * בהדרגה ויוצרות פיזור טבעי על פני הדרגות. `citySlug` תמיד תקף מול
 * communities.ts.
 */
export const leaderEntries: LeaderEntry[] = [
  { id: 'l1',  name: 'חבר/ה בקהילה', dog: 'מקס',     citySlug: 'tel-aviv',    posts: 142, helps: 318, events: 41, trend: 'same', trendBy: 0, badges: [{ label: 'מומחה/ית לברדור', icon: '🎓' }] },
  { id: 'l2',  name: 'חבר/ה בקהילה', dog: 'באדי',    citySlug: 'jerusalem',   posts: 128, helps: 286, events: 38, trend: 'up',   trendBy: 2, badges: [{ label: 'שכן/ה טוב/ה', icon: '🤝' }] },
  { id: 'l3',  name: 'חבר/ה בקהילה', dog: 'לונה',    citySlug: 'haifa',       posts: 117, helps: 264, events: 33, trend: 'down', trendBy: 1, badges: [{ label: 'מומחה/ית האסקי', icon: '🎓' }] },
  { id: 'l4',  name: 'חבר/ה בקהילה', dog: "ג'ינג'ר", citySlug: 'tel-aviv',   posts: 104, helps: 231, events: 29, trend: 'up',   trendBy: 3, badges: [{ label: 'מארגן/ת מפגשים', icon: '🎉' }] },
  { id: 'l5',  name: 'חבר/ה בקהילה', dog: 'צ׳רלי',   citySlug: 'rishon',      posts: 96,  helps: 208, events: 27, trend: 'same', trendBy: 0, badges: [{ label: 'שכן/ה טוב/ה', icon: '🤝' }] },
  { id: 'l6',  name: 'חבר/ה בקהילה', dog: 'רקסי',    citySlug: 'beer-sheva',  posts: 88,  helps: 192, events: 24, trend: 'up',   trendBy: 1, badges: [{ label: 'מומחה/ית גזע', icon: '🎓' }] },
  { id: 'l7',  name: 'חבר/ה בקהילה', dog: 'בלה',     citySlug: 'netanya',     posts: 81,  helps: 176, events: 22, trend: 'down', trendBy: 2, badges: [{ label: 'חבר/ה פעיל/ה', icon: '⭐' }] },
  { id: 'l8',  name: 'חבר/ה בקהילה', dog: 'נאצ׳ו',   citySlug: 'ramat-gan',   posts: 74,  helps: 158, events: 19, trend: 'up',   trendBy: 4, badges: [{ label: 'מארגן/ת טיולים', icon: '🎉' }] },
  { id: 'l9',  name: 'חבר/ה בקהילה', dog: 'דייזי',   citySlug: 'haifa',       posts: 68,  helps: 144, events: 18, trend: 'same', trendBy: 0, badges: [{ label: 'שכן/ה טוב/ה', icon: '🤝' }] },
  { id: 'l10', name: 'חבר/ה בקהילה', dog: 'שוקו',    citySlug: 'petah-tikva', posts: 61,  helps: 128, events: 16, trend: 'down', trendBy: 1, badges: [{ label: 'חבר/ה פעיל/ה', icon: '⭐' }] },
  { id: 'l11', name: 'חבר/ה בקהילה', dog: 'אלי',     citySlug: 'ashdod',      posts: 55,  helps: 114, events: 14, trend: 'up',   trendBy: 2, badges: [{ label: 'מומחה/ית תזונה', icon: '🎓' }] },
  { id: 'l12', name: 'חבר/ה בקהילה', dog: 'טופי',    citySlug: 'herzliya',    posts: 49,  helps: 101, events: 13, trend: 'same', trendBy: 0, badges: [{ label: 'שכן/ה טוב/ה', icon: '🤝' }] },
  { id: 'l13', name: 'חבר/ה בקהילה', dog: 'מילה',    citySlug: 'kfar-saba',   posts: 44,  helps: 89,  events: 11, trend: 'up',   trendBy: 1, badges: [{ label: 'חבר/ה פעיל/ה', icon: '⭐' }] },
  { id: 'l14', name: 'חבר/ה בקהילה', dog: 'בוני',    citySlug: 'rehovot',     posts: 39,  helps: 78,  events: 10, trend: 'down', trendBy: 3, badges: [{ label: 'מארח/ת מפגשים', icon: '🎉' }] },
  { id: 'l15', name: 'חבר/ה בקהילה', dog: 'קוקו',    citySlug: 'holon',       posts: 35,  helps: 68,  events: 9,  trend: 'same', trendBy: 0, badges: [{ label: 'שכן/ה טוב/ה', icon: '🤝' }] },
  { id: 'l16', name: 'חבר/ה בקהילה', dog: 'ריקו',    citySlug: 'raanana',     posts: 31,  helps: 59,  events: 8,  trend: 'up',   trendBy: 2, badges: [{ label: 'כוכב/ת עולה', icon: '🌱' }] },
  { id: 'l17', name: 'חבר/ה בקהילה', dog: 'אריאל',   citySlug: 'modiin',      posts: 27,  helps: 50,  events: 7,  trend: 'down', trendBy: 1, badges: [{ label: 'כוכב/ת עולה', icon: '🌱' }] },
  { id: 'l18', name: 'חבר/ה בקהילה', dog: 'בלק',     citySlug: 'bat-yam',     posts: 23,  helps: 42,  events: 6,  trend: 'up',   trendBy: 1, badges: [{ label: 'כוכב/ת עולה', icon: '🌱' }] },
  { id: 'l19', name: 'חבר/ה בקהילה', dog: 'פפר',     citySlug: 'givatayim',   posts: 19,  helps: 34,  events: 5,  trend: 'same', trendBy: 0, badges: [{ label: 'כוכב/ת עולה', icon: '🌱' }] },
  { id: 'l20', name: 'חבר/ה בקהילה', dog: 'אלסקה',   citySlug: 'eilat',       posts: 15,  helps: 26,  events: 4,  trend: 'up',   trendBy: 3, badges: [{ label: 'כוכב/ת עולה', icon: '🌱' }] },
]

/** פירוק הנקודות של חבר לשלושת מקורות הצבירה. */
export type PointsBreakdown = {
  post: number
  help: number
  event: number
}

/** חישוב פירוק הנקודות מתוך ספירות הפעולות. */
export function pointsBreakdown(e: LeaderEntry): PointsBreakdown {
  return {
    post: e.posts * PER.post,
    help: e.helps * PER.help,
    event: e.events * PER.event,
  }
}

/** סך הנקודות של חבר. */
export function totalPoints(e: LeaderEntry): number {
  const b = pointsBreakdown(e)
  return b.post + b.help + b.event
}

/** רשומה מועשרת - מה שהעמוד באמת מרנדר. */
export type RankedLeader = LeaderEntry & {
  /** מקום ארצי (1-based), לפי סך הנקודות. */
  rank: number
  points: number
  breakdown: PointsBreakdown
  tier: LeaderRankTier
  community: Community | null
}

/** העשרה: מיון לפי נקודות, הצמדת דרגה, קהילה ומקום. */
function enrich(entries: LeaderEntry[]): RankedLeader[] {
  return entries
    .map((e) => {
      const points = totalPoints(e)
      return {
        ...e,
        points,
        breakdown: pointsBreakdown(e),
        tier: rankTierFor(points),
        community: communities.find((c) => c.slug === e.citySlug) ?? null,
        rank: 0, // ממולא מיד אחרי המיון
      }
    })
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }))
}

/** לוח המובילים הארצי המלא, ממוין ומדורג. */
export function nationalLeaderboard(): RankedLeader[] {
  return enrich(leaderEntries)
}

/**
 * לוח מובילים מסונן לעיר אחת. שומר על המיון לפי נקודות וממספר מחדש
 * את המקומות 1..n בתוך העיר, כך שגם בעיר קטנה יש פודיום מקומי משלה.
 */
export function cityLeaderboard(citySlug: string): RankedLeader[] {
  // ולידציה: slug שאינו קיים ב-communities.ts מסמן באג שלמות-נתונים.
  // מחזירים רשימה ריקה, אבל לא בשקט - מתריעים ללוג כדי שהבאג יצוף.
  if (!communities.some((c) => c.slug === citySlug)) {
    console.warn(
      `[leaderboard] citySlug "${citySlug}" אינו קיים ב-communities.ts - מוחזרת רשימה ריקה.`
    )
    return []
  }
  return enrich(leaderEntries.filter((e) => e.citySlug === citySlug))
}

/** רשימת הערים שיש בהן לפחות חבר אחד בלוח - לבורר הסינון. */
export function citiesWithLeaders(): Community[] {
  const slugs = new Set(leaderEntries.map((e) => e.citySlug))
  return communities.filter((c) => slugs.has(c.slug))
}
