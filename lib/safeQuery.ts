/**
 * עוטף קריאת Supabase כך שכשל (Supabase לא מוגדר / רשת) מחזיר fallback
 * במקום לזרוק. כך הדפים מציגים נתוני דמו במצב placeholder.
 *
 * SECURITY / DEV-ONLY:
 * ה-fallback לנתוני דמו נועד למצב פיתוח. אם RLS לא מוגדר נכון ב-Supabase,
 * שאילתות לא מורשות עלולות לחזור בשקט עם נתוני דמו במקום להיחסם - מה שמסתיר
 * תצורה שגויה ומערבב נתוני דמו עם נתונים אמיתיים. לפני עלייה לפרודקשן יש לוודא
 * שמדיניות ה-RLS נבדקה ושמפתח ה-anon מוגבל להרשאות מינימליות.
 *
 * הערך המוחזר כולל גם `status` גרנולרי כדי להבחין בין כשל (demo), תוצאה ריקה
 * לגיטימית (empty), ונתונים אמיתיים (live). `isDemo` נשמר לתאימות לאחור: מאחר
 * שה-fallback הוא נתוני דמו מאוכלסים, גם תוצאה ריקה מסומנת `isDemo: true` כדי
 * שהבאנר יוצג ולא נציג נתוני דמו כאילו היו אמיתיים. צרכנים חדשים שרוצים להבחין
 * בין "אין תוצאות" לבין "כשל" יכולים לבדוק את `status` ולספק fallback ריק משלהם.
 */
export type SafeQueryStatus = 'live' | 'empty' | 'demo'

export async function safeQuery<T>(
  run: () => PromiseLike<{ data: T | null; error: unknown }>,
  fallback: T
): Promise<{ data: T; isDemo: boolean; status: SafeQueryStatus }> {
  try {
    const { data, error } = await run()

    // כשל רשת / Supabase לא מוגדר → נתוני דמו.
    if (error) {
      console.error('[safeQuery] Supabase error - returning demo data', error)
      return { data: fallback, isDemo: true, status: 'demo' }
    }

    // תוצאה ריקה לגיטימית (null או מערך ריק) - מובחנת ב-status='empty', אבל
    // עדיין מחזירה fallback ומסומנת isDemo כדי לא להציג דמו ללא באנר.
    if (data == null || (Array.isArray(data) && data.length === 0)) {
      return { data: fallback, isDemo: true, status: 'empty' }
    }

    return { data, isDemo: false, status: 'live' }
  } catch (err) {
    console.error('[safeQuery] unexpected exception - returning demo data', err)
    return { data: fallback, isDemo: true, status: 'demo' }
  }
}
