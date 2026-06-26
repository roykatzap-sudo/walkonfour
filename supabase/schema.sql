-- ╔══════════════════════════════════════════════════════════════╗
-- ║  כלבניה - סכמת Supabase מלאה                                    ║
-- ║  העתק והרץ ב-Supabase SQL Editor (פעם אחת, בפרויקט חדש).        ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── USERS (extends Supabase auth.users) ──
-- פרטיות-מתוך-עיצוב: הטבלה הזו מחזיקה רק מידע חצי-ציבורי (שם תצוגה, עיר, כלב).
-- המייל יושב ב-auth.users ולעולם לא נחשף דרך ה-API. טלפון/ת"ז/כתובת לא נאספים בכלל.
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  display_name TEXT,        -- כינוי/שם פרטי בלבד; לא שם מלא
  avatar_url TEXT,
  city TEXT,                -- אזור, לא כתובת; אופציונלי
  dog_name TEXT,
  dog_breed TEXT,
  dog_age INTEGER,
  dog_photo_url TEXT,
  bio TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- יצירת פרופיל אוטומטית בהרשמה (קורא את display_name מהטופס הממוקד-פרטיות)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, city, dog_name, dog_breed)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'city',
    NEW.raw_user_meta_data->>'dog_name',
    NEW.raw_user_meta_data->>'dog_breed'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── EVENTS ──
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  event_date TIMESTAMPTZ NOT NULL,
  price INTEGER DEFAULT 0,
  max_participants INTEGER,
  image_url TEXT,
  category TEXT CHECK (category IN ('meetup','lecture','market','training','other')),
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.event_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ── FORUM ──
CREATE TABLE public.forum_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO public.forum_categories (name, slug, description, icon, sort_order) VALUES
  ('שאלות וטרינר', 'vet', 'שאלות רפואיות ובריאות הכלב', '🩺', 1),
  ('אילוף והתנהגות', 'training', 'טיפים ועצות לאילוף', '🎓', 2),
  ('תזונה ומזון', 'nutrition', 'המלצות מזון ותזונה', '🍖', 3),
  ('ציוד והמלצות', 'gear', 'ביקורות על ציוד ומוצרים', '🛒', 4),
  ('פינסיטינג', 'petsitting', 'חיפוש ומציאת שומרים', '🏠', 5),
  ('כלליות', 'general', 'שיחות כלליות', '💬', 6);

CREATE TABLE public.forum_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.forum_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  views INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.forum_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.forum_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.forum_likes (
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY(post_id, user_id)
);

-- ספירת צפיות אטומית
CREATE OR REPLACE FUNCTION public.increment_views(post_id UUID)
RETURNS void AS $$
  UPDATE public.forum_posts SET views = views + 1 WHERE id = post_id;
$$ LANGUAGE sql;

-- ── GROUP PURCHASES ──
CREATE TABLE public.group_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  product_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  original_price INTEGER NOT NULL,
  group_price INTEGER NOT NULL,
  min_participants INTEGER DEFAULT 10,
  max_participants INTEGER DEFAULT 100,
  deadline TIMESTAMPTZ NOT NULL,
  supplier_name TEXT,
  supplier_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.group_purchase_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.group_purchases(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, user_id)
);

-- ── DOG PARKS (cache from OSM) ──
CREATE TABLE public.dog_parks (
  id BIGINT PRIMARY KEY,
  name TEXT,
  city TEXT,
  lat DECIMAL(10,7) NOT NULL,
  lng DECIMAL(10,7) NOT NULL,
  opening_hours TEXT,
  surface TEXT,
  website TEXT,
  last_synced TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS ──
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_purchase_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dog_parks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "events_select" ON public.events FOR SELECT USING (true);
CREATE POLICY "events_insert" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "events_update" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "reg_select" ON public.event_registrations FOR SELECT USING (true);
CREATE POLICY "reg_insert" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reg_delete" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "posts_select" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "posts_update" ON public.forum_posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "posts_delete" ON public.forum_posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "comments_select" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "comments_update" ON public.forum_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "comments_delete" ON public.forum_comments FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "likes_select" ON public.forum_likes FOR SELECT USING (true);
CREATE POLICY "likes_insert" ON public.forum_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete" ON public.forum_likes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "groups_select" ON public.group_purchases FOR SELECT USING (true);
CREATE POLICY "groups_insert" ON public.group_purchases FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "members_select" ON public.group_purchase_members FOR SELECT USING (true);
CREATE POLICY "members_insert" ON public.group_purchase_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "members_delete" ON public.group_purchase_members FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "parks_select" ON public.dog_parks FOR SELECT USING (true);

-- ╔══════════════════════════════════════════════════════════════╗
-- ║  תשתית קהילה - יד שנייה, הודעות מוגנות ודיווחים               ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── MARKETPLACE (יד שנייה) ──
CREATE TABLE public.listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,         -- 0 = חינם/לאיסוף
  condition TEXT,
  city TEXT,
  description TEXT,
  photo_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','sold','removed')),
  promoted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── הודעות פנימיות מוגנות ──
-- הלב של מודל הפרטיות: יצירת קשר בין קונה למוכר בלי לחשוף טלפון/מייל.
-- רק השולח והנמען יכולים לקרוא את ההודעה (ראו RLS למטה).
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES public.listings(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── דיווחים (כפתור הדיווח) ──
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing','post','comment','message','profile')),
  target_id UUID NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports  ENABLE ROW LEVEL SECURITY;

-- יד שנייה: כולם רואים מודעות פעילות/שנמכרו; רק המוכר עורך/מוחק את שלו.
CREATE POLICY "listings_select" ON public.listings FOR SELECT USING (status <> 'removed');
CREATE POLICY "listings_insert" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_update" ON public.listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "listings_delete" ON public.listings FOR DELETE USING (auth.uid() = seller_id);

-- הודעות: רק שני הצדדים בשיחה רואים אותה. זו ה"נעילה" שמחליפה שיתוף טלפונים.
CREATE POLICY "messages_select" ON public.messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "messages_update" ON public.messages FOR UPDATE
  USING (auth.uid() = recipient_id);  -- סימון "נקרא" ע"י הנמען בלבד

-- דיווחים: כל משתמש מחובר יכול לדווח; אף אחד לא קורא דיווחים דרך ה-API
-- (רק צוות דרך service-role). אין policy ל-SELECT = אין קריאה ציבורית.
CREATE POLICY "reports_insert" ON public.reports FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- זכות מחיקה: משתמש יכול למחוק את הפרופיל שלו (מחיקת auth.users מוחקת בקסקייד).
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- ── Realtime (לתגובות חיות בפורום) ──
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_comments;
