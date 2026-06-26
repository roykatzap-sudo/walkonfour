import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/** Supabase client לשימוש ב-Server Components / Route Handlers. */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // נקרא מתוך Server Component - אפשר להתעלם כי ה-middleware מרענן sessions
          }
        },
      },
    }
  )
}
