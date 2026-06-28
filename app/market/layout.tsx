import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({
  title: 'יד שנייה - ציוד משומש לכלבים',
  description:
    'לוח יד שנייה לציוד כלבים: כלובים, רתמות, מיטות, צעצועים, ציוד טיולים וטיפוח - במחירים נוחים, מאנשים בקהילה. קהילה על ארבע היא לוח מודעות, לא צד לעסקה.',
  path: '/market',
})

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
