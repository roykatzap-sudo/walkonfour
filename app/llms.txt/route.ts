import { SITE_URL } from '@/lib/seo'
import { breeds } from '@/lib/breeds'
import { guides } from '@/lib/guides'
import { communities } from '@/lib/communities'

/**
 * /llms.txt - תקן מתפתח (llmstxt.org) שמתאר את האתר למנועי AI
 * (ChatGPT, Perplexity, Google AI Overviews). עוזר ל-GEO: מנועי
 * שפה מקבלים מפה תמציתית ומהימנה של התוכן והקישורים החשובים.
 */
export const dynamic = 'force-static'

export function GET() {
  const u = (p: string) => `${SITE_URL}${p}`

  const body = `# קהילה על ארבע

> מדריכי גזעים, כלים ומפת גינות לבעלי כלבים בישראל. מדריכי גזעים מקיפים, מדריכי אילוף וטיפול, כלים חינמיים, מדריכי ערים, מפת גינות כלבים, לוח אבד/נמצא, אימוץ ושוק יד שנייה. כל התוכן בעברית.

מידע מהימן לבעלי כלבים בישראל: בחירת גזע, אילוף, בריאות, תזונה ובטיחות (כולל נושאים ישראליים כמו חום בקיץ וזיקוקים ביום העצמאות). העצות מבוססות חיזוק חיובי; נושאים רפואיים מנוסחים כלליים עם המלצה להתייעץ עם וטרינר.

## מדריכי גזעים (${breeds.length} גזעים)
${breeds.map((b) => `- [${b.name} (${b.en})](${u(`/articles/${b.slug}`)}): מדריך מלא - אופי, התאמה למשפחה, בריאות, טיפוח ואילוף`).join('\n')}

## מדריכי טיפול ואילוף
${guides.map((g) => `- [${g.title}](${u(`/guides/${g.slug}`)}): ${g.excerpt}`).join('\n')}

## כלים חינמיים
- [מתאם הגזע](${u('/match')}): חידון שממליץ על גזע מתאים לפי אורח חיים
- [מחולל שמות לכלב](${u('/names')})
- [מחשבון עלות גידול כלב](${u('/calculator')})
- [מחשבון גיל הכלב בשנות אדם](${u('/dog-age')}): מותאם לגודל הגזע
- [מחשבון מנת מזון יומית](${u('/food-calculator')}): לפי נוסחת RER/MER
- [מרכז בריאות ועזרה ראשונה](${u('/health')})
- [מסלולי טיול לכלבים](${u('/walks')}): מסלולים אמיתיים ידידותיים לכלבים בישראל

## קהילות לפי עיר (${communities.length} ערים)
${communities.map((c) => `- [קהילת בעלי הכלבים ב${c.name}](${u(`/community/${c.slug}`)})`).join('\n')}

## עוד באתר
- [מפת גינות כלבים](${u('/map')})
- [כלב אבד / נמצא](${u('/lost-found')})
- [אימוץ כלבים](${u('/adopt')})
- [ספריית עסקים לבעלי כלבים](${u('/businesses')})
- [פורום הקהילה](${u('/forum')})
- [אודות](${u('/about')})
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
