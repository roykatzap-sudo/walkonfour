/* ════════════════════════════════════════════════════════════
   helper משותף לכל מייל יוצא של walkonfour.
   - footer אחיד עם זיהוי מפעיל, סיווג תפעולי/שיווקי, ופניות פרטיות
   - לינק הסרה חתום HMAC: לא צריך להיות מחובר כדי להסיר
   - הפרדה: מיילים תפעוליים (לא ניתן להסיר - חובה לפעולה) /
            מיילים שיווקיים (חובה לכלול הסרה לפי סעיף 30א)
   ════════════════════════════════════════════════════════════ */

import { createHmac } from 'crypto'

const SITE_URL = process.env.SITE_URL || 'https://walkonfour.org'
const UNSUB_SECRET = process.env.SESSION_SECRET || ''

export type EmailKind = 'operational' | 'marketing'

/** יוצר טוקן הסרה חתום שלא צריך session - המייל מצורף לטוקן.
 *  הטוקן תקף לתמיד (אין סיבה להגביל - אם המשתמש רוצה להסיר, שיוכל). */
export function buildUnsubToken(email: string): string {
  const payload = Buffer.from(email.toLowerCase()).toString('base64url')
  const sig = createHmac('sha256', UNSUB_SECRET).update(payload).digest('base64url').slice(0, 24)
  return `${payload}.${sig}`
}

/** מאמת טוקן הסרה. מחזיר את המייל אם תקין, null אחרת. */
export function verifyUnsubToken(token: string | null | undefined): string | null {
  if (!token || !UNSUB_SECRET) return null
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return null
  const expectedSig = createHmac('sha256', UNSUB_SECRET).update(payload).digest('base64url').slice(0, 24)
  if (sig !== expectedSig) return null
  try {
    return Buffer.from(payload, 'base64url').toString('utf-8').toLowerCase()
  } catch {
    return null
  }
}

export function unsubscribeUrl(email: string): string {
  return `${SITE_URL}/unsubscribe?t=${buildUnsubToken(email)}`
}

/** ה-footer המשפטי של כל מייל יוצא. שונה לפי תפעולי/שיווקי. */
export function emailFooterHtml(opts: { email: string; kind: EmailKind }): string {
  const { email, kind } = opts
  const unsubLink = `<a href="${unsubscribeUrl(email)}" style="color:#8a7c66;text-decoration:underline">להסרה מדיוור שיווקי</a>`
  const kindLine = kind === 'operational'
    ? 'מייל זה הוא <strong>תפעולי</strong> (פעולה הכרחית) ואינו דיוור.'
    : 'מייל זה הוא <strong>דבר פרסומת</strong> לפי סעיף 30א לחוק התקשורת. ' + unsubLink + '.'
  return `<div style="max-width:480px;margin:18px auto 0;padding:0 8px;font-size:11px;color:#8a7c66;text-align:center;line-height:1.7;direction:rtl">
    <div><strong>קהילה על ארבע</strong> · <a href="${SITE_URL}" style="color:#8a7c66">walkonfour.org</a></div>
    <div style="margin-top:6px">${kindLine}</div>
    <div style="margin-top:4px">נשלח דרך תשתית של ez-suit.org (אותו מפעיל). תגובות יגיעו ל-community@walkonfour.org.</div>
    <div style="margin-top:4px">לשאלות פרטיות / עיון / מחיקה: <a href="mailto:privacy@walkonfour.org" style="color:#8a7c66">privacy@walkonfour.org</a></div>
  </div>`
}

export function emailFooterText(opts: { email: string; kind: EmailKind }): string {
  const { email, kind } = opts
  const kindLine = kind === 'operational'
    ? 'מייל זה הוא תפעולי (פעולה הכרחית) ואינו דיוור.'
    : `מייל זה הוא דבר פרסומת לפי סעיף 30א. להסרה: ${unsubscribeUrl(email)}`
  return `---
קהילה על ארבע · ${SITE_URL}
${kindLine}
נשלח דרך תשתית של ez-suit.org (אותו מפעיל).
פניות פרטיות: privacy@walkonfour.org`
}
