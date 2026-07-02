'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // עמוד פעיל: התאמה מדויקת או תת-נתיב (למשל /breeds/labrador → "גזעים" פעיל)
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const moreActive = MORE_LINKS.some((l) => isActive(l.href))

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


  return (
    <>
      <nav className="kv-nav" aria-label="ניווט ראשי">
        <Link href="/" className="kv-logo" aria-label="קהילה על ארבע - לדף הבית">
          קהילה על <em>ארבע</em>
        </Link>
        <div className="kv-nav-r">
          {PRIMARY_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? 'is-active' : undefined}
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
            className={`kv-nav-btn${isActive('/waitlist') ? ' is-active' : ''}`}
            aria-current={isActive('/waitlist') ? 'page' : undefined}
            aria-label="הצטרפו לרשימת ההמתנה"
          >
            🐾 הצטרפו
          </Link>
          {/* אזור הקהילה (הרשמה/פרופיל/שמירה) סגור בהשקה - יתווסף כשייפתח */}
          {/* כפתור המבורגר - מוצג רק במובייל (CSS) */}
          <button
            type="button"
            className="kv-burger"
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
            className="kv-drawer-close"
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
            className="kv-nav-btn"
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
