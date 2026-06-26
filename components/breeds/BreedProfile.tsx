import type { Breed } from '@/lib/breeds'
import { breedImg } from '@/lib/breeds'
import { getBreedDetail } from '@/lib/breedDetails'
import { hasArticle } from '@/lib/articles'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { FloatingShapes } from '@/components/fx/FloatingShapes'

const ENERGY_LABEL: Record<number, string> = {
  1: 'רגוע מאוד',
  2: 'נינוח',
  3: 'מאוזן',
  4: 'אנרגטי',
  5: 'בלתי-נלאה',
}

const AGGRESSION_LABEL: Record<number, string> = {
  1: 'רגוע ומאוזן',
  2: 'נינוח עם זרים',
  3: 'מגן וערני',
  4: 'דורש יד מנוסה',
  5: 'לבעלים מנוסים בלבד',
}

/** צבע מדד התוקפנות - זהב רגוע בנמוך, טרקוטה בגבוה (בלי ירוקים). */
function aggColor(level: number, n: number): string {
  if (n > level) return '#e5e2da'
  if (level <= 2) return '#c99a5b'
  if (level === 3) return '#cf8a3a'
  return '#b4502e'
}

/** טקסט "האם מתאים לי" שנגזר חכם מאנרגיה + גודל. */
function fitText(b: Breed): { headline: string; points: string[] } {
  const points: string[] = []

  if (b.energy >= 5)
    points.push('דורש המון פעילות יומית - ריצות, משחק וגירוי מנטלי. לא לבעלים שקטים.')
  else if (b.energy === 4)
    points.push('אוהב טיולים ארוכים ומשחק יומי - מתאים למי שיוצא להתאוורר בכל יום.')
  else if (b.energy === 3) points.push('רמת אנרגיה מאוזנת - מסתפק בטיול נעים ומשחק קצר.')
  else points.push('כלב נינוח שמרגיש בבית גם בדירה - לא זקוק לפעילות אינטנסיבית.')

  if (b.size === 'ענק')
    points.push('ענק שדורש מרחב, חצר נוחה ותקציב מזון נדיב - לא מתאים לדירת סטודיו.')
  else if (b.size === 'גדול') points.push('כלב גדול שמרגיש מצוין עם חצר או יציאות תכופות.')
  else if (b.size === 'בינוני') points.push('גודל בינוני שמסתדר יפה גם בדירה גדולה וגם בבית פרטי.')
  else points.push('קומפקטי ומתאים מצוין לחיי דירה ולמגורים בעיר.')

  if (b.goodWithKids) points.push('מתאים למשפחות עם ילדים - סבלני וחברותי.')
  else points.push('פחות מומלץ לבית עם ילדים קטנים מאוד - דורש סוציאליזציה והדרכה.')

  const headline =
    b.energy >= 4
      ? `${b.name} צריך אנשים שזזים`
      : b.energy <= 2
      ? `${b.name} פשוט רוצה להיות אתכם בבית`
      : `${b.name} מסתדר כמעט עם כל בית`

  return { headline, points }
}

function Chip({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={dark ? 'chip3d-dark' : 'chip3d'}>{children}</span>
}

export function BreedProfile({ breed }: { breed: Breed }) {
  const fit = fitText(breed)
  const detail = getBreedDetail(breed.slug)

  return (
    <main className="page" style={{ paddingTop: 0 }}>
      {/* ===== HERO ===== */}
      <section
        className="glass-dark"
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 28,
          margin: '8px 0 56px',
          padding: 0,
        }}
      >
        <FloatingShapes dark />
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
            gap: 0,
            alignItems: 'stretch',
          }}
        >
          {/* תמונה */}
          <div style={{ position: 'relative', minHeight: 460 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img loading="lazy" decoding="async"
              src={breedImg(breed.photo, 1400)}
              alt={`כלב מגזע ${breed.name}`}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
              }}
            />
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to left, rgba(42,32,24,0) 55%, rgba(42,32,24,.92) 100%)',
              }}
            />
          </div>

          {/* מידע */}
          <div
            style={{
              padding: '52px 48px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <span className="section-tag" style={{ color: '#e8c887' }}>
              מדריך הגזע
            </span>
            <h1
              className="grad-text"
              style={{
                fontSize: 56,
                fontWeight: 900,
                letterSpacing: '-2px',
                lineHeight: 1.02,
                margin: '4px 0 2px',
              }}
            >
              {breed.name}
            </h1>
            <div
              lang="en"
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: 'rgba(255,255,255,.78)',
                letterSpacing: '.5px',
                marginBottom: 20,
              }}
            >
              {breed.en}
            </div>

            <p
              style={{
                fontSize: 17,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,.88)',
                margin: '0 0 26px',
                maxWidth: 480,
              }}
            >
              {breed.blurb}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <Chip dark>
                <span aria-hidden>📏</span> {breed.size}
              </Chip>
              <Chip dark>
                <span aria-hidden>🎯</span> {breed.group}
              </Chip>
              <Chip dark>
                <span aria-hidden>🕰️</span> {breed.lifespan} שנים
              </Chip>
              {breed.goodWithKids && (
                <Chip dark>
                  <span aria-hidden>👶</span> מתאים לילדים
                </Chip>
              )}
            </div>

            {breed.origin && (
              <div
                style={{
                  marginTop: 22,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#e8c887',
                }}
              >
                <span aria-hidden>🇮🇱</span> מוצא: {breed.origin}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== כרטיסי מאפיין ===== */}
      {/* ===== רצועת נתוני תקן (key stats) ===== */}
      {detail && (
        <Reveal3D as="section">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: 14,
              marginBottom: 56,
            }}
          >
            {[
              { icon: '📏', label: 'גובה', value: `${detail.heightCm} ס"מ` },
              { icon: '⚖️', label: 'משקל', value: `${detail.weightKg} ק"ג` },
              { icon: '🕒', label: 'תוחלת חיים', value: `${breed.lifespan} שנים` },
              { icon: '🏷️', label: 'קבוצת FCI', value: detail.fciGroup },
            ].map((s) => (
              <div
                key={s.label}
                className="card"
                style={{ padding: '20px 18px', borderRadius: 18, textAlign: 'center' }}
              >
                <div style={{ fontSize: 26 }} aria-hidden>{s.icon}</div>
                <div className="muted" style={{ fontSize: 13, margin: '6px 0 4px' }}>{s.label}</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#241a12', lineHeight: 1.35 }}>{s.value}</div>
              </div>
            ))}
          </div>
        </Reveal3D>
      )}

      <Reveal3D as="section">
        <h2 className="section-title" style={{ fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
          מאפייני הגזע
        </h2>
        <p className="muted" style={{ marginBottom: 24 }}>
          הדברים שכדאי לדעת לפני שמתאהבים, לא אחרי.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
            marginBottom: 64,
          }}
        >
          {/* אנרגיה */}
          <Tilt3D max={10}>
            <div className="lift-3d" style={{ padding: 26 }}>
              <div style={{ fontSize: 32 }} aria-hidden>⚡</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>אנרגיה</h3>
              <div className="muted" style={{ marginBottom: 14 }}>
                {ENERGY_LABEL[breed.energy]}
              </div>
              <div style={{ display: 'flex', gap: 6 }} aria-label={`${breed.energy} מתוך 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 99,
                      background: n <= breed.energy ? '#c99a5b' : '#e5e2da',
                      transition: 'background .2s',
                    }}
                  />
                ))}
              </div>
            </div>
          </Tilt3D>

          {/* נטייה לתוקפנות */}
          <Tilt3D max={10}>
            <div className="lift-3d" style={{ padding: 26 }}>
              <div style={{ fontSize: 32 }} aria-hidden>🛡️</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>נטייה לתוקפנות</h3>
              <div className="muted" style={{ marginBottom: 14 }}>
                {AGGRESSION_LABEL[breed.aggression]}
              </div>
              <div style={{ display: 'flex', gap: 6 }} aria-label={`${breed.aggression} מתוך 5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    style={{
                      flex: 1,
                      height: 8,
                      borderRadius: 99,
                      background: aggColor(breed.aggression, n),
                      transition: 'background .2s',
                    }}
                  />
                ))}
              </div>
            </div>
          </Tilt3D>

          {/* גודל */}
          <Tilt3D max={10}>
            <div className="lift-3d" style={{ padding: 26 }}>
              <div style={{ fontSize: 32 }} aria-hidden>📏</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>גודל</h3>
              <div className="muted" style={{ marginBottom: 14 }}>מבנה הגוף</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#c99a5b', lineHeight: 1 }}>
                {breed.size}
              </div>
            </div>
          </Tilt3D>

          {/* אופי */}
          <Tilt3D max={10}>
            <div className="lift-3d" style={{ padding: 26 }}>
              <div style={{ fontSize: 32 }} aria-hidden>🐶</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>אופי</h3>
              <div className="muted" style={{ marginBottom: 14 }}>תכונות בולטות</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {breed.temperament.map((t) => (
                  <span key={t} className="chip3d">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Tilt3D>

          {/* קבוצת ייעוד */}
          <Tilt3D max={10}>
            <div className="lift-3d" style={{ padding: 26 }}>
              <div style={{ fontSize: 32 }} aria-hidden>🎯</div>
              <h3 style={{ fontWeight: 800, fontSize: 18, margin: '8px 0 4px' }}>קבוצת ייעוד</h3>
              <div className="muted" style={{ marginBottom: 14 }}>למה הגזע נועד</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#c99a5b', lineHeight: 1.1 }}>
                {breed.group}
              </div>
            </div>
          </Tilt3D>
        </div>

        <p
          className="muted"
          style={{
            marginTop: -44,
            marginBottom: 64,
            fontSize: 13,
            lineHeight: 1.7,
            background: 'rgba(180,80,46,.06)',
            border: '1px solid rgba(180,80,46,.18)',
            borderRadius: 14,
            padding: '14px 18px',
          }}
        >
          <strong style={{ color: '#b4502e' }}>חשוב להבין:</strong> מדד התוקפנות הוא הכללה
          על הגזע, לא נבואה על כלב מסוים. בפועל סוציאליזציה, אילוף, בריאות ובעיקר היחס שהכלב
          מקבל משפיעים הרבה יותר מהגנטיקה - וכל כלב, מכל גזע, יכול להיות עדין או תוקפני בהתאם
          לאיך שגידלו אותו. המדד נועד לעזור לבחור נכון ולהתכונן, לא לתייג.
        </p>
      </Reveal3D>

      {/* ===== עובדות · בריאות · טיפוח ===== */}
      {detail && (
        <Reveal3D as="section">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
              marginBottom: 64,
            }}
          >
            {/* כמה עובדות */}
            <div className="card" style={{ padding: 26, borderRadius: 20 }}>
              <div style={{ fontSize: 30 }} aria-hidden>💡</div>
              <h3 style={{ fontWeight: 900, fontSize: 19, margin: '8px 0 14px' }}>כמה עובדות</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
                {detail.quickFacts.map((f, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.6, color: '#3a3128' }}>
                    <span aria-hidden style={{ color: '#c99a5b', fontWeight: 900 }}>•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* בריאות */}
            <div className="card" style={{ padding: 26, borderRadius: 20 }}>
              <div style={{ fontSize: 30 }} aria-hidden>🩺</div>
              <h3 style={{ fontWeight: 900, fontSize: 19, margin: '8px 0 14px' }}>בריאות - על מה לשים לב</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', display: 'grid', gap: 10 }}>
                {detail.health.map((h, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.6, color: '#3a3128' }}>
                    <span aria-hidden style={{ color: '#b4502e', fontWeight: 900 }}>‹</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              <p className="muted" style={{ fontSize: 12.5, lineHeight: 1.6, margin: 0 }}>
                נטיות גזעיות נפוצות - לא גזר דין. כדאי לברר מול המגדל ולעשות בדיקות ווטרינר תקופתיות.
              </p>
            </div>

            {/* טיפוח */}
            <div className="card" style={{ padding: 26, borderRadius: 20 }}>
              <div style={{ fontSize: 30 }} aria-hidden>🧴</div>
              <h3 style={{ fontWeight: 900, fontSize: 19, margin: '8px 0 14px' }}>טיפוח</h3>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3a3128', margin: 0 }}>{detail.grooming}</p>
            </div>
          </div>
        </Reveal3D>
      )}

      {/* ===== האם הגזע מתאים לי? ===== */}
      <Reveal3D as="section">
        <div
          className="card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '40px 36px',
            marginBottom: 64,
            borderRadius: 24,
          }}
        >
          <FloatingPaws />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 720 }}>
            <span className="section-tag">בדיקת התאמה</span>
            <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', margin: '2px 0 18px' }}>
              {fit.headline}
            </h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 14 }}>
              {fit.points.map((p, i) => (
                <li
                  key={i}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    fontSize: 16,
                    lineHeight: 1.65,
                    color: '#241a12',
                  }}
                >
                  <span
                    aria-hidden
                    style={{ color: '#c99a5b', fontWeight: 900, fontSize: 18, lineHeight: 1.4 }}
                  >
                    ✓
                  </span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal3D>

      {/* ===== CTA ===== */}
      <Reveal3D as="section">
        <div
          className="glass-dark"
          style={{
            position: 'relative',
            overflow: 'hidden',
            textAlign: 'center',
            padding: '48px 32px',
            borderRadius: 24,
            color: '#fff',
          }}
        >
          <FloatingShapes dark />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              className="grad-text"
              style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-1px', marginBottom: 10 }}
            >
              שוקלים {breed.name}?
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,.8)',
                fontSize: 16,
                maxWidth: 520,
                margin: '0 auto 28px',
                lineHeight: 1.7,
              }}
            >
              לפני שמחליטים, שווה לדבר עם מי שכבר חי עם {breed.name} בבית. בפורום יש בעלים
              שיגידו לכם את האמת - גם את החלקים שלא כתובים בשום מדריך.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              {hasArticle(breed.slug) && (
                <MagneticButton href={`/articles/${breed.slug}`} className="btn btn-primary">
                  קראו את המדריך המלא על {breed.name}
                </MagneticButton>
              )}
              <MagneticButton href="/forum" className="btn btn-dark">
                שאלו את הקהילה
              </MagneticButton>
              <MagneticButton href="/breeds" className="btn btn-ghost">
                ← לכל הגזעים
              </MagneticButton>
            </div>
          </div>
        </div>
      </Reveal3D>
    </main>
  )
}
