/* ════════════════════════════════════════════════════════════
   מסלולי טיול ידידותיים לכלבים - מסלולים אמיתיים בישראל.
   נאספו ואומתו ממקורות (AT מגזין, וואלה תיירות, AllTrails, קק"ל):
   רק מקומות שמתירים כניסת כלבים. שמורות שאוסרות כלבים (למשל
   נחל דוד בעין גדי) הוצאו במכוון. בשמורות וגנים לאומיים - הכלב
   חייב להיות ברצועה, ולרוב אסורה כניסה למים; מומלץ לאמת מראש
   מדיניות ושעות לפני היציאה.
   ════════════════════════════════════════════════════════════ */

/** רמות הקושי של המסלול (source of truth לסינון ולתגים). */
export const WALK_DIFFICULTIES = ['קל', 'בינוני', 'מאתגר'] as const

export type WalkDifficulty = (typeof WALK_DIFFICULTIES)[number]

export type Walk = {
  id: string
  name: string
  city: string
  region: string // אזור בארץ - לקישוט ולמיון
  lengthKm: number // אורך המסלול בק"מ
  difficulty: WalkDifficulty
  shade: boolean // צל לאורך המסלול
  water: boolean // מקור מים בדרך (נחל / ברזייה / ים)
  fenced: boolean // מקטע מגודר שאפשר לשחרר רצועה
  description: string
  traits: string[] // מאפיינים נוספים - צ'יפים
  lat: number
  lng: number
  photo: string // unsplash id
}

/** מסלולי הטיול - מקומות אמיתיים שמתירים כלבים. */
export const demoWalks: Walk[] = [
  {
    id: 'yarkon-park-tlv',
    name: 'פארק הירקון',
    city: 'תל אביב-יפו',
    region: 'מרכז',
    lengthKm: 4.5,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: true,
    description:
      'מסלול מישורי לאורך הנהר עם צל של עצי איקליפטוס וברזיות מים בכל פינה, ובלב הפארק גם מתחם כלבים מגודר לשחרור רצועה. מושלם לבוקר רגוע או לטיול ערב, ומתאים גם לכלבים מבוגרים.',
    traits: ['מישורי', 'מתחם מגודר', 'ברזיות מים', 'נגיש לעגלה'],
    lat: 32.0997,
    lng: 34.804,
    photo: 'photo-1747571418276-3ada35f941b0',
  },
  {
    id: 'nahal-alexander',
    name: 'נחל אלכסנדר וגשר הצבים',
    city: 'עמק חפר',
    region: 'שרון',
    lengthKm: 3.0,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: false,
    description:
      'שביל רחב וישר לאורך הנחל בעמק חפר, פתוח וחופשי ללא תשלום. צל פסטורלי, מים זורמים עד הים וגשר הצבים המפורסם. הכלב ברצועה ואין כניסה למים - אבל יש שפע נוף וריחות. מתאים גם לרוכבי אופניים.',
    traits: ['ללא תשלום', 'ברצועה', 'גשר הצבים', 'מתאים לאופניים'],
    lat: 32.3897,
    lng: 34.8861,
    photo: 'photo-1689026339723-ca770e8faae2',
  },
  {
    id: 'nahal-taninim',
    name: 'שמורת נחל התנינים',
    city: 'מעגן מיכאל',
    region: 'שרון',
    lengthKm: 2.0,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: false,
    description:
      'מסלול מעגלי קצר בשמורת טבע מטופחת בין זכרון יעקב לחדרה, עם נחל זורם וצמחייה ירוקה. הכלב חייב להיות ברצועה ואסור שייכנס למים. הכניסה בתשלום - כדאי לאמת מראש שעות פתיחה ומדיניות כלבים.',
    traits: ['שמורת טבע', 'ברצועה בלבד', 'מעגלי', 'בתשלום'],
    lat: 32.543,
    lng: 34.9085,
    photo: 'photo-1689026339723-ca770e8faae2',
  },
  {
    id: 'maayan-harod',
    name: 'גן לאומי מעיין חרוד',
    city: 'עמק יזרעאל',
    region: 'צפון',
    lengthKm: 2.5,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: false,
    description:
      'גן לאומי ירוק למרגלות הגלבוע, עם מדשאות, עצי צל ומים זכים הנובעים ממערה. כלבים מותרים ברצועה (לא בתוך הבריכות). מקום נינוח למשפחות ולפיקניק אחרי הטיול. הכניסה בתשלום.',
    traits: ['גן לאומי', 'דשא וצל', 'ברצועה', 'בתשלום'],
    lat: 32.5503,
    lng: 35.3567,
    photo: 'photo-1747571418276-3ada35f941b0',
  },
  {
    id: 'jerusalem-forest-cedars',
    name: 'יער ירושלים - שביל הארזים',
    city: 'ירושלים',
    region: 'ירושלים',
    lengthKm: 4.0,
    difficulty: 'קל',
    shade: true,
    water: false,
    fenced: false,
    description:
      'שביל יער מוצל בהרי ירושלים, פתוח וחינמי, עם חורש עבות שמספק צל לכל אורך הדרך. מתאים לטיול נחת, והאוויר ההררי נעים גם בקיץ. אין מקור מים בדרך - קחו בקבוק וקערה מתקפלת.',
    traits: ['יער מוצל', 'ללא תשלום', 'אוויר הרים'],
    lat: 31.79,
    lng: 35.15,
    photo: 'photo-1752230446597-a5b08f8647e4',
  },
  {
    id: 'park-britannia',
    name: 'פארק בריטניה',
    city: 'אדרת (שפלה)',
    region: 'שפלה',
    lengthKm: 5.0,
    difficulty: 'בינוני',
    shade: true,
    water: true,
    fenced: false,
    description:
      'פארק יער ענק בשפלה עם שבילים בין גבעות, מערות, בורות מים ומעיינות. כמה מסלולים לבחירה - מסלול הבורות מאתגר יותר. חינמי ומתאים לפיקניק, עם הרבה צל. קחו מים ושימו לב לחום בימי הקיץ.',
    traits: ['יער', 'מעיינות', 'ללא תשלום', 'פיקניק'],
    lat: 31.7,
    lng: 34.967,
    photo: 'photo-1743878206228-5f36b5f5c830',
  },
  {
    id: 'canada-ayalon-park',
    name: 'פארק קנדה-איילון',
    city: 'לטרון',
    region: 'שפלה',
    lengthKm: 3.5,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: false,
    description:
      'שבילי טבע מוצלים סביב מעיינות וטרסות עתיקות ליד צומת לטרון. מסלול נוח עם מים בדרך וצל נדיב, מתאים גם לכלבים שמעדיפים קצב רגוע. הכלב ברצועה.',
    traits: ['מעיינות', 'מוצל', 'ברצועה'],
    lat: 31.8389,
    lng: 34.9889,
    photo: 'photo-1752230446597-a5b08f8647e4',
  },
  {
    id: 'nimrod-fortress',
    name: 'גן לאומי מבצר נמרוד',
    city: 'רמת הגולן',
    region: 'צפון',
    lengthKm: 2.5,
    difficulty: 'בינוני',
    shade: false,
    water: false,
    fenced: false,
    description:
      'טיול בגן לאומי שמתיר כניסת כלבים ברצועה, סביב אחד המבצרים המרשימים בארץ עם נוף לחרמון ולגולן. יש מדרגות וטיפוס קל וצל חלקי בלבד. הכניסה בתשלום - אמתו מראש את מדיניות הכלבים.',
    traits: ['גן לאומי', 'נוף חרמון', 'ברצועה', 'בתשלום'],
    lat: 33.2528,
    lng: 35.7136,
    photo: 'photo-1745299039187-46e5364d6d9b',
  },
  {
    id: 'lahav-forest',
    name: 'יער להב וחורבת זרק',
    city: 'להב',
    region: 'דרום',
    lengthKm: 2.0,
    difficulty: 'קל',
    shade: true,
    water: false,
    fenced: false,
    description:
      'חורשת אורנים נעימה בדרום השפלה ליד קיבוץ להב, עם מסלול קצר וקל, פינות פיקניק וחורבת זרק הסמוכה. צל נאה ומקום מצוין למשפחות עם כלב. קחו מים - אין ברזיות בדרך.',
    traits: ['חורשה', 'פיקניק', 'קצר וקל'],
    lat: 31.3786,
    lng: 34.8714,
    photo: 'photo-1743878206228-5f36b5f5c830',
  },
  {
    id: 'poleg-reserve',
    name: 'שמורת שער פולג',
    city: 'נתניה',
    region: 'שרון',
    lengthKm: 3.0,
    difficulty: 'קל',
    shade: false,
    water: true,
    fenced: false,
    description:
      'מסלול קצר ומישורי בשמורת טבע דרומית לנתניה, עם בריכת חורף וצמחייה ייחודית. הכלב ברצועה, והצל מועט - עדיף בשעות הבוקר או אחר הצהריים. נקודת טבע שקטה קרובה לעיר.',
    traits: ['שמורת טבע', 'בריכת חורף', 'ברצועה'],
    lat: 32.267,
    lng: 34.846,
    photo: 'photo-1746973354525-35c4ebee8a17',
  },
  {
    id: 'nahal-siach-carmel',
    name: 'נחל שיח',
    city: 'חיפה',
    region: 'צפון',
    lengthKm: 2.0,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: false,
    description:
      'ערוץ ירוק ומוצל בלב חיפה עם נחל קטן וצמחייה כרמלית. מסלול קצר ונעים, אך מי הנחל אינם ראויים לשתייה - הביאו מים נקיים. עליות מתונות והרבה ריחות לכלב סקרן.',
    traits: ['ערוץ ירוק', 'בלב העיר', 'נחל (לא לשתייה)'],
    lat: 32.77,
    lng: 34.995,
    photo: 'photo-1752230446597-a5b08f8647e4',
  },
  {
    id: 'agamon-hahula',
    name: 'אגמון החולה',
    city: 'עמק החולה',
    region: 'צפון',
    lengthKm: 8.5,
    difficulty: 'בינוני',
    shade: false,
    water: true,
    fenced: true,
    description:
      'שביל רחב סביב האגם בעמק החולה, חלקו במקטעים מגודרים שמאפשרים לשחרר רצועה בבטחה. עונת הנדידה הופכת אותו לחוויה מרהיבה. המסלול ארוך ופתוח לשמש - צאו מוקדם, קחו הרבה מים, ואפשר גם לשכור עגלה חשמלית.',
    traits: ['סביב האגם', 'ציפורים נודדות', 'מקטעים מגודרים', 'בתשלום'],
    lat: 33.1078,
    lng: 35.5953,
    photo: 'photo-1746973354525-35c4ebee8a17',
  },
  {
    id: 'raanana-dog-park',
    name: 'פארק רעננה - מתחם הכלבים',
    city: 'רעננה',
    region: 'שרון',
    lengthKm: 1.8,
    difficulty: 'קל',
    shade: true,
    water: true,
    fenced: true,
    description:
      'גן פארק מטופח עם מתחם כלבים מגודר גדול שבו אפשר לשחרר רצועה לגמרי. דשא רך, ברזיות מים והרבה צל מעצים בוגרים. אידיאלי למפגשים חברתיים של כלבים ולמשחקי כדור.',
    traits: ['מגודר לחלוטין', 'דשא ומשחק', 'ידידותי למשפחות'],
    lat: 32.1782,
    lng: 34.8702,
    photo: 'photo-1747571418276-3ada35f941b0',
  },
  {
    id: 'herzliya-dog-beach',
    name: 'חוף הכלבים הרצליה',
    city: 'הרצליה',
    region: 'שרון',
    lengthKm: 3.0,
    difficulty: 'קל',
    shade: false,
    water: true,
    fenced: false,
    description:
      'מקטע חוף שבו מותר להביא כלבים - חול רך, אוויר ים ומים להתרעננות. עדיף בשעות הבוקר או לקראת שקיעה כי אין צל. שימו לב לתקנון החוף ולשעות שבהן הכניסה עם כלב מותרת.',
    traits: ['חוף כלבים', 'שקיעות', 'רחצה'],
    lat: 32.17,
    lng: 34.795,
    photo: 'photo-1738275793154-d96539ed1c56',
  },
]

/** רשימת הערים הייחודיות, ממוינות, עם "כל הערים" בראש (לתפריט הסינון). */
export const walkCities: string[] = [
  'כל הערים',
  ...Array.from(new Set(demoWalks.map((w) => w.city))).sort((a, b) =>
    a.localeCompare(b, 'he'),
  ),
]

/** מספר המסלולים המגודרים - לשימוש במדדים בכותרת. */
export const fencedCount = demoWalks.filter((w) => w.fenced).length

/** סך הקילומטרים בכל המסלולים - מדד שיווקי קליל בכותרת. */
export const totalKm = Math.round(
  demoWalks.reduce((sum, w) => sum + w.lengthKm, 0),
)

/** בונה כתובת תמונת unsplash אחידה (q=55, lazy ידידותי). */
export const walkImg = (id: string, w = 480) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

/** בונה קישור ניווט ל-Google Maps לפי קואורדינטות נקודת ההתחלה. */
export const walkNavUrl = (walk: Walk) =>
  `https://www.google.com/maps/dir/?api=1&destination=${walk.lat},${walk.lng}`
