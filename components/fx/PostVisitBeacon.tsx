'use client'

import { useEffect } from 'react'
import { getArrival } from '@/lib/arrival'

/**
 * סופר כניסה לאתר מקישור מתויג (utm_source), פעם אחת לכל כניסה.
 * כך רואים בפאנל הניהול איזה פוסט הביא אנשים. לא נשמר שום מזהה של המבקר:
 * רק המקור, שם הקמפיין והעמוד. קוראים את הכתובת ישירות (ולא useSearchParams)
 * כדי לא להפוך את כל האתר לרינדור בצד הלקוח.
 */
export function PostVisitBeacon() {
  useEffect(() => {
    try {
      getArrival()
      const sp = new URLSearchParams(window.location.search)
      const src = sp.get('utm_source')
      if (!src) return
      const campaign = sp.get('utm_campaign') || ''
      const key = `kv-pv:${src}:${campaign}:${window.location.pathname}`
      try {
        if (window.sessionStorage.getItem(key)) return
        window.sessionStorage.setItem(key, '1')
      } catch {
        /* גלישה פרטית: סופרים בלי זיכרון */
      }
      const body = JSON.stringify({ src, campaign, page: window.location.pathname })
      if (typeof navigator.sendBeacon === 'function') {
        navigator.sendBeacon('/api/post-visit', new Blob([body], { type: 'text/plain' }))
      } else {
        fetch('/api/post-visit', { method: 'POST', body, keepalive: true }).catch(() => {})
      }
    } catch {
      /* ספירה היא לא סיבה לשבור עמוד */
    }
  }, [])
  return null
}
