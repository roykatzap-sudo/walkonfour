/* ════════════════════════════════════════════════════════════
   מודל עסקי ותמחור - נתוני דמו (source of truth לעמוד /premium).
   שלושה מסלולים: חינם / פרימיום / עסקים. אין backend אמיתי -
   כפתורי ה-CTA מציגים toast בלבד. במצב אמיתי החיוב יעבור דרך
   ספק תשלומים והנתונים יישמרו ב-Supabase.
   ════════════════════════════════════════════════════════════ */

/** מזהה מסלול - משמש לבחירת ה-CTA והעיצוב. */
export type PlanId = 'free' | 'premium' | 'business'

/** שורת תכונה בכרטיס: included=true מסומנת ב-✓, false ב--. */
export type PlanFeature = {
  label: string
  included: boolean
}

export type Plan = {
  id: PlanId
  name: string
  /** משפט תועלת קצר מתחת לשם. */
  tagline: string
  /** מחיר חודשי בשקלים. 0 = חינם. */
  price: number
  /** יחידת חיוב לתצוגה ("לחודש" / "לעסק / חודש"). */
  unit: string
  /** הערת מחיר משנית (למשל חיוב שנתי / ניסיון). */
  priceNote?: string
  /** למי המסלול מיועד. */
  audience: string
  features: PlanFeature[]
  /** טקסט הכפתור. */
  cta: string
  /** הודעת ה-toast בלחיצה. */
  toast: string
  /** מסלול מודגש (popular) - מקבל מסגרת accent ותג. */
  featured?: boolean
  /** תווית פינה (למשל "הכי פופולרי"). */
  badge?: string
}

/** שלושת המסלולים - לפי סדר התצוגה (חינם → פרימיום → עסקים). */
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'חינם',
    tagline: 'להיכנס, להכיר אנשים, ולא לשלם שקל',
    price: 0,
    unit: 'תמיד',
    audience: 'לכל בעל כלב שרוצה להיות חלק מהקהילה',
    features: [
      { label: 'פרופיל כלב אישי ותג חבר קהילה', included: true },
      { label: 'גישה מלאה לפורום ולקבוצות הערים', included: true },
      { label: 'כלי הגזעים, מחולל השמות והמחשבונים', included: true },
      { label: 'מפת גינות כלבים ולוח אירועים', included: true },
      { label: 'ספריית העסקים והדירוגים', included: true },
      { label: 'הנחות בלעדיות בקבוצות רכישה', included: false },
      { label: 'ייעוץ וטרינרי מקוון מועדף', included: false },
      { label: 'פרופיל עסק מקודם בספרייה', included: false },
    ],
    cta: 'התחילו בחינם',
    toast: 'מצוין! הצטרפתם לכלבניה בחינם - בואו נבנה לכלב פרופיל 🐾',
  },
  {
    id: 'premium',
    name: 'פרימיום',
    tagline: 'חוסכים יותר ממה שמשלמים - בכל חודש',
    price: 19,
    unit: 'לחודש',
    priceNote: 'מחיר השקה מוקדם · ₪19 לחודש, ביטול בכל עת.',
    audience: 'לבעלים פעילים שרוצים לחסוך בהוצאות הכלב',
    features: [
      { label: 'כל מה שכלול במסלול החינם', included: true },
      { label: 'הנחות בלעדיות בקבוצות רכישה (מזון, ציוד)', included: true },
      { label: 'מחירי חבר אצל ספקים ובתי עסק מובחרים', included: true },
      { label: 'ייעוץ וטרינרי מקוון מועדף בתור מהיר', included: true },
      { label: 'תזכורות חיסונים וטיפולים אוטומטיות', included: true },
      { label: 'גישה מוקדמת לאתגרים ולאירועים', included: true },
      { label: 'תג פרימיום בפרופיל ובלוח המובילים', included: true },
      { label: 'פרופיל עסק מקודם בספרייה', included: false },
    ],
    cta: 'שדרגו לפרימיום',
    toast: 'תודה! מסלול הפרימיום ייפתח לחשבונכם - נעדכן במייל ברגע שיהיה מוכן 🐾',
    featured: true,
    badge: 'הכי פופולרי',
  },
  {
    id: 'business',
    name: 'עסקים',
    tagline: 'הגיעו לאלפי בעלי כלבים שמחפשים בדיוק אתכם',
    price: 149,
    unit: 'לעסק / חודש',
    priceNote: 'כולל פרופיל מאומת. ללא התחייבות לטווח ארוך.',
    audience: 'לווטרינרים, מספרות, מאלפים, פנסיונים וחנויות',
    features: [
      { label: 'פרופיל עסק מאומת בספריית העסקים', included: true },
      { label: 'קידום לראש התוצאות בקטגוריה ובעיר', included: true },
      { label: 'תג "עסק מאומת" וגלריית תמונות מורחבת', included: true },
      { label: 'איסוף וניהול דירוגים וביקורות', included: true },
      { label: 'הצעות ומבצעים לחברי הקהילה', included: true },
      { label: 'חשיפה בקבוצות הערים הרלוונטיות', included: true },
      { label: 'דוח חשיפה חודשי ופניות מהאתר', included: true },
      { label: 'ליווי אישי מצוות כלבניה', included: true },
    ],
    cta: 'הצטרפו כעסק',
    toast: 'תודה! צוות כלבניה יחזור אליכם עם פרטי ההצטרפות לספרייה 🐾',
  },
]

/** שורה בטבלת ההשוואה - ערך לכל מסלול. */
export type CompareRow = {
  feature: string
  free: boolean | string
  premium: boolean | string
  business: boolean | string
}

/** טבלת ההשוואה המלאה בין שלושת המסלולים. */
export const COMPARE_ROWS: CompareRow[] = [
  { feature: 'פרופיל כלב וחברות בקהילה', free: true, premium: true, business: true },
  { feature: 'פורום, קבוצות וכלים חינמיים', free: true, premium: true, business: true },
  { feature: 'מפת גינות ולוח אירועים', free: true, premium: true, business: true },
  { feature: 'הנחות בקבוצות רכישה', free: false, premium: true, business: true },
  { feature: 'מחירי חבר אצל ספקים', free: false, premium: true, business: true },
  { feature: 'ייעוץ וטרינרי מועדף', free: false, premium: true, business: false },
  { feature: 'תזכורות חיסונים אוטומטיות', free: false, premium: true, business: false },
  { feature: 'פרופיל עסק בספרייה', free: false, premium: false, business: true },
  { feature: 'קידום בתוצאות החיפוש', free: false, premium: false, business: true },
  { feature: 'דוח חשיפה ופניות חודשי', free: false, premium: false, business: true },
  { feature: 'מחיר חודשי', free: 'חינם', premium: '19 ש"ח', business: '149 ש"ח' },
]

/** דרך הכנסה שקופה - לסקשן "איך כלבניה מתפרנסת". */
export type RevenueStream = {
  icon: string
  title: string
  body: string
}

/** מנועי ההכנסה של כלבניה - שקיפות מלאה. */
export const REVENUE_STREAMS: RevenueStream[] = [
  {
    icon: '🛒',
    title: 'קבוצות רכישה',
    body:
      'כשמאה בעלי כלבים קונים שק מזון יחד, היבואן נותן מחיר סיטונאי. את רובו אנחנו מעבירים אליכם, ולוקחים מרווח קטן והוגן שנשאר אצלנו. אתם משלמים פחות, אנחנו מחזיקים את האתר. כולם מרוויחים.',
  },
  {
    icon: '🤝',
    title: 'שותפויות עם ספקים',
    body:
      'מותגים ושירותים איכותיים משלמים לנו עמלת הפניה כשחבר קהילה בוחר בהם. אנחנו ממליצים רק על מה שהיינו נותנים לכלב שלנו - ההמלצות לעולם לא נקנות, רק נבדקות.',
  },
  {
    icon: '🏷️',
    title: 'ספריית העסקים',
    body:
      'וטרינרים, מספרות, מאלפים ופנסיונים משלמים על נוכחות מקודמת ותג מאומת בספרייה. כך עסק טוב מגיע אליכם, ואתם מקבלים אינדקס מסונן ואמין במקום חיפוש עיוור.',
  },
  {
    icon: '⭐',
    title: 'מסלול הפרימיום',
    body:
      'דמי החבר החודשיים מממנים את הצוות, את השרתים ואת הפיתוח - בלי פרסומות שמרדפות אתכם ובלי מכירת נתונים. המנוי הוא מה שמחזיק את כלבניה עצמאית ונאמנה רק לכם.',
  },
]

/** שלוש הבטחות אמון לתחתית סקשן ההכנסה. */
export const TRUST_NOTES: string[] = [
  'לעולם לא נמכור את הנתונים שלכם לאף גורם.',
  'המסלול החינמי נשאר חינמי - לא נחסום מאחוריו את הקהילה.',
  'המלצות מסומנות בבירור כשהן ממומנות, ותמיד נבדקות לפני שהן עולות.',
]

/** בונה כתובת תמונת Unsplash תקנית (auto-format, q=55). */
export const premiumImg = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`
