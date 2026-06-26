'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { timeAgo } from '@/lib/utils'
import type { ForumComment } from '@/types'

function isForumComment(x: unknown): x is ForumComment {
  if (typeof x !== 'object' || x === null) return false
  const c = x as Record<string, unknown>
  return (
    typeof c.id === 'string' &&
    typeof c.post_id === 'string' &&
    typeof c.content === 'string' &&
    typeof c.created_at === 'string' &&
    typeof c.updated_at === 'string'
  )
}

function Comment({ c }: { c: ForumComment }) {
  const initial = (c.author?.full_name || 'א').charAt(0)
  return (
    <div style={{ display: 'flex', gap: 12, padding: '14px 0', borderBottom: '1px solid #f3f0e9' }}>
      <div style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg,#c99a5b,#e8c887)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
        {initial}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 4 }}>
          <span style={{ fontWeight: 800, fontSize: 14 }}>{c.author?.full_name || 'אנונימי'}</span>
          <span style={{ color: '#aaa', fontSize: 12 }}>{timeAgo(c.created_at)}</span>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.6, color: '#333' }}>{c.content}</div>
      </div>
    </div>
  )
}

export function CommentThread({
  postId,
  initial,
  demo,
}: {
  postId: string
  initial: ForumComment[]
  demo?: boolean
}) {
  const toast = useToast()
  const [comments, setComments] = useState<ForumComment[]>(initial)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  // Realtime - תגובות חדשות נכנסות בלי refresh
  useEffect(() => {
    if (demo) return
    const supabase = createClient()
    const channel = supabase
      .channel(`post-${postId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'forum_comments', filter: `post_id=eq.${postId}` },
        (payload) => {
          if (!isForumComment(payload.new)) {
            console.error('[CommentThread] Invalid ForumComment from real-time API:', payload.new)
            return
          }
          const incoming = payload.new
          setComments((prev) =>
            prev.some((c) => c.id === incoming.id) ? prev : [...prev, incoming]
          )
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, demo])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)

    if (demo) {
      setComments((prev) => [
        ...prev,
        { id: `local-${prev.length}`, post_id: postId, author_id: 'me', parent_id: null, content: text, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), author: { id: 'me', full_name: 'אני', username: null, avatar_url: null, city: null, dog_name: null, dog_breed: null, dog_age: null, dog_photo_url: null, bio: null, is_premium: false, premium_until: null, created_at: '' } },
      ])
      setText('')
      setSending(false)
      toast('התגובה נוספה')
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
    if (!user) {
      toast('כדי להגיב צריך להתחבר תחילה')
      setSending(false)
      return
    }
    const { error } = await supabase
      .from('forum_comments')
      .insert({ post_id: postId, content: text, parent_id: null, author_id: user.id })
    if (error) toast('משהו השתבש בשליחת התגובה. נסו שוב')
    else {
      setText('')
      toast('התגובה נוספה')
    }
    setSending(false)
  }

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <h3 style={{ fontWeight: 800, fontSize: 18, marginBottom: 10 }}>תגובות ({comments.length})</h3>

      <form onSubmit={add} style={{ marginBottom: 12 }}>
        <textarea className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="כתבו את התגובה שלכם..." />
        <button className="btn btn-primary" disabled={sending} style={{ marginTop: 10 }}>
          {sending ? 'שולח...' : 'פרסם תגובה'}
        </button>
      </form>

      <div>
        {comments.length === 0 ? (
          <p className="muted" style={{ padding: '12px 0' }}>עדיין אין תגובות. היו הראשונים להגיב.</p>
        ) : (
          comments.map((c) => <Comment key={c.id} c={c} />)
        )}
      </div>
    </div>
  )
}
