'use client'

import Link from 'next/link'
import { timeAgo } from '@/lib/utils'
import { Tilt3D } from '@/components/fx/Tilt3D'
import type { ForumPost } from '@/types'

export function PostRow({ post }: { post: ForumPost }) {
  const initial = (post.author?.full_name || 'א').charAt(0)
  return (
    <Tilt3D className="pr-tilt" max={5} glare>
      <Link
        href={`/forum/post/${post.id}`}
        className="sweep lift-3d-sm"
        style={{
          display: 'flex', gap: 14, alignItems: 'flex-start', padding: '18px 0',
          borderBottom: '1px solid #f0ede6', textDecoration: 'none', color: 'inherit',
        }}
      >
      <div
        style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg,#c99a5b,#e8c887)', color: '#fff',
          display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 18,
        }}
      >
        {initial}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 3 }}>
          {post.is_pinned && '📌 '}
          {post.title}
        </div>
        <div style={{ color: '#888', fontSize: 13, marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {post.content}
        </div>
        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#aaa', fontWeight: 600 }}>
          <span>{post.author?.full_name || 'אנונימי'}</span>
          <span>💬 {post.comments_count ?? 0}</span>
          <span>❤️ {post.likes_count ?? 0}</span>
          <span>👁️ {post.views}</span>
          <span>{timeAgo(post.created_at)}</span>
        </div>
      </div>
      </Link>
    </Tilt3D>
  )
}
