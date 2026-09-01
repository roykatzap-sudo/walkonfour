'use client'

import { useState } from 'react'

type ReportStatus = 'idle' | 'sending' | 'done' | 'error'

export function ReportButton({ type, id }: { type: 'business' | 'review'; id: number }) {
  const [status, setStatus] = useState<ReportStatus>('idle')

  async function report() {
    if (status !== 'idle') return
    setStatus('sending')
    try {
      const res = await fetch('/api/directory/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id }),
      })
      const data = await res.json()
      if (data.ok) {
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <span
        style={{
          fontSize: 12,
          color: 'var(--text-soft)',
          fontWeight: 600,
        }}
      >
        הדיווח התקבל
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={report}
      disabled={status === 'sending'}
      style={{
        background: 'none',
        border: 'none',
        cursor: status === 'sending' ? 'default' : 'pointer',
        fontSize: 12,
        color: 'var(--text-soft)',
        fontWeight: 600,
        padding: '4px 0',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        opacity: status === 'sending' ? 0.5 : 1,
        minHeight: 32,
        fontFamily: 'inherit',
      }}
      aria-label={type === 'business' ? 'דיווח על עסק' : 'דיווח על ביקורת'}
    >
      {status === 'sending' ? 'שולח...' : 'דיווח'}
    </button>
  )
}
