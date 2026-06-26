/**
 * קיר הכלבים - שכבת נתונים (דמו).
 *
 * אין backend אמיתי: פיד התמונות הקהילתי נשמר כאן כדאטה סטטי. כל רשומה
 * מתארת כלב אחד שצולם ע"י בעליו, עם שם, גזע, עיר, כיתוב קצר ומונה לבבות
 * התחלתי. העמוד טוען את הרשימה, מוסיף לוגיקת "אהבתי" ב-state מקומי, ומציג
 * toast בכל פעולה (כי אין שרת שישמור לבבות או יקבל העלאות).
 *
 * הגזעים והערים נכתבים בעברית טבעית. מזהי התמונות הם תמונות unsplash
 * אמיתיות של כלבים, והכתובת נבנית דרך `wallImg` עם q=55 ו-lazy-friendly,
 * בדיוק כמו שאר חלקי האתר.
 */

/** רשומת תמונה בקיר. `id` יציב ומשמש כ-key וב-toasts. */
export type WallPhoto = {
  id: string
  /** שם הכלב. */
  dog: string
  /** גזע הכלב בעברית. */
  breed: string
  /** שם הבעלים שהעלה את התמונה. */
  owner: string
  /** עיר. */
  city: string
  /** כיתוב קצר וחמים שמלווה את התמונה. */
  caption: string
  /** מזהה תמונת unsplash (כולל הקידומת photo-). */
  photo: string
  /** מונה הלבבות ההתחלתי (לפני אינטראקציה של המשתמש). */
  hearts: number
  /**
   * יחס הגובה-רוחב של התמונה, לאפקט masonry טבעי.
   * 'tall' = פורטרט, 'wide' = לרוחב, 'square' = ריבועי.
   */
  shape: 'tall' | 'wide' | 'square'
}

/**
 * 14 תמונות דמו לקיר. מונה הלבבות יורד בהדרגה אך לא לינארי, כדי שייראה
 * אורגני. הצורות מעורבבות כדי שהגריד ייראה כמו masonry אמיתי ולא טור אחיד.
 */
export const wallPhotos: WallPhoto[] = [
  {
    id: 'w1',
    dog: 'מוקה',
    breed: 'לברדור',
    owner: 'נועה',
    city: 'תל אביב',
    caption: 'בוקר ראשון על הדשא - מאז הוא לא מסכים לחזור הביתה.',
    photo: 'photo-1543071220-6ee5bf71a54e',
    hearts: 312,
    shape: 'tall',
  },
  {
    id: 'w2',
    dog: 'באדי',
    breed: 'גולדן רטריבר',
    owner: 'דני',
    city: 'חיפה',
    caption: 'חזר מהים מלא חול ומלא אושר.',
    photo: 'photo-1552053831-71594a27632d',
    hearts: 287,
    shape: 'wide',
  },
  {
    id: 'w3',
    dog: 'לונה',
    breed: 'האסקי סיביר',
    owner: 'שירה',
    city: 'ירושלים',
    caption: 'העיניים הכחולות האלה מקבלות כל מה שהיא רוצה.',
    photo: 'photo-1518717758536-85ae29035b6d',
    hearts: 401,
    shape: 'tall',
  },
  {
    id: 'w4',
    dog: 'רקס',
    breed: 'בורדר קולי',
    owner: 'יואב',
    city: 'באר שבע',
    caption: 'מחכה לכדור כאילו אין מחר.',
    photo: 'photo-1503256207526-0d5d80fa2f47',
    hearts: 198,
    shape: 'square',
  },
  {
    id: 'w5',
    dog: 'דייזי',
    breed: 'פומרניאן',
    owner: 'תמר',
    city: 'נתניה',
    caption: 'כדור פרווה קטן עם אופי של אריה.',
    photo: 'photo-1564631027894-5bdb17618445',
    hearts: 356,
    shape: 'tall',
  },
  {
    id: 'w6',
    dog: 'שוקו',
    breed: 'דאקל',
    owner: 'עמית',
    city: 'פתח תקווה',
    caption: 'רגליים קצרות, לב ענק.',
    photo: 'photo-1612774412771-005ed8e861d2',
    hearts: 274,
    shape: 'wide',
  },
  {
    id: 'w7',
    dog: 'נאלה',
    breed: 'קורגי',
    owner: 'הדס',
    city: 'רמת גן',
    caption: 'הטוסיק הכי מפורסם בשכונה.',
    photo: 'photo-1612774412771-005ed8e861d2',
    hearts: 333,
    shape: 'square',
  },
  {
    id: 'w8',
    dog: "ג'ינג'ר",
    breed: 'שיבא אינו',
    owner: 'אורי',
    city: 'הרצליה',
    caption: 'החיוך הזה מתחיל לי כל בוקר.',
    photo: 'photo-1568572933382-74d440642117',
    hearts: 421,
    shape: 'tall',
  },
  {
    id: 'w9',
    dog: 'בלה',
    breed: 'ביגל',
    owner: 'ליאת',
    city: 'אשדוד',
    caption: 'האף הזה הוביל אותנו לחצי קילו נקניק.',
    photo: 'photo-1505628346881-b72b27e84530',
    hearts: 245,
    shape: 'wide',
  },
  {
    id: 'w10',
    dog: 'מקס',
    breed: 'לברדור',
    owner: 'רון',
    city: 'כפר סבא',
    caption: 'נרדם באמצע המשחק. שוב.',
    photo: 'photo-1591946614720-90a587da4a36',
    hearts: 367,
    shape: 'square',
  },
  {
    id: 'w11',
    dog: 'קוקו',
    breed: 'פרנץ׳ בולדוג',
    owner: 'דנה',
    city: 'חולון',
    caption: 'האוזניים האלה שומעות פותחן של פחית מקילומטר.',
    photo: 'photo-1583511655857-d19b40a7a54e',
    hearts: 389,
    shape: 'tall',
  },
  {
    id: 'w12',
    dog: 'אריאל',
    breed: 'אוסטרלי שפרד',
    owner: 'מאיה',
    city: 'מודיעין',
    caption: 'ריצה ראשונה בשדה - והוא מצא את הגן עדן שלו.',
    photo: 'photo-1518715308788-300e1e1bb3a8',
    hearts: 218,
    shape: 'wide',
  },
  {
    id: 'w13',
    dog: 'פפר',
    breed: 'כלבת רחוב מעורבת',
    owner: 'שני',
    city: 'גבעתיים',
    caption: 'אומצה מהרחוב, היום מלכת הבית.',
    photo: 'photo-1589941013453-ec89f33b5e95',
    hearts: 512,
    shape: 'square',
  },
  {
    id: 'w14',
    dog: 'אלסקה',
    breed: 'מלמוט',
    owner: 'טל',
    city: 'אילת',
    caption: 'גדולה כמו דוב, עדינה כמו נוצה.',
    photo: 'photo-1605897472359-85e4b94d685d',
    hearts: 298,
    shape: 'tall',
  },
]

/**
 * מזהה כלב השבוע - הרשומה שמקבלת תג מיוחד בראש הקיר.
 * נבחר ידנית (דמו): פפר, סיפור האימוץ מהרחוב, עם הכי הרבה לבבות.
 */
export const DOG_OF_THE_WEEK_ID = 'w13'

/** האם רשומה נתונה היא כלב השבוע. */
export function isDogOfTheWeek(p: WallPhoto): boolean {
  return p.id === DOG_OF_THE_WEEK_ID
}

/** בונה כתובת תמונת unsplash אחידה (q=55, lazy ידידותי) - זהה לשאר האתר. */
export function wallImg(id: string, w: number): string {
  return `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`
}

/** סך הלבבות ההתחלתי בקיר - להצגת מספר קהילתי בכותרת. */
export function totalHearts(): number {
  return wallPhotos.reduce((sum, p) => sum + p.hearts, 0)
}
