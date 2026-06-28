import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'עסקים ונותני שירות לכלבים',
  description:
    'מדריך העסקים של קהילה על ארבע: וטרינרים, מספרות, פנסיונים, מאלפים וחנויות מומלצים לבעלי כלבים - לפי המלצות הקהילה ולפי עיר.',
  path: '/businesses',
})

export default function BusinessesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
