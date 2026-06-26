/* ════════════════════════════════════════════════════════════
   מחשבון גיל הכלב בשנות אדם - נוסחה מותאמת-גודל.
   כלבים גדולים מזדקנים מהר יותר, ולכן ההמרה תלויה בגודל הגזע.
   ההמרה מבוססת על הגישה המקובלת: שנה ראשונה ≈ 15, שנייה ≈ +9,
   ומכאן והלאה תוספת שנתית שגדלה עם גודל הכלב.
   ════════════════════════════════════════════════════════════ */

export const DOG_SIZES = ['small', 'medium', 'large', 'giant'] as const
export type DogSize = (typeof DOG_SIZES)[number]

export const SIZE_LABEL: Record<DogSize, string> = {
  small: 'קטן · עד 10 ק״ג',
  medium: 'בינוני · 10-25 ק״ג',
  large: 'גדול · 25-40 ק״ג',
  giant: 'ענק · מעל 40 ק״ג',
}

const PER_YEAR: Record<DogSize, number> = { small: 4, medium: 5, large: 6, giant: 7 }

/** ממיר גיל כלב (בשנים, יכול להיות עשרוני) לשנות אדם, לפי גודל. */
export function dogToHuman(dogYears: number, size: DogSize): number {
  if (dogYears <= 0) return 0
  if (dogYears <= 1) return Math.round(dogYears * 15)
  if (dogYears <= 2) return Math.round(15 + (dogYears - 1) * 9)
  return Math.round(24 + (dogYears - 2) * PER_YEAR[size])
}

export type LifeStage = { label: string; note: string }

/** שלב חיים לפי הגיל האנושי המשוער. */
export function lifeStage(humanYears: number): LifeStage {
  if (humanYears < 12) return { label: 'גור', note: 'שלב הגדילה והסקרנות - זה הזמן לסוציאליזציה, חיסונים ואילוף בסיסי.' }
  if (humanYears < 25) return { label: 'צעיר', note: 'מלא אנרגיה ושובבות. שמרו על פעילות יומית ועל גבולות עקביים.' }
  if (humanYears < 45) return { label: 'בוגר', note: 'שיא הכוח והיציבות. תזונה מאוזנת ובדיקה וטרינרית שנתית ישמרו עליו.' }
  if (humanYears < 65) return { label: 'בוגר מבוגר', note: 'מתחילים לראות האטה קלה. כדאי להוסיף בדיקות תקופתיות ולשים לב למשקל.' }
  return { label: 'קשיש', note: 'גיל הזהב. רכּות במפרקים, ביקורי וטרינר תכופים יותר ומיטה נוחה יעשו את ההבדל.' }
}
