import { breeds, type Breed, type BreedSize } from '@/lib/breeds'

/**
 * "מתאם הגזע" - מנוע התאמה פשוט ושקוף בין תשובות המשתמש לגזעים.
 *
 * הרעיון: כל שאלה תורמת ניקוד לכל גזע לפי כמה הוא מתאים לתשובה.
 * הניקוד מנורמל ל-0-100 ("אחוז התאמה"), והגזעים ממוינים מהגבוה לנמוך.
 * אין כאן backend - הכול חישוב מקומי, דטרמיניסטי וניתן להסבר.
 */

export type Answer = string

/** מזהי השאלות - סדר קבוע, נשלט מתוך הרכיב. */
export type QuestionId =
  | 'home'
  | 'activity'
  | 'kids'
  | 'experience'
  | 'time'
  | 'shedding'
  | 'climate'
  | 'purpose'

export type Option = {
  value: string
  label: string
  hint?: string
}

export type Question = {
  id: QuestionId
  title: string
  subtitle: string
  /** אימוג'י לכותרת השאלה בלבד - לא בתוך משפט, לעיצוב הכרטיס. */
  icon: string
  options: Option[]
}

/** ששת שאלות אורח-החיים של החידון. */
export const QUESTIONS: Question[] = [
  {
    id: 'home',
    title: 'איפה הכלב יגדל?',
    subtitle: 'גודל הבית קובע כמה מקום יש לגזעים הגדולים.',
    icon: '🏠',
    options: [
      { value: 'apartment', label: 'דירה קטנה', hint: 'בלי חצר, מרחב מוגבל' },
      { value: 'mid', label: 'דירה גדולה', hint: 'מרווח, אולי מרפסת' },
      { value: 'house', label: 'בית עם חצר', hint: 'מקום לרוץ ולשחק' },
    ],
  },
  {
    id: 'activity',
    title: 'כמה אתם פעילים?',
    subtitle: 'גזע אנרגטי זקוק לפורקן יומי כדי להיות מאושר ורגוע.',
    icon: '🏃',
    options: [
      { value: 'low', label: 'אוהבים נחת', hint: 'טיולים קצרים ורגועים' },
      { value: 'medium', label: 'פעילות מתונה', hint: 'הליכה יומית קבועה' },
      { value: 'high', label: 'ספורטיביים מאוד', hint: 'ריצות, טיולים, שטח' },
    ],
  },
  {
    id: 'kids',
    title: 'יש ילדים בבית?',
    subtitle: 'חלק מהגזעים סבלניים במיוחד עם ילדים קטנים.',
    icon: '🧒',
    options: [
      { value: 'young', label: 'כן, ילדים קטנים', hint: 'חשובה סבלנות ועדינות' },
      { value: 'older', label: 'ילדים גדולים', hint: 'יודעים להתנהל עם כלב' },
      { value: 'none', label: 'אין ילדים', hint: 'בית מבוגרים' },
    ],
  },
  {
    id: 'experience',
    title: 'מה הניסיון שלכם?',
    subtitle: 'גזעים מסוימים זקוקים לבעלים מנוסה ולהכוונה עקבית.',
    icon: '🎓',
    options: [
      { value: 'first', label: 'כלב ראשון', hint: 'מחפשים גזע סלחני וקל' },
      { value: 'some', label: 'גידלתי בעבר', hint: 'מכירים את הבסיס' },
      { value: 'expert', label: 'מנוסים מאוד', hint: 'פתוחים לכל אתגר' },
    ],
  },
  {
    id: 'time',
    title: 'כמה זמן פנוי יש לכם?',
    subtitle: 'זמן לאילוף, לטיול ולחברה - או שגרה עמוסה.',
    icon: '⏰',
    options: [
      { value: 'little', label: 'מעט זמן', hint: 'שגרה עמוסה' },
      { value: 'moderate', label: 'זמן סביר', hint: 'בוקר וערב פנויים' },
      { value: 'plenty', label: 'הרבה זמן', hint: 'הכלב במרכז היום' },
    ],
  },
  {
    id: 'shedding',
    title: 'רגישות לשיער?',
    subtitle: 'יש גזעים שכמעט אינם נושרים - נוחים לרגישים ולאלרגיים.',
    icon: '🧶',
    options: [
      { value: 'sensitive', label: 'מאוד רגיש', hint: 'עדיף גזע שכמעט לא נושר' },
      { value: 'okay', label: 'לא מפריע לי', hint: 'שיער זה חלק מהחבילה' },
      { value: 'dont-care', label: 'לגמרי בסדר', hint: 'אין שום בעיה עם פרווה' },
    ],
  },
  {
    id: 'climate',
    title: 'איך הקיץ אצלכם?',
    subtitle: 'בחום הישראלי גזעים עם פרווה כבדה או אף שטוח סובלים מאוד.',
    icon: '☀️',
    options: [
      { value: 'hot', label: 'חם ולח', hint: 'שרב וחמסין רוב הקיץ' },
      { value: 'ac', label: 'בית ממוזג', hint: 'מיזוג רוב שעות היום' },
      { value: 'mild', label: 'אקלים נוח', hint: 'הר, שפלה או חוף מאוורר' },
    ],
  },
  {
    id: 'purpose',
    title: 'מה אתם מחפשים בכלב?',
    subtitle: 'התפקיד שאתם מדמיינים משפיע מאוד על הגזע שיתאים.',
    icon: '🎯',
    options: [
      { value: 'companion', label: 'חבר רגוע לבית', hint: 'חברה, חיבוקים ושקט' },
      { value: 'watchdog', label: 'שמירה והתראה', hint: 'כלב ערני שמגונן על הבית' },
      { value: 'active', label: 'שותף לפעילות', hint: 'ריצות, טיולים וספורט' },
    ],
  },
]

/** מיפוי תשובות לפי מזהה השאלה - מה שנשמר במצב הרכיב. */
export type Answers = Partial<Record<QuestionId, string>>

export type MatchResult = {
  breed: Breed
  /** אחוז התאמה 0-100. */
  score: number
  /** עד שלוש סיבות קצרות שמסבירות את ההתאמה. */
  reasons: string[]
}

/** גזעים שכמעט אינם נושרים - מתאימים לרגישים לשיער. */
const LOW_SHEDDING = new Set([
  'poodle',
  'maltese',
  'shih-tzu',
  'yorkshire',
  'french-bulldog',
])

/** גזעים שסובלים בחום הישראלי - פרווה כבדה/כפולה או אף שטוח (ברכיצפלי). */
const HEAT_SENSITIVE = new Set([
  'husky',
  'saint-bernard',
  'cane-corso',
  'bulldog',
  'french-bulldog',
  'boxer',
  'shih-tzu',
  'pomeranian',
  'australian-shepherd',
])

/** גזעים עמידים יחסית לחום - פרווה קצרה/דלילה או הסתגלות מקומית. */
const HEAT_TOLERANT = new Set([
  'canaan',
  'beagle',
  'dachshund',
  'chihuahua',
  'doberman',
  'amstaff',
  'malinois',
])

/** גזעים עם נטיית שמירה/הגנה טבעית - ערניים ומגוננים. */
const WATCHDOG = new Set([
  'canaan',
  'german-shepherd',
  'rottweiler',
  'doberman',
  'cane-corso',
  'boxer',
  'amstaff',
])

/** משקל מקסימלי אפשרי לכל שאלה - לצורך נרמול לאחוזים. */
const MAX_PER_QUESTION = 4
const SIZE_RANK: Record<BreedSize, number> = { קטן: 1, בינוני: 2, גדול: 3, ענק: 4 }

/** ניקוד התאמה של גזע יחיד מול תשובה אחת. מחזיר { score, reason? }. */
function scoreQuestion(
  id: QuestionId,
  value: string,
  b: Breed
): { score: number; reason?: string } {
  switch (id) {
    case 'home': {
      const rank = SIZE_RANK[b.size]
      if (value === 'apartment') {
        if (rank <= 1) return { score: 4, reason: 'מתאים מצוין לחיי דירה' }
        if (rank === 2) return { score: 2 }
        if (rank === 3) return { score: 0 }
        return { score: -2 }
      }
      if (value === 'mid') {
        if (rank <= 2) return { score: 3, reason: 'נוח בדירה מרווחת' }
        if (rank === 3) return { score: 2 }
        return { score: 0 }
      }
      // house
      if (rank >= 3) return { score: 4, reason: 'פורח בבית עם חצר' }
      return { score: 2 }
    }

    case 'activity': {
      if (value === 'low') {
        if (b.energy <= 2) return { score: 4, reason: 'רגוע ומסתפק במעט פעילות' }
        if (b.energy === 3) return { score: 2 }
        return { score: -1 }
      }
      if (value === 'medium') {
        if (b.energy === 3 || b.energy === 4) return { score: 4, reason: 'רמת אנרגיה שמתאימה לכם' }
        if (b.energy === 2) return { score: 2 }
        return { score: 1 }
      }
      // high
      if (b.energy >= 4) return { score: 4, reason: 'אנרגטי ואוהב פעילות' }
      if (b.energy === 3) return { score: 2 }
      return { score: 0 }
    }

    case 'kids': {
      if (value === 'young') {
        return b.goodWithKids
          ? { score: 4, reason: 'סבלני ומתאים לילדים' }
          : { score: -1 }
      }
      if (value === 'older') {
        return b.goodWithKids ? { score: 3, reason: 'מסתדר יפה עם ילדים' } : { score: 1 }
      }
      // none
      return { score: 2 }
    }

    case 'experience': {
      const demanding = ['malinois', 'border-collie', 'cane-corso', 'doberman', 'rottweiler', 'amstaff', 'german-shepherd', 'australian-shepherd']
      const easy = ['labrador', 'golden', 'cavalier', 'poodle', 'beagle', 'cocker', 'shih-tzu', 'maltese', 'mixed', 'pug', 'corgi']
      if (value === 'first') {
        if (easy.includes(b.slug)) return { score: 4, reason: 'ידידותי לבעלים מתחילים' }
        if (demanding.includes(b.slug)) return { score: -1 }
        return { score: 2 }
      }
      if (value === 'some') {
        return { score: 3 }
      }
      // expert
      if (demanding.includes(b.slug)) return { score: 4, reason: 'מתגמל לבעלים מנוסה' }
      return { score: 2 }
    }

    case 'time': {
      if (value === 'little') {
        if (b.energy <= 2) return { score: 4, reason: 'עצמאי ולא תובעני בזמן' }
        if (b.energy === 3) return { score: 2 }
        return { score: -1 }
      }
      if (value === 'moderate') {
        if (b.energy <= 4) return { score: 3, reason: 'מסתפק בזמן סביר ביום' }
        return { score: 1 }
      }
      // plenty
      if (b.energy >= 4) return { score: 4, reason: 'ישמח לכל רגע יחד אתכם' }
      return { score: 3 }
    }

    case 'shedding': {
      const low = LOW_SHEDDING.has(b.slug)
      if (value === 'sensitive') {
        return low
          ? { score: 4, reason: 'כמעט אינו נושר שיער' }
          : { score: -1 }
      }
      if (value === 'okay') {
        return low ? { score: 3 } : { score: 2 }
      }
      // dont-care
      return { score: 2 }
    }

    case 'climate': {
      if (value === 'hot') {
        if (HEAT_SENSITIVE.has(b.slug)) return { score: -2 }
        if (HEAT_TOLERANT.has(b.slug)) return { score: 4, reason: 'עמיד היטב בחום הישראלי' }
        return { score: 2 }
      }
      if (value === 'ac') {
        // עם מיזוג גם הרגישים מסתדרים, אך עדיין יתרון קל לעמידים
        if (HEAT_SENSITIVE.has(b.slug)) return { score: 2, reason: 'יסתדר בזכות המיזוג' }
        return { score: 3 }
      }
      // mild - כמעט כל גזע נוח
      if (HEAT_SENSITIVE.has(b.slug)) return { score: 3, reason: 'נהנה מהאקלים הנוח' }
      return { score: 3 }
    }

    case 'purpose': {
      if (value === 'companion') {
        if (b.aggression <= 2) return { score: 4, reason: 'אופי רך ומתאים לחברה' }
        if (b.aggression >= 4) return { score: -1 }
        return { score: 2 }
      }
      if (value === 'watchdog') {
        if (WATCHDOG.has(b.slug)) return { score: 4, reason: 'ערני ומגונן על הבית' }
        if (b.aggression >= 3) return { score: 2 }
        return { score: 0 }
      }
      // active
      if (b.energy >= 4) return { score: 4, reason: 'שותף אנרגטי לפעילות' }
      if (b.energy === 3) return { score: 2 }
      return { score: 0 }
    }

    default:
      return { score: 0 }
  }
}

/**
 * מחשב את ההתאמה של כל הגזעים לפי תשובות המשתמש,
 * ומחזיר רשימה ממוינת מהמתאים ביותר לפחות.
 */
export function matchBreeds(answers: Answers): MatchResult[] {
  const answered = Object.entries(answers).filter(([, v]) => v) as [QuestionId, string][]

  // בלי תשובות אין על מה לבסס התאמה - מחזירים 0 עם הסבר, במקום אחוז מזויף.
  if (answered.length === 0) {
    return breeds.map<MatchResult>((b) => ({
      breed: b,
      score: 0,
      reasons: ['לא נענו שאלות - לא ניתן להעריך התאמה'],
    }))
  }

  const maxTotal = answered.length * MAX_PER_QUESTION || 1

  const results = breeds.map<MatchResult>((b) => {
    let raw = 0
    const reasons: string[] = []

    for (const [id, value] of answered) {
      const { score, reason } = scoreQuestion(id, value, b)
      raw += score
      if (reason && reasons.length < 3) reasons.push(reason)
    }

    // נרמול ל-0-100. הרצפה תלוית-השלמה: ככל שעונים על יותר שאלות,
    // הרצפה יורדת והדיפרנציאציה בין גזעים גדלה (1/6 → ~57, 6/6 → 38).
    // כך אין תמריץ לעצור מוקדם ולקבל אחוזים מנופחים זהים.
    const normalized = Math.round((raw / maxTotal) * 100)
    const completionRatio = answered.length / QUESTIONS.length
    const scaledFloor = Math.round(38 + (100 - 38) * (1 - completionRatio) * 0.3)
    const score = Math.max(scaledFloor, Math.min(99, normalized + 55))

    return { breed: b, score, reasons }
  })

  return results.sort((a, b) => b.score - a.score)
}

/** שלושת הגזעים המתאימים ביותר. */
export function topMatches(answers: Answers, n = 3): MatchResult[] {
  return matchBreeds(answers).slice(0, n)
}
