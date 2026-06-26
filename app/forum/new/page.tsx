import { Suspense } from 'react'
import { NewPostForm } from '@/components/forum/NewPostForm'

export const metadata = { title: 'פוסט חדש · כלבניה' }

export default function NewPostPage() {
  return (
    <main className="page page-narrow">
      <h1 className="page-title">פוסט חדש</h1>
      <p className="page-sub">שתפו שאלה, המלצה או סיפור עם הקהילה.</p>
      <Suspense fallback={<div className="card">טוען...</div>}>
        <NewPostForm />
      </Suspense>
    </main>
  )
}
