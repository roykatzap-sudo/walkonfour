import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'טבלת המובילים',
  description:
    'הכלבים והחברים הפעילים ביותר בקהילת כלבניה: דירוג חברי הקהילה לפי תרומה, פעילות והשתתפות. מי בראש החודש?',
  path: '/leaderboard',
})

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
