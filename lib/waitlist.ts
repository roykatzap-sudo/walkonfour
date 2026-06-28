/* ════════════════════════════════════════════════════════════
   רשימת המתנה אמיתית - נשמרת ב-Postgres על Railway דרך הדרייבר
   pg. הספירה אמיתית: מתחילה מאפס וגדלה עם כל הרשמה. עד שמגדירים
   DATABASE_URL, waitlistConfigured() מחזיר false והעמוד מציג מצב
   "בקרוב" כן (בלי לתפוס מיילים לחינם). הטבלה נוצרת אוטומטית בהרשמה
   הראשונה - אין צורך להריץ SQL ידנית.

   הפעלה (חד-פעמי, ~3 דקות):
   1. ב-railway.app → New Project → Provision PostgreSQL (פרויקט נפרד
      מהאתר הקיים שלך, או Add service → Database → PostgreSQL).
   2. במסד שנוצר → Variables/Connect → העתיקו את ה-"Public Network"
      connection string (DATABASE_URL / DATABASE_PUBLIC_URL שמתחיל ב-
      postgresql://...proxy.rlwy.net:PORT/railway).
   3. הוסיפו ב-Vercel env (Production): DATABASE_URL = אותו string.
   4. Redeploy. זהו - הטבלה נוצרת לבד והרשימה חיה.
   ════════════════════════════════════════════════════════════ */

import { Client } from 'pg'

import { getDbUrl } from './dbUrl'

// מאתר את ה-DB בכל שם משתנה (Railway / Vercel-Neon / prefix מותאם)
const DB = getDbUrl()

/** האם מסד הנתונים מוגדר באמת (לא placeholder)? */
export function waitlistConfigured(): boolean {
  return Boolean(DB && /^postgres(ql)?:\/\//.test(DB) && !DB.includes('your-') && !DB.includes('placeholder'))
}

/** יוצר client חדש לכל בקשה (serverless-friendly), עם SSL לחיבור חיצוני. */
function makeClient(): Client {
  return new Client({ connectionString: DB, ssl: { rejectUnauthorized: false } })
}

const CREATE_SQL = `
  create table if not exists waitlist (
    id bigint generated always as identity primary key,
    email text not null unique,
    name text,
    city text,
    marketing_consent boolean not null default false,
    created_at timestamptz default now()
  )`
// לטבלאות קיימות - מוסיף את עמודת ההסכמה אם חסרה (idempotent)
const ALTER_SQL = `alter table waitlist add column if not exists marketing_consent boolean not null default false`

/** ספירת נרשמים אמיתית (0 אם לא מוגדר / טבלה עוד לא קיימת). */
export async function waitlistCount(): Promise<number> {
  if (!waitlistConfigured()) return 0
  const client = makeClient()
  try {
    await client.connect()
    const res = await client.query('select count(*)::int as n from waitlist')
    return res.rows[0]?.n ?? 0
  } catch {
    return 0
  } finally {
    try { await client.end() } catch {}
  }
}

/** מוסיף נרשם. מחזיר 'ok' | 'dup' (כבר קיים) | 'err'. שם פרטי/כינוי אופציונלי (לא שם מלא - לפי מדיניות הפרטיות). */
export async function waitlistAdd(
  email: string,
  name: string | null,
  city: string | null,
  consent = false,
): Promise<'ok' | 'dup' | 'err'> {
  if (!waitlistConfigured()) return 'err'
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL) // יצירת הטבלה אם עוד לא קיימת (idempotent)
    await client.query(ALTER_SQL)  // הוספת עמודת ההסכמה לטבלאות ישנות
    const res = await client.query(
      `insert into waitlist (email, name, city, marketing_consent) values ($1, $2, $3, $4)
       on conflict (email) do nothing returning id`,
      [email, name, city, consent],
    )
    return (res.rowCount ?? 0) > 0 ? 'ok' : 'dup'
  } catch {
    return 'err'
  } finally {
    try { await client.end() } catch {}
  }
}

/** הסרה מדיוור (חוק הספאם): מבטל את ההסכמה לשיווק. מחזיר true אם נמצא ועודכן. */
export async function waitlistUnsubscribe(email: string): Promise<boolean> {
  if (!waitlistConfigured()) return false
  const client = makeClient()
  try {
    await client.connect()
    await client.query(ALTER_SQL)
    const res = await client.query(
      'update waitlist set marketing_consent = false where lower(email) = lower($1)',
      [email],
    )
    return (res.rowCount ?? 0) > 0
  } catch {
    return false
  } finally {
    try { await client.end() } catch {}
  }
}
