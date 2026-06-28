import { createClient } from '@/lib/supabase/server'
import { safeQuery } from '@/lib/safeQuery'
import { demoGroups } from '@/lib/demo'
import { GroupCard } from '@/components/groups/GroupCard'
import { DemoBanner } from '@/components/shared/DemoBanner'
import type { GroupPurchase } from '@/types'
import { buildMetadata } from '@/lib/seo'

// תשובת Supabase עם count מצירוף group_purchase_members
type GroupPurchaseWithMembers = GroupPurchase & {
  members?: Array<{ count: number }>
}

export const metadata = buildMetadata({
  title: 'קבוצות רכישה',
  description:
    'קונים יחד, משלמים מחיר סיטונאי: שק רויאל קנין 15 ק"ג ב-198 ש"ח במקום 290. הקהילה בהקמה.',
  path: '/groups',
})
export const dynamic = 'force-dynamic'

export default async function GroupsPage() {
  const supabase = await createClient()

  const { data: groups, isDemo } = await safeQuery<GroupPurchaseWithMembers[]>(
    () =>
      supabase
        .from('group_purchases')
        .select('*, members:group_purchase_members(count)')
        .eq('is_active', true)
        .gte('deadline', new Date().toISOString())
        .order('deadline', { ascending: true }),
    demoGroups
  )

  const list: GroupPurchase[] = groups.map((g) => ({
    ...g,
    members_count: g.members_count ?? g.members?.[0]?.count ?? 0,
  }))

  return (
    <main className="page">
      <span className="section-tag">חיסכון קבוצתי</span>
      <h1 className="page-title">קבוצות רכישה</h1>
      <p className="page-sub">
        כשקונים יחד, מקבלים מחיר סיטונאי: שק רויאל קנין 15 ק&quot;ג ב-198 ש&quot;ח
        במקום 290. ככה זה יעבוד כשהקהילה תתחיל.
      </p>

      {isDemo && <DemoBanner />}

      <div className="gr-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {list.map((g) => (
          <GroupCard key={g.id} group={g} demo={isDemo} />
        ))}
      </div>
    </main>
  )
}
