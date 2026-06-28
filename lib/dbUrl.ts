/* ════════════════════════════════════════════════════════════
   מאתר את מחרוזת החיבור ל-Postgres בלי תלות בשם המדויק של המשתנה.
   תומך ב-Railway (DATABASE_URL), ב-Postgres/Neon של Vercel
   (POSTGRES_URL ועוד), וגם ב-prefix מותאם (למשל STORAGE_URL) -
   סורק כל משתנה סביבה שהערך שלו הוא connection string של postgres.
   ════════════════════════════════════════════════════════════ */

export function getDbUrl(): string | undefined {
  const env = process.env
  // מעדיפים חיבור ישיר (non-pooling) - הכי תואם ל-pg עם שאילתות פרמטריות.
  // מכסה Railway (DATABASE_URL), Neon (DATABASE_URL_UNPOOLED), Supabase (POSTGRES_URL_NON_POOLING).
  for (const k of [
    'DATABASE_URL_UNPOOLED',
    'POSTGRES_URL_NON_POOLING',
    'DATABASE_URL',
    'POSTGRES_URL',
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
