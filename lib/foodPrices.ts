/* ════════════════════════════════════════════════════════════
   מחירון מזון כלבים - מחירים מקורבים שנאספו ממקורות ישראליים
   (זאפ, All4pet, חנויות חיות) ביוני 2026. מחירים משתנים בין
   חנויות ובזמן - לכל מוצר יש לינק ל"השוואה חיה" בזאפ לאימות.
   *** לא להציג מחיר בלי לעדכן את FOOD_PRICES_UPDATED. ***
   ════════════════════════════════════════════════════════════ */

export type FoodTier = 'תקציבי' | 'פרימיום' | 'סופר פרימיום'

export type FoodPrice = {
  brand: string
  product: string
  tier: FoodTier
  weightKg: number
  low: number // מחיר נמוך שנצפה (₪)
  high: number // מחיר גבוה שנצפה (₪)
  zap: string // קישור להשוואה חיה בזאפ
}

export const FOOD_PRICES_UPDATED = 'יוני 2026'

export const foodPrices: FoodPrice[] = [
  {
    brand: 'רויאל קנין',
    product: 'Medium Adult (גזע בינוני, בוגר)',
    tier: 'פרימיום',
    weightKg: 15,
    low: 319,
    high: 349,
    zap: 'https://www.zap.co.il/model.aspx?modelid=720124',
  },
  {
    brand: 'הילס',
    product: 'Science Plan Adult',
    tier: 'פרימיום',
    weightKg: 12,
    low: 329,
    high: 389,
    zap: 'https://www.zap.co.il/models.aspx?sog=an-dogfood&db663261=3205624&db9051672=9063579',
  },
  {
    brand: 'אקאנה',
    product: 'Heritage / Pacifica (נטול דגנים)',
    tier: 'סופר פרימיום',
    weightKg: 11.4,
    low: 309,
    high: 419,
    zap: 'https://www.zap.co.il/models.aspx?sog=an-dogfood&db663261=663264&db9051672=9063575',
  },
  {
    brand: 'פרו פלאן',
    product: 'Adult (בוגר)',
    tier: 'פרימיום',
    weightKg: 14,
    low: 270,
    high: 339,
    zap: 'https://www.zap.co.il/models.aspx?sog=an-dogfood',
  },
  {
    brand: 'בונזו',
    product: 'מזון יומיומי (עוף ודגנים)',
    tier: 'תקציבי',
    weightKg: 15,
    low: 95,
    high: 140,
    zap: 'https://www.zap.co.il/models.aspx?sog=an-dogfood&db663261=663268&db9051672=9063594',
  },
]

/** מקורות שנבדקו, לשקיפות. */
export const FOOD_SOURCES: { label: string; url: string }[] = [
  { label: 'זאפ - השוואת מחירי מזון כלבים', url: 'https://www.zap.co.il/models.aspx?sog=an-dogfood' },
  { label: 'All4pet', url: 'https://www.all4pet.co.il' },
]
