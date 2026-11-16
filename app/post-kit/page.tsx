import type { Metadata } from 'next'
import { answerPosts, cityPosts, quizPosts } from '@/lib/postKit'
import { PostKit } from '@/components/postkit/PostKit'

export const metadata: Metadata = {
  title: 'ערכת פוסטים לפייסבוק',
  description: 'תמונה מוכנה וטקסט מוכן לכל פוסט, מתוך הנתונים של האתר.',
  robots: { index: false, follow: false },
}

/**
 * עמוד עבודה (לא תוכן): לכל פוסט תמונה להורדה וטקסט להעתקה.
 * הכול נבנה מהנתונים של האתר, כך שהמספרים בפוסט תמיד זהים למספרים בעמוד.
 */
export default function PostKitPage() {
  const cities = cityPosts()
  const quiz = quizPosts()
  const answers = answerPosts()

  return (
    <div className="page" style={{ maxWidth: 1040 }}>
      <span className="section-tag">ערכת פוסטים</span>
      <h1 className="page-title" style={{ fontSize: 'clamp(30px,4.6vw,44px)' }}>פוסט מוכן: תמונה וטקסט</h1>
      <p className="page-sub" style={{ maxWidth: 760 }}>
        בוחרים פוסט, מורידים את התמונה, מעתיקים את הטקסט ומעלים לפייסבוק. המספרים והשמות נלקחים מהאתר ברגע זה,
        כך שהם תמיד מעודכנים. כל קישור מתויג, ובפאנל הניהול רואים כמה כניסות הביא כל פוסט.
      </p>

      <ol style={{ margin: '0 0 26px', paddingInlineStart: 22, fontSize: 17, lineHeight: 1.9, color: '#3d3226', maxWidth: 760 }}>
        <li>מורידים את התמונה ומעלים אותה לפייסבוק כתמונה רגילה.</li>
        <li>מדביקים את הטקסט. את הקישור אפשר לשים בסוף הפוסט או בתגובה הראשונה. כדאי לנסות פעם כך ופעם כך.</li>
        <li>מעתיקים גם את תיאור התמונה לשדה &quot;טקסט חלופי&quot;, בשביל מי שלא רואה את התמונה.</li>
      </ol>

      <PostKit cities={cities} quiz={quiz} answers={answers} />
    </div>
  )
}
