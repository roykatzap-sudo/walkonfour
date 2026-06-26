import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'מנוי פרימיום - הטבות וחיסכון',
  description:
    'מסלולי המנוי של כלבניה: חינם, פרימיום ועסקים. הליבה הקהילתית חינמית לתמיד; הפרימיום חוסך בהוצאות הכלב עם מחירי חבר והטבות. מחיר השקה.',
  path: '/premium',
})

export default function PremiumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
