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

const DB = process.env.DATABASE_URL

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
    created_at timestamptz default now()
  )`

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
): Promise<'ok' | 'dup' | 'err'> {
  if (!waitlistConfigured()) return 'err'
  const client = makeClient()
  try {
    await client.connect()
    await client.query(CREATE_SQL) // יצירת הטבלה אם עוד לא קיימת (idempotent)
    const res = await client.query(
      `insert into waitlist (email, name, city) values ($1, $2, $3)
       on conflict (email) do nothing returning id`,
      [email, name, city],
    )
    return (res.rowCount ?? 0) > 0 ? 'ok' : 'dup'
  } catch {
    return 'err'
  } finally {
    try { await client.end() } catch {}
  }
}
