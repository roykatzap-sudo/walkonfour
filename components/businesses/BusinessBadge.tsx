'use client'

import { useState } from 'react'

/**
 * לבעלי העסק: קישור ותג להטמעה באתר שלהם.
 * עסק שמקשר לעמוד שלו במדריך עוזר גם לעצמו (עוד ביקורות) וגם לאתר.
 */
export function BusinessBadge({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null)
  const code = `<a href="${url}" target="_blank" rel="noopener"><img src="https://walkonfour.org/badge.svg" alt="${name.replace(/"/g, '&quot;')} במדריך העסקים של קהילה על ארבע" width="220" height="64"></a>`

  async function copy(kind: 'link' | 'code') {
    try {
      await navigator.clipboard.writeText(kind === 'link' ? url : code)
      setCopied(kind)
      window.setTimeout(() => setCopied(null), 2400)
    } catch {
      /* הדפדפן חסם גישה ללוח */
    }
  }

  const btn: React.CSSProperties = {
    minHeight: 46, padding: '0 18px', borderRadius: 999, cursor: 'pointer', font: 'inherit', fontSize: 15, fontWeight: 800,
    background: '#fff', color: 'var(--brand-dark)', border: '1.5px solid rgba(201,154,91,.5)',
  }

  return (
    <details style={{ marginTop: 22, background: '#fffaf1', border: '1px solid rgba(201,154,91,.3)', borderRadius: 16, padding: '14px 18px' }}>
      <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: 16, color: '#2a2018', minHeight: 30 }}>
        העסק שלכם? כך מביאים עוד ביקורות
      </summary>
      <p style={{ margin: '10px 0 12px', fontSize: 15.5, lineHeight: 1.75, color: '#3a3128' }}>
        שלחו ללקוחות את הקישור לעמוד הזה ובקשו מהם לכתוב ביקורת. אם יש לכם אתר, אפשר להוסיף אליו את התג שלנו,
        והוא יוביל ישר לעמוד שלכם כאן.
      </p>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/badge.svg" alt="התג: מופיע במדריך העסקים של קהילה על ארבע" width={220} height={64} style={{ display: 'block', marginBottom: 12 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" style={btn} onClick={() => copy('link')} aria-live="polite">
          {copied === 'link' ? 'הקישור הועתק' : 'העתקת הקישור לעמוד'}
        </button>
        <button type="button" style={btn} onClick={() => copy('code')} aria-live="polite">
          {copied === 'code' ? 'הקוד הועתק' : 'העתקת קוד התג לאתר'}
        </button>
      </div>
    </details>
  )
}
