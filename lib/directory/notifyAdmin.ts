/* ================================================================
   התראת מייל לאדמין כשתוכן במדריך נתפס בסינון האוטומטי
   ועבר לסטטוס 'pending'. fire-and-forget - לא חוסם את התגובה
   למשתמש, וכישלון שליחה לא מפיל את ההגשה (הפריט מחכה באדמין בכל מקרה).
   ================================================================ */

import { Resend } from 'resend'

const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.COMMUNITY_EMAIL_FROM || 'קהילה על ארבע <community@ez-suit.org>'
const TO = process.env.DIRECTORY_ADMIN_EMAIL || 'ezsuit@ez-suit.org'

export type PendingNotice = {
  type: 'business' | 'review'
  title: string // שם העסק / שם הכותב + העסק
  reasons: string[]
  excerpt: string
}

export async function notifyPendingItem(notice: PendingNotice): Promise<void> {
  if (!RESEND_KEY) {
    console.warn('[directory/notify] RESEND_API_KEY missing - skipping admin email')
    return
  }
  const kind = notice.type === 'business' ? 'עסק חדש' : 'ביקורת חדשה'
  const subject = `ממתין לאישור במדריך העסקים: ${kind}`
  const adminUrl = 'https://walkonfour.org/admin'

  const text = [
    `${kind} נתפס בסינון האוטומטי וממתין לאישור.`,
    '',
    `פריט: ${notice.title}`,
    `סיבות: ${notice.reasons.join(', ')}`,
    `תוכן: ${notice.excerpt.slice(0, 300)}`,
    '',
    `לאישור או דחייה: ${adminUrl} (לשונית "מדריך עסקים")`,
  ].join('\n')

  try {
    const resend = new Resend(RESEND_KEY)
    const res = await resend.emails.send({ from: FROM, to: TO, subject, text })
    if ((res as { error?: unknown }).error) {
      console.error('[directory/notify] Resend rejected:', (res as { error: unknown }).error)
    }
  } catch (e) {
    console.error('[directory/notify] send failed:', e)
  }
}
