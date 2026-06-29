/* ════════════════════════════════════════════════════════════
   סכמת קהילה - 5 טבלאות + ALTER לטבלת waitlist הקיימת.
   כל הטבלאות עם idempotent CREATE כך שאפשר להריץ באופן בטוח כל
   בקשה ראשונה (בדומה ל-waitlist.ts).

   ארכיטקטורה משפטית (אחרי סקירת סוכן 2026-06-29):
   - אין מיקום בזמן אמת. אין geolocation API. הסיכון: נמוך-בינוני.
   - מידע מינימלי. מייל + nickname + פרטי כלב + תיאומים עתידיים + צ'אט.
   - retention: תיאומים נמחקים 24ש אחרי שעת ההגעה. הודעות 24ש אחרי שליחה.
     audit_log נשמר 24 חודש (תקנות אבטחת מידע).
   - גיל 18+ בלבד (community_users.over_18 חובה true בכניסה).
   - הסכמה ראשונית מתועדת ב-consented_at + טקסט הגרסה (consent_version)
     כדי שאם משנים את הטקסט - יודעים מי הסכים למה.
   ════════════════════════════════════════════════════════════ */

/** CREATE statements (idempotent). מורצים מ-ensureCommunitySchema. */
export const CREATE_SQLS = [
  // משתמשים: מי שעבר OTP מרשימת ההמתנה.
  `create table if not exists community_users (
    id bigint generated always as identity primary key,
    email text not null unique,
    nickname text not null,
    over_18 boolean not null default false,
    consent_version text not null,
    consented_at timestamptz not null default now(),
    last_login_at timestamptz,
    notif_operational boolean not null default true,  -- התראות תפעוליות (תיאום בגינה)
    notif_marketing boolean not null default false,   -- דיוור שיווקי (מסונכרן מ-waitlist.marketing_consent)
    deleted_at timestamptz,                            -- soft delete + 30 ימים grace ל-CASCADE
    created_at timestamptz not null default now()
  )`,

  // קודי OTP חד-פעמיים. נמחקים אחרי 10 דקות / שימוש מוצלח.
  `create table if not exists community_otp (
    id bigint generated always as identity primary key,
    email text not null,
    code_hash text not null,
    attempts int not null default 0,
    expires_at timestamptz not null,
    used_at timestamptz,
    created_at timestamptz not null default now()
  )`,

  // כלב פר משתמש (1+). תמונה אופציונלית, EXIF מוסר בשרת.
  `create table if not exists dogs (
    id bigint generated always as identity primary key,
    user_id bigint not null references community_users(id) on delete cascade,
    name text not null,
    breed text,
    age_years numeric(4,1),
    temperament text,
    photo_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`,

  // תיאומי הגעה לגינות. אין מיקום בזמן אמת - רק כוונה עתידית.
  // park_key הוא string שמזהה את הגינה (id מ-allDogParks).
  // expires_at = arrival_at + 30 דק׳, ואז נמחק.
  `create table if not exists park_plans (
    id bigint generated always as identity primary key,
    user_id bigint not null references community_users(id) on delete cascade,
    dog_id bigint not null references dogs(id) on delete cascade,
    park_key text not null,
    arrival_at timestamptz not null,
    expires_at timestamptz not null,
    cancelled_at timestamptz,
    created_at timestamptz not null default now()
  )`,

  // צ'אט פר גינה. 24ש מחיקה קשיחה (cron / cleanup ע"פ קריאה).
  `create table if not exists park_messages (
    id bigint generated always as identity primary key,
    user_id bigint not null references community_users(id) on delete cascade,
    park_key text not null,
    body text not null,
    created_at timestamptz not null default now()
  )`,

  // לוג אבטחה: שמירה 24 חודש לפי תקנות אבטחת מידע.
  // לא תוכן רגיש - רק who-did-what-when.
  `create table if not exists community_audit_log (
    id bigint generated always as identity primary key,
    user_id bigint references community_users(id) on delete set null,
    event text not null,
    ip_hash text,
    details jsonb,
    created_at timestamptz not null default now()
  )`,

  // ALTER לטבלאות קיימות (idempotent) - מוסיף עמודות חדשות אם חסרות
  `alter table community_users add column if not exists notif_operational boolean not null default true`,
  `alter table community_users add column if not exists notif_marketing boolean not null default false`,
  `alter table community_users add column if not exists deleted_at timestamptz`,

  // אינדקסים
  `create index if not exists idx_otp_email on community_otp(email)`,
  `create index if not exists idx_otp_expires on community_otp(expires_at)`,
  `create index if not exists idx_dogs_user on dogs(user_id)`,
  `create index if not exists idx_plans_park on park_plans(park_key, arrival_at)`,
  `create index if not exists idx_plans_user on park_plans(user_id)`,
  `create index if not exists idx_msg_park on park_messages(park_key, created_at desc)`,
  `create index if not exists idx_audit_user on community_audit_log(user_id, created_at desc)`,
]

/** טקסט הגרסה הנוכחית של ההסכמה. כשהטקסט מתעדכן - מעלים את הגרסה.
 *  כך אנחנו יודעים לאיזה טקסט בדיוק כל משתמש הסכים (חובת תיעוד הסכמה). */
export const CURRENT_CONSENT_VERSION = '2026-06-29-v1-placeholder'

/** TTL constants. */
export const OTP_TTL_MIN = 10
export const OTP_MAX_ATTEMPTS = 5
export const PLAN_GRACE_MIN = 30 // התיאום נשאר 30 דק׳ אחרי שעת ההגעה לפני שנמחק
export const PLAN_HORIZON_HOURS = 24 // לא ניתן לתאם יותר מ-24 שעות קדימה
export const CHAT_TTL_HOURS = 24
export const AUDIT_TTL_MONTHS = 24
