import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoPosts } from '@/lib/demo'
import { CommentThread } from '@/components/forum/CommentThread'
import { DemoBanner } from '@/components/shared/DemoBanner'
import { timeAgo } from '@/lib/utils'
import type { ForumComment, ForumPost } from '@/types'

export const dynamic = 'force-dynamic'

/** כתובת הבסיס לקישורים מוחלטים (שיתוף ו-OpenGraph). */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')

/** תמונת ברירת מחדל לשיתוף - קרם-לברדור, כלב מאיר פנים. */
const OG_FALLBACK = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1200&h=630&auto=format&fit=crop&q=55'

/** מקצר טקסט לתיאור OG: עד 160 תווים, חיתוך נקי במילה. */
function clip(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`
}

/** שולף את הפוסט (DB אמיתי או דמו) - משותף ל-generateMetadata ולעמוד. */
async function loadPost(id: string): Promise<{ post: ForumPost | null; isDemo: boolean }> {
  const supabase = await createClient()
  const demoMatch = demoPosts.find((p) => p.id === id) ?? null

  const { data: post, isDemo } = await safeQuery<ForumPost | null>(
    () =>
      supabase
        .from('forum_posts')
        .select(`
          *,
          author:profiles(id, full_name, avatar_url, dog_name, dog_breed),
          category:forum_categories(name, slug, icon),
          comments:forum_comments(*, author:profiles(id, full_name, avatar_url)),
          likes:forum_likes(count)
        `)
        .eq('id', id)
        .single() as any,
    demoMatch
  )

  return { post, isDemo }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { post } = await loadPost(params.id)
  if (!post) return { title: 'פוסט לא נמצא · קהילה על ארבע' }

  const title = `${post.title} · פורום קהילה על ארבע`
  const description = clip(post.content || 'דיון בקהילת בעלי הכלבים של קהילה על ארבע.')
  const url = `${SITE_URL}/forum/post/${post.id}`
  const breed = post.author?.dog_breed
  const ogImage = post.image_url || OG_FALLBACK
  const ogAlt = breed ? `${post.title} - דיון על ${breed} בקהילה על ארבע` : `${post.title} - פורום קהילה על ארבע`

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url,
      siteName: 'קהילה על ארבע',
      locale: 'he_IL',
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImage],
    },
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { post, isDemo } = await loadPost(params.id)

  if (!post) notFound()

  // עדכון צפיות (אם DB אמיתי)
  if (!isDemo) {
    try {
      await supabase.rpc('increment_views', { post_id: params.id })
    } catch {
      // אין פונקציה / placeholder - לא קריטי
    }
  }

  const comments: ForumComment[] = ((post as any).comments ?? []).sort(
    (a: ForumComment, b: ForumComment) => +new Date(a.created_at) - +new Date(b.created_at)
  )
  const initial = (post.author?.full_name || 'א').charAt(0)

  // קישורי שיתוף - בלחיצה אחת, דרך URL בלבד (ללא JS, נגיש, מהיר)
  const shareUrl = `${SITE_URL}/forum/post/${post.id}`
  const shareText = `${post.title} - מתוך פורום קהילה על ארבע`
  const enc = encodeURIComponent
  const shareLinks = [
    {
      label: 'שיתוף בוואטסאפ',
      href: `https://wa.me/?text=${enc(`${shareText}\n${shareUrl}`)}`,
      color: '#25D366',
      icon: (
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.5-1.2-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.4.5-.3.3c-.2.2-.3.4-.2.6.2.4.8 1.3 1.6 2 1 .9 1.9 1.2 2.3 1.4.2.1.4.1.5-.1l.7-.9c.2-.2.4-.2.6-.1l1.9.9c.3.1.4.2.5.3.1.2.1.8-.1 1.5Z" />
      ),
    },
    {
      label: 'שיתוף בפייסבוק',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl)}`,
      color: '#1877F2',
      icon: (
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1 0 2.1.2 2.1.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
      ),
    },
    {
      label: 'שיתוף בטלגרם',
      href: `https://t.me/share/url?url=${enc(shareUrl)}&text=${enc(shareText)}`,
      color: '#229ED9',
      icon: (
        <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 6.9-1.6 7.4c-.1.5-.4.7-.9.4l-2.5-1.8-1.2 1.1c-.1.1-.2.2-.5.2l.2-2.5 4.5-4c.2-.2 0-.3-.3-.1L9 13l-2.4-.8c-.5-.2-.5-.5.1-.8l9.4-3.6c.4-.2.8.1.6.9Z" />
      ),
    },
  ]

  return (
    <main className="page page-narrow">
      <Link href={post.category?.slug ? `/forum/${post.category.slug}` : '/forum'} className="link" style={{ display: 'inline-block', marginBottom: 18 }}>
        <span aria-hidden="true">← </span>חזרה לפורום
      </Link>

      {isDemo && <DemoBanner />}

      <article className="card">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <div aria-hidden="true" style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#c99a5b,#e8c887)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 20 }}>
            {initial}
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{post.author?.full_name || 'אנונימי'}</div>
            <div style={{ color: 'var(--text-soft)', fontSize: 13 }}>
              {post.author?.dog_name ? `${post.author.dog_name} · ${post.author.dog_breed ?? ''} · ` : ''}
              {timeAgo(post.created_at)}
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 14 }}>{post.title}</h1>
        <p style={{ lineHeight: 1.8, color: 'var(--text)', fontSize: 16, whiteSpace: 'pre-wrap' }}>{post.content}</p>

        <div style={{ display: 'flex', gap: 18, marginTop: 20, color: 'var(--text-soft)', fontSize: 13, fontWeight: 600 }}>
          <span><span aria-hidden="true">👁️ </span>{post.views} צפיות</span>
          <span><span aria-hidden="true">💬 </span>{comments.length} תגובות</span>
        </div>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid #f0ede6', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-soft)', marginInlineEnd: 4 }}>שיתוף:</span>
          {shareLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                background: '#fff', border: `1.5px solid ${s.color}`, color: s.color,
                transition: 'all .2s',
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
                {s.icon}
              </svg>
            </a>
          ))}
        </div>
      </article>

      <CommentThread postId={post.id} initial={comments} demo={isDemo} />
    </main>
  )
}
