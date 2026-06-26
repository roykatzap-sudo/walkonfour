import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'קיר הקהילה',
  description:
    'קיר הקהילה של כלבניה: רגעים, תמונות וסיפורים של בעלי כלבים מכל הארץ. הצטרפו, שתפו את הכלב שלכם, ותכירו את הקהילה.',
  path: '/wall',
})

export default function WallLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
