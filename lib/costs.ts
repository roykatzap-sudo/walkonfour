/**
 * מחשבון עלות גידול כלב - נתוני עלות משוערים לשוק הישראלי (₪ לחודש).
 *
 * כל המספרים הם הערכה כללית בלבד, לא הבטחה. העלות בפועל תלויה בגזע,
 * בריאות הכלב, אזור מגורים ובחירות אישיות. המקדמים נבנו לפי טווחי מחירים
 * נפוצים בחנויות ובשירותים בישראל (2026).
 */

export type SizeId = 'small' | 'medium' | 'large' | 'giant'
export type FoodId = 'economy' | 'standard' | 'premium'
export type VetId = 'basic' | 'checkups' | 'insurance'
export type GroomId = 'home' | 'occasional' | 'regular'
export type GearId = 'minimal' | 'standard' | 'plus'

export type OptionId = string

export interface Option<T extends OptionId> {
  id: T
  /** תווית קצרה לכפתור */
  label: string
  /** הסבר משלים שמופיע מתחת לתווית */
  hint: string
}

export interface CostGroup<T extends OptionId> {
  /** מזהה הקטגוריה */
  key: 'size' | 'food' | 'vet' | 'groom' | 'gear'
  /** כותרת הקטגוריה */
  title: string
  /** שורת עזרה מתחת לכותרת */
  sub: string
  options: Option<T>[]
}

/** גודל הכלב - מקדם שמכפיל בעיקר את עלות המזון. */
export const SIZES: CostGroup<SizeId> = {
  key: 'size',
  title: 'גודל הכלב',
  sub: 'הגודל משפיע בעיקר על כמות המזון ועל מחיר חלק מהשירותים.',
  options: [
    { id: 'small', label: 'קטן', hint: 'עד 10 ק״ג · צ׳יוואווה, שיצו, פומרניאן' },
    { id: 'medium', label: 'בינוני', hint: '10-25 ק״ג · בורדר קולי, קוקר, כלבי תערובת' },
    { id: 'large', label: 'גדול', hint: '25-40 ק״ג · לברדור, גולדן, רועה גרמני' },
    { id: 'giant', label: 'ענק', hint: 'מעל 40 ק״ג · סנט ברנרד, גרייט דיין, מאסטיף' },
  ],
}

/** מקדם גודל למזון ולשירותים מסוימים. */
const SIZE_FACTOR: Record<SizeId, number> = {
  small: 0.7,
  medium: 1,
  large: 1.4,
  giant: 1.9,
}

/** מזון - עלות בסיס חודשית לכלב בינוני, מוכפלת במקדם הגודל. */
export const FOODS: CostGroup<FoodId> = {
  key: 'food',
  title: 'סוג המזון',
  sub: 'המזון הוא בדרך כלל ההוצאה החודשית הגדולה ביותר.',
  options: [
    { id: 'economy', label: 'מזון בסיסי', hint: 'מותגי סופר נפוצים' },
    { id: 'standard', label: 'מזון איכותי', hint: 'מותגי חנות חיות מובילים' },
    { id: 'premium', label: 'פרימיום / טבעי', hint: 'ללא דגנים, מזון רטוב או טרי' },
  ],
}

/** עלות מזון חודשית בסיס (₪) לכלב בינוני, לפני מקדם גודל. */
const FOOD_BASE: Record<FoodId, number> = {
  economy: 170,
  standard: 300,
  premium: 520,
}

/** וטרינר / ביטוח - הוצאה חודשית ממוצעת (פריסה שנתית). */
export const VET: CostGroup<VetId> = {
  key: 'vet',
  title: 'וטרינר וביטוח',
  sub: 'חיסונים, בדיקות שגרה והיערכות להוצאות בריאות בלתי צפויות.',
  options: [
    { id: 'basic', label: 'חיסונים בלבד', hint: 'חיסון שנתי וטיפול מונע בסיסי' },
    { id: 'checkups', label: 'בדיקות שגרה', hint: 'ביקורת תקופתית ובדיקות דם' },
    { id: 'insurance', label: 'ביטוח בריאות', hint: 'פוליסה חודשית לכיסוי טיפולים' },
  ],
}

/** עלות וטרינר/ביטוח חודשית בסיס (₪), מושפעת חלקית מהגודל. */
const VET_BASE: Record<VetId, number> = {
  basic: 70,
  checkups: 140,
  insurance: 230,
}

/** טיפוח - תספורת, רחצה, גזיזת ציפורניים. */
export const GROOM: CostGroup<GroomId> = {
  key: 'groom',
  title: 'טיפוח',
  sub: 'גזעים עם פרווה ארוכה זקוקים לטיפוח תכוף יותר.',
  options: [
    { id: 'home', label: 'בבית בלבד', hint: 'רחצה וסירוק עצמאיים' },
    { id: 'occasional', label: 'מדי פעם', hint: 'תספורת אצל מטפח כל כמה חודשים' },
    { id: 'regular', label: 'קבוע', hint: 'מספרה לכלבים אחת לחודש' },
  ],
}

/** עלות טיפוח חודשית בסיס (₪), מושפעת מהגודל. */
const GROOM_BASE: Record<GroomId, number> = {
  home: 25,
  occasional: 90,
  regular: 180,
}

/** אבזור - רצועות, צעצועים, מצעים, חטיפים ומתכלים. */
export const GEAR: CostGroup<GearId> = {
  key: 'gear',
  title: 'אבזור ומתכלים',
  sub: 'צעצועים, חטיפים, שקיות, מצעים ואביזרים מתחלפים.',
  options: [
    { id: 'minimal', label: 'בסיסי', hint: 'הכרחי בלבד' },
    { id: 'standard', label: 'רגיל', hint: 'צעצועים וחטיפים מדי פעם' },
    { id: 'plus', label: 'מפנק', hint: 'אביזרים, חטיפים ופינוקים בקביעות' },
  ],
}

/** עלות אבזור חודשית בסיס (₪), מושפעת חלקית מהגודל. */
const GEAR_BASE: Record<GearId, number> = {
  minimal: 40,
  standard: 90,
  plus: 170,
}

export interface CalcInput {
  size: SizeId
  food: FoodId
  vet: VetId
  groom: GroomId
  gear: GearId
}

export interface CostLine {
  key: string
  label: string
  monthly: number
}

export interface CostResult {
  lines: CostLine[]
  monthly: number
  yearly: number
}

/** ברירת המחדל למחשבון - כלב בינוני, בחירות אמצע סבירות. */
export const DEFAULT_INPUT: CalcInput = {
  size: 'medium',
  food: 'standard',
  vet: 'checkups',
  groom: 'occasional',
  gear: 'standard',
}

/** עיגול לעשירייה הקרובה - מספרים נקיים ומשוערים. */
function round10(n: number): number {
  return Math.round(n / 10) * 10
}

/**
 * מחשב פירוק עלויות חודשי ושנתי לפי הבחירות.
 * המזון מושפע במלואו מהגודל; וטרינר ואבזור מושפעים חלקית; טיפוח כמעט במלואו.
 */
export function calcCosts(input: CalcInput): CostResult {
  const sf = SIZE_FACTOR[input.size]
  // השפעת גודל חלקית: 1 בבסיס, מתקרב ל-sf לפי המשקל
  const partial = (weight: number) => 1 + (sf - 1) * weight

  const food = round10(FOOD_BASE[input.food] * sf)
  const vet = round10(VET_BASE[input.vet] * partial(0.4))
  const groom = round10(GROOM_BASE[input.groom] * partial(0.7))
  const gear = round10(GEAR_BASE[input.gear] * partial(0.3))

  const lines: CostLine[] = [
    { key: 'food', label: 'מזון', monthly: food },
    { key: 'vet', label: 'וטרינר וביטוח', monthly: vet },
    { key: 'groom', label: 'טיפוח', monthly: groom },
    { key: 'gear', label: 'אבזור ומתכלים', monthly: gear },
  ]

  const monthly = lines.reduce((s, l) => s + l.monthly, 0)
  const yearly = monthly * 12

  return { lines, monthly, yearly }
}

/**
 * ציוד ראשוני חד-פעמי לכלב בינוני: כלוב, מיטה, קערות, רצועה, רתמה.
 * מושפע חלקית מהגודל (ציוד גדול יותר עולה יותר).
 */
const ONE_TIME_GEAR_BASE = 1050

/**
 * עלות וטרינרית מוגברת של השנה הראשונה לכלב בינוני.
 * הגור עובר *סדרת חיסונים* שלמה לבניית המערכת החיסונית: 3-4 מנות חיסון
 * משולב, חיסון כלבת, וכמה תילועים - הרבה מעבר לדחף השנתי הבודד של כלב בוגר.
 * בנוסף: שבב אלקטרוני ועיקור/סירוס. מושפע מהגודל (מנות ועיקור יקרים יותר).
 */
const FIRST_YEAR_VET_BASE = 1650

export interface ProjectionYear {
  year: number
  /** הוצאה שנתית (שנה 1 כוללת את העלויות החד-פעמיות). */
  annual: number
  /** הוצאה מצטברת עד וכולל השנה הזו. */
  cumulative: number
}

export interface Projection {
  /** סך כל העלויות החד-פעמיות של השנה הראשונה (ציוד + וטרינר גור). */
  oneTime: number
  /** ציוד ראשוני חד-פעמי. */
  oneTimeGear: number
  /** תוספת וטרינרית של שנה ראשונה (סדרת חיסוני גור, שבב, עיקור/סירוס). */
  firstYearVet: number
  monthly: number
  /** הוצאה שוטפת לשנה (בלי החד-פעמי). */
  yearly: number
  years: number
  /** סך הכל לכל התקופה. */
  total: number
  perYear: ProjectionYear[]
}

/**
 * משליך את העלות לאורך מספר שנים נתון.
 * שנה 1 גבוהה יותר: היא כוללת ציוד ראשוני ותוספת וטרינרית של גור
 * (סדרת חיסונים מלאה לבניית החיסון, שבב ועיקור/סירוס).
 */
export function projectCosts(input: CalcInput, years: number): Projection {
  const yrs = Math.max(1, Math.min(20, Math.round(years)))
  const { monthly, yearly } = calcCosts(input)
  const sf = SIZE_FACTOR[input.size]

  const oneTimeGear = round10(ONE_TIME_GEAR_BASE * (1 + (sf - 1) * 0.35))
  const firstYearVet = round10(FIRST_YEAR_VET_BASE * (1 + (sf - 1) * 0.5))
  const oneTime = oneTimeGear + firstYearVet

  const perYear: ProjectionYear[] = []
  let cumulative = 0
  for (let y = 1; y <= yrs; y++) {
    const annual = yearly + (y === 1 ? oneTime : 0)
    cumulative += annual
    perYear.push({ year: y, annual, cumulative })
  }

  return { oneTime, oneTimeGear, firstYearVet, monthly, yearly, years: yrs, total: oneTime + yearly * yrs, perYear }
}

/** עיצוב מספר כשקלים עם מפריד אלפים עברי. */
export function shekel(n: number): string {
  return '₪' + Math.round(n).toLocaleString('he-IL')
}
