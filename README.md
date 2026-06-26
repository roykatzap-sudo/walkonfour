# כלבניה 🐕

קהילת בעלי הכלבים הגדולה בישראל - Next.js 14 (App Router) + Supabase + Tailwind, RTL מלא.

## מה כבר בנוי

| אזור | נתיב | סטטוס |
|------|------|-------|
| דף בית שיווקי | `/` | ✅ פורט מלא מה-HTML (hero, מרקיזה, גלריה, ריל, פיצ'רים, קבוצות, אירועים, מפה, המלצות, תמחור) |
| הרשמה / התחברות | `/auth/register`, `/auth/login` | ✅ אימייל+סיסמה + Google OAuth |
| אירועים | `/events`, `/events/[id]`, `/events/create` | ✅ רשימה, פרטים, הרשמה, יצירה |
| פורום | `/forum`, `/forum/[category]`, `/forum/post/[id]`, `/forum/new` | ✅ קטגוריות, פוסטים, תגובות + Realtime, לייקים |
| קבוצות רכישה | `/groups` | ✅ פסי התקדמות + הצטרפות |
| פרופיל | `/profile` | ✅ עריכת פרטים + פרטי כלב (מוגן) |
| מפת גינות | `/map` + סקשן בבית | ✅ Leaflet + OpenStreetMap (Overpass) + מצא קרוב אלי |

> **מצב הדגמה:** כל עוד `.env.local` מכיל placeholder, הדפים מציגים **נתוני דמו** (באנר כחול).
> ברגע שמחברים Supabase אמיתי - הנתונים מתחלפים אוטומטית ל-DB.

## הרצה מקומית

```bash
npm install
npm run dev      # http://localhost:3000
```

## חיבור Supabase (כשמוכנים)

1. צרו פרויקט ב-[supabase.com](https://supabase.com).
2. **SQL Editor** → הריצו את `supabase/schema.sql` (טבלאות, RLS, trigger, increment_views, Realtime).
3. **Authentication → Providers** → הפעילו Email, ואופציונלית Google (עם redirect ל-`/auth/callback`).
4. **Project Settings → API** → העתיקו את ה-URL וה-anon key אל `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
5. רענון - הבאנר הכחול נעלם והנתונים אמיתיים.

## פריסה ל-Vercel

`vercel` → הוסיפו את אותם משתני סביבה בלוח הבקרה → Deploy.

## מבנה

```
app/            # דפים (App Router)
components/     # nav, auth, events, forum, groups, map, shared
lib/            # supabase clients, utils, demo data, dog parks, safeQuery
types/          # TypeScript types
supabase/       # schema.sql
```

## עיצוב

- פונט: **Heebo** (Google Fonts), כיוון **RTL** בכל מקום.
- צבעים: ירוק ראשי `#2d7a4f`, accent `#4ade80`, רקע `#f8f6f1` / כהה `#0d1f14`.
- כפתורים pill, כרטיסים מעוגלים, hover עדין, סמן מותאם + שובל כפות בדסקטופ.
