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
import { LiveNow } from '@/components/home/LiveNow'
import { FounderNote } from '@/components/home/FounderNote'
import { communities, img } from '@/lib/communities'
import { breeds, getBreed, breedImg } from '@/lib/breeds'

const MARQUEE = [
  '18 מפגשים החודש',
  'שק רויאל קנין ב-198 במקום 290',
  'וטרינר שעונה תוך 24 שעות',
  'פינסיטינג שאפשר לסמוך עליו',
  '78 בעלי כלבים בקבוצת הרכישה הקרובה',
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
  { icon: '🛒', title: 'קונים יחד', sub: 'שק של 15 ק"ג יורד מ-290 ל-198. אותו מזון, פחות כסף', d: 1 as const },
  { icon: '🎉', title: 'נפגשים', sub: '18 מפגשים החודש. הקרוב - שישי בירקון, 7:30 בבוקר', d: 2 as const },
  { icon: '🏠', title: 'שומרים אחד על הכלב של השני', sub: 'נוסעים לחו"ל? יש בקהילה מי שכבר עשה את זה', d: 3 as const },
  { icon: '💬', title: 'שואלים בלי בושה', sub: 'את השאלות שלא נעים לשאול את הווטרינר. עונים אנשים שעברו את זה', d: 2 as const },
  { icon: '🔄', title: 'יד שנייה', sub: 'רתמה כמעט חדשה ב-120 במקום 280. כלבים גדלים מהר', d: 3 as const },
  { icon: '🩺', title: 'וטרינר במנוי', sub: 'הכלב הקיא בלילה ואתם לא בטוחים? תשובה תוך 24 שעות', d: 4 as const },
]

const GROUPS = [
  { name: 'Royal Canin', size: 'שק 15 ק"ג', tag: 'כמעט סגורה', tagCls: 'tl', neu: 198, old: 290, save: 32, w: 78, joined: '78 מתוך 100', left: 'נותרו 4 ימים', hot: true, d: 1 as const },
  { name: "Hill's Science Diet", size: '9 ק"ג', tag: 'פעילה', tagCls: 'tl', neu: 230, old: 340, save: 32, w: 45, joined: '45 מתוך 100', left: 'נותרו 8 ימים', hot: false, d: 2 as const },
  { name: 'Ruffwear', size: 'רתמה + רצועה', tag: 'מתמלאת', tagCls: 'tw', neu: 280, old: 420, save: 33, w: 30, joined: '30 מתוך 100', left: 'נותרו 12 ימים', hot: false, d: 3 as const },
]

const EVENTS = [
  { type: 'מפגש בוקר', title: 'קפה וכלבים בגדות הירקון', loc: 'תל אביב · 7:30 בבוקר · 64 נרשמו', price: '₪45', badge: 'שישי · 14.3', img: 'photo-1601758228041-f3b2795255f1', btn: 'אני בא', d: 1 as const },
  { type: 'הרצאה', title: 'מה באמת שמים בקערה - תזונה בלי שטויות', loc: 'זום · 38 נרשמו', price: '₪60', badge: 'ראשון · 16.3', img: 'photo-1628009368231-7bb7cfcb0def', btn: 'לשמור מקום', d: 2 as const },
  { type: 'יריד', title: 'יריד יד שנייה - רתמות, כלובים, צעצועים', loc: 'גן סאקר, ירושלים · 91 נרשמו', price: 'חינם', badge: 'שבת · 22.3', img: 'photo-1548199973-03cce0bbc87b', btn: 'לפרטים', d: 3 as const },
]

const TOOLS = [
  { href: '/match', icon: '🧭', title: 'מתאם הגזע', sub: 'שש שאלות, ונגיד לכם בכנות אילו שלושה גזעים יסתדרו עם הסלון והילדים', d: 1 as const },
  { href: '/names', icon: '🏷️', title: 'מחולל שמות', sub: 'מקס, לונה, בלו או משהו שאף אחד בגינה עוד לא קרא לכלב שלו', d: 2 as const },
  { href: '/calculator', icon: '🧮', title: 'מחשבון עלות', sub: 'כמה כלב באמת עולה בחודש. כולל הדברים ששוכחים, כמו וטרינר פתאומי', d: 3 as const },
  { href: '/health', icon: '🩺', title: 'מרכז בריאות', sub: 'מתי זה "נחכה לבוקר" ומתי זה "רץ עכשיו לווטרינר". וגם חיסונים', d: 4 as const },
  { href: '/walks', icon: '🐾', title: 'מסלולי טיול', sub: 'גינות כלבים וטיילות שאנשים באמת הולכים אליהן, לא רק על המפה', d: 1 as const },
  { href: '/tools', icon: '🧰', title: 'כל הכלים', sub: 'שישה כלים חינמיים, בלי הרשמה. בוחרים ומתחילים', d: 2 as const },
]

const TESTIMONIALS = [
  { q: '"חצי שנה בקבוצות, ועשיתי את החשבון: 800 שקל שנשארו לי בכיס. כבר לא קונה שק לבד."', name: 'מיכל כהן', role: 'בעלת לברדור · תל אביב', img: 'photo-1544005313-94ddf0286df2', d: 1 as const },
  { q: '"באדי הפסיק לאכול יומיים ונכנס לי הלב לתחת. שאלתי בפורום ב-11 בלילה, וקיבלתי תשובה מבן אדם שעבר בדיוק את זה."', name: 'דני לוי', role: 'בעל גולדן · ירושלים', img: 'photo-1507003211169-0a1dd7228f2d', d: 2 as const },
  { q: '"נסעתי עשרה ימים לחו"ל בפעם הראשונה בלי לדאוג. מישהי מהקהילה שמרה על לונה כאילו זה הכלב שלה."', name: 'שירה ברק', role: 'בעלת האסקי · חיפה', img: 'photo-1438761681033-6461ffad8d80', d: 3 as const },
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
  const [videoOpen, setVideoOpen] = useState(false)

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

  // מודאל וידאו: סגירה ב-Escape + נעילת גלילת הרקע כל עוד הוא פתוח
  useEffect(() => {
    if (!videoOpen) return
    function onKey(ev: KeyboardEvent) {
      if (ev.key === 'Escape') setVideoOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [videoOpen])

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
              4,823 בעלי כלבים בישראל
            </div>
            <h1 className="hero-h1 display">
              לכלב שלך מגיע<em className="grad-text">חבר'ה כמוך</em>
            </h1>
            <p className="hero-sub">
              חוסכים יחד על מזון, נפגשים בירקון בשישי בבוקר, ושואלים את כל השאלות
              שלא נעים לשאול את הווטרינר. ההצטרפות בחינם.
            </p>
            <div className="hero-btns">
              <MagneticButton href="/auth/register" className="hbm">
                בואו להכיר
              </MagneticButton>
              <button
                className="hbg"
                onClick={() => setVideoOpen(true)}
                aria-label="צפו בסרטון קצר על מה קורה בקהילה"
              >
                ▶ דקה וחצי, ותבינו
              </button>
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
              src="/breeds-wc/golden.png"
              alt="איור צבעי-מים של גולדן רטריבר מחייך"
            />
          </div>
        </div>
        <div className="hero-stats">
          <div className="hs"><div className="hs-val"><Counter to={4823} /></div><div className="hs-lbl">חברי קהילה</div></div>
          <div className="hs"><div className="hs-val">₪<Counter to={340} /></div><div className="hs-lbl">חיסכון חודשי ממוצע</div></div>
          <div className="hs"><div className="hs-val"><Counter to={18} /></div><div className="hs-lbl">אירועים בחודש</div></div>
          <div className="hs"><div className="hs-val"><Counter to={96} />%</div><div className="hs-lbl">שביעות רצון</div></div>
        </div>
      </section>

      {/* מה קורה עכשיו בכלבניה - רצועה חיה */}
      <LiveNow />

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
            <h2 id="cities-heading" className="section-title display">יש חבר'ה גם בעיר שלכם</h2>
          </div>
          <Link href="/communities" className="btn btn-ghost">לכל הקהילות →</Link>
        </Reveal3D>
        <Carousel ariaLabel="קהילות לפי עיר" itemMinWidth={230}>
          {CITY_CARDS.map((c, i) => (
            <Reveal3D as="div" key={c.slug} delay={((i % 4) + 1) as 1 | 2 | 3 | 4}>
              <Tilt3D max={9} className="kv-fill-h">
                <Link
                  href={`/community/${c.slug}`}
                  className="lift-3d kv-card-link"
                  aria-label={`קהילת ${c.name} - ${c.members.toLocaleString('he-IL')} חברים`}
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
                        <span aria-hidden="true">👥</span> {c.members.toLocaleString('he-IL')} חברים
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
            <h2 className="section-title display">כלבים אמיתיים,<br />אנשים אמיתיים</h2>
          </div>
          <p className="pg-sub">מקס מתל אביב, לונה מחיפה, וכמה אלפים שעוד לא הכרתם. כולם פה בגלל כלב אחד.</p>
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
          <Reveal3D as="span" className="section-tag">למה להישאר</Reveal3D>
          <Reveal3D><h2 id="split-heading" className="split-title display">שש סיבות<br />שתישארו</h2></Reveal3D>
          <Reveal3D><p className="split-sub">מקבוצת רכישה שחוסכת לכם מאתיים שקל בחודש, ועד מישהו שישמור על הכלב כשאתם בחו"ל.</p></Reveal3D>
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

      {/* GROUPS */}
      <section className="gr-section">
        <div className="gr-inner">
          <Reveal3D className="gr-top">
            <h2 className="gr-title display">קונים יחד,<br />משלמים פחות</h2>
            <p className="gr-sub">78 בעלי כלבים כבר בקבוצת הרויאל קנין. עוד 4 ימים, ושק של 15 ק"ג יורד מ-290 ל-198.</p>
          </Reveal3D>
          <div className="gr-grid">
            {GROUPS.map((g) => (
              <Reveal3D as="div" delay={g.d} key={g.name}>
                <Tilt3D max={8} className="kv-fill-h">
                  <div className={`gc${g.hot ? ' hot' : ''} lift-3d kv-fill-h`}>
                    <div className="gc-h">
                      <div className="gc-name">{g.name}<br />{g.size}</div>
                      <span className={`gc-tag ${g.tagCls}`}>{g.tag}</span>
                    </div>
                    <div className="gc-pr">
                      <span className="gc-new">₪{g.neu}</span>
                      <span className="gc-old">₪{g.old}</span>
                      <span className="gc-save">{g.save}%-</span>
                    </div>
                    <div className="gc-bar">
                      <div className="gc-fill" style={{ width: `${g.w}%` }} />
                    </div>
                    <div className="gc-meta"><span>{g.joined}</span><span>{g.left}</span></div>
                    <Link
                      href="/groups"
                      className="gc-btn kv-block-link"
                      aria-label={`להצטרפות לקבוצת הרכישה ${g.name}`}
                    >
                      להצטרפות →
                    </Link>
                  </div>
                </Tilt3D>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section className="ev-section">
        <div className="ev-inner">
          <Reveal3D className="ev-head">
            <div>
              <span className="section-tag">יוצאים מהבית</span>
              <h2 className="section-title display">נפגשים<br />פנים אל פנים</h2>
            </div>
            <Link href="/events" className="btn btn-ghost">לכל האירועים →</Link>
          </Reveal3D>
          <div className="ev-grid">
            {EVENTS.map((e) => (
              <Reveal3D as="div" delay={e.d} key={e.title}>
                <Tilt3D max={8} className="kv-fill-h">
                  <div className="ev lift-3d kv-fill-h">
                    <div className="ev-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async" src={u(e.img, 700)} srcSet={srcSetFor(e.img, [360, 540, 700])} sizes="(max-width: 760px) 100vw, 33vw" alt={`${e.type} - ${e.title}`} />
                      <div className="ev-badge">{e.badge}</div>
                    </div>
                    <div className="ev-body">
                      <div className="ev-type">{e.type}</div>
                      <div className="ev-title">{e.title}</div>
                      <div className="ev-loc">{e.loc}</div>
                    </div>
                    <div className="ev-foot">
                      <span className="ev-price">{e.price}</span>
                      <Link
                        href="/events"
                        className="ev-btn kv-inline-link"
                        aria-label={`${e.btn} - ${e.title}`}
                      >
                        {e.btn}
                      </Link>
                    </div>
                  </div>
                </Tilt3D>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* MAP */}
      <MapSection />

      {/* TESTIMONIALS */}
      <section className="tc-section" aria-labelledby="tc-heading">
        <div className="tc-inner">
          <Reveal3D><h2 id="tc-heading" className="tc-title display">מה אומרים מי שכבר בפנים</h2></Reveal3D>
          <div className="tc-grid">
            {TESTIMONIALS.map((t) => (
              <Reveal3D as="div" delay={t.d} key={t.name} className="tc">
                <figure className="tc-fig">
                  <div className="tc-top">
                    <div className="tc-av">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img loading="lazy" decoding="async" src={u(t.img, 100)} srcSet={srcSetFor(t.img, [100, 200])} sizes="56px" alt={`תמונת הפרופיל של ${t.name}`} />
                    </div>
                    <div className="tc-stars" aria-label="דירוג חמישה כוכבים מתוך חמישה">★★★★★</div>
                  </div>
                  <blockquote className="tc-q">{t.q}</blockquote>
                  <figcaption>
                    <div className="tc-name">{t.name}</div>
                    <div className="tc-role">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal3D>
            ))}
          </div>
        </div>
      </section>

      {/* גזעים פופולריים */}
      <section className="breeds-section kv-section kv-section--breeds" aria-labelledby="breeds-heading">
        <Reveal3D className="ev-head">
          <div>
            <span className="section-tag">מדריך הגזעים</span>
            <h2 id="breeds-heading" className="section-title display">גזעים שמדברים עליהם</h2>
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
            <h2 id="tools-home-heading" className="section-title display">כלים שבאמת עוזרים</h2>
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

      {/* PRICING */}
      <section className="pr-section" aria-labelledby="pr-heading">
        <div className="pr-inner">
          <Reveal3D><h2 id="pr-heading" className="pr-title display">בחינם זה כבר שווה. פרימיום זה בונוס</h2></Reveal3D>
          <Reveal3D><p className="pr-sub">מתחילים בחינם, בלי כרטיס אשראי. משדרגים רק אם בא לכם. אפשר גם לא - רוב מה שכאן פתוח ממילא.</p></Reveal3D>
          <div className="pr-cards">
            <Reveal3D as="div" delay={1} className="pc">
              <div className="pc-name">בסיסי</div>
              <div className="pc-price">חינם <span>לתמיד</span></div>
              <hr className="pc-div" />
              <div className="pc-feat"><span className="ok">✓</span> גישה לפורום</div>
              <div className="pc-feat"><span className="ok">✓</span> קבוצות רכישה</div>
              <div className="pc-feat"><span className="ok">✓</span> אירועים חברתיים</div>
              <div className="pc-feat"><span className="no">✗</span> שאל וטרינר</div>
              <div className="pc-feat"><span className="no">✗</span> תוכן בלעדי</div>
              <Link href="/auth/register" className="pc-btn pc-out kv-block-link">
                להצטרפות חינם
              </Link>
            </Reveal3D>
            <Reveal3D as="div" delay={2} className="pc feat">
              <div className="pc-badge">הכי פופולרי</div>
              <div className="pc-name">פרימיום</div>
              <div className="pc-price">₪19 <span>/ חודש</span></div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: '#a87a3e', marginTop: -4, marginBottom: 4 }}>מחיר השקה מוקדם 🚀</div>
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

      {/* VIDEO MODAL */}
      {videoOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="סרטון הסבר - איך קהילת כלבניה עובדת"
          onClick={() => setVideoOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 12000,
            display: 'grid',
            placeItems: 'center',
            padding: 'clamp(16px, 4vw, 48px)',
            background: 'rgba(42,32,24,.82)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            onClick={(ev) => ev.stopPropagation()}
            style={{
              position: 'relative',
              width: 'min(960px, 100%)',
              aspectRatio: '16 / 9',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#000',
              border: '1px solid rgba(232,200,135,.35)',
              boxShadow: '0 32px 90px rgba(0,0,0,.55)',
            }}
          >
            <button
              type="button"
              onClick={() => setVideoOpen(false)}
              aria-label="סגירת הסרטון"
              autoFocus
              style={{
                position: 'absolute',
                top: 12,
                insetInlineEnd: 12,
                zIndex: 2,
                width: 40,
                height: 40,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 100,
                border: '1px solid rgba(255,255,255,.25)',
                background: 'rgba(42,32,24,.85)',
                color: '#fff',
                fontSize: 18,
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              ✕
            </button>
            <iframe
              src="https://www.youtube.com/embed/aTUojz9rfqM?rel=0&modestbranding=1"
              title="קהילת כלבניה - איך זה עובד"
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
