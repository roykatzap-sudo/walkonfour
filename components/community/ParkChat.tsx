'use client'

import { useEffect, useRef, useState } from 'react'

type Msg = { id: number; user_id: number; body: string; nickname: string; created_at: string }

export function ParkChat({ parkKey, currentUserId }: { parkKey: string; currentUserId: number }) {
  const [messages, setMessages] = useState<Msg[] | null>(null)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [err, setErr] = useState('')
  const [denied, setDenied] = useState(false)
  const lastIdRef = useRef(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  async function load(initial = false) {
    try {
      const url = `/api/community/messages?park_key=${encodeURIComponent(parkKey)}${initial ? '' : `&since=${lastIdRef.current}`}`
      const res = await fetch(url)
      if (res.status === 403) { setDenied(true); return }
      const data = await res.json()
      if (!data.ok) return
      const newMsgs: Msg[] = data.messages || []
      if (initial) {
        setMessages(newMsgs)
        if (newMsgs.length) lastIdRef.current = newMsgs[newMsgs.length - 1].id
      } else if (newMsgs.length) {
        setMessages((prev) => [...(prev || []), ...newMsgs])
        lastIdRef.current = newMsgs[newMsgs.length - 1].id
      }
    } catch {/* ignore network blips during polling */}
  }

  // טעינה ראשונית + polling כל 5 שניות (במקום WebSocket - פשוט יותר ל-MVP)
  useEffect(() => {
    load(true)
    const t = setInterval(() => load(false), 5000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parkKey])

  // גלילה אוטומטית להודעה האחרונה
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages?.length])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || posting) return
    setPosting(true); setErr('')
    try {
      const res = await fetch('/api/community/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ park_key: parkKey, body: text.trim() }),
      })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'rate') setErr('יותר מדי הודעות. המתינו רגע.')
        else if (data.error === 'no_plan') setDenied(true)
        else setErr('שגיאה')
        setPosting(false)
        return
      }
      setText('')
      setMessages((prev) => [...(prev || []), data.message])
      lastIdRef.current = data.message.id
    } catch {
      setErr('שגיאת רשת')
    } finally {
      setPosting(false)
    }
  }

  if (denied) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 32 }} aria-hidden="true">🔒</div>
        <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)', margin: '8px 0 6px' }}>הצ'אט פתוח רק למי שתיאם הגעה</h3>
        <p style={{ fontSize: 14, color: '#5b4d3c', margin: 0, lineHeight: 1.6 }}>
          תאמו הגעה לגינה הזו (גם ל-24 שעות אחורה) כדי לראות את הצ'אט.
        </p>
      </div>
    )
  }

  if (messages === null) {
    return <div className="card" style={{ padding: 28, textAlign: 'center', color: '#5b4d3c' }}>טוען...</div>
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: 540 }}>
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', minHeight: 200, maxHeight: 380, background: '#fbf7ef' }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8a7c66', fontSize: 14, padding: '40px 0' }}>
            אין עדיין הודעות. תהיו הראשונים 🐾
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {messages.map((m) => {
              const isMine = m.user_id === currentUserId
              const time = new Date(m.created_at).toTimeString().slice(0, 5)
              return (
                <div key={m.id} style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '78%',
                    background: isMine ? 'var(--brand)' : '#fff',
                    color: isMine ? '#fff' : 'var(--ink)',
                    padding: '8px 12px',
                    borderRadius: 14,
                    borderStartStartRadius: isMine ? 14 : 4,
                    borderStartEndRadius: isMine ? 4 : 14,
                    border: isMine ? 'none' : '1px solid rgba(201,154,91,.22)',
                  }}>
                    {!isMine && <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--brand-dark)', marginBottom: 2 }}>{m.nickname}</div>}
                    <div style={{ fontSize: 14.5, lineHeight: 1.45, wordBreak: 'break-word' }}>{m.body}</div>
                    <div style={{ fontSize: 10.5, opacity: 0.7, textAlign: 'end', marginTop: 2 }}>{time}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <form onSubmit={send} style={{ display: 'flex', gap: 8, padding: 10, borderTop: '1px solid rgba(201,154,91,.22)', background: '#fff' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="כתבו הודעה..."
          maxLength={500}
          style={{ flex: 1, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.3)', fontSize: 15 }}
        />
        <button type="submit" className="btn btn-primary" disabled={posting || !text.trim()} style={{ fontSize: 14, padding: '10px 18px' }}>
          שלח
        </button>
      </form>
      {err && <div role="alert" style={{ padding: '6px 12px', fontSize: 12.5, color: '#a23c2e', textAlign: 'center', background: '#fef5f3' }}>{err}</div>}
      <div style={{ padding: '6px 12px', fontSize: 11.5, color: '#8a7c66', textAlign: 'center', background: '#fbf7ef', borderTop: '1px solid rgba(201,154,91,.15)' }}>
        🔒 הודעות נמחקות אוטומטית אחרי 24 שעות. הצ'אט גלוי רק למי שתיאם הגעה.
      </div>
    </div>
  )
}
