import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'טבלת המובילים',
  description:
    'כך יעבוד לוח המובילים של קהילה על ארבע: דירוג לפי תרומה, עזרה והשתתפות. הקהילה בהקמה - הלוח ייפתח עם ההשקה.',
  path: '/leaderboard',
})

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
