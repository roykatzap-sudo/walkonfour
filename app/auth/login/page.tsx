import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = { title: 'התחברות · כלבניה' }

export default function LoginPage() {
  return (
    <main className="page page-narrow">
      <h1 className="page-title">ברוכים השבים 🐾</h1>
      <p className="page-sub">התחברו כדי להמשיך לקהילה.</p>
      <Suspense fallback={<div className="card">טוען...</div>}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  )
}
