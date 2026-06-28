/* ════════════════════════════════════════════════════════════
   מקומות דוג-פרנדלי בישראל - דירקטוריון.
   *** רק ממקורות מאומתים: חופי כלבים מוכרזים, ופילטרי הדוג-פרנדלי
   הרשמיים של Rest ושל Timeout. אין הוספות ממקורות חלשים/בלוגים. ***
   גם מקור חזק יכול לטעות (Rest רשם בטעות מקום לא נכון) - מדיניות
   משתנה, מומלץ לאמת טלפונית. הרשימה תגדל עם אימות נוסף/הקהילה.
   ════════════════════════════════════════════════════════════ */

export type DFCategory = 'חוף' | 'מסעדה' | 'בית קפה'

export type DFPlace = {
  id: string
  name: string
  category: DFCategory
  city: string
  region: string
  note: string
  /** קישור ניווט (חיפוש Google Maps לפי שם + עיר). פותח אפליקציית מפות/וויז. */
  mapsUrl: string
}

/** הקטגוריות + אייקון + צבע למקרא (גוונים רכים, ללא ירוק). רק קטגוריות עם מקומות מאומתים. */
export const DF_CATEGORIES: { key: DFCategory; icon: string; bg: string; fg: string }[] = [
  { key: 'חוף', icon: '🏖️', bg: '#d6e8ef', fg: '#2c5a6b' },
  { key: 'מסעדה', icon: '🍽️', bg: '#f0d9c0', fg: '#8a5a2b' },
  { key: 'בית קפה', icon: '☕', bg: '#e6d2b8', fg: '#7a5328' },
]

/** רק אזורים שבהם יש מקומות מאומתים בפועל. */
export const REGIONS = ['מרכז', 'שרון', 'ירושלים', 'צפון', 'דרום'] as const

/** בונה קישור חיפוש ל-Google Maps לפי שם המקום והעיר (עובד גם במובייל וגם בדסקטופ). */
function maps(name: string, city: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${city}`)}`
}

export const dogFriendlyPlaces: DFPlace[] = [
  { id: "charles-clore", name: "חוף צ׳רלס קלור", category: "חוף", city: "תל אביב-יפו", region: "מרכז", note: "חוף כלבים מוכרז - החלק הדרומי.", mapsUrl: maps("חוף צ׳רלס קלור", "תל אביב") },
  { id: "tel-baruch-dog", name: "חוף תל ברוך דרום", category: "חוף", city: "תל אביב-יפו", region: "מרכז", note: "חוף כלבים מוכרז בחלק הדרומי.", mapsUrl: maps("חוף תל ברוך דרום", "תל אביב") },
  { id: "herzliya-dog", name: "חוף הכלבים הרצליה", category: "חוף", city: "הרצליה", region: "שרון", note: "חוף ייעודי לכלבים בצפון חופי הרצליה, עם מקלחות וברזיות.", mapsUrl: maps("חוף הכלבים", "הרצליה") },
  { id: "haifa-dog", name: "חוף הכלבים חיפה", category: "חוף", city: "חיפה", region: "צפון", note: "חוף ייעודי לכלבים בדרום חופי חיפה.", mapsUrl: maps("חוף הכלבים", "חיפה") },
  { id: "oia", name: "אויה (OIA)", category: "מסעדה", city: "אשדוד", region: "דרום", note: "מאומת ברשימת הדוג-פרנדלי של Rest.", mapsUrl: maps("אויה OIA מסעדה", "אשדוד") },
  { id: "lisa", name: "ליסה בר", category: "מסעדה", city: "אשדוד", region: "דרום", note: "מאומת ב-Rest.", mapsUrl: maps("ליסה בר", "אשדוד") },
  { id: "playground", name: "פלייגראונד", category: "מסעדה", city: "תל אביב-יפו", region: "מרכז", note: "מאומת ב-Rest.", mapsUrl: maps("פלייגראונד מסעדה", "תל אביב") },
  { id: "wine-garden", name: "ווין גארדן", category: "מסעדה", city: "תל אביב-יפו", region: "מרכז", note: "מאומת ב-Rest.", mapsUrl: maps("ווין גארדן מסעדה", "תל אביב") },
  { id: "gusto", name: "גוסטו", category: "מסעדה", city: "תל אביב-יפו", region: "מרכז", note: "מאומת ב-Rest.", mapsUrl: maps("גוסטו מסעדה", "תל אביב") },
  { id: "jango", name: "ג׳אנגו", category: "מסעדה", city: "תל אביב-יפו", region: "מרכז", note: "מאומת ב-Rest.", mapsUrl: maps("ג׳אנגו מסעדה", "תל אביב") },
  { id: "baba-yaga", name: "באבא יאגה", category: "מסעדה", city: "תל אביב-יפו", region: "מרכז", note: "מאומת ב-Rest.", mapsUrl: maps("באבא יאגה מסעדה", "תל אביב") },
  { id: "notturno", name: "נוקטורנו", category: "בית קפה", city: "ירושלים", region: "ירושלים", note: "מאומת ב-Rest.", mapsUrl: maps("נוקטורנו", "ירושלים") },
  { id: "joy", name: "ג׳וי גריל האוס", category: "מסעדה", city: "ירושלים", region: "ירושלים", note: "מאומת ב-Rest.", mapsUrl: maps("ג׳וי גריל האוס", "ירושלים") },
  { id: "aresto", name: "ארסטו", category: "מסעדה", city: "קיסריה", region: "שרון", note: "מסעדה איטלקית, מאומת ב-Rest.", mapsUrl: maps("ארסטו מסעדה", "קיסריה") },
  { id: "ranch-house", name: "ראנץ׳ האוס", category: "מסעדה", city: "אילת", region: "דרום", note: "מאומת ב-Rest.", mapsUrl: maps("ראנץ׳ האוס מסעדה", "אילת") },
  { id: "azba", name: "עזבה", category: "מסעדה", city: "ראמה", region: "צפון", note: "מסעדה ערבית, מאומת ב-Rest.", mapsUrl: maps("עזבה מסעדה", "ראמה") },
  { id: "bulls", name: "בולס (BULLS)", category: "מסעדה", city: "קריית חיים", region: "צפון", note: "מאומת ב-Rest.", mapsUrl: maps("בולס BULLS מסעדה", "קריית חיים") },
  { id: "arabesque", name: "ארבסק", category: "מסעדה", city: "כפר יאסיף", region: "צפון", note: "מאומת ב-Rest.", mapsUrl: maps("ארבסק מסעדה", "כפר יאסיף") },
  { id: "cafe-otef", name: "קפה עוטף", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "סניפי שרונה / קפלן 30 / וולפסון 54. (Timeout)", mapsUrl: maps("קפה עוטף שרונה", "תל אביב") },
  { id: "bucke", name: "בוקה (Bucke)", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "כמה סניפים בעיר. (Timeout)", mapsUrl: maps("בוקה Bucke קפה", "תל אביב") },
  { id: "we-like-you-too", name: "We Like You Too", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "שד׳ בן גוריון 30 / בן ציון 34. (Timeout)", mapsUrl: maps("We Like You Too cafe", "תל אביב") },
  { id: "anastasia", name: "אנסטסיה", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "פרישמן 54, טבעוני. (Timeout)", mapsUrl: maps("אנסטסיה קפה פרישמן 54", "תל אביב") },
  { id: "sander-bar", name: "סנדר בר", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "מתחם בזל, אלקלעי 5. (Timeout)", mapsUrl: maps("סנדר בר אלקלעי 5", "תל אביב") },
  { id: "panino", name: "פנינו", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "אחד העם 15 / הכרמל 38. (Timeout)", mapsUrl: maps("פנינו קפה אחד העם 15", "תל אביב") },
  { id: "orby", name: "אורבי", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "פלורנטין, מעון 5. (Timeout)", mapsUrl: maps("אורבי קפה מעון 5 פלורנטין", "תל אביב") },
  { id: "kooper-pako", name: "Kooper & Pako", category: "בית קפה", city: "תל אביב-יפו", region: "מרכז", note: "קינג ג׳ורג׳ 48 / מזא״ה 42. (Timeout)", mapsUrl: maps("Kooper & Pako קינג ג׳ורג׳ 48", "תל אביב") },
]

export const DF_COUNT = dogFriendlyPlaces.length
