/* ════════════════════════════════════════════════════════════
   מאתר את מחרוזת החיבור ל-Postgres בלי תלות בשם המדויק של המשתנה.
   תומך ב-Railway (DATABASE_URL), ב-Postgres/Neon של Vercel
   (POSTGRES_URL ועוד), וגם ב-prefix מותאם (למשל STORAGE_URL) -
   סורק כל משתנה סביבה שהערך שלו הוא connection string של postgres.
   ════════════════════════════════════════════════════════════ */

export function getDbUrl(): string | undefined {
  const env = process.env
  // מעדיפים חיבור POOLED (IPv4) - חיבור ישיר של Supabase הוא IPv6-בלבד ו-Vercel
  // לא תומך ב-IPv6 יוצא, אז הישיר נכשל. ה-pooler עובד על Vercel.
  // Railway: DATABASE_URL (IPv4 ישיר) · Neon: DATABASE_URL (pooled) · Supabase: POSTGRES_URL (pooler).
  for (const k of [
    'DATABASE_URL',
    'POSTGRES_URL',
    'DATABASE_URL_UNPOOLED',
    'POSTGRES_URL_NON_POOLING',
    'POSTGRES_PRISMA_URL',
  ]) {
    if (env[k]) return env[k]
  }
  // fallback: כל משתנה שהערך שלו נראה כמו postgres://... (מכסה prefix מותאם של Vercel)
  for (const v of Object.values(env)) {
    if (v && /^postgres(ql)?:\/\//.test(v)) return v
  }
  return undefined
}
