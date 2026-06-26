'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { useToast } from '@/components/shared/Toast'
import { WallItem } from '@/components/wall/WallItem'
import { DOG_OF_THE_WEEK_ID, totalHearts, wallPhotos } from '@/lib/wall'

/**
 * קיר הכלבים - פיד תמונות קהילתי.
 *
 * אין backend: הקיר טוען רשימת תמונות דמו מ-lib/wall.ts. כל כרטיס מנהל
 * את מונה הלבבות שלו עצמאית (ב-WallItem), וכפתור "העלו תמונה" מציג toast
 * במקום לפתוח טופס אמיתי. כלב השבוע מקבל כרטיס מודגש בראש הגריד.
 *
 * הגריד הוא masonry אמיתי מבוסס CSS columns - התמונות בגבהים שונים
 * נשתלות זו לצד זו בלי רווחים, וכל כרטיס שומר על break-inside: avoid.
 */
export default function WallPage() {
  const toast = useToast()
  const router = useRouter()

  // מפרידים את כלב השבוע מהשאר כדי להבליט אותו בראש הקיר.
  const featured = useMemo(
    () => wallPhotos.find((p) => p.id === DOG_OF_THE_WEEK_ID) ?? null,
    []
  )
  const rest = useMemo(
    () => wallPhotos.filter((p) => p.id !== DOG_OF_THE_WEEK_ID),
    []
  )

  const total = useMemo(() => totalHearts(), [])

  // העלאת תמונה גדורה מאחורי התחברות, בדיוק כמו שאר הפעולות הקהילתיות
  // (אירועים, פורום). מי שלא מחובר נשלח להרשמה; מי שמחובר מקבל הודעה
  // שההעלאות ייפתחו בקרוב - אין עדיין צינור העלאה אמיתי בצד הלקוח.
  const onUpload = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
    if (!user) {
      toast('כדי להעלות תמונה צריך להתחבר תחילה - מעבירים אתכם להרשמה')
      router.push('/auth/register?next=/wall')
      return
    }
    toast('תודה שהצטרפתם! העלאת תמונות לקיר תיפתח לכולם ממש בקרוב.')
  }

  return (
    <main className="page">
      {/* ── HERO ── */}
      <section
        aria-labelledby="wall-title"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          padding: '58px 28px 62px',
          marginBottom: 32,
          background: 'linear-gradient(160deg, #ffffff 0%, #fbf7ef 100%)',
          border: '1px solid #efe2cd',
          textAlign: 'center',
        }}
      >
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto' }}>
          <span className="section-tag">קיר הכלבים</span>
          <h1
            id="wall-title"
            className="grad-text"
            style={{
              fontSize: 'clamp(38px, 7vw, 64px)',
              fontWeight: 900,
              letterSpacing: '-2px',
              lineHeight: 1.05,
              margin: '4px 0 16px',
            }}
          >
            קיר שלם של פרצופים מתוקים
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: '#5b4d3c', maxWidth: 560, margin: '0 auto 24px' }}>
            כלבים של אנשים מכל הארץ, באמצע פיהוק, שינה או שטות. תגללו, תחייכו, ותנו לב
            לאחד שכבש אתכם. בעל הכלב מהצד השני באמת מתרגש מזה.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <MagneticButton onClick={onUpload} className="btn btn-primary">
              <span aria-hidden style={{ marginInlineEnd: 8 }}>
                ＋
              </span>
              העלו תמונה
            </MagneticButton>
          </div>

          {/* מונה קהילתי */}
          <p style={{ margin: '20px 0 0', fontSize: 14.5, color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--brand-dark)', fontWeight: 900 }}>
              {total.toLocaleString('he-IL')}
            </strong>{' '}
            לבבות חולקו עד עכשיו על{' '}
            <strong style={{ color: 'var(--brand-dark)', fontWeight: 900 }}>
              {wallPhotos.length.toLocaleString('he-IL')}
            </strong>{' '}
            כלבים
          </p>
        </div>
      </section>

      {/* ── כלב השבוע ── */}
      {featured && (
        <section aria-labelledby="featured-title" style={{ marginBottom: 38 }}>
          <h2
            id="featured-title"
            className="page-title"
            style={{ fontSize: 22, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span aria-hidden>★</span>
            כלב השבוע
          </h2>
          <div style={{ maxWidth: 460 }}>
            <Reveal3D>
              <WallItem photo={featured} featured />
            </Reveal3D>
          </div>
        </section>
      )}

      {/* ── הקיר ── */}
      <section aria-labelledby="grid-title">
        <h2
          id="grid-title"
          className="page-title"
          style={{ fontSize: 22, marginBottom: 16 }}
        >
          כל התמונות
        </h2>

        {/* masonry מבוסס columns - נשבר רספונסיבית לפי רוחב המסך */}
        <div className="wall-masonry">
          {rest.map((p, i) => (
            <div key={p.id} className="wall-masonry-item">
              <Reveal3D delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
                <WallItem photo={p} />
              </Reveal3D>
            </div>
          ))}
        </div>
      </section>

      {/* ── קריאה לפעולה ── */}
      <section
        style={{
          marginTop: 48,
          padding: '34px 28px',
          borderRadius: 24,
          textAlign: 'center',
          background: 'linear-gradient(160deg, #2a2018 0%, #3a2c1e 100%)',
          color: '#fff',
          border: '1px solid rgba(232,200,135,.25)',
        }}
      >
        <h2 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 900, letterSpacing: '-1px' }}>
          יש לכם תמונה אחת שגורמת לכולם לחייך?
        </h2>
        <p style={{ margin: '0 auto 20px', maxWidth: 520, fontSize: 16, lineHeight: 1.6, color: 'rgba(255,255,255,.85)' }}>
          כן, ההיא מהגלריה שאתם מראים לכל אחד שמוכן. תעלו אותה לכאן. מגיע לכלב הזה קהל.
        </p>
        <MagneticButton onClick={onUpload} className="btn btn-primary">
          <span aria-hidden style={{ marginInlineEnd: 8 }}>
            ＋
          </span>
          העלו תמונה עכשיו
        </MagneticButton>
      </section>

      {/* סגנון ה-masonry - מקומי לעמוד כדי לא לגעת ב-globals */}
      <style jsx>{`
        .wall-masonry {
          column-count: 3;
          column-gap: 18px;
        }
        .wall-masonry-item {
          margin-bottom: 18px;
          break-inside: avoid;
          -webkit-column-break-inside: avoid;
        }
        @media (max-width: 860px) {
          .wall-masonry {
            column-count: 2;
          }
        }
        @media (max-width: 540px) {
          .wall-masonry {
            column-count: 1;
          }
        }
      `}</style>
    </main>
  )
}
