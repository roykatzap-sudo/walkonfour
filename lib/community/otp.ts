/* ════════════════════════════════════════════════════════════
   OTP login - מייל מ-Resend עם קוד 6 ספרות.
   - הקוד נשמר רק כ-hash (SHA-256), לא בטקסט גלוי
   - תקף 10 דקות (OTP_TTL_MIN)
   - מקסימום 5 ניסיונות (OTP_MAX_ATTEMPTS) - מונע bruteforce
   - rate-limit נפרד על שליחת הקודים (rateLimit.ts)
   - אימות מול waitlist - רק מי שנרשם יכול להיכנס לקהילה הסגורה
   ════════════════════════════════════════════════════════════ */

import { createHash, randomInt } from 'crypto'
import type { Client } from 'pg'
import { Resend } from 'resend'
import { withCommunityDb, logAudit } from './db'
import { OTP_TTL_MIN, OTP_MAX_ATTEMPTS } from './schema'

const RESEND_KEY = process.env.RESEND_API_KEY
const FROM = process.env.COMMUNITY_EMAIL_FROM || 'קהילה על ארבע <community@walkonfour.org>'

function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

function generateCode(): string {
  // 6 ספרות, padded - 000000 עד 999999
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

/** האם המייל ברשימת ההמתנה? תנאי כניסה לקהילה הסגורה. */
async function isOnWaitlist(client: Client, email: string): Promise<boolean> {
  const res = await client.query(
    'select 1 from waitlist where lower(email) = lower($1) limit 1',
    [email],
  )
  return (res.rowCount ?? 0) > 0
}

export type RequestOtpResult =
  | { ok: true }
  | { ok: false; reason: 'not_on_waitlist' | 'email_failed' | 'db_failed' | 'rate_limited' | 'unconfigured' }

/**
 * שולח קוד OTP למייל. מוודא קודם שהמייל ברשימת המתנה.
 * חשוב: גם אם המייל לא ברשימה, מחזירים את אותה תגובה למשתמש (אנטי-enumeration).
 * הלוגיקה החיצונית קוראת רק 'ok' / 'rate_limited' כדי לא לדלוף.
 */
export async function requestOtp(email: string, ip: string | null): Promise<RequestOtpResult> {
  if (!RESEND_KEY) return { ok: false, reason: 'unconfigured' }
  const result = await withCommunityDb(async (client) => {
    const onList = await isOnWaitlist(client, email)
    if (!onList) {
      await logAudit(client, null, 'otp.rejected.not_on_waitlist', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'not_on_waitlist' as const }
    }
    const code = generateCode()
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60_000)
    // מחיקה של OTP קודמים פעילים לאותו מייל - רק אחד פעיל פר מייל
    await client.query("delete from community_otp where lower(email) = lower($1) and used_at is null", [email])
    await client.query(
      'insert into community_otp (email, code_hash, expires_at) values ($1, $2, $3)',
      [email.toLowerCase(), hashCode(code), expiresAt],
    )
    // שליחת המייל
    try {
      const resend = new Resend(RESEND_KEY)
      await resend.emails.send({
        from: FROM,
        to: email,
        subject: 'קוד הכניסה שלך לקהילה על ארבע',
        html: emailHtml(code),
        text: emailText(code),
      })
      await logAudit(client, null, 'otp.sent', ip, { email_lc: email.toLowerCase() })
      return { ok: true as const }
    } catch (e) {
      console.error('[otp] email send failed', e)
      await logAudit(client, null, 'otp.email_failed', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'email_failed' as const }
    }
  })
  return result ?? { ok: false, reason: 'db_failed' }
}

export type VerifyOtpResult =
  | { ok: true; userId: number; isNew: boolean }
  | { ok: false; reason: 'invalid' | 'expired' | 'too_many_attempts' | 'db_failed' }

/**
 * מאמת קוד OTP. מצליח → מחזיר userId (יוצר משתמש אם זו פעם ראשונה).
 * אם isNew=true - המשתמש עוד לא קיים, נצטרך onboarding (פרופיל + הסכמה).
 */
export async function verifyOtp(email: string, code: string, ip: string | null): Promise<VerifyOtpResult> {
  const result = await withCommunityDb(async (client) => {
    // מחפש OTP פעיל
    const otpRes = await client.query(
      `select id, code_hash, attempts, expires_at, used_at
       from community_otp
       where lower(email) = lower($1) and used_at is null
       order by created_at desc limit 1`,
      [email],
    )
    const row = otpRes.rows[0]
    if (!row) {
      await logAudit(client, null, 'otp.verify.no_active_code', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'invalid' as const }
    }
    if (new Date(row.expires_at).getTime() < Date.now()) {
      await logAudit(client, null, 'otp.verify.expired', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'expired' as const }
    }
    if (row.attempts >= OTP_MAX_ATTEMPTS) {
      await logAudit(client, null, 'otp.verify.too_many_attempts', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'too_many_attempts' as const }
    }
    // העלאת מונה ניסיונות לפני הבדיקה (מונע race)
    await client.query('update community_otp set attempts = attempts + 1 where id = $1', [row.id])
    if (row.code_hash !== hashCode(code)) {
      await logAudit(client, null, 'otp.verify.bad_code', ip, { email_lc: email.toLowerCase() })
      return { ok: false as const, reason: 'invalid' as const }
    }
    // הצלחה - סימון used + מציאת/יצירת user
    await client.query('update community_otp set used_at = now() where id = $1', [row.id])
    const userRes = await client.query(
      'select id from community_users where lower(email) = lower($1) limit 1',
      [email],
    )
    if (userRes.rows[0]) {
      const userId = Number(userRes.rows[0].id)
      await client.query('update community_users set last_login_at = now() where id = $1', [userId])
      await logAudit(client, userId, 'login.success', ip)
      return { ok: true as const, userId, isNew: false }
    }
    // משתמש חדש - לא יוצרים שורה עדיין. ה-onboarding ימלא nickname/consent.
    await logAudit(client, null, 'login.success.new', ip, { email_lc: email.toLowerCase() })
    return { ok: true as const, userId: -1, isNew: true }
  })
  return result ?? { ok: false, reason: 'db_failed' }
}

// ───────── תוכן המייל ─────────
function emailHtml(code: string): string {
  return `<!DOCTYPE html><html dir="rtl" lang="he"><body style="font-family:-apple-system,system-ui,sans-serif;background:#fbf7ef;padding:24px;color:#2a2018">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:18px;padding:32px 28px;border:1px solid rgba(201,154,91,.22)">
    <div style="text-align:center;font-size:28px;margin-bottom:8px">🐾</div>
    <h1 style="font-size:22px;margin:0 0 6px;font-weight:900;color:#2a2018;text-align:center">קוד הכניסה שלך</h1>
    <p style="font-size:15px;color:#5b4d3c;margin:0 0 24px;text-align:center;line-height:1.55">
      הקוד תקף ל-${OTP_TTL_MIN} דקות. הקלידו אותו במסך ההתחברות.
    </p>
    <div style="font-size:42px;font-weight:900;letter-spacing:.4em;text-align:center;color:#c99a5b;background:#fbf7ef;padding:22px;border-radius:14px;font-family:monospace">${code}</div>
    <p style="font-size:13px;color:#8a7c66;margin:22px 0 0;text-align:center;line-height:1.6">
      אם לא ביקשתם את הקוד הזה - אפשר להתעלם מהמייל. אף אחד לא יוכל להיכנס לחשבון שלכם בלי הקוד.
    </p>
  </div>
  <p style="font-size:12px;color:#8a7c66;margin:18px auto 0;text-align:center;max-width:480px">קהילה על ארבע · walkonfour.org</p>
  </body></html>`
}

function emailText(code: string): string {
  return `קהילה על ארבע - קוד כניסה: ${code}\n\nהקוד תקף ל-${OTP_TTL_MIN} דקות.\nאם לא ביקשתם, התעלמו מהמייל.\n\nwalkonfour.org`
}
