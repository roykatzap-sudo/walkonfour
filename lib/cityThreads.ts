/* ════════════════════════════════════════════════════════════
   שרשור לכל עיר בקבוצת הפייסבוק שלנו ("איזו גינה הכי שווה אצלכם?").
   בעמוד של עיר שיש לה שרשור, כפתורי ההצטרפות מובילים ישר אליו, כך שמי שמגיע
   לקבוצה רואה מיד שיחה על העיר שלו ולא קבוצה כללית.
   להוסיף עיר: לפתוח שרשור בקבוצה, להעתיק את הקישור הישיר לפוסט (בלי פרמטרים).
   ════════════════════════════════════════════════════════════ */

const GROUP = 'https://www.facebook.com/groups/2421586375002894'

const THREADS: Record<string, string> = {
  ashdod: `${GROUP}/posts/2559648594530004/`,
  'tel-aviv': `${GROUP}/posts/2559649104529953/`,
  rishon: `${GROUP}/posts/2559649581196572/`,
  herzliya: `${GROUP}/posts/2559652227862974/`,
  'ramat-gan': `${GROUP}/posts/2559652654529598/`,
  netanya: `${GROUP}/posts/2559653064529557/`,
}

/** קישור לשרשור של העיר, או null אם עוד אין. */
export function cityThreadUrl(slug: string): string | null {
  return THREADS[slug] ?? null
}

/** מחלץ את ה-slug מנתיב כמו /city/ashdod. */
export function citySlugFromPath(path: string): string | null {
  const m = path.match(/^\/city\/([a-z0-9-]+)\/?$/)
  return m ? m[1] : null
}
