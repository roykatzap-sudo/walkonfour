'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * התראות "חיות" קופצות מהפינה - פעילות קהילה שמזרימה חיים לאתר.
 * כניסה תלת-ממדית, נעלמות לבד, ניתנות לסגירה, מכבדות prefers-reduced-motion.
 * דקורטיבי (aria-hidden) כדי לא להציף קוראי מסך.
 */

type Pop = {
  initial: string
  accent: string
  icon: string
  text: string
  sub: string
}

const POOL: Pop[] = [
  { initial: 'מ', accent: '#c99a5b', icon: '🛒', text: 'מיכל מתל אביב הצטרפה לקבוצת Royal Canin', sub: 'נותרו 4 מקומות' },
  { initial: '🐾', accent: '#b4502e', icon: '', text: 'נמצא כלב בפלורנטין - מחפשים בעלים', sub: 'לפני 6 דקות' },
  { initial: 'ד', accent: '#a87a3e', icon: '💬', text: 'דני שאל על גמילה לבית בפורום', sub: 'כבר 3 תשובות' },
  { initial: 'י', accent: '#7a6f1f', icon: '🎉', text: 'יואב נרשם למפגש הבוקר בירקון', sub: 'שישי, 7:30' },
  { initial: 'ש', accent: '#38758f', icon: '🏠', text: 'שירה מצאה פינסיטר לחופשה', sub: 'חיפה' },
  { initial: '❤️', accent: '#b4502e', icon: '', text: 'נאלה מנתניה חזרה הביתה', sub: 'תודה לקהילה' },
  { initial: 'ר', accent: '#8a5a2b', icon: '🦴', text: 'רתמת Ruffwear נמכרה ב-120 ₪', sub: 'יד שנייה' },
  { initial: 'ר', accent: '#c99a5b', icon: '⭐', text: 'רון דירג את "וטרינר הצפון" חמישה כוכבים', sub: 'ספריית עסקים' },
  { initial: 'ת', accent: '#a87a3e', icon: '🐶', text: 'תמר אימצה גורה מבאר שבע', sub: 'מזל טוב' },
  { initial: 'נ', accent: '#7a6f1f', icon: '🧭', text: 'נועה גילתה שמתאים לה בורדר קולי', sub: 'מתאם הגזע' },
  { initial: 'ע', accent: '#38758f', icon: '📍', text: 'עומר סימן גינת כלבים חדשה', sub: 'ראשון לציון' },
  { initial: 'H', accent: '#c99a5b', icon: '🛒', text: "קבוצת Hill's הגיעה ל-45 חברים", sub: 'מתמלאת' },
  { initial: 'ג', accent: '#8a5a2b', icon: '🥾', text: 'גיא הוסיף מסלול טיול בכרמל', sub: 'מסלולי טיול' },
  { initial: 'א', accent: '#a87a3e', icon: '📸', text: 'אורי העלה תמונה של באדי לקיר', sub: '23 לבבות' },
]

export function LivePops() {
  const [pop, setPop] = useState<(Pop & { id: number }) | null>(null)
  const [leaving, setLeaving] = useState(false)
  const idx = useRef(0)
  const counter = useRef(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    function clearAll() {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }

    function showNext() {
      // מתחילים מאינדקס אקראי ומתקדמים, שלא יחזור על אותו סדר
      const item = POOL[idx.current % POOL.length]
      idx.current += 1 + Math.floor(Math.random() * 2)
      counter.current += 1
      setLeaving(false)
      setPop({ ...item, id: counter.current })

      // יציאה אחרי ~6 שניות
      timers.current.push(
        setTimeout(() => setLeaving(true), 6000),
        setTimeout(() => {
          setPop(null)
          // הבא תוך 9-16 שניות
          timers.current.push(setTimeout(showNext, 9000 + Math.random() * 7000))
        }, 6500),
      )
    }

    // הראשונה אחרי 4 שניות מטעינת הדף
    timers.current.push(setTimeout(showNext, 4000))
    return clearAll
  }, [])

  function dismiss() {
    setLeaving(true)
    timers.current.push(setTimeout(() => setPop(null), 450))
  }

  if (!pop) return null

  return (
    <div className="live-pops" aria-hidden="true">
      <div className={`live-pop${leaving ? ' leaving' : ''}`} key={pop.id}>
        <div className="live-pop-av" style={{ background: `linear-gradient(135deg, ${pop.accent}, #e8c887)` }}>
          {pop.initial}
        </div>
        <div className="live-pop-body">
          <div className="live-pop-text">
            {pop.icon && <span className="live-pop-icon">{pop.icon}</span>}
            {pop.text}
          </div>
          <div className="live-pop-sub">{pop.sub}</div>
        </div>
        <button type="button" className="live-pop-x" onClick={dismiss} aria-label="סגירת ההתראה">
          ✕
        </button>
      </div>
    </div>
  )
}
