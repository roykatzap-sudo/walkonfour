'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Counter } from '@/components/shared/Counter'
import { MapSection } from '@/components/map/MapSection'
import { Reveal3D } from '@/components/fx/Reveal3D'
import { Tilt3D } from '@/components/fx/Tilt3D'
import { MagneticButton } from '@/components/fx/MagneticButton'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { FloatingShapes } from '@/components/fx/FloatingShapes'
import { Carousel } from '@/components/fx/Carousel'
import { FounderNote } from '@/components/home/FounderNote'
import { communities, img } from '@/lib/communities'
import { breeds, getBreed, breedImg } from '@/lib/breeds'

const MARQUEE = [
  'מדריכי גזעים בלי לייפות',
  'גינות כלבים על המפה',
  'מדריך לכל עיר בארץ',
  'מסלולים אמיתיים, לא רק על המפה',
  'מחירון מזון ומחשבון עלויות',
]

const PHOTOS = [
  { name: 'מקס', breed: 'לברדור · תל אביב', img: 'photo-1543466835-00a7907e9de1', cls: 'tall', d: 1 as const },
  { name: 'באדי', breed: 'גולדן · ירושלים', img: 'photo-1587300003388-59208cc962cb', cls: '', d: 2 as const },
  { name: 'לונה', breed: 'שפיץ · חיפה', img: 'photo-1548199973-03cce0bbc87b', cls: '', d: 3 as const },
  { name: 'מפגש קהילתי', breed: 'תל אביב · מרץ 2025', img: 'photo-1601758228041-f3b2795255f1', cls: 'wide', d: 2 as const },
  { name: "צ'רלי", breed: 'בולדוג · רמת גן', img: 'photo-1518020382113-a7e8fc38eac9', cls: '', d: 4 as const },
]

const REEL = ['photo-1552053831-71594a27632d', 'photo-1587300003388-59208cc962cb', 'photo-1548199973-03cce0bbc87b', 'photo-1518020382113-a7e8fc38eac9', 'photo-1601758228041-f3b2795255f1', 'photo-1543466835-00a7907e9de1']
const REEL_LABELS = ['לברדור', 'גולדן', 'שפיץ', 'בולדוג', 'חברים', 'גור']

const FEATURES = [
  { icon: '01', title: 'קונים יחד', sub: 'שק מזון או ציוד בכמות. המחיר יורד, אף אחד לא נשאר עם 30 קילו לבד', d: 1 as const },
  { icon: '02', title: 'נפגשים', sub: 'בוקר בפארק, ערב אילוף, יריד יד שנייה. מתארגנים בקבוצה, באים בלי לתאם פגישות', d: 2 as const },
  { icon: '03', title: 'שומרים אחד על הכלב של השני', sub: 'נוסעים לחו"ל? יש מי שכבר עשה את זה ושמח להחזיר טובה', d: 3 as const },
  { icon: '04', title: 'שואלים בלי בושה', sub: 'את השאלות שלא נעים לשאול את הווטרינר. עונים אנשים שעברו את זה', d: 2 as const },
  { icon: '05', title: 'יד שנייה', sub: 'רתמה כמעט חדשה במקום לזרוק. כלבים גדלים מהר, ההורים יודעים', d: 3 as const },
  { icon: '06', title: 'שאלות לווטרינר', sub: 'הכלב הקיא בלילה? שואלים, מקבלים תשובה, מחליטים אם רצים למרפאה', d: 4 as const },
]



const TOOLS = [
  { href: '/match', icon: '🧭', title: 'מתאם הגזע', sub: 'שש שאלות, שלוש המלצות. בכנות, כולל הגזעים שלא יסתדרו עם הסלון שלכם', d: 1 as const },
  { href: '/names', icon: '🏷️', title: 'מחולל שמות', sub: 'מקס, לונה, בלו - או משהו שאף אחד בגינה עוד לא חשב עליו', d: 2 as const },
  { href: '/calculator', icon: '🧮', title: 'מחשבון עלות', sub: 'כמה כלב באמת עולה בחודש, כולל וטרינר פתאומי שאף אחד לא מספר עליו מראש', d: 3 as const },
  { href: '/health', icon: '🩺', title: 'מרכז בריאות', sub: 'מתי "נחכה לבוקר" ומתי "עכשיו לווטרינר". וגם לוח חיסונים', d: 4 as const },
  { href: '/walks', icon: '🥾', title: 'מסלולי טיול', sub: 'מסלולים שאנשים באמת הולכים אליהם, לא רק שמופיעים על המפה', d: 1 as const },
  { href: '/tools', icon: '+', title: 'עוד כלים', sub: 'שישה כלים חינמיים, בלי הרשמה. בוחרים ומתחילים', d: 2 as const },
]


// ערים נבחרות לרצועת "קהילה בכל עיר"
const CITY_SLUGS = ['tel-aviv', 'jerusalem', 'haifa', 'rishon', 'netanya', 'beer-sheva', 'herzliya', 'ramat-gan']
const CITY_CARDS = CITY_SLUGS
  .map((s) => communities.find((c) => c.slug === s))
  .filter((c): c is NonNullable<typeof c> => Boolean(c))

// גזעים פופולריים לגריד
const BREED_SLUGS = ['canaan', 'labrador', 'golden', 'german-shepherd', 'husky', 'french-bulldog', 'poodle', 'border-collie']
const POPULAR_BREEDS = BREED_SLUGS
  .map((s) => getBreed(s))
  .filter((b): b is NonNullable<ReturnType<typeof getBreed>> => Boolean(b))

const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&auto=format&fit=crop&q=55`

// srcSet רספונסיבי כדי שמסכי מובייל לא ימשכו את הגרסה הרחבה ביותר.
// נשאר על <img> גולמי + q=55 (כללי הפרויקט) - רק מוסיפים וריאנטים ברוחב.
const srcSetFor = (id: string, widths: number[]) =>
  widths.map((w) => `${u(id, w)} ${w}w`).join(', ')

export default function Home() {
  const heroImgRef = useRef<HTMLDivElement>(null)

  // CTA דביק לרשימת ההמתנה - מופיע אחרי גלילה קלה, ניתן לסגירה.
  const [stickyCta, setStickyCta] = useState(false)
  const [ctaDismissed, setCtaDismissed] = useState(false)

  useEffect(() => {
    if (ctaDismissed) return
    const onScroll = () => {
      // מופיע אחרי גלילה מעבר לגובה מסך אחד (עברנו את ההירו)
      setStickyCta(window.scrollY > window.innerHeight * 0.9)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ctaDismissed])

  // פרלקס ישירות על ה-DOM דרך ref - בלי setState, בלי re-render לכל תזוזת עכבר.
  // throttle עם requestAnimationFrame + כיבוד prefers-reduced-motion.
  const heroPos = useRef({ px: 0, py: 0 })
  const heroRaf = useRef<number | null>(null)
  const reduceMotion = useRef(false)

  useEffect(() => {
    reduceMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    return () => {
      if (heroRaf.current !== null) cancelAnimationFrame(heroRaf.current)
    }
  }, [])

  function onHeroMove(e: React.MouseEvent<HTMLElement>) {
    if (reduceMotion.current) return
    const r = e.currentTarget.getBoundingClientRect()
    heroPos.current.px = (e.clientX - r.left) / r.width - 0.5
    heroPos.current.py = (e.clientY - r.top) / r.height - 0.5
    if (heroRaf.current !== null) return
    heroRaf.current = requestAnimationFrame(() => {
      heroRaf.current = null
      const el = heroImgRef.current
      if (!el) return
      const { px, py } = heroPos.current
      el.style.transform = `perspective(900px) rotateY(${px * 8}deg) rotateX(${-py * 8}deg) translate(${px * 14}px, ${py * 14}px)`
    })
  }
  function onHeroLeave() {
    if (heroRaf.current !== null) {
      cancelAnimationFrame(heroRaf.current)
      heroRaf.current = null
    }
    const el = heroImgRef.current
    if (el) el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)'
  }

  return (
    <>
      {/* HERO */}
      <section className="hero" onMouseMove={onHeroMove} onMouseLeave={onHeroLeave}>
        <div className="hero-left hero-layer">
          <FloatingShapes dark />
          <FloatingPaws />
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="ey-dot" />
              בהקמה · קהילה לבעלי כלבים בישראל
            </div>
            <h1 className="hero-h1 display">
              לכלב שלך מגיע<em>יותר מגוגל</em>
            </h1>
            <p className="hero-sub">
              גינות, מסלולים ומה שאף ווטרינר לא יספיק לכם להגיד. מאנשים שכבר עברו את זה.
            </p>
            <div className="hero-btns">
              <MagneticButton href="/waitlist" className="hbm">
                הצטרפו לרשימת ההמתנה
              </MagneticButton>
              <Link className="hbg" href="/cities" style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>
                תראו לי מה יש בעיר שלי
              </Link>
            </div>
            <FounderNote />
          </div>
        </div>
        <div className="hero-right">
          <div ref={heroImgRef} className="hero-tilt">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              loading="eager"
              fetchPriority="high"
              decoding="async"
              src="/hero-opener.png"
              width={1122}
              height={1402}
              sizes="(max-width: 900px) 100vw, 50vw"
              alt="משפחות וכלבים נפגשות בפארק עירוני - קהילת קהילה על ארבע"
            />
          </div>
        </div>
        <div className="hero-stats">
          <div className="hs"><div className="hs-val"><Counter to={29} /></div><div className="hs-lbl">גזעים</div></div>
          <div className="hs"><div className="hs-val"><Counter to={621} /></div><div className="hs-lbl">גינות על המפה</div></div>
          <div className="hs"><div className="hs-val"><Counter to={38} /></div><div className="hs-lbl">מסלולים</div></div>
          <div className="hs"><div className="hs-val"><Counter to={42} /></div><div className="hs-lbl">ערים</div></div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="mq-wrap">
        <div className="mq-track">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <div className="mq-item" key={i}>
              {m} <span>·</span>
            </div>
          ))}
        </div>
      </div>

      {/* קהילה בכל עיר */}
      <section className="cities-section kv-section" aria-labelledby="cities-heading">
        <Reveal3D className="ev-head">
          <div>
            <span className="section-tag">קרוב לבית</span>
            <h2 id="cities-heading" className="section-title display">מה יש בעיר שלכם</h2>
          </div>
          <Link href="/cities" className="btn btn-ghost">לכל מדריכי הערים →</Link>
        </Reveal3D>
        <Carousel ariaLabel="קהילות לפי עיר" itemMinWidth={230}>
          {CITY_CARDS.map((c, i) => (
            <Reveal3D as="div" key={c.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Tilt3D max={9} className="kv-fill-h">
                <Link
                  href={`/city/${c.slug}`}
                  className="lift-3d kv-card-link"
                  aria-label={`מדריך לבעלי כלבים ב${c.name}`}
                >
                  <div className="kv-card">
                    <div className="kv-card-media">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        decoding="async"
                        src={img(c.photo, 500)}
                        alt={`כלבים ובעליהם בקהילת ${c.name}`}
                      />
                      <span className="kv-card-dot" style={{ background: c.accent }} aria-hidden="true" />
                    </div>
                    <div className="kv-card-body">
                      <div className="kv-card-name">{c.name}</div>
                      <div className="kv-card-meta">{c.district}</div>
                      <div className="kv-pill">
                        <span aria-hidden="true">📍</span> מדריך עירוני
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt3D>
            </Reveal3D>
          ))}
        </Carousel>
      </section>

      {/* PHOTO GRID */}
      <section className="pg-section">
        <Reveal3D className="pg-header">
          <div>
            <span className="section-tag">הקהילה שלנו</span>
            <h2 className="section-title display">הכלבים<br />של הקהילה</h2>
          </div>
          <p className="pg-sub">מקס מתל אביב, לונה מחיפה. העיר שלכם בדרך.</p>
        </Reveal3D>
        <div className="pg-grid">
          {PHOTOS.map((p) => (
            <Reveal3D as="div" delay={p.d} key={p.name} className={`pg-item ${p.cls}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" className="pg-img" src={u(p.img, p.cls === 'wide' ? 900 : 600)} srcSet={srcSetFor(p.img, p.cls === 'wide' ? [480, 720, 900] : [320, 480, 600])} sizes={p.cls === 'wide' ? '(max-width: 760px) 100vw, 66vw' : '(max-width: 760px) 100vw, 33vw'} alt={`${p.name} - ${p.breed}`} />
              <div className="pg-info">
                <div className="pg-name">{p.name}</div>
                <div className="pg-breed">{p.breed}</div>
              </div>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* REEL */}
      <div className="reel-section">
        <div className="reel-lbl">מהקהילה שלנו</div>
        <div className="reel-track">
          {[...REEL, ...REEL].map((id, i) => (
            <div className="rc" key={i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img loading="lazy" decoding="async" src={u(id, 400)} srcSet={srcSetFor(id, [240, 320, 400])} sizes="210px" alt={`כלב מגזע ${REEL_LABELS[i % REEL_LABELS.length]}`} />
              <div className="rc-lbl">{REEL_LABELS[i % REEL_LABELS.length]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SPLIT FEATURES */}
      <section className="split" aria-labelledby="split-heading">
        <div className="split-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img loading="lazy" decoding="async" src={u('photo-1587300003388-59208cc962cb', 900)} srcSet={srcSetFor('photo-1587300003388-59208cc962cb', [480, 720, 900])} sizes="(max-width: 900px) 100vw, 50vw" alt="גולדן רטריבר משחק בחוץ עם בעליו" />
        </div>
        <div className="split-content">
          <Reveal3D as="span" className="section-tag">מה מחכה בקהילה</Reveal3D>
          <Reveal3D><h2 id="split-heading" className="split-title display">מה אפשר<br />לעשות כאן</h2></Reveal3D>
          <Reveal3D><p className="split-sub">להוריד את המחיר של שק המזון, למצוא חבר לטיול בוקר, ולשאול בלילה את מי שכבר עבר את זה. זה מה שאנחנו בונים.</p></Reveal3D>
          <div className="features-list">
            {FEATURES.map((f) => (
              <Reveal3D as="div" delay={f.d} key={f.title} className="feat-row">
                <div className="fi">{f.icon}</div>
                <div className="ft">
                  <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 2 }}>{f.title}</h3>
                  <p>{f.sub}</p>
                </div>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <MapSection />

      {/* גזעים פופולריים */}
      <section className="breeds-section kv-section kv-section--breeds" aria-labelledby="breeds-heading">
        <Reveal3D className="ev-head">
          <div>
            <span className="section-tag">מדריך הגזעים</span>
            <h2 id="breeds-heading" className="section-title display">הגזעים הנפוצים</h2>
          </div>
          <Link href="/breeds" className="btn btn-ghost">לכל הגזעים →</Link>
        </Reveal3D>
        <Carousel ariaLabel="גזעים פופולריים" itemMinWidth={250}>
          {POPULAR_BREEDS.map((b, i) => (
            <Reveal3D as="div" key={b.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Tilt3D max={11} glare className="kv-fill-h">
                <Link
                  href={`/breeds/${b.slug}`}
                  className="lift-3d kv-card-link"
                  aria-label={`מדריך הגזע ${b.name}`}
                >
                  <div className="kv-card kv-card--breeds">
                    <div className="kv-card-media kv-card-media--breeds">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        decoding="async"
                        src={breedImg(b.photo, 500)}
                        alt={`כלב מגזע ${b.name}`}
                      />
                      <span className="kv-card-size">{b.size}</span>
                    </div>
                    <div className="kv-card-body">
                      <div className="kv-card-name kv-card-name--breeds">{b.name}</div>
                      <div className="kv-card-en">{b.en}</div>
                      <div className="kv-tag-row">
                        {b.temperament.slice(0, 2).map((t) => (
                          <span key={t} className="kv-tag">{t}</span>
                        ))}
                      </div>
                      <div className="kv-energy" aria-label={`רמת אנרגיה ${b.energy} מתוך 5`}>
                        <span aria-hidden="true">
                          {'⚡'.repeat(b.energy)}
                          <span className="kv-energy-off">{'⚡'.repeat(5 - b.energy)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Tilt3D>
            </Reveal3D>
          ))}
        </Carousel>
      </section>

      {/* כלים חינמיים */}
      <section className="tools-home-section kv-section" aria-labelledby="tools-home-heading">
        <Reveal3D className="ev-head">
          <div>
            <span className="section-tag">חינם, בלי הרשמה</span>
            <h2 id="tools-home-heading" className="section-title display">כלים חינמיים</h2>
          </div>
          <Link href="/tools" className="btn btn-ghost">לכל הכלים →</Link>
        </Reveal3D>
        <div className="kv-card-grid">
          {TOOLS.map((t, i) => (
            <Reveal3D as="div" key={t.href} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Tilt3D max={9} className="kv-fill-h">
                <Link
                  href={t.href}
                  className="lift-3d kv-card-link"
                  aria-label={`${t.title} - ${t.sub}`}
                >
                  <div className="kv-card" style={{ padding: '26px 24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div
                      aria-hidden="true"
                      className="kv-tool-icon"
                      style={{
                        fontSize: 34,
                        width: 64,
                        height: 64,
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: 18,
                        marginBottom: 16,
                        background: 'linear-gradient(160deg, #fdf0d8, #f6e3c2)',
                        border: '1px solid rgba(201,154,91,.2)',
                      }}
                    >
                      {t.icon}
                    </div>
                    <div className="kv-card-name" style={{ marginBottom: 6 }}>{t.title}</div>
                    <div className="kv-card-meta" style={{ lineHeight: 1.7, flex: 1 }}>{t.sub}</div>
                    <span aria-hidden="true" style={{ marginTop: 16, fontWeight: 700, color: 'var(--brand-dark)' }}>
                      לכלי ←
                    </span>
                  </div>
                </Link>
              </Tilt3D>
            </Reveal3D>
          ))}
        </div>
      </section>

      {/* CTA חוזר - רשימת המתנה */}
      <section className="wl-band" aria-labelledby="wl-band-heading">
        <div className="wl-band-inner">
          <span className="wl-band-paw" aria-hidden="true">🐾</span>
          <h2 id="wl-band-heading" className="wl-band-title display">
            הכלב שלכם כבר <em>בפנים?</em>
          </h2>
          <p className="wl-band-sub">
            אנחנו בונים את הקהילה עכשיו. הצטרפו לרשימת ההמתנה ותהיו הראשונים לדעת כשנפתח בעיר שלכם.
          </p>
          <Reveal3D as="div">
            <MagneticButton href="/waitlist" className="wl-band-btn">
              הצטרפו לרשימת ההמתנה
            </MagneticButton>
          </Reveal3D>
          <p className="wl-band-note">בלי התחייבות, בלי כרטיס אשראי. רק נעדכן כשיש חדש.</p>
        </div>
      </section>

      {/* PRICING */}
      <section className="pr-section" aria-labelledby="pr-heading">
        <div className="pr-inner">
          <Reveal3D><h2 id="pr-heading" className="pr-title display">חינם זה רוב מה שיש כאן</h2></Reveal3D>
          <Reveal3D><p className="pr-sub">מתחילים בחינם, בלי כרטיס אשראי. משדרגים רק אם בא לכם. אפשר גם לא - רוב מה שכאן פתוח ממילא.</p></Reveal3D>
          <div className="pr-cards">
            <Reveal3D as="div" delay={1} className="pc">
              <div className="pc-name">בסיסי</div>
              <div className="pc-price">חינם <span>לתמיד</span></div>
              <hr className="pc-div" />
              <div className="pc-feat"><span className="ok">✓</span> כל המדריכים והכלים</div>
              <div className="pc-feat"><span className="ok">✓</span> מפת גינות ומסלולים</div>
              <div className="pc-feat"><span className="ok">✓</span> פורום הקהילה</div>
              <div className="pc-feat"><span className="no">✗</span> שאל וטרינר</div>
              <div className="pc-feat"><span className="no">✗</span> מדריכים מעמיקים</div>
              <Link href="/auth/register" className="pc-btn pc-out kv-block-link">
                להצטרפות חינם
              </Link>
            </Reveal3D>
            <Reveal3D as="div" delay={2} className="pc feat">
              <div className="pc-badge">הכי פופולרי</div>
              <div className="pc-name">פרימיום</div>
              <div className="pc-price">₪19 <span>/ חודש</span></div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#a87a3e', marginTop: -4, marginBottom: 4 }}>מחיר השקה - למצטרפים הראשונים</div>
              <hr className="pc-div" />
              <div className="pc-feat"><span className="ok">✓</span> כל מה שכלול בבסיסי</div>
              <div className="pc-feat"><span className="ok">✓</span> שאל וטרינר</div>
              <div className="pc-feat"><span className="ok">✓</span> מדריכים בלעדיים</div>
              <div className="pc-feat"><span className="ok">✓</span> עדיפות בהרשמה לאירועים</div>
              <div className="pc-feat"><span className="ok">✓</span> הנחות מהספונסרים</div>
              <Link href="/auth/register?plan=premium" className="pc-btn pc-fill kv-block-link">
                הצטרפו במחיר ההשקה
              </Link>
            </Reveal3D>
          </div>
        </div>
      </section>

      {/* CTA דביק - מופיע אחרי גלילה, ניתן לסגירה */}
      {!ctaDismissed && (
        <div className={`wl-sticky${stickyCta ? ' show' : ''}`} role="region" aria-label="הצטרפות לרשימת ההמתנה" aria-hidden={!stickyCta}>
          <span className="wl-sticky-txt">
            <span aria-hidden="true">🐾</span> בונים קהילה לבעלי כלבים בישראל.
          </span>
          <Link href="/waitlist" className="wl-sticky-btn" tabIndex={stickyCta ? 0 : -1}>
            הצטרפו לרשימת ההמתנה
          </Link>
          <button
            type="button"
            className="wl-sticky-close"
            aria-label="סגירת פס ההצטרפות"
            tabIndex={stickyCta ? 0 : -1}
            onClick={() => setCtaDismissed(true)}
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
