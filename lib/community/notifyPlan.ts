/* ════════════════════════════════════════════════════════════
   התראת מייל "מישהו תיאם לגינה שגם אתה תיאמת בה" - תפעולי.

   נשלח רק למשתמשים עם notif_operational=true.
   חלון התאמה: ±3 שעות סביב שעת ההגעה החדשה.
   רגיש: אנונימי - לא חושף את שם המתאם, רק "מישהו תיאם הגעה לגינה X
   ב-XX:XX". (השמות נחשפים רק 15 דק׳ לפני בפועל - לפי הסקירה המשפטית).
   ════════════════════════════════════════════════════════════ */

import type { Client } from 'pg'
import { Resend } from 'resend'
import { emailFooterHtml, emailFooterText } from './emailFooter'
import { allDogParks } from '../dogParksAll'

const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.COMMUNITY_EMAIL_FROM || 'קהילה על ארבע <community@ez-suit.org>'
const REPLY_TO = process.env.COMMUNITY_EMAIL_REPLY_TO || 'community@walkonfour.org'
const SITE_URL = process.env.SITE_URL || 'https://walkonfour.org'

type Recipient = { user_id: number; email: string; nickname: string }

/** מחפש משתמשים אחרים שתיאמו לאותה גינה בחלון ±3 שעות סביב arrivalAt.
 *  מסנן: לא המשתמש עצמו, רק עם notif_operational=true, ולא חסומים הדדית. */
export async function findCoplanners(
  client: Client,
  planUserId: number,
  parkKey: string,
  arrivalAt: Date,
): Promise<Recipient[]> {
  const res = await client.query(
    `select distinct on (u.id) u.id as user_id, u.email, u.nickname
     from park_plans p
     join community_users u on u.id = p.user_id
     where p.park_key = $1
       and p.user_id != $2
       and p.cancelled_at is null
       and p.expires_at > now()
       and abs(extract(epoch from (p.arrival_at - $3::timestamptz))) <= 3 * 3600
       and u.notif_operational = true
       and u.id not in (select blocked_id from user_blocks where blocker_id = $2)
       and u.id not in (select blocker_id from user_blocks where blocked_id = $2)
     order by u.id, p.created_at desc
     limit 50`,
    [parkKey, planUserId, arrivalAt.toISOString()],
  )
  return res.rows as Recipient[]
}

/** שולח התראות לכל המתאמים שמצאנו. אנונימי - לא חושף את שם המתאם החדש.
 *  כשלי שליחה (Resend / רשת) - נבלעים בשקט. לא חוסם את היצירה. */
export async function notifyCoplanners(
  recipients: Recipient[],
  parkKey: string,
  arrivalAt: Date,
): Promise<void> {
  if (!RESEND_KEY || !recipients.length) return
  const park = allDogParks.find((p) => String(p.id) === parkKey)
  const parkName = park?.name || 'גינה'
  const cityName = park?.city || ''
  const timeStr = formatTime(arrivalAt)
  const dateStr = formatDate(arrivalAt)
  const resend = new Resend(RESEND_KEY)
  await Promise.all(recipients.map(async (r) => {
    try {
      await resend.emails.send({
        from: FROM,
        to: r.email,
        replyTo: REPLY_TO,
        subject: `מישהו תיאם הגעה ל${parkName} ב-${timeStr}`,
        html: htmlBody({ nickname: r.nickname, parkName, cityName, dateStr, timeStr, parkKey, email: r.email }),
        text: textBody({ nickname: r.nickname, parkName, cityName, dateStr, timeStr, parkKey, email: r.email }),
      })
    } catch {/* silent */}
  }))
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jerusalem' })
}
function formatDate(d: Date): string {
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'היום'
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === tomorrow.toDateString()) return 'מחר'
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
}

function htmlBody(opts: { nickname: string; parkName: string; cityName: string; dateStr: string; timeStr: string; parkKey: string; email: string }): string {
  const { nickname, parkName, cityName, dateStr, timeStr, parkKey, email } = opts
  const cityLine = cityName ? `<div style="font-size:13px;color:#8a7c66">${cityName}</div>` : ''
  return `<!DOCTYPE html><html dir="rtl" lang="he"><body style="font-family:-apple-system,system-ui,sans-serif;background:#fbf7ef;padding:24px;color:#2a2018">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;padding:28px 26px;border:1px solid rgba(201,154,91,.22)">
    <div style="text-align:center;font-size:26px;margin-bottom:6px">🐾</div>
    <h1 style="font-size:20px;margin:0 0 14px;font-weight:900;color:#2a2018;text-align:center">שלום ${escapeHtml(nickname)},</h1>
    <p style="font-size:15px;color:#5b4d3c;margin:0 0 18px;text-align:center;line-height:1.55">
      מישהו מהקהילה תיאם הגעה לאותה גינה שגם אתם תיאמתם בה.
    </p>
    <div style="background:#fbf7ef;border:1px solid rgba(201,154,91,.22);border-radius:14px;padding:16px;margin:0 0 18px">
      <div style="font-size:17px;font-weight:900;color:#2a2018">${escapeHtml(parkName)}</div>
      ${cityLine}
      <div style="font-size:15px;color:#5b4d3c;margin-top:10px"><strong>${escapeHtml(dateStr)} · ${escapeHtml(timeStr)}</strong></div>
    </div>
    <p style="font-size:13px;color:#8a7c66;margin:0 0 18px;text-align:center;line-height:1.6">
      שמות החברים שתיאמו נחשפים זה לזה רק 15 דקות לפני שעת ההגעה (מסיבות בטיחות).
    </p>
    <a href="${SITE_URL}/community/parks/${encodeURIComponent(parkKey)}" style="display:block;text-align:center;background:#c99a5b;color:#fff;padding:12px;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none">🐕 לפרטים ולצ'אט הגינה</a>
  </div>
  ${emailFooterHtml({ email, kind: 'operational' })}
  </body></html>`
}

function textBody(opts: { nickname: string; parkName: string; cityName: string; dateStr: string; timeStr: string; parkKey: string; email: string }): string {
  const { nickname, parkName, cityName, dateStr, timeStr, parkKey, email } = opts
  return `שלום ${nickname},

מישהו מהקהילה תיאם הגעה לאותה גינה שגם אתם תיאמתם בה.

${parkName}${cityName ? ` · ${cityName}` : ''}
${dateStr} · ${timeStr}

שמות החברים נחשפים זה לזה רק 15 דקות לפני שעת ההגעה.

לפרטים ולצ'אט: ${SITE_URL}/community/parks/${encodeURIComponent(parkKey)}

${emailFooterText({ email, kind: 'operational' })}`
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
