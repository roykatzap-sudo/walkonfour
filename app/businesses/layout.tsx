import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'מדריך בעלי מקצוע לכלבים',
  description:
    'מדריך חינמי של בעלי מקצוע לכלבים: וטרינרים, מספרות, מאלפים, פנסיונים וחנויות - עם דירוגים וביקורות מבעלי כלבים בקהילה. הוסיפו את העסק שלכם בחינם.',
  path: '/businesses',
})

export default function BusinessesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
