/* ════════════════════════════════════════════════════════════
   מחשבון מנת מזון יומית לכלב.
   מבוסס על הנוסחה הווטרינרית המקובלת:
     RER (אנרגיה במנוחה) = 70 × (משקל בק״ג)^0.75
     MER (אנרגיה יומית)  = RER × מקדם לפי שלב חיים / מטרה
   כמות במ״ג מחושבת מצפיפות האנרגיה של המזון (קק״ל ל-100 גרם).
   הערכה כללית בלבד - תמיד להתאים מול הווטרינר ולפי הוראות היצרן.
   ════════════════════════════════════════════════════════════ */

export type FeedMode = {
  id: string
  label: string
  factor: number
  note: string
}

/** מצבי האכלה - כל אחד עם מקדם MER. */
export const FEED_MODES: FeedMode[] = [
  { id: 'puppy', label: 'גור (4-12 חודשים)', factor: 2.0, note: 'גורים זקוקים לאנרגיה גבוהה לגדילה - חלקו ל-3 ארוחות ביום.' },
  { id: 'adult', label: 'בוגר מסורס/מעוקרת', factor: 1.6, note: 'המצב הנפוץ ביותר. כלב מסורס שורף פחות, אז קל לו לעלות במשקל.' },
  { id: 'intact', label: 'בוגר לא מסורס', factor: 1.8, note: 'מטבוליזם מעט גבוה יותר מכלב מסורס באותו משקל.' },
  { id: 'active', label: 'פעיל מאוד / ספורטיבי', factor: 2.2, note: 'כלב עבודה או ספורט. שימו לב גם לאיכות המזון ולשתייה.' },
  { id: 'senior', label: 'קשיש', factor: 1.4, note: 'בגיל מבוגר המטבוליזם יורד. כדאי לעקוב אחר המשקל ולהתאים.' },
  { id: 'diet', label: 'ירידה במשקל', factor: 1.2, note: 'חישוב לפי המשקל הנוכחי. לדיאטה אמיתית - בנו תוכנית עם הווטרינר.' },
]

export type FoodResult = {
  rer: number
  dailyKcal: number
  gramsPerDay: number
  meals: number
  gramsPerMeal: number
}

/** מחשב מנה יומית. weightKg = משקל, factor = מקדם MER, kcalPer100g = צפיפות אנרגיה. */
export function calcFood(weightKg: number, factor: number, kcalPer100g: number, meals: number): FoodResult {
  const safeW = Math.max(0.5, weightKg)
  const rer = 70 * Math.pow(safeW, 0.75)
  const dailyKcal = rer * factor
  const density = Math.max(200, kcalPer100g) / 100 // קק״ל לגרם
  const gramsPerDay = dailyKcal / density
  const m = Math.max(1, meals)
  return {
    rer: Math.round(rer),
    dailyKcal: Math.round(dailyKcal),
    gramsPerDay: Math.round(gramsPerDay),
    meals: m,
    gramsPerMeal: Math.round(gramsPerDay / m),
  }
}
