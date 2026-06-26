/* ════════════════════════════════════════════════════════════
   יד שנייה - שוק ציוד משומש לכלבים (נתוני דמו)
   ────────────────────────────────────────────────────────────
   אין backend אמיתי. הנתונים כאן סטטיים להמחשה, וכל פעולה
   (פרסום מודעה / יצירת קשר) מציגה toast בצד הלקוח.
   ════════════════════════════════════════════════════════════ */

/** מצב הפריט - משפיע על תג הצבע בכרטיס. */
export type ItemCondition = 'חדש באריזה' | 'כמו חדש' | 'במצב טוב' | 'משומש'

/** קטגוריות המוצרים בשוק - משמשות גם לשורת הסינון. */
export const MARKET_CATEGORIES = [
  'כלובים וגדרות',
  'רתמות ורצועות',
  'מיטות ומזרנים',
  'צעצועים',
  'אוכל והאכלה',
  'טיולים ונסיעות',
  'טיפוח',
] as const

export type MarketCategory = (typeof MARKET_CATEGORIES)[number]

export type Listing = {
  id: string
  title: string
  category: MarketCategory
  price: number // ₪ - 0 = חינם / לאיסוף
  condition: ItemCondition
  city: string
  seller: string
  description: string
  photo: string // מזהה תמונת unsplash
  promoted?: boolean // מודעה מקודמת (רמז למונטיזציה)
  postedAgo: string // "לפני יומיים" וכו'
}

/** מודעות דמו - 12 פריטי ציוד משומש. */
export const demoListings: Listing[] = [
  {
    id: 'crate-xl-tlv',
    title: 'כלוב מתקפל XL לכלב גדול',
    category: 'כלובים וגדרות',
    price: 220,
    condition: 'כמו חדש',
    city: 'תל אביב-יפו',
    seller: 'דנה ל.',
    description:
      'כלוב ברזל מתקפל במידה 107 ס"מ, מתאים לגזע גדול. שימש חודשיים בלבד לאילוף גור. מגיע עם מגש תחתון נשלף ושתי דלתות. נאסף מהבית בצפון תל אביב.',
    photo: 'photo-1583511655857-d19b40a7a54e',
    promoted: true,
    postedAgo: 'לפני יומיים',
  },
  {
    id: 'harness-m-haifa',
    title: 'רתמת Y מרופדת מידה M',
    category: 'רתמות ורצועות',
    price: 60,
    condition: 'במצב טוב',
    city: 'חיפה',
    seller: 'יוסי כ.',
    description:
      'רתמת Y אנטומית, ריפוד נושם, טבעת קדמית למי שעוד עובד על משיכה ברצועה. קנינו במידה M והכלב פשוט גדל - חצי שנה והיא כבר קטנה. אפס קרעים, נקייה לגמרי. עדיף שתלך למישהו מאשר לארון.',
    photo: 'photo-1601758228041-f3b2795255f1',
    postedAgo: 'לפני 4 ימים',
  },
  {
    id: 'bed-orthopedic-jlm',
    title: 'מיטה אורתופדית מקצף זיכרון',
    category: 'מיטות ומזרנים',
    price: 130,
    condition: 'כמו חדש',
    city: 'ירושלים',
    seller: 'מאיה ב.',
    description:
      'מיטה גדולה עם בסיס קצף זיכרון אמיתי ודופן תמיכה לראש. הכיסוי נשלף וניתן לכביסה במכונה. תומכת במפרקים, אידיאלית לכלב מבוגר. נקנתה בטעות במידה גדולה מדי.',
    photo: 'photo-1541599540903-216a46ca1dc0',
    promoted: true,
    postedAgo: 'לפני שבוע',
  },
  {
    id: 'toys-bundle-raanana',
    title: 'חבילת צעצועי לעיסה - 6 יחידות',
    category: 'צעצועים',
    price: 45,
    condition: 'במצב טוב',
    city: 'רעננה',
    seller: 'דניאל א.',
    description:
      'מארז צעצועים מגומי טבעי וחבל: כדור מקפץ, עצם לעיסה, שני חבלי משיכה וצעצוע פאזל להחבאת חטיפים. הכל שטוף ומחוטא. הכלב פשוט בחר לו מועדף אחד.',
    photo: 'photo-1576201836106-db1758fd1c97',
    postedAgo: 'לפני 3 ימים',
  },
  {
    id: 'bowls-steel-netanya',
    title: 'מעמד הגבהה עם שתי קערות נירוסטה',
    category: 'אוכל והאכלה',
    price: 70,
    condition: 'במצב טוב',
    city: 'נתניה',
    seller: 'טל ר.',
    description:
      'מעמד במבוק עם שתי קערות נירוסטה נשלפות. ההגבהה עזרה לכלב הגדול שלנו לא להתכופף בכל ארוחה - הווטרינר המליץ וזה באמת שינה. עברנו לדגם גבוה יותר כשהוא גדל. כמה שריטות, אבל יציב לגמרי.',
    photo: 'photo-1589924691995-400dc9ecc119',
    postedAgo: 'לפני 5 ימים',
  },
  {
    id: 'carseat-beersheva',
    title: 'מושב בטיחות לרכב לכלב קטן',
    category: 'טיולים ונסיעות',
    price: 90,
    condition: 'כמו חדש',
    city: 'באר שבע',
    seller: 'עומר ש.',
    description:
      'מושב מוגבה ורך לתא הרכב, מתאים לכלב עד 8 ק"ג. נקשר לחגורת הבטיחות ומגיע עם רצועת ריסון פנימית. הכלב שלנו העדיף בסוף את הברכיים. כמו חדש.',
    photo: 'photo-1558788353-f76d92427f16',
    promoted: true,
    postedAgo: 'לפני יום',
  },
  {
    id: 'clippers-grooming-tlv',
    title: 'מכונת תספורת חשמלית לכלבים',
    category: 'טיפוח',
    price: 110,
    condition: 'במצב טוב',
    city: 'תל אביב-יפו',
    seller: 'שירה ג.',
    description:
      'מכונת תספורת נטענת ושקטה - הכלב שלנו לא נבהל ממנה, וזה חצי מהקרב. ארבעה ראשי מסרק, שמן סיכה ומברשת. ניסינו לספר לבד שנה, בסוף ויתרנו ועברנו למספרה. עובדת מצוין, פשוט לא בשבילנו.',
    photo: 'photo-1591946614720-90a587da4a36',
    postedAgo: 'לפני שבוע',
  },
  {
    id: 'fence-puppy-ramatgan',
    title: 'גדר אילוף מתכת - 8 פאנלים',
    category: 'כלובים וגדרות',
    price: 150,
    condition: 'משומש',
    city: 'רמת גן',
    seller: 'אבי פ.',
    description:
      'מתחם אילוף מתכת לגור, נפתח לצורות שונות לפי המרחב. שמונה פאנלים עם דלת נעילה. סימני שימוש וכמה שריטות, אבל יציב ובטוח לחלוטין. מצוין לתקופת ההסתגלות.',
    photo: 'photo-1593134257782-e89567b7718a',
    postedAgo: 'לפני שבועיים',
  },
  {
    id: 'leash-bungee-modiin',
    title: 'רצועת ריצה אלסטית לחגירת מותן',
    category: 'רתמות ורצועות',
    price: 0,
    condition: 'במצב טוב',
    city: 'מודיעין',
    seller: 'נועה ק.',
    description:
      'רצועת ריצה עם חגורת מותן וקפיץ בולם זעזועים, להוצאת הכלב בריצה בלי לאחוז ביד. מוסרת בחינם לאיסוף עצמי בלבד - פשוט שתעבור לבית שצריך אותה.',
    photo: 'photo-1518717758536-85ae29035b6d',
    postedAgo: 'לפני 6 ימים',
  },
  {
    id: 'feeder-auto-petach',
    title: 'מאכיל אוטומטי עם טיימר',
    category: 'אוכל והאכלה',
    price: 140,
    condition: 'כמו חדש',
    city: 'פתח תקווה',
    seller: 'רון מ.',
    description:
      'מאכיל אוטומטי 4 ליטר, עד ארבע ארוחות ביום, עם הקלטת קול שקוראת לכלב לאכול (הקלטנו את הילד והכלב רץ כל פעם). קנינו לימים הארוכים בעבודה, ואז התחלנו לעבוד מהבית. עובד מצוין, מנוקה, כמו חדש.',
    photo: 'photo-1623387641168-d9803ddd3f35',
    postedAgo: 'לפני 3 ימים',
  },
  {
    id: 'backpack-hike-eilat',
    title: 'תיק נשיאה לכלב לטיולים',
    category: 'טיולים ונסיעות',
    price: 80,
    condition: 'במצב טוב',
    city: 'אילת',
    seller: 'גלי ד.',
    description:
      'תיק נשיאה מאוורר לכלב קטן עד 6 ק"ג, עם רשת לאוורור, פתח עליון וכיס צד לחטיפים. ליווה אותנו בטיולים והשתמר יפה. מתאים לשבילים ולנסיעות קצרות.',
    photo: 'photo-1444212477490-ca407925329e',
    postedAgo: 'לפני שבוע',
  },
  {
    id: 'brush-deshed-ashdod',
    title: 'מברשת השרה להורדת פרווה',
    category: 'טיפוח',
    price: 35,
    condition: 'חדש באריזה',
    city: 'אשדוד',
    seller: 'יעל ה.',
    description:
      'מברשת השרה עם להב נירוסטה וכפתור שמשחרר את הפרווה בלחיצה. אצלנו עם הלברדור בעונת הנשירה זה היה הצלה - חופן פרווה בכל העברה. הזמנו שתיים בטעות, אז זאת עדיין סגורה באריזה. חבל שתשב לי במגירה.',
    photo: 'photo-1535930891776-0c2dfb7fda1a',
    postedAgo: 'לפני 4 ימים',
  },
]

/** בונה כתובת תמונת unsplash תקנית (q=55, lazy בשימוש בכרטיס). */
export const listingImg = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

/** "הכל" + הקטגוריות - שורת הצ'יפים לסינון בעמוד. */
export const CATEGORY_FILTERS = ['הכל', ...MARKET_CATEGORIES] as const

/** תצוגת מחיר: 0 ש"ח מוצג כ"חינם". */
export function formatPrice(price: number): string {
  return price === 0 ? 'חינם' : `₪${price.toLocaleString('he-IL')}`
}

/** מיפוי מצב הפריט לצבעי תג (בתוך פלטת הקרם בלבד). */
export const CONDITION_STYLE: Record<ItemCondition, { fg: string; bg: string; border: string }> = {
  'חדש באריזה': { fg: '#7a5a2a', bg: 'rgba(232,200,135,.28)', border: 'rgba(201,154,91,.45)' },
  'כמו חדש': { fg: '#8a6a36', bg: 'rgba(232,200,135,.18)', border: 'rgba(201,154,91,.32)' },
  'במצב טוב': { fg: '#9a7a46', bg: 'rgba(232,200,135,.12)', border: 'rgba(201,154,91,.24)' },
  משומש: { fg: '#7a6f5e', bg: 'rgba(42,32,24,.06)', border: 'rgba(42,32,24,.14)' },
}
