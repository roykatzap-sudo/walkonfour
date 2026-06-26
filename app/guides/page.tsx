import Link from 'next/link'
import { guides, guideImg } from '@/lib/guides'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { CostCalculator } from '@/components/tools/CostCalculator'

export const metadata = {
  title: 'מדריכי טיפול ואילוף · כלבניה',
  description:
    'המדריכים שבאמת עוזרים: גמילה, משיכה ברצועה, חרדת נטישה, חום בקיץ הישראלי וזיקוקים. בלי תיאוריה מנופחת, רק מה שעובד.',
}

export default function GuidesPage() {
  return (
    <main className="page" style={{ maxWidth: 1180 }}>
      <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 28, padding: '8px 4px 28px', marginBottom: 8 }}>
        <FloatingShapes />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="section-tag">מדריכי טיפול ואילוף</span>
          <h1 className="page-title" style={{ fontSize: 46 }}>
            הבעיות האמיתיות, <span className="grad-text">בלי הרצאות</span>
          </h1>
          <p className="page-sub" style={{ maxWidth: 600 }}>
            הכלב מושך, לא נגמל, מפחד מזיקוקים או נמס בחום של אוגוסט? את כל אלה כבר עברנו.
            ריכזנו את מה שבאמת עובד - קצר, אנושי, ולעניין.
          </p>
        </div>
      </div>

      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}
      >
        {guides.map((g, i) => (
          <Reveal3D key={g.slug} as="li" delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
            <Link
              href={`/guides/${g.slug}`}
              aria-label={`${g.title} - קריאה של ${g.readMinutes} דקות`}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderRadius: 20 }}
            >
              <Tilt3D className="sweep" max={7} glare>
                <article
                  style={{
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    border: '1px solid rgba(42,32,24,.08)',
                    boxShadow: '0 4px 18px rgba(42,32,24,.06)',
                    height: '100%',
                  }}
                >
                  <div style={{ position: 'relative', height: 168 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      loading="lazy"
                      decoding="async"
                      src={guideImg(g.photo, 600)}
                      alt={g.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                    <span
                      className="chip3d-dark"
                      style={{ position: 'absolute', top: 12, insetInlineStart: 12, backdropFilter: 'blur(6px)', background: 'rgba(42,32,24,.62)', color: '#fff', border: '1px solid rgba(255,255,255,.3)' }}
                    >
                      {g.category}
                    </span>
                  </div>
                  <div className="lift-3d-sm" style={{ padding: 18 }}>
                    <h2 style={{ margin: 0, fontSize: 19, fontWeight: 800, lineHeight: 1.35 }}>{g.title}</h2>
                    <p style={{ margin: '8px 0 14px', fontSize: 14.5, color: '#5f574c', lineHeight: 1.65 }}>{g.excerpt}</p>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#a87a3e' }}>
                      קריאה של {g.readMinutes} דקות ←
                    </span>
                  </div>
                </article>
              </Tilt3D>
            </Link>
          </Reveal3D>
        ))}
      </ul>

      {/* ===== מחשבון עלויות מוטמע - לפי גזע ספציפי, משקל ושנים ===== */}
      <section style={{ marginTop: 48 }} aria-labelledby="cost-calc-heading">
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <span className="section-tag">לפני שמאמצים</span>
          <h2 id="cost-calc-heading" className="page-title" style={{ fontSize: 38 }}>
            💰 כמה יעלה לגדל <span className="grad-text">דווקא את הכלב שלכם?</span>
          </h2>
          <p className="page-sub" style={{ maxWidth: 640, margin: '0 auto' }}>
            בחרו גזע ספציפי (הגודל והמשקל ייקבעו אוטומטית), ולכמה שנים - וקבלו הערכת עלות כוללת
            עם גרף שמראה את ההוצאה המצטברת לאורך חיי הכלב, כולל ההוצאות הגדולות של השנה הראשונה.
          </p>
        </div>
        <CostCalculator />
        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <Link href="/calculator" className="link">לעמוד המחשבון המלא ←</Link>
        </div>
      </section>

      {/* קישור צולב למדריכי הגזעים */}
      <div className="card" style={{ marginTop: 24, textAlign: 'center', padding: 28 }}>
        <h3 style={{ fontSize: 21, fontWeight: 900, marginBottom: 6 }}>מחפשים מידע על גזע מסוים?</h3>
        <p className="muted" style={{ marginBottom: 18 }}>יש לנו מדריך מלא לכל אחד מ-27 הגזעים הנפוצים בארץ.</p>
        <Link href="/articles" className="btn btn-primary">למדריכי הגזעים</Link>
      </div>
    </main>
  )
}
