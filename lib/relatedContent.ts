/* ════════════════════════════════════════════════════════════
   מיפוי קישורים פנימיים בין אשכולות התוכן באתר.

   למה ידני ולא אוטומטי: קישור שנבחר לפי משמעות (מדריך מחירון
   שמפנה לגזע שהוא באמת יקר להחזקה) שווה הרבה יותר מקישור
   שנבחר לפי סדר במערך. עד היום שלושה מדריכים קיבלו את כל
   הקישורים הפנימיים רק כי הם ראשונים ברשימה, בעוד שדפי
   המחירונים שמדורגים הכי טוב קיבלו קישור אחד בלבד.

   הליבה כאן היא אשכול "עלויות". הוא הדף החזק ביותר באתר
   מבחינת דירוג, ולכן הוא גם מקבל קישורים מהמדריכים המקושרים
   ביותר וגם מזרים סמכות הלאה לדפי הגזעים החלשים.

   כללי כתיבה למי שמוסיף כאן ערכים:
   1. label הוא טקסט העוגן. הוא צריך להיראות כמו שאילתת חיפוש
      ("כמה עולה אוכל לכלבים"), לא כמו כותרת של דף.
   2. reason מופיע מתחת לעוגן ומסביר למה שווה ללחוץ.
   3. כל מספר ב-reason חייב להופיע כבר בעמוד היעד עצמו.
      אם אין ודאות לגבי מספר, כותבים reason בלי מספר.
   4. אין תלות בקבצי תוכן אחרים בקובץ הזה, כדי שלא ייווצרו
      מעגלי import ושאפשר יהיה לערוך אותו במקביל למדריכים.
   ════════════════════════════════════════════════════════════ */

export type RelatedItem = { href: string; label: string; reason: string }

/* ─────────────────────────────────────────────
   מדריך ← מדריכים. חיבור האשכול הפנימי.
   ───────────────────────────────────────────── */
const guideToGuides: Record<string, RelatedItem[]> = {
  /* ── ליבת אשכול העלויות ── */
  'monthly-dog-cost': [
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'ההוצאה החודשית הגדולה, 80-450 ש"ח לשק' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'הסעיף שהכי קל לשכוח, 70-280 ש"ח לחודש' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'ההוצאה השוטפת הכי בלתי צפויה, 160-430 ש"ח' },
    { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'הוצאה חד-פעמית בשנה הראשונה, 500-2,500 ש"ח' },
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'אגרה שנתית חובה, כ-44 ש"ח לכלב מעוקר' },
  ],
  'dog-food-prices': [
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'התמונה המלאה, 600-1,800 ש"ח לחודש' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'מזון לא מתאים מגיע בסוף לקליניקה, 160-430 ש"ח' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'קשור ישירות למה שהכלב אוכל, 500-1,100 ש"ח' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'הסעיף השני בגודלו בתקציב, 70-280 ש"ח לחודש' },
  ],
  'spay-neuter-cost': [
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'עיקור מוריד את האגרה מכ-400 לכ-44 ש"ח' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'נדרש לפני הניתוח, 86-162 ש"ח בקליניקה פרטית' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'בדיקה לפני ניתוח וביקורת אחריו, 160-430 ש"ח' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איפה הניתוח נכנס בתקציב השנה הראשונה' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'לרוב תנאי לסבסוד העירוני, 86-160 ש"ח' },
  ],
  'dog-insurance': [
    { href: '/guides/dog-surgery-cost', label: 'כמה עולה ניתוח לכלב', reason: 'התרחיש שבגללו קונים פוליסה, 4,000-15,000 ש"ח' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'מה משלמים גם עם ביטוח, 160-430 ש"ח' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'הפרמיה בתוך התקציב החודשי הכולל' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'אחד הסעיפים שכמעט תמיד לא מכוסים' },
  ],
  'dog-training-cost': [
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'אילוף בפנסיון מתומחר אחרת, 80-250 ש"ח ללילה' },
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'חלופה יומיומית זולה יותר, 40-80 ש"ח לחצי שעה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איך סדרת אילוף נראית בתקציב השנתי' },
    { href: '/guides/german-shepherd-price', label: 'כמה עולה רועה גרמני', reason: 'גזע שהאילוף בו הוא חלק מהעלות האמיתית' },
  ],
  'dog-boarding-cost': [
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'החלופה כשלא נוסעים, 70-130 ש"ח לשעה' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'פנסיון דורש חיסונים בתוקף לפני הקבלה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'כמה חופשה אחת מזיזה את התקציב השנתי' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'אילוף בפנסיון, 4,000-9,000 ש"ח לשבועיים' },
  ],
  'dog-walker-cost': [
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'מה עושים כשנוסעים, 80-250 ש"ח ללילה' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'משיכה ברצועה מייקרת כל הליכה מלווה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'מנוי הליכות בתוך 600-1,800 ש"ח לחודש' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'מה קורה אם הכלב נפגע בהליכה מלווה' },
  ],
  'dog-license-fee': [
    { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'הצעד שמוריד את האגרה השנתית משמעותית' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'תנאי מוקדם לרישוי, 86-160 ש"ח' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'חיסון כלבת בתוקף נדרש לרישיון' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'האגרה בתוך התמונה התקציבית המלאה' },
  ],
  'vaccinations-2026': [
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'הביקור עצמו מתומחר בנפרד, 160-430 ש"ח' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'לרוב נעשה באותו ביקור, 86-160 ש"ח' },
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'חיסון כלבת הוא תנאי לרישיון תקף' },
    { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'שתי ההוצאות הגדולות של השנה הראשונה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איך פורסים את עלות השנה הראשונה' },
  ],
  'labrador-price': [
    { href: '/guides/golden-price', label: 'כמה עולה גולדן רטריבר', reason: 'ההשוואה הכי נפוצה, 3,500-9,000 ש"ח לגור' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'מה קורה אחרי הקנייה, 600-1,800 ש"ח לחודש' },
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'כלב גדול אוכל ב-300-700 ש"ח לחודש' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'סדרה פרטית בגיל גור, 1,200-2,500 ש"ח' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'רלוונטי לגזע עם נטייה לבעיות מפרקים' },
  ],
  'golden-price': [
    { href: '/guides/labrador-price', label: 'כמה עולה גור לברדור', reason: 'הגזע המתחרה, 3,500-8,000 ש"ח לגור' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'ההוצאה השוטפת אחרי הקנייה' },
    { href: '/guides/dog-grooming-cost', label: 'כמה עולה מספרה לכלב', reason: 'פרווה ארוכה מייקרת את הטיפוח, 120-450 ש"ח' },
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'מחירון שקים מלא, 80-450 ש"ח לשק' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'שווה בדיקה בגזע עם נטייה לגידולים' },
  ],

  /* ── שמונת מדריכי העלויות החדשים ── */
  'vet-visit-cost': [
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'החיסונים שנעשים בביקור השגרתי' },
    { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'הניתוח הנפוץ ביותר, 500-2,500 ש"ח' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'נעשה בהרדמה, 500-1,100 ש"ח' },
    { href: '/guides/dog-surgery-cost', label: 'כמה עולה ניתוח לכלב', reason: 'התרחיש היקר, 4,000-15,000 ש"ח' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'מה מכוסה ומה לא, 70-280 ש"ח לחודש' },
  ],
  'dog-microchip-cost': [
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'השבב הוא תנאי לרישוי, כ-44 ש"ח למעוקר' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'לרוב נעשה יחד עם השבב באותו ביקור' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'מחירון הביקור עצמו, 160-430 ש"ח' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'הוצאות הפתיחה של כלב חדש' },
  ],
  'dog-grooming-cost': [
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'טיפוח קבוע בתוך התקציב החודשי' },
    { href: '/guides/pomeranian-price', label: 'כמה עולה פומרניאן', reason: 'פרווה כפולה שמחייבת מספרה קבועה' },
    { href: '/guides/golden-price', label: 'כמה עולה גולדן רטריבר', reason: 'גזע ארוך פרווה עם עלות טיפוח גבוהה' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'בעיות עור וכפות מגיעות לקליניקה' },
  ],
  'dog-dental-cost': [
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'הבדיקה שמזהה אבנית, 160-430 ש"ח' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'סעיף שנחשב טיפול מונע ולרוב לא מכוסה' },
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'סוג המזון משפיע ישירות על קצב האבנית' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איך פורסים הוצאה שחוזרת כל שנה-שנתיים' },
  ],
  'dog-surgery-cost': [
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'ההבדל בין 70-280 ש"ח לחודש לחשבון של אלפים' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'ביקור החירום שלפני הניתוח' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'למה כדאי קרן חירום בתוך התקציב' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'הרדמה מלאה גם כאן, 500-1,100 ש"ח' },
  ],
  'german-shepherd-price': [
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'בגזע עבודה זו לא הוצאה אופציונלית' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'ההחזקה השוטפת של כלב גדול' },
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'כלב גדול אוכל ב-300-700 ש"ח לחודש' },
    { href: '/guides/dog-insurance', label: 'כמה עולה ביטוח לכלב', reason: 'רלוונטי לגזע עם נטייה לדיספלזיה' },
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'האגרה השנתית וחובות הרישוי' },
  ],
  'pomeranian-price': [
    { href: '/guides/dog-grooming-cost', label: 'כמה עולה מספרה לכלב', reason: 'הוצאה קבועה בגזע פרווה כפולה, 120-450 ש"ח' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'כלב קטן יוצא 600-900 ש"ח לחודש' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'גזעים קטנים סובלים יותר מאבנית' },
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'שק אחד מחזיק הרבה זמן בגזע קטן' },
  ],
  'husky-price': [
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'ההחזקה השוטפת של כלב גדול ואנרגטי' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'גזע בורח שדורש עבודה מסודרת' },
    { href: '/guides/dog-grooming-cost', label: 'כמה עולה מספרה לכלב', reason: 'נשירה עונתית שדורשת טיפוח מקצועי' },
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'צורך יומי בפריקת אנרגיה, 40-80 ש"ח לחצי שעה' },
  ],

  /* ── מדריכים מקושרים היטב שמזרימים סמכות אל אשכול העלויות ── */
  'puppy-first-week': [
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'התקציב שכדאי לבנות עוד לפני שהגור מגיע' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'לוח החיסונים של השבועות הראשונים' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'חובה בחוק, 86-160 ש"ח' },
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'האגרה השנתית וההנחה לכלב מעוקר' },
    { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'ההוצאה הגדולה של השנה הראשונה' },
  ],
  'house-training': [
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'מה עוד מחכה לכם בתקציב השנה הראשונה' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'מתי שווה מאלף, 250-500 ש"ח לשיעור' },
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'יציאות באמצע היום, 40-80 ש"ח לחצי שעה' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'מתי בעיית ניקיון היא בעצם רפואית' },
  ],
  'leash-pulling': [
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'מחירון שיעורים פרטיים וקורסים קבוצתיים' },
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'מי שמוליך את הכלב כשאתם בעבודה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'ציוד ואילוף בתוך התקציב החודשי' },
    { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'חובות הרצועה והרישוי שחלות בטיול' },
  ],
  'choosing-food': [
    { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'מחירון מלא, 80-450 ש"ח לשק' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איפה האוכל יושב בתקציב הכולל' },
    { href: '/guides/dog-dental-cost', label: 'כמה עולה ניקוי אבנית לכלב', reason: 'מה שהכלב אוכל משפיע על השיניים' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'בדיקה לפני מעבר למזון רפואי' },
  ],
  'separation-anxiety': [
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'שובר את היום הארוך לבד, 40-80 ש"ח' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'ליווי מקצועי לחרדת נטישה' },
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'החלופה כשנוסעים, 80-250 ש"ח ללילה' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'מתי חרדה מצריכה בדיקה מקצועית' },
  ],
  'dog-alone-time': [
    { href: '/guides/dog-walker-cost', label: 'כמה עולה דוגווקר', reason: 'הפתרון הכי נפוץ לשעות העבודה' },
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'מעון יומי ופנסיון, מחירון מלא' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'כמה מוסיפים שירותי טיפול לתקציב' },
    { href: '/guides/dog-training-cost', label: 'כמה עולה אילוף כלבים', reason: 'עבודה על הישארות לבד עם מאלף' },
  ],
  'travel-prep': [
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'החלופה לנסיעה, 80-250 ש"ח ללילה' },
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'מה חייב להיות בתוקף לפני נסיעה' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'זיהוי הכרחי בכל נסיעה' },
    { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'איך חופשה אחת מזיזה את התקציב' },
  ],
  'flying-abroad': [
    { href: '/guides/vaccinations-2026', label: 'כמה עולה חיסון לכלב', reason: 'חיסון כלבת בתוקף הוא תנאי סף לטיסה' },
    { href: '/guides/dog-microchip-cost', label: 'כמה עולה שבב לכלב', reason: 'שבב תקני נדרש לתעודה הווטרינרית' },
    { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'הבדיקה שלפני הנפקת התעודה' },
    { href: '/guides/dog-boarding-cost', label: 'כמה עולה פנסיון לכלבים', reason: 'החלופה אם מחליטים לא להטיס' },
  ],
}

/* ─────────────────────────────────────────────
   מדריך עלויות ← דפי גזע.
   הזרמת סמכות מהדפים החזקים לדפים החלשים.
   ───────────────────────────────────────────── */
const guideToBreeds: Record<string, RelatedItem[]> = {
  'monthly-dog-cost': [
    { href: '/breeds/saint-bernard', label: 'סנט ברנרד: מחירים והוצאות בישראל', reason: 'ענק שאוכל, נוסע ומתאשפז ביוקר' },
    { href: '/breeds/cane-corso', label: 'קאנה קורסו: מחירים והוצאות בישראל', reason: 'גזע ענק שמזיז את התקציב החודשי כלפי מעלה' },
    { href: '/breeds/chihuahua', label: "צ'יוואווה: מחירים והוצאות בישראל", reason: 'הקצה הזול של הטווח, 600-900 ש"ח לחודש' },
    { href: '/breeds/corgi', label: 'קורגי: מחירים והוצאות בישראל', reason: 'גזע קטן עם צרכי פעילות של רועה' },
    { href: '/breeds/mixed', label: 'כלב מעורב: מחירים והוצאות בישראל', reason: 'לרוב הבחירה הזולה והבריאה ביותר' },
    { href: '/breeds/canaan', label: 'כלב כנעני: מחירים והוצאות בישראל', reason: 'הגזע המקומי, מותאם לאקלים ולכן חסכוני' },
  ],
  'dog-food-prices': [
    { href: '/breeds/saint-bernard', label: 'סנט ברנרד: מחירים והוצאות בישראל', reason: 'צריכת המזון הגבוהה ביותר מכל הגזעים באתר' },
    { href: '/breeds/rottweiler', label: 'רוטוויילר: מחירים והוצאות בישראל', reason: 'כלב גדול וכבד עם צריכה יומית משמעותית' },
    { href: '/breeds/boxer', label: 'בוקסר: מחירים והוצאות בישראל', reason: 'אתלטי ואנרגטי, אוכל בהתאם' },
    { href: '/breeds/labrador', label: 'לברדור רטריבר: מחירים והוצאות בישראל', reason: 'נוטה להשמנה, ולכן כמות המזון קריטית' },
    { href: '/breeds/cane-corso', label: 'קאנה קורסו: מחירים והוצאות בישראל', reason: 'גזע ענק, 300-700 ש"ח אוכל לחודש' },
  ],
  'spay-neuter-cost': [
    { href: '/breeds/mixed', label: 'כלב מעורב: מחירים והוצאות בישראל', reason: 'הגזע הנפוץ ביותר בסבסוד העירוני' },
    { href: '/breeds/canaan', label: 'כלב כנעני: מחירים והוצאות בישראל', reason: 'גזע בינוני, בטווח האמצע של המחירון' },
    { href: '/breeds/beagle', label: 'ביגל: מחירים והוצאות בישראל', reason: 'גזע בינוני עם נטייה להשמנה אחרי הניתוח' },
    { href: '/breeds/cocker', label: 'קוקר ספניאל: מחירים והוצאות בישראל', reason: 'גזע בינוני, 1,200-1,900 ש"ח לעיקור' },
  ],
  'dog-insurance': [
    { href: '/breeds/french-bulldog', label: 'בולדוג צרפתי: מחירים והוצאות בישראל', reason: 'גזע שטוח פנים עם סיכון נשימתי גבוה' },
    { href: '/breeds/bulldog', label: 'בולדוג אנגלי: מחירים והוצאות בישראל', reason: 'גזע שטוח פנים, אחד היקרים לביטוח' },
    { href: '/breeds/dachshund', label: 'תחש (דקל): מחירים והוצאות בישראל', reason: 'גב ארוך עם נטייה לפריצת דיסק' },
    { href: '/breeds/shih-tzu', label: 'שיצו: מחירים והוצאות בישראל', reason: 'פרצוף שטוח ורגישות לחום הישראלי' },
    { href: '/breeds/boxer', label: 'בוקסר: מחירים והוצאות בישראל', reason: 'גזע עם נטייה מוכרת לגידולים' },
  ],
  'dog-surgery-cost': [
    { href: '/breeds/dachshund', label: 'תחש (דקל): מחירים והוצאות בישראל', reason: 'ניתוחי דיסק הם התרחיש היקר בגזע' },
    { href: '/breeds/french-bulldog', label: 'בולדוג צרפתי: מחירים והוצאות בישראל', reason: 'ניתוחי נתיב אוויר נפוצים בגזע' },
    { href: '/breeds/bulldog', label: 'בולדוג אנגלי: מחירים והוצאות בישראל', reason: 'לידות וניתוחי נשימה מייקרים את החשבון' },
    { href: '/breeds/cane-corso', label: 'קאנה קורסו: מחירים והוצאות בישראל', reason: 'ניתוח בכלב ענק יקר יותר בכל פרמטר' },
  ],
  'dog-grooming-cost': [
    { href: '/breeds/poodle', label: 'פודל: מחירים והוצאות בישראל', reason: 'הגזע שהמספרה היא חלק בלתי נפרד מהחזקתו' },
    { href: '/breeds/maltese', label: 'מלטז: מחירים והוצאות בישראל', reason: 'פרווה שמסתבכת תוך יומיים בלי סירוק' },
    { href: '/breeds/yorkshire', label: 'יורקשייר טרייר: מחירים והוצאות בישראל', reason: 'פרווה משיית שדורשת טיפוח קבוע' },
    { href: '/breeds/pomeranian', label: 'פומרניאן: מחירים והוצאות בישראל', reason: 'פרווה כפולה מפוארת ותובענית' },
    { href: '/breeds/goldendoodle', label: 'גולדנדודל: מחירים והוצאות בישראל', reason: 'פרווה גלית שמחייבת מספרה כל כמה שבועות' },
    { href: '/breeds/shih-tzu', label: 'שיצו: מחירים והוצאות בישראל', reason: 'פרווה ארוכה או תספורת קצרה לקיץ' },
  ],
  'dog-training-cost': [
    { href: '/breeds/border-collie', label: 'בורדר קולי: מחירים והוצאות בישראל', reason: 'הגזע החכם ביותר, וגם התובעני ביותר' },
    { href: '/breeds/malinois', label: 'מלינואה בלגי: מחירים והוצאות בישראל', reason: 'כלב עבודה שאילוף אצלו הוא חובה' },
    { href: '/breeds/australian-shepherd', label: 'רועה אוסטרלי: מחירים והוצאות בישראל', reason: 'אנרגיה וראש שצריכים תעסוקה יומית' },
    { href: '/breeds/german-shepherd', label: 'רועה גרמני: מחירים והוצאות בישראל', reason: 'גזע שדורש הכוונה עקבית מגיל גור' },
    { href: '/breeds/husky', label: 'האסקי סיבירי: מחירים והוצאות בישראל', reason: 'עצמאי ובורח, ולכן מאתגר באילוף' },
  ],
  'dog-walker-cost': [
    { href: '/breeds/vizsla', label: 'ויסלה הונגרי: מחירים והוצאות בישראל', reason: 'דבוק לבעלים וסובל מהישארות לבד' },
    { href: '/breeds/beagle', label: 'ביגל: מחירים והוצאות בישראל', reason: 'שונא להישאר לבד, והשכנים שומעים' },
    { href: '/breeds/maltese', label: 'מלטז: מחירים והוצאות בישראל', reason: 'רוצה חברה לאורך כל היום' },
    { href: '/breeds/boxer', label: 'בוקסר: מחירים והוצאות בישראל', reason: 'מרץ יומי שחייב פורקן מסודר' },
    { href: '/breeds/border-collie', label: 'בורדר קולי: מחירים והוצאות בישראל', reason: 'בלי פעילות יומית הוא ממציא לעצמו עבודה' },
  ],
  'dog-boarding-cost': [
    { href: '/breeds/husky', label: 'האסקי סיבירי: מחירים והוצאות בישראל', reason: 'דורש פנסיון עם גידור אמיתי' },
    { href: '/breeds/beagle', label: 'ביגל: מחירים והוצאות בישראל', reason: 'חברותי, ומסתדר טוב בפנסיון קבוצתי' },
    { href: '/breeds/labrador', label: 'לברדור רטריבר: מחירים והוצאות בישראל', reason: 'אחד הגזעים הנפוצים ביותר בפנסיונים' },
    { href: '/breeds/golden', label: 'גולדן רטריבר: מחירים והוצאות בישראל', reason: 'רגיש למצב רוח, ולכן בחירת פנסיון חשובה' },
  ],
  'dog-license-fee': [
    { href: '/breeds/amstaff', label: 'אמסטאף: מחירים והוצאות בישראל', reason: 'גזע ברשימת הכלבים המסוכנים, רישוי מחמיר' },
    { href: '/breeds/rottweiler', label: 'רוטוויילר: מחירים והוצאות בישראל', reason: 'ברשימה הסגורה בתקנות, חובות נוספות' },
    { href: '/breeds/doberman', label: 'דוברמן: מחירים והוצאות בישראל', reason: 'לא ברשימה, אבל חלות כל חובות הרישוי' },
    { href: '/breeds/canaan', label: 'כלב כנעני: מחירים והוצאות בישראל', reason: 'רישוי רגיל, כמו כל גזע שאינו ברשימה' },
  ],
  'vaccinations-2026': [
    { href: '/breeds/mixed', label: 'כלב מעורב: מחירים והוצאות בישראל', reason: 'הכי נפוץ בשירות הווטרינרי העירוני' },
    { href: '/breeds/canaan', label: 'כלב כנעני: מחירים והוצאות בישראל', reason: 'גזע מקומי עם עמידות טובה' },
    { href: '/breeds/labrador', label: 'לברדור רטריבר: מחירים והוצאות בישראל', reason: 'לוח חיסונים סטנדרטי לגזע גדול' },
    { href: '/breeds/beagle', label: 'ביגל: מחירים והוצאות בישראל', reason: 'גזע בינוני, סדרת חיסונים רגילה לגור' },
  ],
  'dog-microchip-cost': [
    { href: '/breeds/mixed', label: 'כלב מעורב: מחירים והוצאות בישראל', reason: 'שבב הוא הזיהוי היחיד כשאין תעודות' },
    { href: '/breeds/canaan', label: 'כלב כנעני: מחירים והוצאות בישראל', reason: 'עצמאי ונוטה להתרחק, שבב קריטי' },
    { href: '/breeds/husky', label: 'האסקי סיבירי: מחירים והוצאות בישראל', reason: 'אלוף הבריחות, ולכן שבב מעודכן חובה' },
    { href: '/breeds/amstaff', label: 'אמסטאף: מחירים והוצאות בישראל', reason: 'שבב הוא תנאי לרישוי בגזע הזה' },
  ],
  'dog-dental-cost': [
    { href: '/breeds/yorkshire', label: 'יורקשייר טרייר: מחירים והוצאות בישראל', reason: 'גזע זעיר עם צפיפות שיניים ואבנית' },
    { href: '/breeds/maltese', label: 'מלטז: מחירים והוצאות בישראל', reason: 'נוטה לאבנית מוקדמת יחסית' },
    { href: '/breeds/chihuahua', label: "צ'יוואווה: מחירים והוצאות בישראל", reason: 'לסת קטנה, בעיות שיניים נפוצות' },
    { href: '/breeds/poodle', label: 'פודל: מחירים והוצאות בישראל', reason: 'טיפוח כולל גם את הפה, לא רק את הפרווה' },
    { href: '/breeds/shih-tzu', label: 'שיצו: מחירים והוצאות בישראל', reason: 'לסת שטוחה עם סידור שיניים בעייתי' },
  ],
  'vet-visit-cost': [
    { href: '/breeds/saint-bernard', label: 'סנט ברנרד: מחירים והוצאות בישראל', reason: 'כל טיפול בכלב ענק עולה יותר' },
    { href: '/breeds/french-bulldog', label: 'בולדוג צרפתי: מחירים והוצאות בישראל', reason: 'גזע עם ביקורי וטרינר תכופים מהממוצע' },
    { href: '/breeds/cane-corso', label: 'קאנה קורסו: מחירים והוצאות בישראל', reason: 'משקל גבוה שמייקר תרופות והרדמה' },
    { href: '/breeds/mixed', label: 'כלב מעורב: מחירים והוצאות בישראל', reason: 'לרוב עמיד יותר ופחות ביקורים' },
  ],
  'labrador-price': [
    { href: '/breeds/labrador', label: 'לברדור רטריבר: כל מה שצריך לדעת', reason: 'אופי, בריאות והתאמה לאקלים הישראלי' },
    { href: '/breeds/golden', label: 'גולדן רטריבר: כל מה שצריך לדעת', reason: 'ההשוואה הכי נפוצה מול הלברדור' },
    { href: '/breeds/goldendoodle', label: 'גולדנדודל: כל מה שצריך לדעת', reason: 'חלופה משפחתית עם נשירה מופחתת' },
  ],
  'golden-price': [
    { href: '/breeds/golden', label: 'גולדן רטריבר: כל מה שצריך לדעת', reason: 'אופי, בריאות וטיפוח הפרווה' },
    { href: '/breeds/goldendoodle', label: 'גולדנדודל: כל מה שצריך לדעת', reason: 'ההכלאה עם פודל, נשירה מופחתת' },
    { href: '/breeds/labrador', label: 'לברדור רטריבר: כל מה שצריך לדעת', reason: 'הגזע המתחרה, פחות סירוק' },
  ],
  'german-shepherd-price': [
    { href: '/breeds/german-shepherd', label: 'רועה גרמני: כל מה שצריך לדעת', reason: 'אופי, בריאות וצרכי אילוף' },
    { href: '/breeds/malinois', label: 'מלינואה בלגי: כל מה שצריך לדעת', reason: 'דומה, אתלטי ותובעני יותר' },
    { href: '/breeds/doberman', label: 'דוברמן: כל מה שצריך לדעת', reason: 'כלב מגן וחכם באותה קטגוריה' },
    { href: '/breeds/rottweiler', label: 'רוטוויילר: כל מה שצריך לדעת', reason: 'כלב שמירה גדול, רישוי מחמיר יותר' },
  ],
  'pomeranian-price': [
    { href: '/breeds/pomeranian', label: 'פומרניאן: כל מה שצריך לדעת', reason: 'אופי, טיפוח והתאמה לדירה' },
    { href: '/breeds/yorkshire', label: 'יורקשייר טרייר: כל מה שצריך לדעת', reason: 'גזע זעיר נוסף עם פרווה תובענית' },
    { href: '/breeds/maltese', label: 'מלטז: כל מה שצריך לדעת', reason: 'חלופה עדינה בגודל דומה' },
    { href: '/breeds/chihuahua', label: "צ'יוואווה: כל מה שצריך לדעת", reason: 'הקטן ביותר, אופי גדול בהרבה' },
  ],
  'husky-price': [
    { href: '/breeds/husky', label: 'האסקי סיבירי: כל מה שצריך לדעת', reason: 'למה החום הישראלי מאתגר אותו' },
    { href: '/breeds/malinois', label: 'מלינואה בלגי: כל מה שצריך לדעת', reason: 'כלב עבודה אנרגטי בגודל דומה' },
    { href: '/breeds/australian-shepherd', label: 'רועה אוסטרלי: כל מה שצריך לדעת', reason: 'אנרגיה גבוהה עם פרווה שנושרת' },
  ],
}

/* ─────────────────────────────────────────────
   גזע ← מדריכי עלויות.
   ברירת מחדל לכל גזע שאין לו מיפוי ייעודי.
   ───────────────────────────────────────────── */
const breedDefaultGuides: RelatedItem[] = [
  { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'ההוצאה החודשית האמיתית, 600-1,800 ש"ח' },
  { href: '/guides/dog-food-prices', label: 'כמה עולה אוכל לכלבים', reason: 'מחירון מעודכן, 80-450 ש"ח לשק' },
  { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'עיקור כלבה 800-2,500, סירוס זכר 500-1,500 ש"ח' },
  { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'אגרה שנתית, כ-44 ש"ח לכלב מעוקר' },
]

const trainingGuide: RelatedItem = {
  href: '/guides/dog-training-cost',
  label: 'כמה עולה אילוף כלבים',
  reason: 'שיעור פרטי 250-500 ש"ח, קורס קבוצתי 800-1,800 ש"ח',
}
const groomingGuide: RelatedItem = {
  href: '/guides/dog-grooming-cost',
  label: 'כמה עולה מספרה לכלב',
  reason: 'תספורת ותחזוקת פרווה, 120-450 ש"ח',
}
const insuranceGuide: RelatedItem = {
  href: '/guides/dog-insurance',
  label: 'כמה עולה ביטוח לכלב',
  reason: 'פוליסה לגזע רגיש, 70-280 ש"ח לחודש',
}
const surgeryGuide: RelatedItem = {
  href: '/guides/dog-surgery-cost',
  label: 'כמה עולה ניתוח לכלב',
  reason: 'התרחיש היקר שכדאי להכיר מראש, 4,000-15,000 ש"ח',
}
const vetVisitGuide: RelatedItem = {
  href: '/guides/vet-visit-cost',
  label: 'כמה עולה ביקור אצל וטרינר',
  reason: 'ביקור שגרתי 160-430 ש"ח, וביקור חירום יקר יותר',
}
const dentalGuide: RelatedItem = {
  href: '/guides/dog-dental-cost',
  label: 'כמה עולה ניקוי אבנית לכלב',
  reason: 'נעשה בהרדמה מלאה, 500-1,100 ש"ח',
}
const walkerGuide: RelatedItem = {
  href: '/guides/dog-walker-cost',
  label: 'כמה עולה דוגווקר',
  reason: 'חצי שעה 40-80 ש"ח, שעה מלאה 70-130 ש"ח',
}

const labradorPriceGuide: RelatedItem = {
  href: '/guides/labrador-price',
  label: 'כמה עולה גור לברדור',
  reason: 'גור ממגדל 3,500-8,000 ש"ח, ופירוט השנה הראשונה',
}
const goldenPriceGuide: RelatedItem = {
  href: '/guides/golden-price',
  label: 'כמה עולה גולדן רטריבר',
  reason: 'גור 3,500-9,000 ש"ח, ומה מעלה את המחיר',
}
const germanShepherdPriceGuide: RelatedItem = {
  href: '/guides/german-shepherd-price',
  label: 'כמה עולה רועה גרמני',
  reason: 'גור 2,500-9,500 ש"ח לפי קו גידול ותעודות',
}
const pomeranianPriceGuide: RelatedItem = {
  href: '/guides/pomeranian-price',
  label: 'כמה עולה פומרניאן',
  reason: 'גור 6,000-15,000 ש"ח, ועלות הטיפוח השנתית',
}
const huskyPriceGuide: RelatedItem = {
  href: '/guides/husky-price',
  label: 'כמה עולה גור האסקי',
  reason: 'גור 4,000-10,000 ש"ח, והחזקה שנתית של כ-5,500 ש"ח',
}

const breedToGuides: Record<string, RelatedItem[]> = {
  labrador: [labradorPriceGuide, ...breedDefaultGuides.slice(0, 3), trainingGuide],
  golden: [goldenPriceGuide, ...breedDefaultGuides.slice(0, 3), groomingGuide],
  goldendoodle: [goldenPriceGuide, groomingGuide, ...breedDefaultGuides.slice(0, 3)],
  'german-shepherd': [germanShepherdPriceGuide, ...breedDefaultGuides.slice(0, 3), trainingGuide],
  pomeranian: [pomeranianPriceGuide, groomingGuide, ...breedDefaultGuides.slice(0, 3)],
  husky: [huskyPriceGuide, ...breedDefaultGuides.slice(0, 3), trainingGuide],

  'border-collie': [...breedDefaultGuides, trainingGuide, walkerGuide],
  malinois: [...breedDefaultGuides, trainingGuide],
  'australian-shepherd': [...breedDefaultGuides, trainingGuide, walkerGuide],
  vizsla: [...breedDefaultGuides, walkerGuide],
  boxer: [...breedDefaultGuides, walkerGuide, insuranceGuide],
  beagle: [...breedDefaultGuides, walkerGuide],

  'french-bulldog': [...breedDefaultGuides, insuranceGuide, surgeryGuide],
  bulldog: [...breedDefaultGuides, insuranceGuide, surgeryGuide],
  'shih-tzu': [...breedDefaultGuides, insuranceGuide, groomingGuide],
  dachshund: [...breedDefaultGuides, insuranceGuide, surgeryGuide],

  poodle: [...breedDefaultGuides, groomingGuide, dentalGuide],
  maltese: [...breedDefaultGuides, groomingGuide, dentalGuide],
  yorkshire: [...breedDefaultGuides, groomingGuide, dentalGuide],
  cocker: [...breedDefaultGuides, groomingGuide, vetVisitGuide],
  chihuahua: [...breedDefaultGuides, dentalGuide],

  'saint-bernard': [...breedDefaultGuides, vetVisitGuide, surgeryGuide],
  'cane-corso': [...breedDefaultGuides, vetVisitGuide, trainingGuide],
  rottweiler: [...breedDefaultGuides, trainingGuide, vetVisitGuide],
  doberman: [...breedDefaultGuides, trainingGuide],
  amstaff: [...breedDefaultGuides, trainingGuide],
  corgi: [...breedDefaultGuides, trainingGuide],
  canaan: [...breedDefaultGuides, vetVisitGuide],
  mixed: [...breedDefaultGuides, vetVisitGuide],
}

/* ─────────────────────────────────────────────
   עיר ← מדריכי עלויות.
   זהה לכל הערים בכוונה: המחירים דומים ברוב הארץ,
   והפער האמיתי הוא בין רשות לרשות ובין קליניקה לקליניקה.
   מיפוי שונה לכל עיר היה יוצר בידול שאין לו כיסוי בנתונים.
   ───────────────────────────────────────────── */
const cityDefaultGuides: RelatedItem[] = [
  { href: '/guides/monthly-dog-cost', label: 'כמה עולה כלב בחודש', reason: 'התקציב החודשי המלא, 600-1,800 ש"ח' },
  { href: '/guides/dog-license-fee', label: 'כמה עולה רישיון לכלב', reason: 'אגרה שנתית, כ-44 ש"ח לכלב מעוקר' },
  { href: '/guides/spay-neuter-cost', label: 'כמה עולה עיקור וסירוס', reason: 'ובאילו רשויות יש סבסוד עירוני' },
  { href: '/guides/vet-visit-cost', label: 'כמה עולה ביקור אצל וטרינר', reason: 'ביקור שגרתי 160-430 ש"ח, ומה מייקר אותו' },
]

/* ─────────────────────────────────────────────
   API ציבורי
   ───────────────────────────────────────────── */
export const getRelatedForGuide = (slug: string): RelatedItem[] => guideToGuides[slug] ?? []
export const getBreedsForGuide = (slug: string): RelatedItem[] => guideToBreeds[slug] ?? []
export const getGuidesForBreed = (slug: string): RelatedItem[] => breedToGuides[slug] ?? breedDefaultGuides
export const getGuidesForCity = (_citySlug: string): RelatedItem[] => cityDefaultGuides
