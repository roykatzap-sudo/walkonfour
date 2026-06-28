/* ════════════════════════════════════════════════════════════
   מאתר את מחרוזת החיבור ל-Postgres בלי תלות בשם המדויק של המשתנה.
   תומך ב-Railway (DATABASE_URL), ב-Postgres/Neon של Vercel
   (POSTGRES_URL ועוד), וגם ב-prefix מותאם (למשל STORAGE_URL) -
   סורק כל משתנה סביבה שהערך שלו הוא connection string של postgres.
   ════════════════════════════════════════════════════════════ */

export function getDbUrl(): string | undefined {
  const env = process.env
  // שמות מפורשים נפוצים, לפי סדר עדיפות (pooled לפני unpooled)
  for (const k of ['DATABASE_URL', 'POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'DATABASE_URL_UNPOOLED']) {
    if (env[k]) return env[k]
  }
  // fallback: כל משתנה שהערך שלו נראה כמו postgres://... (מכסה prefix מותאם של Vercel)
  for (const v of Object.values(env)) {
    if (v && /^postgres(ql)?:\/\//.test(v)) return v
  }
  return undefined
}
