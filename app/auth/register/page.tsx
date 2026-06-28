import { Suspense } from 'react'
import { AuthForm } from '@/components/auth/AuthForm'

export const metadata = { title: 'הרשמה · קהילה על ארבע' }

export default function RegisterPage() {
  return (
    <main className="page page-narrow">
      <h1 className="page-title">הצטרפו לקהילה על ארבע</h1>
      <p className="page-sub">קהילת בעלי הכלבים של קהילה על ארבע - חינם, לתמיד.</p>
      <Suspense fallback={<div className="card">טוען...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </main>
  )
}
