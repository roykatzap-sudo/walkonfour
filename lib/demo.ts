import type { Event, ForumCategory, ForumPost, GroupPurchase } from '@/types'

/**
 * נתוני דמו - מוצגים כש-Supabase לא מוגדר (placeholder) או ריק.
 * ברגע שמחברים DB אמיתי עם נתונים, הם מחליפים את אלה אוטומטית.
 */

export const demoEvents: Event[] = [
  { id: 'd1', title: 'מפגש בעלי כלבים בפארק הירקון', description: 'מפגש קהילתי חודשי לבעלי כלבים מכל הגזעים. הביאו את החבר הארבע-רגלי שלכם לבוקר של היכרות, משחק וקפה טוב.', location: 'פארק הירקון', city: 'תל אביב', lat: 32.0956, lng: 34.7985, event_date: '2025-03-14T16:00:00Z', price: 45, max_participants: 100, image_url: null, category: 'meetup', organizer_id: null, is_active: true, created_at: '2025-02-01T00:00:00Z', registrations_count: 64 },
  { id: 'd2', title: 'תזונה נכונה לאורך כל חיי הכלב', description: 'הרצאה מקוונת עם וטרינר על תזונה מאוזנת, מבחירת המזון הנכון ועד התאמת התפריט לגיל ולמשקל. יישאר זמן לשאלות.', location: 'אונליין', city: 'תל אביב', lat: null, lng: null, event_date: '2025-03-16T18:00:00Z', price: 60, max_participants: 200, image_url: null, category: 'lecture', organizer_id: null, is_active: true, created_at: '2025-02-01T00:00:00Z', registrations_count: 38 },
  { id: 'd3', title: 'יריד יד שנייה וציוד לכלבים', description: 'יום שלם של מציאות: רתמות, מיטות, צעצועים ואביזרים יד שנייה במצב מצוין ובמחירים נוחים. כניסה חופשית לכל המשפחה.', location: 'גן סאקר', city: 'ירושלים', lat: 31.7767, lng: 35.2044, event_date: '2025-03-22T10:00:00Z', price: 0, max_participants: null, image_url: null, category: 'market', organizer_id: null, is_active: true, created_at: '2025-02-01T00:00:00Z', registrations_count: 91 },
  { id: 'd4', title: 'סדנת אילוף בסיסי לכלב ולבעליו', description: 'בוקר מעשי שבו לומדים יחד עם המאלף פקודות יסוד, הליכה נינוחה ברצועה ותקשורת רגועה עם הכלב. מתאים לגורים ולכלבים בוגרים כאחד.', location: 'פארק הלאומי', city: 'רמת גן', lat: 32.0834, lng: 34.8214, event_date: '2025-03-28T09:00:00Z', price: 80, max_participants: 25, image_url: null, category: 'training', organizer_id: null, is_active: true, created_at: '2025-02-01T00:00:00Z', registrations_count: 17 },
]

export const demoGroups: GroupPurchase[] = [
  { id: 'g1', title: 'שק מזון יבש 15 ק"ג לכלב בוגר גדול', product_name: 'Royal Canin Maxi Adult', description: 'מזון יבש מלא לכלבים בוגרים מגזעים גדולים, עם הרכב המותאם לצורכי האנרגיה והמפרקים שלהם.', image_url: null, original_price: 290, group_price: 198, min_participants: 50, max_participants: 100, deadline: '2025-03-20T00:00:00Z', supplier_name: 'פטשופ ישראל', supplier_url: null, is_active: true, created_at: '2025-02-01T00:00:00Z', members_count: 78 },
  { id: 'g2', title: 'שק מזון יבש 9 ק"ג לכלב בוגר', product_name: "Hill's Science Diet Adult", description: 'מזון יומיומי מאוזן לכלבים בוגרים, עם תמהיל רכיבים שנועד לתמוך בעיכול ובמשקל תקין.', image_url: null, original_price: 340, group_price: 230, min_participants: 40, max_participants: 100, deadline: '2025-03-25T00:00:00Z', supplier_name: 'וטרינר פלוס', supplier_url: null, is_active: true, created_at: '2025-02-01T00:00:00Z', members_count: 45 },
  { id: 'g3', title: 'רתמה ורצועה לטיולים ארוכים', product_name: 'Ruffwear Front Range', description: 'רתמה עמידה ונוחה שמתאימה לטיולים ארוכים ולפעילות בשטח, עם ריפוד שמפזר את הלחץ ולא מכביד על הכלב.', image_url: null, original_price: 420, group_price: 280, min_participants: 30, max_participants: 100, deadline: '2025-03-30T00:00:00Z', supplier_name: 'אאוטדור דוג', supplier_url: null, is_active: true, created_at: '2025-02-01T00:00:00Z', members_count: 30 },
]

export const demoCategories: ForumCategory[] = [
  { id: 'c1', name: 'שאלות לווטרינר', slug: 'vet', description: 'שאלות על בריאות הכלב וטיפול רפואי', icon: '🩺', sort_order: 1, posts_count: 124 },
  { id: 'c2', name: 'אילוף והתנהגות', slug: 'training', description: 'טיפים, שיטות והתמודדות עם בעיות התנהגות', icon: '🎓', sort_order: 2, posts_count: 89 },
  { id: 'c3', name: 'תזונה ומזון', slug: 'nutrition', description: 'המלצות על מזון והתאמת תפריט לכלב', icon: '🍖', sort_order: 3, posts_count: 67 },
  { id: 'c4', name: 'ציוד והמלצות', slug: 'gear', description: 'חוות דעת על ציוד, אביזרים ומוצרים', icon: '🛒', sort_order: 4, posts_count: 52 },
  { id: 'c5', name: 'שמירה על כלבים', slug: 'petsitting', description: 'חיפוש ומציאת שומרים אמינים לכלב', icon: '🏠', sort_order: 5, posts_count: 41 },
  { id: 'c6', name: 'שיחה כללית', slug: 'general', description: 'הכול על החיים עם כלב, בלי נושא מוגדר', icon: '💬', sort_order: 6, posts_count: 203 },
]

export const demoPosts: ForumPost[] = [
  { id: 'p1', category_id: 'c1', author_id: 'u1', title: 'הכלב שלי מסרב לאכול כבר יומיים', content: 'שלום לכולם. יש לי לברדור בן ארבע שמהיום למחר הפסיק לגעת באוכל. הוא שותה כרגיל ומתנהג בדיוק כמו תמיד חוץ מזה, ואין סימן לכאב או למצוקה. מישהו התמודד עם משהו דומה, ומתי לדעתכם זה הזמן לרוץ לווטרינר?', image_url: null, views: 342, is_pinned: false, is_locked: false, created_at: '2025-03-01T10:00:00Z', updated_at: '2025-03-01T10:00:00Z', author: { id: 'u1', username: null, full_name: 'מיכל כהן', avatar_url: null, city: 'תל אביב', dog_name: 'מקס', dog_breed: 'לברדור', dog_age: 4, dog_photo_url: null, bio: null, is_premium: false, premium_until: null, created_at: '2025-01-01T00:00:00Z' }, comments_count: 12, likes_count: 8 },
  { id: 'p2', category_id: 'c2', author_id: 'u2', title: 'איך הרגלתם את הגור להפסיק לנשוך?', content: 'הגור החדש שלי בן שלושה חודשים נושך כל מה שזז, כולל ידיים ורגליים. ניסיתי להחליף לצעצוע ולהפסיק את המשחק כשהוא נושך, אבל בינתיים בלי שינוי גדול. אשמח לשמוע מה עבד לכם מניסיון אישי.', image_url: null, views: 198, is_pinned: false, is_locked: false, created_at: '2025-03-03T14:00:00Z', updated_at: '2025-03-03T14:00:00Z', author: { id: 'u2', username: null, full_name: 'דני לוי', avatar_url: null, city: 'ירושלים', dog_name: 'באדי', dog_breed: 'גולדן', dog_age: 0, dog_photo_url: null, bio: null, is_premium: true, premium_until: null, created_at: '2025-01-01T00:00:00Z' }, comments_count: 23, likes_count: 15 },
  { id: 'p3', category_id: 'c3', author_id: 'u3', title: 'מחפשת המלצה על מזון לכלבה עם רגישות לעוף', content: 'אובחנה אצל הכלבה שלי רגישות לעוף, והווטרינר המליץ לעבור למזון על בסיס חלבון אחר. מישהו מכיר מזון טוב על בסיס דג או טלה שעבד לכלב שלו? אשמח גם לשמוע כמה זמן לקח עד שראיתם שיפור.', image_url: null, views: 156, is_pinned: false, is_locked: false, created_at: '2025-03-05T09:00:00Z', updated_at: '2025-03-05T09:00:00Z', author: { id: 'u3', username: null, full_name: 'שירה ברק', avatar_url: null, city: 'חיפה', dog_name: 'לונה', dog_breed: 'האסקי', dog_age: 2, dog_photo_url: null, bio: null, is_premium: false, premium_until: null, created_at: '2025-01-01T00:00:00Z' }, comments_count: 7, likes_count: 5 },
]
