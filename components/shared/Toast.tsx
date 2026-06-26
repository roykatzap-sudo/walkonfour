'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

type ToastCtx = (msg: string) => void

const Ctx = createContext<ToastCtx>(() => {})

/** hook גלובלי להצגת toast - מחקה את t() מה-HTML המקורי. */
export function useToast() {
  return useContext(Ctx)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('')
  const [show, setShow] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toast = useCallback((m: string) => {
    setMsg(m)
    setShow(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setShow(false), 4000)
  }, [])

  return (
    <Ctx.Provider value={toast}>
      {children}
      <div
        className={`kv-toast${show ? ' show' : ''}`}
        role="status"
        aria-label="הודעה"
        aria-live="polite"
        aria-atomic="true"
      >
        {msg}
      </div>
    </Ctx.Provider>
  )
}
