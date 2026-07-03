'use client'

import { useEffect } from 'react'

/**
 * useSignatureMotion - מפעיל חשיפת-הגלילה החתומה של האתר.
 *
 * מחפש את כל האלמנטים עם [data-kv-reveal] או .kv-reveal / [data-kv-stagger]
 * ומדליק עליהם data-kv-reveal="in" כשהם נכנסים לתצוגה (IntersectionObserver
 * יחיד לכל הדף). ה-CSS ב-app/signature.css עושה את שאר העבודה.
 *
 * עקרונות ביצועים ונגישות:
 *  - Observer יחיד, unobserve מיד אחרי החשיפה (חד-פעמי, בלי re-run).
 *  - אם המשתמש ביקש להפחית תנועה (מערכת ההפעלה או מתג הנגישות באתר) -
 *    מדליקים הכול מיד בלי observer, כדי שתוכן לא יישאר מוסתר.
 *  - MutationObserver קליל קולט אלמנטים חדשים (ניווט SPA / תוכן דינמי).
 *  - transform/opacity בלבד (ה-CSS) - אין layout thrash.
 */

/** האם יש להפחית תנועה. מכבד OS + מתג הנגישות באתר. בטוח ל-SSR. */
function reduceMotion(): boolean {
  if (typeof window === 'undefined') return false
  const root = document.documentElement
  if (root.dataset.reduceMotion === '1' || root.classList.contains('kv-a11y-reduce-motion')) return true
  return !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** בורר לכל מה שאמור להיחשף. */
const SELECTOR = '.kv-reveal, [data-kv-stagger]'

/** מסמן אלמנט כחשוף + מפסיק לצפות בו. */
function reveal(el: Element, obs?: IntersectionObserver) {
  ;(el as HTMLElement).dataset.kvReveal = 'in'
  obs?.unobserve(el)
}

export function useSignatureMotion(): void {
  useEffect(() => {
    // מכבד .kv-reveal של הורים בלבד: קונטיינר עם data-kv-stagger מנהל את ילדיו,
    // אז לא צריך לצפות בכל ילד בנפרד. אבל .kv-reveal עצמאי כן נצפה.
    const collect = (): Element[] =>
      Array.from(document.querySelectorAll(SELECTOR)).filter((el) => {
        // אם כבר נחשף - דלג
        if ((el as HTMLElement).dataset.kvReveal === 'in') return false
        // ילד .kv-reveal בתוך קונטיינר stagger מנוהל ע"י ההורה - לא נצפה עצמאית
        if (el.classList.contains('kv-reveal') && el.parentElement?.closest('[data-kv-stagger]')) return false
        return true
      })

    // הפחתת תנועה: הצג הכול מיד, בלי observers.
    if (reduceMotion()) {
      document.querySelectorAll(SELECTOR).forEach((el) => reveal(el))
      return
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) reveal(entry.target, obs)
        }
      },
      // מרווח שלילי קטן מלמטה: החשיפה מתחילה מעט לפני שהאלמנט ממש נכנס,
      // כך שהתנועה מרגישה מכוונת ולא "מאחרת".
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    const observeAll = () => collect().forEach((el) => io.observe(el))
    observeAll()

    // קולט אלמנטים חדשים שנוספו ל-DOM (תוכן דינמי / מעברי עמוד).
    const mo = new MutationObserver((mutations) => {
      let added = false
      for (const m of mutations) {
        if (m.addedNodes.length) { added = true; break }
      }
      if (added) observeAll()
    })
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
}

/**
 * SignatureMotion - רכיב-אפס (renders null) שאפשר להשמיט ב-layout כדי
 * להפעיל את ה-hook גלובלית בלי לגעת בכל עמוד.
 */
export function SignatureMotion(): null {
  useSignatureMotion()
  return null
}
