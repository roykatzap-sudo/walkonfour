'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { demoCategories } from '@/lib/demo'

export function NewPostForm() {
  const router = useRouter()
  const params = useSearchParams()
  const toast = useToast()

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState(params.get('category') || demoCategories[0].slug)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')

    const validSlugs = demoCategories.map((c) => c.slug)
    if (!validSlugs.includes(category)) {
      setErr('הקטגוריה שנבחרה אינה חוקית. בחרו קטגוריה מהרשימה.')
      return
    }
    if (title.length > 200 || content.length > 5000) {
      setErr('הכותרת או התוכן ארוכים מדי. קצרו ונסו שוב.')
      return
    }

    setLoading(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('כדי לפרסם פוסט צריך להתחבר תחילה')

      const { data: cat, error: catError } = await supabase.from('forum_categories').select('id').eq('slug', category).single()
      if (catError || !cat) throw new Error('הקטגוריה לא נמצאה במסד הנתונים. בחרו קטגוריה שונה.')

      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert({ title, content, category_id: cat.id, author_id: user.id })
        .select('id')
        .single()
      if (error) throw error

      toast('הפוסט פורסם בהצלחה')
      router.push(`/forum/post/${post.id}`)
    } catch (e: any) {
      setErr(e?.message || 'משהו השתבש. ודאו שההגדרות תקינות ונסו שוב.')
      setLoading(false)
    }
  }

  return (
    <div className="card">
      {err && <div className="alert alert-error">{err}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="np-category">קטגוריה</label>
          <select id="np-category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
            {demoCategories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="np-title">כותרת</label>
          <input id="np-title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="על מה תרצו לדבר?" />
        </div>
        <div className="field">
          <label htmlFor="np-content">תוכן</label>
          <textarea id="np-content" className="input" value={content} onChange={(e) => setContent(e.target.value)} required maxLength={5000} style={{ minHeight: 180 }} placeholder="שתפו את השאלה, ההמלצה או הסיפור שלכם..." />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'מפרסם...' : 'פרסם פוסט'}
        </button>
      </form>
    </div>
  )
}
