/* ════════════════════════════════════════════════════════════
   לוח "כלב אבד / נמצא" - נתוני דמו.
   במצב אמיתי הדיווחים יגיעו מ-Supabase; כאן רשימה סטטית להמחשה.
   ════════════════════════════════════════════════════════════ */

export type LostFoundStatus = 'lost' | 'found' // אבד / נמצא

export const LF_STATUS_LABEL: Record<LostFoundStatus, string> = {
  lost: 'אבד',
  found: 'נמצא',
}

export type LostFoundReport = {
  id: string
  status: LostFoundStatus
  dogName: string | null // לכלב שנמצא לרוב לא יודעים שם
  breed: string // גזע או "מעורב"
  size: 'קטן' | 'בינוני' | 'גדול'
  color: string
  city: string
  area: string // שכונה / אזור מדויק יותר
  date: string // ISO - מתי אבד/נמצא
  chipped: boolean | null // האם שבב זוהה (לכלב שנמצא)
  description: string
  contactName: string
  photo: string // unsplash id
}

/** דיווחים - נתוני דמו, ממוינים מהחדש לישן. */
export const demoReports: LostFoundReport[] = [
  { id: 'lf1', status: 'lost', dogName: 'לונה', breed: 'בורדר קולי', size: 'בינוני', color: 'שחור-לבן', city: 'תל אביב-יפו', area: 'פלורנטין', date: '2026-06-18T07:30:00Z', chipped: true, description: 'ברחה מהחצר בבוקר אחרי רעם. ביישנית, לא תתקרב לזרים, מגיבה לשם "לונה". שבב רשום על שמנו.', contactName: 'מיכל', photo: 'photo-1503256207526-0d5d80fa2f47' },
  { id: 'lf2', status: 'found', dogName: null, breed: 'מעורב', size: 'בינוני', color: 'חום-קרם', city: 'רמת גן', area: 'פארק הלאומי', date: '2026-06-19T16:00:00Z', chipped: false, description: 'הסתובב לבד ליד הכניסה לפארק, ידידותי מאוד ועם קולר אדום בלי תג. אין שבב. מחזיקים אצלנו בינתיים.', contactName: 'יואב', photo: 'photo-1587300003388-59208cc962cb' },
  { id: 'lf3', status: 'lost', dogName: 'מקס', breed: 'לברדור', size: 'גדול', color: 'זהוב', city: 'חיפה', area: 'הדר הכרמל', date: '2026-06-17T18:45:00Z', chipped: true, description: 'נבהל מזיקוקים ורץ. חברותי מאוד וניגש לאנשים, עונה ל"מקס". זקוק לתרופה יומית - כל מידע קריטי.', contactName: 'דנה', photo: 'photo-1552053831-71594a27632d' },
  { id: 'lf4', status: 'found', dogName: null, breed: 'שיצו', size: 'קטן', color: 'לבן-חום', city: 'ירושלים', area: 'קטמון', date: '2026-06-19T09:15:00Z', chipped: true, description: 'נמצא משוטט בשכונה, פרווה ארוכה ומטופחת - כנראה אבד לא מזמן. יש שבב, פנינו לווטרינר לאיתור הבעלים.', contactName: 'אבי', photo: 'photo-1582456891925-a53965520520' },
  { id: 'lf5', status: 'lost', dogName: 'נאלה', breed: 'האסקי', size: 'גדול', color: 'אפור-לבן', city: 'נתניה', area: 'עיר ימים', date: '2026-06-16T20:00:00Z', chipped: true, description: 'קפצה מעל הגדר. עיניים תכולות, אנרגטית ונוטה לברוח רחוק. ראינו אותה לאחרונה רצה לכיוון הטיילת.', contactName: 'רון', photo: 'photo-1605568427561-40dd23c2acea' },
  { id: 'lf6', status: 'found', dogName: null, breed: 'מעורב', size: 'קטן', color: 'שחור', city: 'באר שבע', area: 'נווה זאב', date: '2026-06-18T13:00:00Z', chipped: false, description: 'גורה קטנה ורזה ליד מרכז מסחרי, רעבה ומבוהלת. נתנו אוכל ומים. אין שבב - מחפשים בעלים או אימוץ.', contactName: 'שירה', photo: 'photo-1583511655857-d19b40a7a54e' },
  { id: 'lf7', status: 'lost', dogName: "צ'יף", breed: 'רועה גרמני', size: 'גדול', color: 'שחור-חום', city: 'ראשון לציון', area: 'פארק האשלג', date: '2026-06-15T06:00:00Z', chipped: true, description: 'השתחרר מהרצועה בטיול בוקר. מאולף ומציית לפקודות, אך זהיר עם זרים. נא לא לרדוף - להתקשר אלינו.', contactName: 'עומר', photo: 'photo-1589941013453-ec89f33b5e95' },
  { id: 'lf8', status: 'found', dogName: null, breed: 'פומרניאן', size: 'קטן', color: 'כתום', city: 'הרצליה', area: 'הרצליה פיתוח', date: '2026-06-19T11:30:00Z', chipped: true, description: 'כדור פרווה כתום שהסתובב ליד הים, מטופח ועם שבב. מחזיקים אותו בבית חמים עד שהבעלים יימצאו.', contactName: 'נועה', photo: 'photo-1564631027894-5bdb17618445' },
  { id: 'lf9', status: 'lost', dogName: 'בּלה', breed: 'מעורב', size: 'בינוני', color: 'חום', city: 'פתח תקווה', area: 'כפר גנים', date: '2026-06-14T17:20:00Z', chipped: false, description: 'אבדה בטיול ערב. צולעת קלות על רגל אחורית, חוששת מרעשים. בלי שבב אבל עם קולר ורוד. כל קצה חוט עוזר.', contactName: 'תמר', photo: 'photo-1518020382113-a7e8fc38eac9' },
  { id: 'lf10', status: 'found', dogName: null, breed: 'ביגל', size: 'בינוני', color: 'תלת-צבעי', city: 'כפר סבא', area: 'מרכז העיר', date: '2026-06-18T08:50:00Z', chipped: true, description: 'ביגל ידידותי עם אף עובד שעקב אחרינו הביתה. יש שבב - ניגשנו לאמת מול הווטרינר. מחכה לבעליו בשמחה.', contactName: 'גיא', photo: 'photo-1505628346881-b72b27e84530' },
]

export const LF_CITIES: string[] = [
  'כל הערים',
  ...Array.from(new Set(demoReports.map((r) => r.city))).sort((a, b) => a.localeCompare(b, 'he')),
]

export const lostCount = demoReports.filter((r) => r.status === 'lost').length
export const foundCount = demoReports.filter((r) => r.status === 'found').length

export const lfImg = (id: string, w = 480) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

/** "לפני X" קצר ועברי-תקני (יחיד/רבים). */
export function lfTimeAgo(iso: string, now: number): string {
  const diff = now - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'לפני פחות משעה'
  if (h < 24) return h === 1 ? 'לפני שעה' : `לפני ${h} שעות`
  const d = Math.floor(h / 24)
  return d === 1 ? 'אתמול' : `לפני ${d} ימים`
}
