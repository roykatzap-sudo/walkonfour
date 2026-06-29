'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export function CommunityHeader({ nickname }: { nickname: string }) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function logout() {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await fetch('/api/community/logout', { method: 'POST' })
      router.push('/community/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, insetInlineStart: 0, insetInlineEnd: 0, height: 64, background: 'rgba(251,247,239,.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(201,154,91,.2)', zIndex: 100, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
      <Link href="/community" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{ fontSize: 22 }} aria-hidden="true">🐾</span>
        <span style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)' }}>קהילה על ארבע</span>
      </Link>
      <div style={{ flex: 1 }} />
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--brand)', color: '#fff', border: 'none', borderRadius: 999, padding: '7px 14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <span aria-hidden="true">👤</span>
          {nickname}
        </button>
        {menuOpen && (
          <>
            <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 99 }} />
            <div role="menu" style={{ position: 'absolute', top: '100%', insetInlineEnd: 0, marginTop: 8, background: '#fff', border: '1px solid rgba(201,154,91,.22)', borderRadius: 14, boxShadow: '0 14px 36px rgba(42,32,24,.18)', padding: 6, minWidth: 200, zIndex: 100 }}>
              <Link href="/community/dogs" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 14px', fontSize: 14.5, color: 'var(--ink)', textDecoration: 'none', borderRadius: 10 }}>🐕 הכלבים שלי</Link>
              <Link href="/community/account" onClick={() => setMenuOpen(false)} style={{ display: 'block', padding: '10px 14px', fontSize: 14.5, color: 'var(--ink)', textDecoration: 'none', borderRadius: 10 }}>⚙️ החשבון שלי</Link>
              <hr style={{ margin: '4px 8px', border: 'none', borderTop: '1px solid rgba(201,154,91,.18)' }} />
              <button type="button" onClick={logout} disabled={loggingOut} style={{ display: 'block', width: '100%', padding: '10px 14px', fontSize: 14.5, color: '#a23c2e', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'start', borderRadius: 10, fontFamily: 'inherit', fontWeight: 600 }}>
                {loggingOut ? 'יוצא...' : '🚪 יציאה'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
