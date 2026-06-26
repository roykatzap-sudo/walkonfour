import { createBrowserClient } from '@supabase/ssr'

/** Supabase client לשימוש ב-Client Components (רץ בדפדפן). */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
  )
}
