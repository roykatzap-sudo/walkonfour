'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'

type NavLink = { href: string; label: string }

/** קישורי הליבה - מוצגים תמיד בשורת הדסקטופ. (השקה: רק תוכן וכלים) */
const PRIMARY_LINKS: NavLink[] = [
  { href: '/breeds', label: 'גזעים' },
  { href: '/articles', label: 'מדריכים' },
  { href: '/vet', label: 'שאלות לווטרינר' },
  { href: '/tools', label: 'כלים' },
]

/** קישורים משניים תחת "עוד ▾". (אזור הקהילה סגור בהשקה - יתווסף כשייפתח) */
const MORE_LINKS: NavLink[] = [
  { href: '/match', label: 'איזה כלב מתאים לי' },
  { href: '/cities', label: 'מדריכי ערים' },
  { href: '/map', label: 'מפת גינות' },
  { href: '/walks', label: 'מסלולי טיול' },
  { href: '/canaan-dog', label: 'סיפור הכלב הכנעני' },
]

/** רשימה שטוחה - למגירת המובייל, שם מציגים את הכל ללא תת-תפריטים. */
const ALL_LINKS: NavLink[] = [...PRIMARY_LINKS, ...MORE_LINKS]

/** האם יש להפחית תנועה. מכבד OS + מתג הנגישות באתר. בטוח ל-SSR. */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/* ── שכבת חתימה מקומית לניווט (CSS שלא ניתן לבטא ב-inline) ──
   רק שני דברים כאן: (1) ביטול הקו-התחתון הסטטי של הקישור הפעיל בדסקטופ,
   כי האינדיקטור החי מחליף אותו; (2) כיבוי מעברי ה-inline של הניווט כאשר
   המשתמש ביקש להפחית תנועה (OS או מתג הנגישות באתר). plain <style> יציב,
   אינו נוגע בקבצי ה-CSS המשותפים, ו-CSP-safe (בלי מקור חיצוני). */
const NAV_SIGNATURE_CSS = `
.kv-nav-r a.kv-nav-a.is-active::after { display: none; }
@media (prefers-reduced-motion: reduce) {
  .kv-nav-sig, .kv-logo-sig, .kv-active-ind { transition: none !important; }
}
html.kv-a11y-reduce-motion .kv-nav-sig,
html[data-reduce-motion="1"] .kv-nav-sig,
html.kv-a11y-reduce-motion .kv-logo-sig,
html[data-reduce-motion="1"] .kv-logo-sig,
html.kv-a11y-reduce-motion .kv-active-ind,
html[data-reduce-motion="1"] .kv-active-ind { transition: none !important; }
`

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [reduced, setReduced] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const navRowRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // עמוד פעיל: התאמה מדויקת או תת-נתיב (למשל /breeds/labrador → "גזעים" פעיל)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const moreActive = MORE_LINKS.some((l) => isActive(l.href))

  // מצב "הפחתת תנועה" - ריאקטיבי גם לשינוי מערכת ההפעלה וגם למתג הנגישות
  // באתר (class/data-attr על <html>), כדי שגם ה-transform ה-inline (scale
  // הלוגו) יושבת מיידית, לא רק ה-transition (שמושבת ב-CSS עם !important).
  useEffect(() => {
    const update = () => setReduced(prefersReducedMotion())
    update()
    const mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null
    mq?.addEventListener?.('change', update)
    // מתג הנגישות באתר משנה class/attr על <html> - עוקבים דרך MutationObserver
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-reduce-motion'] })
    return () => {
      mq?.removeEventListener?.('change', update)
      mo.disconnect()
    }
  }, [])

  // ── אינדיקטור פעיל חי: פס זהב יחיד שגולש למיקום הקישור הפעיל ──
  // מודדים את מיקום ה-.is-active בשורת הדסקטופ ומזיזים אליו פס משותף
  // דרך transform + width (GPU). כשאין פעיל בשורה - הפס מתעמעם.
  const [indicator, setIndicator] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false })

  const measureIndicator = useCallback(() => {
    const row = navRowRef.current
    if (!row) return
    // הבורר יחסי ל-row (שהוא עצמו .kv-nav-r): מחפשים קישור פעיל או כפתור
    // "עוד" פעיל בין צאצאיו. אין קידומת .kv-nav-r כי היא ה-row עצמו.
    const active = row.querySelector<HTMLElement>('a.is-active, .kv-more-btn.is-active')
    if (!active) {
      setIndicator((p) => ({ ...p, on: false }))
      return
    }
    const rowRect = row.getBoundingClientRect()
    const aRect = active.getBoundingClientRect()
    // הקישורים מוסתרים במובייל (display:none → רוחב 0). האינדיקטור החי הוא
    // מבטא דסקטופ בלבד - אם הקישור הפעיל מכווץ, מכבים אותו (בלי ארטיפקט).
    if (aRect.width < 1) {
      setIndicator((p) => ({ ...p, on: false }))
      return
    }
    // מיקום פיזי (aRect.left - rowRect.left) יחד עם left:0 + translateX פיזי -
    // נכון בכל כיוון כתיבה, כולל RTL.
    const x = aRect.left - rowRect.left
    setIndicator({ x, w: aRect.width, on: true })
  }, [])

  // מודדים אחרי render וכשה-pathname משתנה. האינדיקטור מתחיל שקוף
  // (on=false) ולכן אין הבהוב בזמן המדידה הראשונה.
  useEffect(() => {
    measureIndicator()
  }, [pathname, measureIndicator])

  // מדידה מחדש על resize / טעינת פונטים (רוחב הטקסט עשוי להשתנות)
  useEffect(() => {
    const onResize = () => measureIndicator()
    window.addEventListener('resize', onResize)
    if (document.fonts && 'ready' in document.fonts) {
      document.fonts.ready.then(() => measureIndicator()).catch(() => {})
    }
    return () => window.removeEventListener('resize', onResize)
  }, [measureIndicator])

  // ── condense מודע-גלילה: מסמן scrolled אחרי סף קטן ──
  // rAF-throttled, קורא scrollY בלבד (בלי layout thrash). משנה רק
  // background/shadow/blur של השורה + scale זעיר ללוגו (transform) →
  // בלי שינוי גובה, בלי CLS (השורה fixed ממילא).
  useEffect(() => {
    let raf = 0
    let last = false
    const THRESHOLD = 8
    const read = () => (window.scrollY || document.documentElement.scrollTop || 0)
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const next = read() > THRESHOLD
        if (next !== last) {
          last = next
          setScrolled(next)
        }
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  // סגירת המגירה ב-Escape + נעילת גלילת הרקע כשהיא פתוחה
  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  // סגירת תפריט "עוד" בלחיצה בחוץ או ב-Escape
  useEffect(() => {
    if (!moreOpen) return
    function onDown(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMoreOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [moreOpen])

  // עיצוב condense דרך inline (מנצח תמיד על ה-CSS הבסיסי, בלי תלות בסדר גיליונות).
  const navSigStyle: CSSProperties = {
    transition: reduced
      ? 'none'
      : 'background-color .34s cubic-bezier(.22,1,.36,1), box-shadow .34s cubic-bezier(.22,1,.36,1), border-bottom-color .34s cubic-bezier(.22,1,.36,1)',
    ...(scrolled
      ? {
          backgroundColor: 'rgba(251,247,239,.97)',
          boxShadow: '0 6px 22px rgba(42,32,24,.09)',
          borderBottomColor: 'rgba(201,154,91,.28)',
        }
      : null),
  }
  const logoSigStyle: CSSProperties = {
    display: 'inline-flex',
    transformOrigin: 'right center',
    transform: scrolled && !reduced ? 'scale(.94)' : 'none',
    transition: reduced ? 'none' : 'transform .34s cubic-bezier(.22,1,.36,1)',
  }
  const indicatorStyle: CSSProperties = {
    position: 'absolute',
    bottom: 14,
    left: 0,
    height: '2.5px',
    borderRadius: 2,
    background: 'linear-gradient(90deg, rgba(201,154,91,1), rgba(232,200,135,1))',
    transformOrigin: 'left center',
    pointerEvents: 'none',
    willChange: 'transform, width, opacity',
    transform: `translateX(${indicator.x}px)`,
    width: `${indicator.w}px`,
    opacity: indicator.on ? 1 : 0,
    transition: reduced
      ? 'none'
      : 'transform .34s cubic-bezier(.22,1,.36,1), width .34s cubic-bezier(.22,1,.36,1), opacity .34s cubic-bezier(.22,1,.36,1)',
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: NAV_SIGNATURE_CSS }} />
      <nav className="kv-nav kv-nav-sig" style={navSigStyle} aria-label="ניווט ראשי">
        <Link href="/" className="kv-logo kv-logo-sig" style={logoSigStyle} aria-label="קהילה על ארבע - לדף הבית">
          קהילה על <em>ארבע</em>
        </Link>
        <div className="kv-nav-r" ref={navRowRef} style={{ position: 'relative' }}>
          {/* אינדיקטור פעיל חי - פס זהב יחיד שגולש (transform + width). קישוט. */}
          <span className="kv-active-ind" aria-hidden="true" style={indicatorStyle} />
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`kv-nav-a${isActive(l.href) ? ' is-active' : ''}`}
              aria-current={isActive(l.href) ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          {/* תפריט "עוד" - מקבץ את קישורי הקהילה כדי לפנות מקום בשורה */}
          <div className="kv-more" ref={moreRef}>
            <button
              type="button"
              className={moreActive ? 'kv-more-btn is-active' : 'kv-more-btn'}
              aria-haspopup="true"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((v) => !v)}
            >
              עוד
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={moreOpen ? 'kv-more-caret open' : 'kv-more-caret'}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div className={`kv-more-panel${moreOpen ? ' open' : ''}`} role="menu" aria-label="קישורים נוספים">
              {MORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  role="menuitem"
                  className={isActive(l.href) ? 'is-active' : undefined}
                  aria-current={isActive(l.href) ? 'page' : undefined}
                  onClick={() => setMoreOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          {/* CTA רשימת המתנה - עקבי בכל האתר (kv-nav-btn נשאר גלוי גם במובייל) */}
          <Link
            href="/waitlist"
            className={`kv-nav-btn kv-press kv-glow${isActive('/waitlist') ? ' is-active' : ''}`}
            aria-current={isActive('/waitlist') ? 'page' : undefined}
            aria-label="הצטרפו לרשימת ההמתנה"
          >
            🐾 הצטרפו
          </Link>
          {/* אזור הקהילה (הרשמה/פרופיל/שמירה) סגור בהשקה - יתווסף כשייפתח */}
          {/* כפתור המבורגר - מוצג רק במובייל (CSS) */}
          <button
            type="button"
            className="kv-burger kv-press"
            aria-label="פתיחת תפריט הניווט"
            aria-expanded={menuOpen}
            aria-controls="kv-mobile-drawer"
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* ── מגירת ניווט מובייל ── */}
      <div
        className={`kv-drawer-overlay${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />
      <div
        id="kv-mobile-drawer"
        className={`kv-drawer${menuOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="תפריט ניווט"
        aria-hidden={!menuOpen}
      >
        <div className="kv-drawer-head">
          <Link href="/" className="kv-logo" onClick={() => setMenuOpen(false)} aria-label="קהילה על ארבע - לדף הבית">
            קהילה על <em>ארבע</em>
          </Link>
          <button
            type="button"
            className="kv-drawer-close kv-press"
            aria-label="סגירת התפריט"
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="kv-drawer-links">
          {ALL_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? 'is-active' : undefined}
              aria-current={isActive(l.href) ? 'page' : undefined}
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {l.label}
            </Link>
          ))}
          {/* CTA רשימת המתנה - בולט בתחתית המגירה */}
          <Link
            href="/waitlist"
            className="kv-nav-btn kv-press kv-glow"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
            aria-label="הצטרפו לרשימת ההמתנה"
          >
            🐾 הצטרפו לרשימת ההמתנה
          </Link>
        </div>
      </div>
    </>
  )
}
