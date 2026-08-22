import Link from 'next/link'
import { buildMetadata } from '@/lib/seo'
import { FloatingPaws } from '@/components/fx/FloatingPaws'
import { JsonLd, articleSchema, breadcrumbSchema, faqSchema } from '@/components/seo/JsonLd'
import { dogFriendlyContent } from '@/lib/dogFriendlyContent'
import { DOG_PARK_COUNT } from '@/lib/siteStats'
import { WaitlistCTA } from '@/components/shared/WaitlistCTA'
import { JoinCommunityCard } from '@/components/fx/JoinCommunityCard'
import { ReadingProgress } from '@/components/articles/ReadingProgress'

const c = dogFriendlyContent

export function generateMetadata() {
  return buildMetadata({
    title: c.title,
    description: c.description,
    path: '/dog-friendly',
    type: 'article',
    rawTitle: true,
    article: { section: 'איפה מותר עם כלב', publishedTime: '2026-07-05', modifiedTime: '2026-07-05' },
  })
}

const PAGE_CSS = `
  /* ── HERO כהה ודרמטי ── */
  .df-hero {
    position: relative; overflow: hidden;
    margin: -8px 0 0; padding: 74px 28px 62px;
    border-radius: 30px;
    background:
      radial-gradient(120% 90% at 82% 8%, rgba(232,200,135,.20), transparent 58%),
      linear-gradient(150deg, #2a2018 0%, #3a2c1e 52%, #241a12 100%);
    color: #fff; text-align: center;
  }
  .df-hero-inner { position: relative; z-index: 3; max-width: 700px; margin: 0 auto; }
  .df-hero h1 {
    font-size: clamp(31px, 5.6vw, 52px); font-weight: 900;
    line-height: 1.12; letter-spacing: -1.4px; margin: 12px 0 14px; color: #fff;
  }
  .df-hero h1 em {
    font-style: normal; position: relative; white-space: nowrap;
    background: linear-gradient(90deg, #e8c887, #f3dcae);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .df-hero p { font-size: 17.5px; line-height: 1.75; color: rgba(255,255,255,.86); margin: 0 auto; max-width: 560px; }
  .df-hero-tag {
    display: inline-block; padding: 7px 18px; border-radius: 999px;
    font-size: 13.5px; font-weight: 800; letter-spacing: .3px;
    color: #f0d49a; background: rgba(232,200,135,.12);
    border: 1px solid rgba(232,200,135,.34);
  }
  .df-hero-rule {
    display: block; height: 4px; width: 108px; margin: 20px auto 0; border-radius: 3px;
    background: linear-gradient(90deg, transparent, #e8c887, #c99a5b, transparent);
  }

  /* ── מקרא רמזור ── */
  .df-legend {
    display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
    margin-top: 26px;
  }
  .df-chip {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 13.5px; font-weight: 800; line-height: 1;
    padding: 9px 15px; border-radius: 999px; border: 1.5px solid;
  }
  .df-dot { width: 9px; height: 9px; border-radius: 50%; flex: none; }

  /* ── תשובה מהירה קומפקטית ── */
  .df-qa {
    position: relative; margin-top: 24px;
    padding: 18px 22px 18px 22px;
    background: #fff;
    border: 1px solid rgba(201,154,91,.3);
    border-inline-start: 5px solid #c99a5b;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(42,32,24,.06);
  }
  .df-qa-badge {
    display: inline-block; font-size: 12.5px; font-weight: 900; letter-spacing: .4px;
    color: var(--brand-dark); background: #fdf2de;
    padding: 5px 12px; border-radius: 999px; margin-bottom: 9px;
    border: 1px solid rgba(201,154,91,.3);
  }
  .df-qa-p { margin: 0; font-size: 16.4px; line-height: 1.78; color: var(--ink); max-width: 68ch; }

  /* ── רשת "מבט מהיר" ── */
  .df-glance { display: grid; gap: 9px; grid-template-columns: repeat(auto-fill, minmax(158px, 1fr)); }
  .df-glance-i {
    display: flex; align-items: center; gap: 9px;
    padding: 12px 14px; border-radius: 13px; text-decoration: none;
    background: #fff; border: 1.5px solid; color: var(--ink);
    transition: transform .22s var(--kv-ease-warm, ease), box-shadow .22s ease;
  }
  .df-glance-i:hover { transform: translateY(-3px); box-shadow: 0 10px 22px rgba(42,32,24,.11); }
  .df-glance-i:focus-visible { outline: 3px solid rgba(201,154,91,.6); outline-offset: 3px; }
  .df-glance-ico { font-size: 20px; flex: none; }
  .df-glance-l { font-size: 14.6px; font-weight: 800; flex: 1; line-height: 1.25; }

  /* ── כרטיסי נכסים ── */
  .df-assets { display: grid; gap: 13px; grid-template-columns: repeat(auto-fit, minmax(258px, 1fr)); margin-top: 30px; }
  .df-asset {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; border-radius: 18px; text-decoration: none;
    color: var(--ink); position: relative; overflow: hidden;
    background: linear-gradient(135deg, #fffaf1, #fdf4e6);
    border: 1.5px solid rgba(201,154,91,.3);
    transition: transform .28s var(--kv-ease-warm, ease), box-shadow .28s ease, border-color .2s ease;
  }
  .df-asset::after {
    content: ''; position: absolute; inset-inline-end: -30px; top: -30px;
    width: 96px; height: 96px; border-radius: 50%;
    background: radial-gradient(circle, rgba(201,154,91,.16), transparent 70%);
  }
  .df-asset:hover { transform: translateY(-4px); box-shadow: 0 16px 34px rgba(42,32,24,.13); border-color: rgba(201,154,91,.55); }
  .df-asset:focus-visible { outline: 3px solid rgba(201,154,91,.6); outline-offset: 3px; }
  .df-asset-ico {
    flex: none; width: 52px; height: 52px; border-radius: 15px;
    display: grid; place-items: center; font-size: 25px;
    background: #fff; border: 1.5px solid rgba(201,154,91,.3);
    transition: transform .3s var(--kv-ease-spring, ease);
  }
  .df-asset:hover .df-asset-ico { transform: scale(1.09) rotate(-6deg); }
  .df-asset-t { font-weight: 900; font-size: 16.5px; line-height: 1.3; }
  .df-asset-s { display: block; font-size: 13.5px; font-weight: 600; color: #6a6155; margin-top: 4px; }

  /* ── כרטיס סקשן ── */
  .df-card {
    position: relative; background: #fff; border-radius: 20px;
    border: 1px solid rgba(201,154,91,.24);
    padding: 26px 26px 22px; margin-bottom: 16px;
    scroll-margin-top: 88px; overflow: hidden;
    transition: box-shadow .3s ease, border-color .25s ease, transform .3s var(--kv-ease-warm, ease);
  }
  .df-card::before {
    content: ''; position: absolute; top: 0; inset-inline-start: 0;
    width: 100%; height: 4px; transform: scaleX(0); transform-origin: right;
    background: linear-gradient(90deg, #c99a5b, #e8c887);
    transition: transform .5s var(--kv-ease-warm, ease);
  }
  .df-card:hover { box-shadow: 0 14px 38px rgba(42,32,24,.09); border-color: rgba(201,154,91,.45); transform: translateY(-2px); }
  .df-card:hover::before, .df-card[data-kv-reveal="in"]::before { transform: scaleX(1); }
  .df-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; flex-wrap: wrap; margin-bottom: 14px; }
  .df-title { display: flex; align-items: center; gap: 12px; font-size: 22px; font-weight: 900; color: var(--ink); margin: 0; }
  .df-ico {
    flex: none; width: 46px; height: 46px; border-radius: 14px;
    display: grid; place-items: center; font-size: 23px;
    background: linear-gradient(140deg, #fdf4e6, #f7e9d2);
    border: 1px solid rgba(201,154,91,.26);
    transition: transform .32s var(--kv-ease-spring, ease);
  }
  .df-card:hover .df-ico { transform: rotate(-8deg) scale(1.07); }
  .df-p { font-size: 16.2px; color: #3a2e22; line-height: 1.88; margin: 0 0 11px; max-width: 66ch; }

  /* ── רשימת מלונות ── */
  .df-hotel {
    display: block; padding: 18px 20px; border-radius: 16px; text-decoration: none;
    background: #fff; border: 1px solid rgba(201,154,91,.24); color: var(--ink);
    transition: transform .25s var(--kv-ease-warm, ease), box-shadow .25s ease, border-color .2s ease;
  }
  .df-hotel:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(42,32,24,.1); border-color: rgba(201,154,91,.5); }
  .df-hotel:focus-visible { outline: 3px solid rgba(201,154,91,.6); outline-offset: 3px; }
  .df-hotel-n { font-weight: 900; font-size: 17px; display: flex; align-items: center; gap: 8px; }
  .df-hotel-w { font-size: 13.5px; font-weight: 700; color: var(--brand-dark); margin-top: 3px; }
  .df-hotel-p { font-size: 14.8px; color: #5b4d3c; line-height: 1.7; margin: 8px 0 0; }

  /* ── מקומות מדווחים ── */
  .df-spot {
    padding: 14px 16px; border-radius: 14px; background: #fbf7ef;
    border: 1px solid rgba(201,154,91,.24);
  }
  .df-spot-n { font-weight: 800; font-size: 15.5px; color: var(--ink); }
  .df-spot-c { font-size: 13px; font-weight: 700; color: var(--brand-dark); margin-top: 2px; }
  .df-spot-x { font-size: 13.8px; color: #6a6155; margin-top: 5px; line-height: 1.55; }

  /* ── תוכן עניינים ── */
  .df-toc a { color: var(--brand-dark); text-decoration: none; font-weight: 700; }
  .df-toc a:hover { text-decoration: underline; }

  /* ── FAQ ── */
  .df-faq {
    background: #fff; border: 1px solid rgba(201,154,91,.24);
    border-radius: 14px; padding: 15px 19px;
    transition: box-shadow .28s ease, border-color .2s ease;
  }
  .df-faq:hover { border-color: rgba(201,154,91,.46); }
  .df-faq[open] { box-shadow: 0 8px 22px rgba(42,32,24,.08); border-color: rgba(201,154,91,.5); }
  .df-faq summary { list-style: none; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; }
  .df-faq summary::-webkit-details-marker { display: none; }
  .df-faq summary::after {
    content: '›'; font-size: 25px; line-height: 1; font-weight: 700; color: #c99a5b;
    transform: rotate(90deg); transition: transform .3s var(--kv-ease-spring, ease); flex: none;
  }
  .df-faq[open] summary::after { transform: rotate(-90deg); }
  .df-faq:focus-within { outline: 3px solid rgba(201,154,91,.55); outline-offset: 2px; }
  .df-faq[open] .df-faq-b { animation: dfFaq .42s var(--kv-ease-spring, ease); }
  @keyframes dfFaq { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

  @media (max-width: 620px) {
    .df-hero { padding: 56px 20px 46px; border-radius: 24px; }
    .df-card { padding: 22px 20px 18px; }
    .df-title { font-size: 20px; }
  }
  @media (prefers-reduced-motion: reduce) {
    .df-asset, .df-asset-ico, .df-card, .df-card::before, .df-ico, .df-hotel, .df-faq, .df-faq summary::after, .df-glance-i { transition: none; }
    .df-asset:hover, .df-card:hover, .df-hotel:hover, .df-glance-i:hover { transform: none; }
    .df-card::before { transform: scaleX(1); }
    .df-faq[open] .df-faq-b { animation: none; }
    .df-asset:hover .df-asset-ico, .df-card:hover .df-ico { transform: none; }
  }
  html.kv-a11y-reduce-motion .df-card::before,
  html[data-reduce-motion="1"] .df-card::before { transform: scaleX(1) !important; transition: none !important; }
`

/** תוויות קצרות לרשת "מבט מהיר" - הכותרות המלאות ארוכות מדי לצ'יפ. */
const GLANCE: Record<string, string> = {
  parks: 'גינות כלבים',
  walks: 'מסלולי טיול',
  beaches: 'חופים',
  transport: 'אוטובוס ורכבת',
  car: 'רכב פרטי',
  business: 'בתי עסק',
  'service-dogs': 'כלבי נחייה',
}

const VERDICT: Record<'yes' | 'depends' | 'no', { bg: string; border: string; color: string; dot: string }> = {
  yes: { bg: '#f0f7ed', border: 'rgba(88,140,66,.38)', color: '#3d6a30', dot: '#5a9142' },
  depends: { bg: '#fff7e6', border: 'rgba(201,154,91,.46)', color: '#8a6220', dot: '#d69b3d' },
  no: { bg: '#fdf0ee', border: 'rgba(180,80,46,.38)', color: '#a4432c', dot: '#c25538' },
}

export default function DogFriendlyPage() {
  const schemas: Record<string, unknown>[] = [
    articleSchema({
      title: c.title,
      description: c.description,
      path: '/dog-friendly',
      section: 'איפה מותר עם כלב',
      datePublished: '2026-07-05',
      dateModified: '2026-07-05',
    }),
    breadcrumbSchema([
      { name: 'בית', path: '/' },
      { name: 'איפה מותר עם כלב', path: '/dog-friendly' },
    ]),
    faqSchema(c.faq),
  ]

  return (
    <main className="page" style={{ maxWidth: 880 }}>
      <JsonLd data={schemas} />
      <ReadingProgress />
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />

      {/* ═══ HERO ═══ */}
      <header className="df-hero">
        <FloatingPaws />
        <div className="df-hero-inner kv-reveal">
          <span className="df-hero-tag">המדריך המלא 2026</span>
          <h1>
            איפה באמת מותר <em>להיכנס עם הכלב</em>?
          </h1>
          <p>
            בתי קפה, מלונות, חופים, אוטובוס ורכבת. מה החוק באמת אומר, איפה זה תלוי בבעל העסק, ואיפה פשוט אסור.
          </p>
          <span className="df-hero-rule" aria-hidden="true" />
          <div className="df-legend" aria-hidden="true">
            <span className="df-chip" style={{ background: 'rgba(90,145,66,.16)', borderColor: 'rgba(120,180,95,.4)', color: '#bde3a8' }}>
              <span className="df-dot" style={{ background: '#7fc45f' }} /> מותר
            </span>
            <span className="df-chip" style={{ background: 'rgba(214,155,61,.16)', borderColor: 'rgba(232,200,135,.4)', color: '#f0d49a' }}>
              <span className="df-dot" style={{ background: '#e8c887' }} /> תלוי במקום
            </span>
            <span className="df-chip" style={{ background: 'rgba(194,85,56,.16)', borderColor: 'rgba(220,120,90,.4)', color: '#f0b5a2' }}>
              <span className="df-dot" style={{ background: '#d97a5c' }} /> מוגבל
            </span>
          </div>
        </div>
      </header>

      {/* ═══ תשובה מהירה - קומפקטית ═══ */}
      <section className="df-qa kv-reveal">
        <span className="df-qa-badge">⚡ בקצרה</span>
        <p className="df-qa-p">{c.quickAnswer}</p>
      </section>

      {/* ═══ מבט מהיר - רשת רמזור סרוקה ═══ */}
      <section style={{ marginTop: 22 }} aria-label="מבט מהיר לפי סוג מקום">
        <div className="df-glance" data-kv-stagger>
          {[...c.sections.map((s) => ({ id: s.id, icon: s.icon, label: GLANCE[s.id] ?? s.heading, tone: s.verdict?.tone ?? 'depends' })),
            { id: 'hotels', icon: '🏨', label: 'מלונות', tone: 'yes' as const },
            { id: 'eateries', icon: '☕', label: 'בתי קפה', tone: 'depends' as const },
          ].map((g) => {
            const v = VERDICT[g.tone as 'yes' | 'depends' | 'no']
            return (
              <a key={g.id} href={`#${g.id}`} className="df-glance-i kv-reveal" style={{ borderColor: v.border }}>
                <span className="df-glance-ico" aria-hidden="true">{g.icon}</span>
                <span className="df-glance-l">{g.label}</span>
                <span className="df-dot" style={{ background: v.dot }} aria-hidden="true" />
              </a>
            )
          })}
        </div>
      </section>

      {/* ═══ נכסים אמיתיים ═══ */}
      <section className="df-assets" data-kv-stagger>
        <Link href="/map" className="df-asset kv-reveal">
          <span className="df-asset-ico" aria-hidden="true">🗺️</span>
          <span>
            <span className="df-asset-t">{DOG_PARK_COUNT} גינות כלבים על המפה</span>
            <span className="df-asset-s">סינון לפי עיר ואיתור הקרובות אליכם</span>
          </span>
        </Link>
        <Link href="/walks" className="df-asset kv-reveal">
          <span className="df-asset-ico" aria-hidden="true">🥾</span>
          <span>
            <span className="df-asset-t">38 מסלולי טיול עם כלב</span>
            <span className="df-asset-s">עם סימון צל, מים ומקטעים מגודרים</span>
          </span>
        </Link>
      </section>

      {/* ═══ תוכן עניינים ═══ */}
      <nav className="df-toc kv-reveal" aria-label="תוכן עניינים" style={{ marginTop: 28, padding: '19px 24px', background: '#fff', border: '1px solid rgba(201,154,91,.24)', borderRadius: 18 }}>
        <div style={{ fontWeight: 900, color: 'var(--ink)', fontSize: 15, marginBottom: 10 }}>📑 בעמוד זה</div>
        <ol style={{ margin: 0, paddingInlineStart: 22, fontSize: 15.2, color: '#5b4d3c', lineHeight: 2.05 }}>
          {c.sections.map((s) => (
            <li key={s.id}><a href={`#${s.id}`}>{s.heading}</a></li>
          ))}
          <li><a href="#hotels">מלונות שמקבלים כלבים</a></li>
          <li><a href="#eateries">בתי קפה ומסעדות</a></li>
        </ol>
      </nav>

      {/* ═══ הסקשנים ═══ */}
      <div style={{ marginTop: 32 }} data-kv-stagger>
        {c.sections.map((s) => {
          const v = s.verdict ? VERDICT[s.verdict.tone] : null
          return (
            <section key={s.id} id={s.id} className="df-card kv-reveal">
              <div className="df-head">
                <h2 className="df-title">
                  <span className="df-ico" aria-hidden="true">{s.icon}</span>
                  {s.heading}
                </h2>
                {s.verdict && v && (
                  <span className="df-chip" style={{ background: v.bg, borderColor: v.border, color: v.color }}>
                    <span className="df-dot" style={{ background: v.dot }} aria-hidden="true" />
                    {s.verdict.label}
                  </span>
                )}
              </div>
              {s.paragraphs.map((p, j) => <p key={j} className="df-p">{p}</p>)}
            </section>
          )
        })}

        {/* ═══ מלונות ═══ */}
        <section id="hotels" className="df-card kv-reveal">
          <div className="df-head">
            <h2 className="df-title">
              <span className="df-ico" aria-hidden="true">🏨</span>
              מלונות שמקבלים כלבים
            </h2>
            <span className="df-chip" style={{ background: VERDICT.yes.bg, borderColor: VERDICT.yes.border, color: VERDICT.yes.color }}>
              <span className="df-dot" style={{ background: VERDICT.yes.dot }} aria-hidden="true" />
              מדיניות מפורסמת
            </span>
          </div>
          <p className="df-p">
            רשתות מלונות מפרסמות מדיניות חיות מחמד רשמית, ולכן הן הימור בטוח בהרבה מבית עסק בודד. עדיין: אשרו בהזמנה עצמה, כי המדיניות משתנה בין סניפים ולעיתים כרוכה בתוספת תשלום או בהגבלת משקל.
          </p>
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }} data-kv-stagger>
            {c.hotels.map((h) => (
              <a key={h.name} href={h.url} target="_blank" rel="noopener noreferrer" className="df-hotel kv-reveal">
                <span className="df-hotel-n">
                  {h.name}
                  <span aria-hidden="true" style={{ fontSize: 13, color: 'var(--brand-dark)' }}>↗</span>
                </span>
                <span className="df-hotel-w">📍 {h.where}</span>
                <p className="df-hotel-p">{h.policy}</p>
              </a>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '15px 18px', background: 'linear-gradient(135deg,#fff8ea,#fdf2de)', border: '1.5px solid rgba(201,154,91,.34)', borderRadius: 14 }}>
            <div style={{ fontWeight: 900, fontSize: 15, color: 'var(--ink)', marginBottom: 5 }}>💡 הדרך הכי מעודכנת לחפש</div>
            <p style={{ margin: '0 0 10px', fontSize: 14.6, color: '#5b4d3c', lineHeight: 1.7 }}>{c.hotelFinder.note}</p>
            <a href={c.hotelFinder.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brand-dark)', fontWeight: 800, fontSize: 15, textDecoration: 'underline', textUnderlineOffset: 3 }}>
              {c.hotelFinder.label} ↗
            </a>
          </div>
        </section>

        {/* ═══ בתי קפה ומסעדות ═══ */}
        <section id="eateries" className="df-card kv-reveal">
          <div className="df-head">
            <h2 className="df-title">
              <span className="df-ico" aria-hidden="true">☕</span>
              בתי קפה ומסעדות
            </h2>
            <span className="df-chip" style={{ background: VERDICT.depends.bg, borderColor: VERDICT.depends.border, color: VERDICT.depends.color }}>
              <span className="df-dot" style={{ background: VERDICT.depends.dot }} aria-hidden="true" />
              תלוי בעסק
            </span>
          </div>
          <p className="df-p">{c.eateries.rule}</p>
          <div style={{ fontWeight: 900, fontSize: 15.5, color: 'var(--ink)', margin: '18px 0 10px' }}>
            מקומות שמדווחים כידידותיים לכלבים
          </div>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }} data-kv-stagger>
            {c.eateries.reported.map((e) => (
              <div key={e.name} className="df-spot kv-reveal">
                <div className="df-spot-n">{e.name}</div>
                <div className="df-spot-c">📍 {e.city}</div>
                <div className="df-spot-x">{e.note}</div>
              </div>
            ))}
          </div>
          <div role="note" style={{ marginTop: 16, padding: '14px 17px', background: '#fdf6f0', border: '1.5px solid #e8c49a', borderRadius: 13, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span aria-hidden="true" style={{ fontSize: 17, flexShrink: 0 }}>⚠️</span>
            <p style={{ margin: 0, fontSize: 14.2, color: '#6b4c2a', lineHeight: 1.68 }}>{c.eateries.warning}</p>
          </div>
        </section>
      </div>

      {/* ═══ קהילה ═══ */}
      <JoinCommunityCard tone="parks" />

      {/* ═══ FAQ ═══ */}
      <section className="kv-reveal" style={{ marginTop: 38 }}>
        <h2 style={{ fontSize: 23, fontWeight: 900, color: 'var(--ink)', margin: '0 0 15px' }}>שאלות נפוצות</h2>
        <div style={{ display: 'grid', gap: 10 }} data-kv-stagger>
          {c.faq.map((f, i) => (
            <details key={i} className="df-faq kv-reveal">
              <summary style={{ fontWeight: 800, color: 'var(--ink)', fontSize: 15.8 }}>{f.q}</summary>
              <p className="df-faq-b" style={{ margin: '11px 0 0', fontSize: 15.2, color: '#5b4d3c', lineHeight: 1.78 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ═══ הסתייגות ═══ */}
      <div role="note" style={{ marginTop: 32, padding: '16px 20px', background: '#fdf6f0', border: '1.5px solid #e8c49a', borderRadius: 15, display: 'flex', gap: 11, alignItems: 'flex-start' }}>
        <span aria-hidden="true" style={{ fontSize: 19, flexShrink: 0 }}>⚖️</span>
        <p style={{ margin: 0, fontSize: 14.4, color: '#6b4c2a', lineHeight: 1.7 }}>
          <strong>המידע כאן הוא מידע כללי בלבד ואינו מהווה ייעוץ משפטי.</strong> מדיניות של רשויות מקומיות, חופים, חברות תחבורה ובתי עסק משתנה מעת לעת. השילוט במקום ומדיניות העסק הם הקובעים, וכדאי לוודא מראש לפני שנוסעים.
        </p>
      </div>

      {/* ═══ קישורים ═══ */}
      <section className="kv-reveal" style={{ marginTop: 34 }}>
        <h2 style={{ fontSize: 18.5, fontWeight: 900, color: 'var(--ink)', margin: '0 0 12px' }}>קשור לעמוד הזה</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Link href="/laws" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>חוקים על כלבים בישראל →</Link>
          <Link href="/laws/leash-fine" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>קנס על כלב בלי רצועה →</Link>
          <Link href="/cities" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>מדריכי ערים →</Link>
          <Link href="/guides/flying-abroad" className="chip3d" style={{ textDecoration: 'none', fontSize: 14.5 }}>טיסה לחו&quot;ל עם כלב →</Link>
        </div>
      </section>

      <WaitlistCTA />
    </main>
  )
}
