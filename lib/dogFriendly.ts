/* ════════════════════════════════════════════════════════════
   מקומות דוג-פרנדלי בישראל - דירקטוריון.
   מבוסס על מקורות פומביים (חופי כלבים מוסדרים ורשימות דוג-פרנדלי
   של Rest, Timeout, פורינה, dogsbubble ואתרי הרשתות).
   מדיניות עשויה להשתנות - מומלץ לאמת טלפונית לפני הגעה.
   הרשימה תתרחב עם הקהילה.
   ════════════════════════════════════════════════════════════ */

export type DFCategory = 'חוף' | 'מסעדה' | 'בית קפה' | 'גלידרייה' | 'קניון' | 'חנות' | 'לינה'

export type DFPlace = {
  id: string
  name: string
  category: DFCategory
  city: string
  region: string
  note: string
}

/** הקטגוריות + אייקון + צבע למקרא (גוונים רכים, ללא ירוק). */
export const DF_CATEGORIES: { key: DFCategory; icon: string; bg: string; fg: string }[] = [
  { key: 'חוף', icon: '🏖️', bg: '#d6e8ef', fg: '#2c5a6b' },
  { key: 'מסעדה', icon: '🍽️', bg: '#f0d9c0', fg: '#8a5a2b' },
  { key: 'בית קפה', icon: '☕', bg: '#e6d2b8', fg: '#7a5328' },
  { key: 'גלידרייה', icon: '🍦', bg: '#f3d6e0', fg: '#9a3a5a' },
  { key: 'קניון', icon: '🛍️', bg: '#ddd6e8', fg: '#564a78' },
  { key: 'חנות', icon: '🏬', bg: '#e8c887', fg: '#7a5320' },
  { key: 'לינה', icon: '🏨', bg: '#e9ddc4', fg: '#6b5524' },
]

export const REGIONS = ['ארצי', 'מרכז', 'שרון', 'ירושלים', 'צפון', 'דרום'] as const

export const dogFriendlyPlaces: DFPlace[] = [
  // ── חופי כלבים מוסדרים ──
  { id: 'charles-clore', name: 'חוף צ׳ארלס קלור', category: 'חוף', city: 'תל אביב-יפו', region: 'מרכז', note: 'מחופי הכלבים המוכרים, רצועה ארוכה בדרום העיר.' },
  { id: 'hilton-dog', name: 'חוף הילטון (קטע צפוני)', category: 'חוף', city: 'תל אביב-יפו', region: 'מרכז', note: 'הקטע הצפוני מיועד לכלבים.' },
  { id: 'tel-baruch-dog', name: 'חוף תל ברוך', category: 'חוף', city: 'תל אביב-יפו', region: 'מרכז', note: 'חוף כלבים פופולרי בצפון העיר.' },
  { id: 'gaash-dog', name: 'חוף געש', category: 'חוף', city: 'חוף השרון', region: 'שרון', note: 'חוף מוסדר שמתאים לכלבים.' },
  { id: 'herzliya-dog', name: 'חוף הכלבים הרצליה (נוף ים)', category: 'חוף', city: 'הרצליה', region: 'שרון', note: 'גישה ישירה למים ומרחב לריצה.' },
  { id: 'apollonia-dog', name: 'חוף אפולוניה', category: 'חוף', city: 'הרצליה', region: 'שרון', note: 'חוף פתוח שמתאים לכלבים.' },
  { id: 'haifa-dog', name: 'חוף הכלבים בת גלים', category: 'חוף', city: 'חיפה', region: 'צפון', note: 'חוף כלבים מוסדר (נפתח 2020).' },
  { id: 'beit-yanai-dog', name: 'חוף בית ינאי', category: 'חוף', city: 'בית ינאי', region: 'שרון', note: 'חוף פתוח שמתאים לכלבים.' },
  { id: 'dor-dog', name: 'חוף דור הבונים', category: 'חוף', city: 'דור', region: 'צפון', note: 'חוף טבעי שמתאים לכלבים.' },
  { id: 'palmachim-dog', name: 'חוף פלמחים', category: 'חוף', city: 'פלמחים', region: 'מרכז', note: 'חוף פתוח שמתאים לכלבים.' },
  { id: 'tayo-dog', name: 'חוף טייו', category: 'חוף', city: 'בין ראשל״צ לבת ים', region: 'מרכז', note: 'אזור חוף שמתאים לכלבים.' },
  { id: 'batyam-dog', name: 'חוף כלבים בת ים', category: 'חוף', city: 'בת ים', region: 'מרכז', note: 'אזור מוסדר לכניסת כלבים.' },
  { id: 'ashdod-dog', name: 'חוף כלבים אשדוד', category: 'חוף', city: 'אשדוד', region: 'דרום', note: 'חוף מוסדר לכלבים.' },

  // ── מסעדות ──
  { id: 'bocca', name: 'קבוצת בוקה', category: 'מסעדה', city: 'תל אביב-יפו', region: 'מרכז', note: 'רשת מסעדות ובתי קפה שמותגת דוג-פרנדלי.' },
  { id: 'wine-garden', name: 'ווין גארדן', category: 'מסעדה', city: 'תל אביב-יפו', region: 'מרכז', note: 'מסעדה ים-תיכונית שמקבלת כלבים.' },
  { id: 'playground', name: 'פלייגראונד', category: 'מסעדה', city: 'תל אביב-יפו', region: 'מרכז', note: 'מסעדה דוג-פרנדלי.' },
  { id: 'gusto', name: 'גוסטו', category: 'מסעדה', city: 'תל אביב-יפו', region: 'מרכז', note: 'מסעדה איטלקית שמקבלת כלבים.' },
  { id: 'baba-yaga', name: 'באבא יאגה', category: 'מסעדה', city: 'תל אביב-יפו', region: 'מרכז', note: 'מסעדה ים-תיכונית דוג-פרנדלי.' },
  { id: 'bulls', name: 'בולס', category: 'מסעדה', city: 'קריית חיים, חיפה', region: 'צפון', note: 'מסעדת בשרים שמקבלת כלבים.' },
  { id: 'arabesque', name: 'ארבסק', category: 'מסעדה', city: 'כפר יאסיף', region: 'צפון', note: 'מסעדת בשרים דוג-פרנדלי.' },
  { id: 'azba', name: 'עזבה', category: 'מסעדה', city: 'ראמה', region: 'צפון', note: 'מסעדה ערבית שמקבלת כלבים.' },
  { id: 'salwa', name: 'הבית של סלווה', category: 'מסעדה', city: 'עין נקובא', region: 'ירושלים', note: 'מסעדה ביתית דוג-פרנדלי.' },
  { id: 'aresto', name: 'ארסטו', category: 'מסעדה', city: 'קיסריה', region: 'שרון', note: 'מסעדה איטלקית שמקבלת כלבים.' },
  { id: 'umino', name: 'אומינו סושי', category: 'מסעדה', city: 'ראשון לציון', region: 'מרכז', note: 'מסעדה אסייתית דוג-פרנדלי.' },
  { id: 'pow-wow', name: 'Pow Wow', category: 'מסעדה', city: 'ראשון לציון', region: 'מרכז', note: 'מאפשרים כלבים, עם חטיפים מיוחדים.' },
  { id: 'oia', name: 'אויה', category: 'מסעדה', city: 'אשדוד', region: 'דרום', note: 'מסעדה יוונית שמקבלת כלבים.' },
  { id: 'lisa', name: 'ליסה בר', category: 'מסעדה', city: 'אשדוד', region: 'דרום', note: 'מסעדת בשרים/בר דוג-פרנדלי.' },
  { id: 'saba-jbeto', name: 'סבא ג׳בטו', category: 'מסעדה', city: 'באר שבע', region: 'דרום', note: 'מכניסים כלבים בשעות הפעילות, עם שתייה.' },
  { id: 'joy', name: 'ג׳וי גריל האוס', category: 'מסעדה', city: 'ירושלים', region: 'ירושלים', note: 'ביסטרו שמקבל כלבים.' },
  { id: 'ranch-house', name: 'ראנץ׳ האוס', category: 'מסעדה', city: 'אילת', region: 'דרום', note: 'מסעדת בשרים דוג-פרנדלי.' },

  // ── בתי קפה ──
  { id: 'anastasia-jlm', name: 'קפה אנסטסיה', category: 'בית קפה', city: 'ירושלים', region: 'ירושלים', note: 'קערת אוכל ומים וחטיפים טבעוניים לכלב.' },
  { id: 'anastasia-tlv', name: 'קפה אנסטסיה', category: 'בית קפה', city: 'תל אביב-יפו (פרישמן)', region: 'מרכז', note: 'דוג-פרנדלי, עם פינוק לכלב.' },
  { id: 'notturno', name: 'נוקטורנו', category: 'בית קפה', city: 'ירושלים', region: 'ירושלים', note: 'בית קפה ותיק שמקבל כלבים.' },
  { id: 'cafe-otef', name: 'קפה עוטף', category: 'בית קפה', city: 'תל אביב-יפו (שרונה/עלייה)', region: 'מרכז', note: 'דוג-פרנדלי עם קערת מים וחטיפים.' },
  { id: 'we-like-you-too', name: 'We Like You Too', category: 'בית קפה', city: 'תל אביב-יפו (שדרות בן ציון)', region: 'מרכז', note: 'בית קפה שמקבל כלבים.' },
  { id: 'sander-bar', name: 'סנדר בר בשכונה', category: 'בית קפה', city: 'תל אביב-יפו (הצפון הישן)', region: 'מרכז', note: 'בר שכונתי דוג-פרנדלי.' },
  { id: 'panino', name: 'פנינו', category: 'בית קפה', city: 'תל אביב-יפו (אחד העם/כרמל)', region: 'מרכז', note: 'בית קפה שמקבל כלבים.' },
  { id: 'orby', name: 'אורבי', category: 'בית קפה', city: 'תל אביב-יפו (פלורנטין)', region: 'מרכז', note: 'בית קפה שכונתי דוג-פרנדלי.' },
  { id: 'kooper-pako', name: 'Kooper & Pako', category: 'בית קפה', city: 'תל אביב-יפו (כמה סניפים)', region: 'מרכז', note: 'בית קפה שמקבל כלבים.' },
  { id: 'gan-sipur', name: 'גן סיפור', category: 'בית קפה', city: 'תל אביב-יפו', region: 'מרכז', note: 'מקום ידידותי למשפחות ולכלבים.' },
  { id: 'tails-haifa', name: 'Tails', category: 'בית קפה', city: 'חיפה', region: 'צפון', note: 'בית קפה עם דקור ייחודי המוקדש לכלבים.' },
  { id: 'milhouse', name: 'מילהאוס', category: 'בית קפה', city: 'חיפה (בת גלים)', region: 'צפון', note: 'מקבל כלבים.' },
  { id: 'barda', name: 'ברדא', category: 'בית קפה', city: 'חיפה (העיר התחתית)', region: 'צפון', note: 'מקבל כלבים.' },
  { id: 'palmer', name: 'קפה פלמר', category: 'בית קפה', city: 'חיפה (שער פלמר)', region: 'צפון', note: 'מקבל כלבים.' },
  { id: 'talk-cafe', name: 'טלק קפה', category: 'בית קפה', city: 'חיפה (שוק תלפיות)', region: 'צפון', note: 'מקבל כלבים.' },
  { id: 'bleecker', name: 'בליקר ביקרי', category: 'בית קפה', city: 'כפר סבא (ויצמן 301)', region: 'שרון', note: 'ישיבה בחוץ עם הכלב, מספקים שתייה.' },
  { id: 'cafe-cafe-ks', name: 'קפה קפה', category: 'בית קפה', city: 'כפר סבא (דוד אלעזר 8)', region: 'שרון', note: 'ישיבה בחוץ עם הכלב, מספקים שתייה.' },
  { id: 'bnb-raanana', name: 'ברד אנד ברקפסט', category: 'בית קפה', city: 'רעננה (מרכז גירון)', region: 'שרון', note: 'אפשר לשבת עם הכלב, מקבלים מים.' },
  { id: 'gibborei-netanya', name: 'בתי הקפה בגיבורי ישראל', category: 'בית קפה', city: 'נתניה (יכין סנטר)', region: 'שרון', note: 'מתחם עם בתי קפה שמקבלים כלבים.' },

  // ── גלידריות ──
  { id: 'anita', name: 'אניטה', category: 'גלידרייה', city: 'תל אביב-יפו (נווה צדק) וסניפים', region: 'מרכז', note: '"דוגי-קרים" - גלידה ייעודית לכלבים.' },
  { id: 'golda', name: 'גולדה', category: 'גלידרייה', city: 'ארצי', region: 'ארצי', note: 'רשת גלידה עם פינוק לכלבים.' },

  // ── קניונים ──
  { id: 'dizengoff-center', name: 'דיזנגוף סנטר', category: 'קניון', city: 'תל אביב-יפו', region: 'מרכז', note: 'מאפשר כניסת כלבים ברצועה.' },
  { id: 'azrieli', name: 'קניוני עזריאלי', category: 'קניון', city: 'ארצי', region: 'ארצי', note: 'כלבים ברצועה (אמתו בסניף הספציפי).' },

  // ── חנויות ──
  { id: 'pet-chains', name: 'רשתות חנויות חיות', category: 'חנות', city: 'ארצי', region: 'ארצי', note: 'פטשופ, אנימל, ביוטיק, מגה פט ועוד - מוזמנים עם הכלב.' },
  { id: 'decathlon', name: 'דקתלון', category: 'חנות', city: 'ארצי', region: 'ארצי', note: 'בסניפים רבים מותר כלב ברצועה (אמתו בסניף).' },

  // ── לינה ──
  { id: 'atlas', name: 'רשת מלונות אטלס', category: 'לינה', city: 'תל אביב / ירושלים / אילת', region: 'ארצי', note: '16 מלונות בוטיק - כלב עד 15 ק״ג ללא תוספת תשלום.' },
  { id: 'brown', name: 'רשת בראון הוטלס', category: 'לינה', city: 'ארצי', region: 'ארצי', note: '14 מלונות - כלב עד 9 ק״ג ללא תוספת תשלום.' },
  { id: 'metayelim', name: 'רשת מטיילים', category: 'לינה', city: 'ארצי', region: 'ארצי', note: '8 מתחמי לינה ליד אתרי טיול ברחבי הארץ.' },
  { id: 'tzimers', name: 'צימרים דוג-פרנדלי', category: 'לינה', city: 'ארצי', region: 'ארצי', note: 'מתחמי צימרים שמקבלים כלבים, חלקם עם חצר פרטית.' },
]

export const DF_COUNT = dogFriendlyPlaces.length
