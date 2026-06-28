export type Community = {
  slug: string
  name: string
  district: string
  blurb: string
  accent: string
  photo: string // unsplash id
  lat: number
  lng: number
}

const P = {
  tlv: 'photo-1601758228041-f3b2795255f1',
  park: 'photo-1450778869180-41d0601e046e',
  run: 'photo-1517849845537-4d257902454a',
  city: 'photo-1444723121867-7a241cacace9',
  golden: 'photo-1552053831-71594a27632d',
  pup: 'photo-1583511655857-d19b40a7a54e',
  beach: 'photo-1530281700549-e82e7bf110d6',
  field: 'photo-1568572933382-74d440642117',
}

/**
 * ערים מרכזיות בישראל - לכל אחת קהילה משלה.
 * צבעי ה-accent מוגבלים לפלטת קרם-לברדור בלבד (זהב ראשי #c99a5b / זהב בהיר #e8c887),
 * לשמירה על אחידות מותגית וקונטרסט נגיש מעל התמונות הכהות.
 */
export const communities: Community[] = [
  { slug: 'tel-aviv',    name: 'תל אביב-יפו', district: 'גוש דן',   blurb: 'שישי בבוקר על גדות הירקון, ליד גשר ההלכה. באים עם הקפה, הכלבים משחקים, ואף אחד לא ממהר לשום מקום.', accent: '#e8c887', photo: P.tlv,    lat: 32.0853, lng: 34.7818 },
  { slug: 'jerusalem',   name: 'ירושלים',      district: 'ירושלים',  blurb: 'מקיפים את גן סאקר בשבת אחר הצהריים. הררי, קצת קר בבוקר, והכלבים לומדים לטפס במדרגות נחלאות כמו מקומיים.', accent: '#c99a5b', photo: P.park,   lat: 31.7683, lng: 35.2137 },
  { slug: 'haifa',       name: 'חיפה',         district: 'צפון',     blurb: 'בוקר בטיילת לואי שבכרמל, עם המפרץ פרוס למטה. מי שגר למעלה יודע - אין כמו לרדת לחוף דדו לפני שהשרב מגיע.', accent: '#e8c887', photo: P.beach,  lat: 32.7940, lng: 34.9896 },
  { slug: 'rishon',      name: 'ראשון לציון',  district: 'מרכז',     blurb: 'נפגשים בפארק הסיפורים, שם יש גדר וגם צל. הרבה משפחות עם ילדים וכלב ראשון - אז אף שאלה כאן לא נחשבת טיפשית.', accent: '#c99a5b', photo: P.run,    lat: 31.9730, lng: 34.7925 },
  { slug: 'petah-tikva', name: 'פתח תקווה',    district: 'מרכז',     blurb: 'פארק הירקון הצפוני בקצה ה-482 הוא המגרש הגדול שלנו. אחת לחודש בא מאלף ועונה על השאלות שכולם מתביישים לשאול.', accent: '#e8c887', photo: P.field,  lat: 32.0840, lng: 34.8878 },
  { slug: 'ashdod',      name: 'אשדוד',        district: 'דרום',     blurb: 'חוף הסלעים מותר לכלבים, וזה הסוד הכי שמור בעיר. 6:30 בבוקר, לפני שהחום נכנס, הכלבים נכנסים למים ואנחנו רק מסתכלים.', accent: '#c99a5b', photo: P.beach,  lat: 31.8044, lng: 34.6553 },
  { slug: 'netanya',     name: 'נתניה',        district: 'שרון',     blurb: 'טיילת המצוק עם הים מתחת, ואחר כך יורדים בנחל פולג. הרוח מהים עושה את ההליכה נעימה גם כשבפנים הארץ נחנקים.', accent: '#e8c887', photo: P.run,    lat: 32.3215, lng: 34.8532 },
  { slug: 'beer-sheva',  name: 'באר שבע',      district: 'דרום',     blurb: 'בנחל באר שבע יש שביל מוצל לאורך המים, וזו הצלה בקיץ הנגבי. הרבה סטודנטים עם הכלב הראשון שלהם, וכולם עוזרים אחד לשני.', accent: '#c99a5b', photo: P.field,  lat: 31.2520, lng: 34.7915 },
  { slug: 'holon',       name: 'חולון',        district: 'גוש דן',   blurb: 'פארק פרס בערב, כשהחום שוכך והילדים כבר בבית. גינה מגודרת, ספסל, וחבורה קבועה שמכירה את הכלב שלכם בשם.', accent: '#e8c887', photo: P.city,   lat: 32.0167, lng: 34.7792 },
  { slug: 'ramat-gan',   name: 'רמת גן',       district: 'גוש דן',   blurb: 'הפארק הלאומי, עם האגם והדשא הענק, הוא חצר הבית שלנו. שבת בבוקר ליד הכניסה מרחוב הירדן - מחפשים את חבורת הכלבים, לא תפספסו.', accent: '#c99a5b', photo: P.park,   lat: 32.0680, lng: 34.8248 },
  { slug: 'rehovot',     name: 'רחובות',       district: 'מרכז',     blurb: 'הולכים בשבילי פארק המדע ליד מכון ויצמן, שם שקט ויש צל אמיתי. קצב נינוח, בלי לחץ של עיר גדולה.', accent: '#e8c887', photo: P.golden, lat: 31.8928, lng: 34.8113 },
  { slug: 'herzliya',    name: 'הרצליה',       district: 'שרון',     blurb: 'חוף הנכים בהרצליה פיתוח פתוח לכלבים בשעות הבוקר. אחר כך עולים לקפה בגן ראשונים - חצי מהשולחנות שם עם כלב מתחת.', accent: '#c99a5b', photo: P.beach,  lat: 32.1663, lng: 34.8436 },
  { slug: 'kfar-saba',   name: 'כפר סבא',      district: 'שרון',     blurb: 'גינת הכלבים בפארק העירוני ליד רחוב ויצמן היא נקודת הבוקר-טוב. קטנה, מגודרת, וכולם מכירים שם את כולם - וגם את הכלבים.', accent: '#e8c887', photo: P.field,  lat: 32.1750, lng: 34.9070 },
  { slug: 'raanana',     name: 'רעננה',        district: 'שרון',     blurb: 'פארק רעננה עם האגם הוא הבית, ויש בו פינת כלבים מגודרת רצינית. הרבה חברה אנגלוסקסית, אז יוצא לדבר שם גם קצת אנגלית.', accent: '#c99a5b', photo: P.run,    lat: 32.1848, lng: 34.8713 },
  { slug: 'modiin',      name: 'מודיעין',      district: 'מרכז',     blurb: 'פארק ענבה הגדול, עם שבילים שעוברים בין הגבעות, הוא המסלול הקבוע. עיר חדשה ומתוכננת - כל שכונה כמעט עם גינת כלבים משלה.', accent: '#e8c887', photo: P.park,   lat: 31.8980, lng: 35.0104 },
  { slug: 'bat-yam',     name: 'בת ים',        district: 'גוש דן',   blurb: 'הטיילת בקצה הדרומי, מול חוף ריביירה, בשעת השקיעה. חבורה קטנה וקבועה שמסיימת את הסיבוב בפלאפל ברחוב בלפור.', accent: '#c99a5b', photo: P.beach,  lat: 32.0231, lng: 34.7503 },
  { slug: 'givatayim',   name: 'גבעתיים',      district: 'גוש דן',   blurb: 'עולים לגבעת קוזלובסקי בשביל הנוף, ויורדים לפארק גבעתיים בשביל הכלבים. עיר קטנה וצפופה, אבל פינת הכלבים שם תמיד חיה.', accent: '#e8c887', photo: P.city,   lat: 32.0726, lng: 34.8125 },
  { slug: 'eilat',       name: 'אילת',         district: 'דרום',     blurb: 'כאן הכלל היחיד הוא החום: יוצאים ב-6 בבוקר או אחרי השקיעה, אף פעם באמצע. חבורה קטנה ועיקשת שמכירה כל פיסת צל בעיר.', accent: '#c99a5b', photo: P.beach,  lat: 29.5577, lng: 34.9519 },
]

export const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

export const getCommunity = (slug: string) =>
  communities.find((c) => c.slug === slug) ?? null
