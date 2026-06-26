// מאגר שמות לכלב - ישראלי ובינלאומי, מחולק לפי מגדר וסגנון.
// אין backend: זה מקור הנתונים הסטטי שמזין את מחולל השמות.

/** מגדר הכלב/ה. 'any' = "לא משנה" (מאחד את שני המאגרים). */
export type DogGender = 'male' | 'female'

/** סגנון השם - קובע את האווירה של ההגרלה. */
export type DogNameStyle = 'cute' | 'tough' | 'funny' | 'classic'

export type DogName = {
  /** השם עצמו (עברית). */
  name: string
  /** משמעות / הקשר קצר - שורה אחת. */
  meaning: string
  gender: DogGender
  style: DogNameStyle
}

/** תוויות מגדר לתצוגה (כולל "לא משנה"). */
export const GENDER_LABELS: Record<DogGender | 'any', string> = {
  any: 'לא משנה',
  male: 'זכר',
  female: 'נקבה',
}

/** תוויות סגנון לתצוגה (כולל "הכול"). */
export const STYLE_LABELS: Record<DogNameStyle | 'any', string> = {
  any: 'כל הסגנונות',
  cute: 'חמוד',
  tough: 'קשוח',
  funny: 'מצחיק',
  classic: 'קלאסי',
}

/** אימוג'י עדין לכל סגנון - לקישוט הצ'יפים בלבד (לא בתוך משפטים). */
export const STYLE_EMOJI: Record<DogNameStyle, string> = {
  cute: '🐾',
  tough: '🦴',
  funny: '🎉',
  classic: '🏛️',
}

export const DOG_NAMES: DogName[] = [
  // ───────────────────────── זכר · חמוד ─────────────────────────
  { name: 'בּוּבָּה', meaning: 'חיבה ישראלית קלאסית לכל גור מתוק', gender: 'male', style: 'cute' },
  { name: 'פּוּפִּיק', meaning: 'מתוק ועגלגל, בדיוק כמו גור', gender: 'male', style: 'cute' },
  { name: 'נַאגֶט', meaning: 'קטן, זהוב וטעים ללב', gender: 'male', style: 'cute' },
  { name: 'מוקה', meaning: 'גוון חום קפה רך ומרגיע', gender: 'male', style: 'cute' },
  { name: 'בּיסקוויט', meaning: 'פריך, מתוק וקל לחבק', gender: 'male', style: 'cute' },
  { name: 'טדי', meaning: 'דובון חי שתמיד רוצה חיבוק', gender: 'male', style: 'cute' },
  { name: 'פּוֹפְּקוֹרְן', meaning: 'קטן, קופצני ומשמח', gender: 'male', style: 'cute' },
  { name: 'צ׳יקו', meaning: '"קטנטן" בספרדית - מושלם לגור', gender: 'male', style: 'cute' },
  { name: 'בָּמְבִּי', meaning: 'עיניים גדולות ולב ענק', gender: 'male', style: 'cute' },
  { name: 'מַרְשְׁמֶלוֹ', meaning: 'רך, לבן ומתוק להפליא', gender: 'male', style: 'cute' },
  { name: 'פִּיסְטוּק', meaning: 'קטן, ירקרק ומשגע - חיבה ישראלית', gender: 'male', style: 'cute' },
  { name: 'קוקוס', meaning: 'מתוק ושעיר, טרופי ונחמד', gender: 'male', style: 'cute' },

  // ───────────────────────── זכר · קשוח ─────────────────────────
  { name: 'רֶמְבּוֹ', meaning: 'לוחם חסר פחד - קלאסיקה לכלב שמירה', gender: 'male', style: 'tough' },
  { name: 'תוֹר', meaning: 'אל הרעם הנורדי, עוצמה טהורה', gender: 'male', style: 'tough' },
  { name: 'בְּרוּטוּס', meaning: 'גנרל רומי איתן וחסון', gender: 'male', style: 'tough' },
  { name: 'טַייסוֹן', meaning: 'אגרוף של ברזל בגוף של כלב', gender: 'male', style: 'tough' },
  { name: 'דיזל', meaning: 'מנוע חזק שלא נעצר', gender: 'male', style: 'tough' },
  { name: 'מַקְס', meaning: 'מקסימום עוצמה בלי מילים מיותרות', gender: 'male', style: 'tough' },
  { name: 'זֵאוּס', meaning: 'מלך האלים - נוכחות שלא מתעלמים ממנה', gender: 'male', style: 'tough' },
  { name: 'אַטְלָס', meaning: 'נושא עולם על הכתפיים, כוח ויציבות', gender: 'male', style: 'tough' },
  { name: 'בְּלֵייד', meaning: 'חד, מהיר ומדויק', gender: 'male', style: 'tough' },
  { name: 'גַרְגַ׳ר', meaning: 'איתן ושרירי - חיבה ישראלית לכלב גדול', gender: 'male', style: 'tough' },
  { name: 'טַנְק', meaning: 'בלתי ניתן לעצירה, כולו שריר', gender: 'male', style: 'tough' },
  { name: 'נימרוד', meaning: 'גיבור צייד מהמקרא, אמיץ ועוצמתי', gender: 'male', style: 'tough' },

  // ───────────────────────── זכר · מצחיק ─────────────────────────
  { name: 'שְׁנִיצֶל', meaning: 'זהוב, פריך ובלתי אפשרי לא לאהוב', gender: 'male', style: 'funny' },
  { name: 'בּוֹרֵקַס', meaning: 'חם, ממולא ומצחיק - ישראלי עד העצם', gender: 'male', style: 'funny' },
  { name: 'צ׳וּפְּצ׳יק', meaning: 'הפרט הקטן והמצחיק שעושה את ההבדל', gender: 'male', style: 'funny' },
  { name: 'נַקְנִיק', meaning: 'ארוך, עגלגל ומשעשע - מתאים לתחש', gender: 'male', style: 'funny' },
  { name: 'פַלָאפֶל', meaning: 'עגול, חום ומקפיץ חיוך', gender: 'male', style: 'funny' },
  { name: 'בַּמְבָּה', meaning: 'קליל, אוורירי וכולם מתים עליו', gender: 'male', style: 'funny' },
  { name: 'קוּגֶל', meaning: 'מתוק, חם ומצחיק - שבת על ארבע', gender: 'male', style: 'funny' },
  { name: 'גַמְבָּה', meaning: 'מצחיק לקרוא ואי אפשר לכעוס עליו', gender: 'male', style: 'funny' },
  { name: 'פִּיצָה', meaning: 'כולם רוצים חתיכה ממנו', gender: 'male', style: 'funny' },
  { name: 'שָׁוַרְמָה', meaning: 'מסתובב סביב עצמו ומשמח את כולם', gender: 'male', style: 'funny' },
  { name: 'טוּבְּלֵרוֹן', meaning: 'משולש, מתוק ומצחיק לבטא', gender: 'male', style: 'funny' },
  { name: 'מַמְבּוֹ', meaning: 'רוקד, קופץ ולא מפסיק לזוז', gender: 'male', style: 'funny' },

  // ───────────────────────── זכר · קלאסי ─────────────────────────
  { name: 'רֶקְס', meaning: '"מלך" בלטינית - שם כלב נצחי', gender: 'male', style: 'classic' },
  { name: 'בָּארוּן', meaning: 'אצילי ומכובד, כלב של ג׳נטלמן', gender: 'male', style: 'classic' },
  { name: 'צ׳ַרְלִי', meaning: 'חברותי ונאמן - קלאסיקה שלא מתיישנת', gender: 'male', style: 'classic' },
  { name: 'אוסקר', meaning: 'מכובד וקלאסי, עם נוכחות', gender: 'male', style: 'classic' },
  { name: 'בֶּנְג׳י', meaning: 'הכלב האהוב מהסרטים, נצחי וחביב', gender: 'male', style: 'classic' },
  { name: 'דּוּקְ', meaning: '"דוכס" - אצילי ושקול', gender: 'male', style: 'classic' },
  { name: 'לֵאוֹ', meaning: 'אריה - גאה, רגוע ובטוח בעצמו', gender: 'male', style: 'classic' },
  { name: 'מָקִים', meaning: 'גרסה קלאסית ועברית לשם מקס - פשוט ואהוב', gender: 'male', style: 'classic' },
  { name: 'רוֹקִי', meaning: 'איתן ונחוש, עם לב של זהב', gender: 'male', style: 'classic' },
  { name: 'גַ׳ק', meaning: 'ידידותי ואמין, שם שעובר דורות', gender: 'male', style: 'classic' },
  { name: 'אַרְיֵה', meaning: 'גאה ועברי, מלך הסוואנה שלכם', gender: 'male', style: 'classic' },
  { name: 'גִּבּוֹר', meaning: 'אמיץ ונאמן - שם עברי מלא משמעות', gender: 'male', style: 'classic' },

  // ───────────────────────── נקבה · חמוד ─────────────────────────
  { name: 'לוּנָה', meaning: 'ירח עדין שמאיר את הבית', gender: 'female', style: 'cute' },
  { name: 'דֵייזִי', meaning: 'פרח חיננית - רך, מתוק ופורח', gender: 'female', style: 'cute' },
  { name: 'בֵּלָה', meaning: '"יפה" באיטלקית - חינני וקלאסי', gender: 'female', style: 'cute' },
  { name: 'נוּגָה', meaning: 'מתוקה ורכה, נמסה בלב', gender: 'female', style: 'cute' },
  { name: 'קוּקִי', meaning: 'עוגייה חיה שאי אפשר להתאפק מולה', gender: 'female', style: 'cute' },
  { name: 'פְּרַלִינֵה', meaning: 'מעודנת ומתוקה כמו שוקולד משובח', gender: 'female', style: 'cute' },
  { name: 'מִילִי', meaning: 'קטנה, חמודה ומלאת חיים', gender: 'female', style: 'cute' },
  { name: 'תּוּתִי', meaning: 'מתוקה ואדומת-לחיים כמו תות', gender: 'female', style: 'cute' },
  { name: 'בֵּיבִּי', meaning: 'תינוקת המשפחה לנצח', gender: 'female', style: 'cute' },
  { name: 'שׁוּגַר', meaning: 'מתוקה כמו סוכר, מלאה אנרגיה', gender: 'female', style: 'cute' },
  { name: 'פְּרַלִין', meaning: 'עדינה, חומה ומפנקת', gender: 'female', style: 'cute' },
  { name: 'לוֹלִי', meaning: 'סוכרייה על מקל - צבעונית ומשמחת', gender: 'female', style: 'cute' },

  // ───────────────────────── נקבה · קשוח ─────────────────────────
  { name: 'זֵינָה', meaning: 'לוחמת נסיכה - חזקה ובלתי מנוצחת', gender: 'female', style: 'tough' },
  { name: 'נִינְגָ׳ה', meaning: 'זריזה, חדה ושקטה כמו צל', gender: 'female', style: 'tough' },
  { name: 'אַתֵנָה', meaning: 'אלת המלחמה והחוכמה - עוצמה ותבונה', gender: 'female', style: 'tough' },
  { name: 'רוֹקְסִי', meaning: 'נועזת, עצמאית ובלתי מתפשרת', gender: 'female', style: 'tough' },
  { name: 'שֵׁבָה', meaning: 'מלכה גאה עם נוכחות מצמררת', gender: 'female', style: 'tough' },
  { name: 'וַלְקִירְיָה', meaning: 'לוחמת נורדית שבוחרת את הגיבורים', gender: 'female', style: 'tough' },
  { name: 'דָקוֹטָה', meaning: 'פראית, חופשייה וחזקה כמו הפרֵרי', gender: 'female', style: 'tough' },
  { name: 'נַאלָה', meaning: 'ציידת אמיצה - מלכת הסוואנה', gender: 'female', style: 'tough' },
  { name: 'סְטוֹרְם', meaning: 'סערה על ארבע רגליים', gender: 'female', style: 'tough' },
  { name: 'לֵיידִי גַ׳ק', meaning: 'נשית, חזקה ובוסית בכל מצב', gender: 'female', style: 'tough' },
  { name: 'אַמַזוֹנָה', meaning: 'לוחמת אגדית, עצמאית ונועזת', gender: 'female', style: 'tough' },
  { name: 'דֶלְתָּא', meaning: 'מהירה, חדה וממוקדת מטרה', gender: 'female', style: 'tough' },

  // ───────────────────────── נקבה · מצחיק ─────────────────────────
  { name: 'מַלָבִּי', meaning: 'רכה, ורודה ומתוקה - קינוח חי', gender: 'female', style: 'funny' },
  { name: 'גְּבִינָה', meaning: 'לבנה, רכה וכולם מתים עליה', gender: 'female', style: 'funny' },
  { name: 'קְצִיצָה', meaning: 'עגלגלה, חמודה ומצחיקה לקרוא', gender: 'female', style: 'funny' },
  { name: 'חוּמוּסָה', meaning: 'ישראלית, חלקה ובלתי אפשרי לכעוס עליה', gender: 'female', style: 'funny' },
  { name: 'פֵיטָה', meaning: 'מלוחה-מתוקה ומשמחת בכל פינה', gender: 'female', style: 'funny' },
  { name: 'בַּקְלָבָה', meaning: 'מתוקה, שכבתית ומלאת אנרגיה', gender: 'female', style: 'funny' },
  { name: 'נוּטֵלָה', meaning: 'מתוקה וחומה שכולם רוצים חתיכה ממנה', gender: 'female', style: 'funny' },
  { name: 'סוּפְגָנִיָה', meaning: 'עגולה, מתוקה וחגיגית כל השנה', gender: 'female', style: 'funny' },
  { name: 'לִימוֹנָדָה', meaning: 'חמצמצה, מרעננת ומלאת חיים', gender: 'female', style: 'funny' },
  { name: 'מַפְלָה', meaning: 'פריכה, מתוקה ומצחיקה - חיבה ישראלית', gender: 'female', style: 'funny' },
  { name: 'בּוּרְקָסָה', meaning: 'חמה, ממולאת ומשמחת את כל השכונה', gender: 'female', style: 'funny' },
  { name: 'צִ׳יפְּסִית', meaning: 'פריכה, מלוחה וממכרת', gender: 'female', style: 'funny' },

  // ───────────────────────── נקבה · קלאסי ─────────────────────────
  { name: 'גְּרֵייסִי', meaning: 'חיננית ומלאת חן - קלאסיקה נצחית', gender: 'female', style: 'classic' },
  { name: 'קְלֵאוֹפַּטְרָה', meaning: 'מלכה מצרית - אצילה ומלכותית', gender: 'female', style: 'classic' },
  { name: 'מֵיזִי', meaning: 'עדינה ומכובדת, שם של ליידי', gender: 'female', style: 'classic' },
  { name: 'רוֹזָה', meaning: 'ורד מלכותי - יופי קלאסי ושקט', gender: 'female', style: 'classic' },
  { name: 'סוֹפִי', meaning: '"חוכמה" ביוונית - אלגנטית ונבונה', gender: 'female', style: 'classic' },
  { name: 'אֵמָה', meaning: 'מעודנת ואהובה, שם שלא מתיישן', gender: 'female', style: 'classic' },
  { name: 'מֵיי', meaning: 'אביבית, רכה ומלאת חן', gender: 'female', style: 'classic' },
  { name: 'לֵיידִי', meaning: 'הגברת מהסרט הקלאסי - אצילית ועדינה', gender: 'female', style: 'classic' },
  { name: 'וִיקְטוֹרְיָה', meaning: 'מלכותית ומכובדת, נצח של אלגנטיות', gender: 'female', style: 'classic' },
  { name: 'תָּמָר', meaning: 'עברית, יפה וזקופה כמו עץ דקל', gender: 'female', style: 'classic' },
  { name: 'שׁוּלִי', meaning: 'חמה וביתית - קלאסיקה ישראלית', gender: 'female', style: 'classic' },
  { name: 'נוֹעָה', meaning: 'עברית ועדינה, "תנועה ונועם"', gender: 'female', style: 'classic' },
]

/**
 * שולף שם אקראי לפי מסננים. אם אין התאמה - נופל חזרה למאגר רחב יותר.
 * @param gender 'male' | 'female' | 'any'
 * @param style  סגנון | 'any'
 * @param exclude שם להימנע ממנו (כדי לא להגריל פעמיים את אותו דבר ברצף)
 */
export function pickRandomName(
  gender: DogGender | 'any',
  style: DogNameStyle | 'any',
  exclude?: string,
): DogName {
  const matches = (g: DogGender | 'any', s: DogNameStyle | 'any') =>
    DOG_NAMES.filter(
      (n) => (g === 'any' || n.gender === g) && (s === 'any' || n.style === s),
    )

  // ניסיון לפי המסננים המלאים, ואז fallback הדרגתי שלא יישבר לעולם.
  let pool = matches(gender, style)
  if (pool.length === 0) pool = matches(gender, 'any')
  if (pool.length === 0) pool = matches('any', style)
  if (pool.length === 0) pool = DOG_NAMES

  // הימנעות מחזרה מיידית כשיש מספיק אפשרויות.
  const filtered =
    exclude && pool.length > 1 ? pool.filter((n) => n.name !== exclude) : pool
  const final = filtered.length ? filtered : pool

  return final[Math.floor(Math.random() * final.length)]
}
