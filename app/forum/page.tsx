import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoCategories, demoPosts } from '@/lib/demo'
import { PostRow } from '@/components/forum/PostRow'
import { DemoBanner } from '@/components/shared/DemoBanner'
import type { ForumCategory, ForumPost } from '@/types'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'פורום הקהילה',
  description:
    'שאלות, תשובות והמלצות בין בעלי כלבים. הקהילה בהקמה - הצטרפו ותהיו מהראשונים.',
  path: '/forum',
})
export const dynamic = 'force-dynamic'

export default async function ForumPage() {
  const supabase = await createClient()

  const { data: categories, isDemo } = await safeQuery<ForumCategory[]>(
    () => supabase.from('forum_categories').select('*, posts:forum_posts(count)').order('sort_order') as any,
    demoCategories
  )

  const { data: recent } = await safeQuery<ForumPost[]>(
    () =>
      supabase
        .from('forum_posts')
        .select('*, author:profiles(id, full_name, avatar_url), comments:forum_comments(count), likes:forum_likes(count)')
        .order('created_at', { ascending: false })
        .limit(5) as any,
    demoPosts
  )

  const cats: ForumCategory[] = (categories as any[]).map((c) => ({
    ...c,
    posts_count: c.posts_count ?? c.posts?.[0]?.count ?? 0,
  }))

  return (
    <main className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span className="section-tag">קהילה</span>
          <h1 className="page-title">פורום הקהילה</h1>
          <p className="page-sub" style={{ marginBottom: 0 }}>המקום לשאול, לענות ולהמליץ - בין בעלי כלבים. הקהילה בהקמה.</p>
        </div>
        <Link href="/forum/new" className="btn btn-dark">+ פוסט חדש</Link>
      </div>

      <div style={{ marginTop: 32 }}>{isDemo && <DemoBanner />}</div>

      <div
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 12, marginBottom: 48,
        }}
      >
        {cats.map((c) => (
          <Link
            key={c.id}
            href={`/forum/${c.slug}`}
            className="card"
            style={{ textDecoration: 'none', color: 'inherit', display: 'block', transition: 'transform .2s' }}
          >
            <div style={{ fontSize: 30, marginBottom: 10 }}>{c.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{c.name}</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 10 }}>{c.description}</div>
            <div style={{ color: '#c99a5b', fontWeight: 700, fontSize: 13 }}>{c.posts_count} פוסטים →</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>דיונים אחרונים</h2>
      <div className="card">
        {(recent as ForumPost[]).map((p) => (
          <PostRow key={p.id} post={p} />
        ))}
      </div>
    </main>
  )
}
