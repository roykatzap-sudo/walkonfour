import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoCategories, demoPosts } from '@/lib/demo'
import { PostRow } from '@/components/forum/PostRow'
import { DemoBanner } from '@/components/shared/DemoBanner'
import type { ForumCategory, ForumPost } from '@/types'
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const dynamic = 'force-dynamic'

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = demoCategories.find((c) => c.slug === params.category)
  if (!cat) return buildMetadata({ title: 'פורום הקהילה', path: '/forum' })
  return buildMetadata({
    title: `${cat.name} - פורום קהילה על ארבע`,
    description: `${cat.description}. דיונים, שאלות ותשובות מקהילת בעלי הכלבים של קהילה על ארבע.`,
    path: `/forum/${cat.slug}`,
  })
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const supabase = await createClient()
  const demoCat = demoCategories.find((c) => c.slug === params.category) ?? null

  const { data: category } = await safeQuery<ForumCategory | null>(
    () => supabase.from('forum_categories').select('*').eq('slug', params.category).single() as any,
    demoCat
  )

  if (!category) notFound()

  const demoCatPosts = demoPosts.filter((p) => p.category_id === category.id)
  const { data: posts, isDemo } = await safeQuery<ForumPost[]>(
    () =>
      supabase
        .from('forum_posts')
        .select('*, author:profiles(id, full_name, avatar_url), comments:forum_comments(count), likes:forum_likes(count)')
        .eq('category_id', category.id)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false }) as any,
    demoCatPosts
  )

  return (
    <main className="page">
      <Link href="/forum" className="link" style={{ display: 'inline-block', marginBottom: 18 }}>← כל הקטגוריות</Link>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <h1 className="page-title">{category.icon} {category.name}</h1>
        <Link href={`/forum/new?category=${category.slug}`} className="btn btn-dark">+ פוסט חדש</Link>
      </div>
      <p className="page-sub">{category.description}</p>

      {isDemo && <DemoBanner />}

      <div className="card">
        {(posts as ForumPost[]).length === 0 ? (
          <p className="muted" style={{ textAlign: 'center', padding: 20 }}>אין עדיין פוסטים בקטגוריה זו. היו הראשונים!</p>
        ) : (
          (posts as ForumPost[]).map((p) => <PostRow key={p.id} post={p} />)
        )}
      </div>
    </main>
  )
}
