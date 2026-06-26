import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = { title: 'הרשמה · כלבניה' }

export default function RegisterPage() {
  return (
    <main className="page page-narrow">
      <h1 className="page-title">הצטרפו לכלבניה</h1>
      <p className="page-sub">קהילת בעלי הכלבים הגדולה בישראל - חינם, לתמיד.</p>
      <Suspense fallback={<div className="card">טוען...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </main>
  )
}
