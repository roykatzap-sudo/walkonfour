'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/shared/Toast'
import { savingsPercent } from '@/lib/utils'
import { Tilt3D } from '@/components/fx/Tilt3D'
import type { GroupPurchase } from '@/types'

export function GroupCard({ group, demo }: { group: GroupPurchase; demo?: boolean }) {
  const toast = useToast()
  const [members, setMembers] = useState(group.members_count ?? 0)
  const [joined, setJoined] = useState(!!group.is_member)

  const save = group.savings_percent ?? savingsPercent(group.original_price, group.group_price)
  const pct = Math.min(100, Math.round((members / group.max_participants) * 100))
  const daysLeft = Math.max(0, Math.ceil((new Date(group.deadline).getTime() - Date.now()) / 86400000))
  const hot = pct >= 70

  async function join() {
    if (joined) return
    if (demo) {
      setJoined(true)
      setMembers((m) => m + 1)
      toast(`הצטרפת לרכישה הקבוצתית של ${group.product_name}`)
      return
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
    if (!user) {
      toast('כדי להצטרף לקבוצה צריך להתחבר תחילה')
      return
    }
    const { error } = await supabase
      .from('group_purchase_members')
      .insert({ group_id: group.id, user_id: user.id })
    if (error) {
      toast('משהו השתבש בהצטרפות. נסו שוב')
      return
    }
    setJoined(true)
    setMembers((m) => m + 1)
    toast('הצטרפת לקבוצה בהצלחה')
  }

  return (
    <Tilt3D className="gc-tilt" max={8} glare>
      <div className={`gc sweep lift-3d-sm${hot ? ' hot' : ''}`}>
        <div className="gc-h">
          <div className="gc-name">{group.title}</div>
          <span className={`gc-tag ${pct < 70 ? 'tl' : 'tw'}`}>
            {pct >= 70 ? 'כמעט מלאה' : 'פתוחה להצטרפות'}
          </span>
        </div>
        <div className="gc-pr">
          <span className="gc-new">₪{group.group_price}</span>
          <span className="gc-old">₪{group.original_price}</span>
          <span className="gc-save">{save}%-</span>
        </div>
        <div className="gc-bar">
          <div className="gc-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="gc-meta">
          <span>{members} מתוך {group.max_participants} הצטרפו</span>
          <span>{daysLeft === 1 ? 'נותר יום אחד' : `נותרו ${daysLeft} ימים`}</span>
        </div>
        <button
          className="gc-btn"
          onClick={join}
          disabled={joined}
          aria-pressed={joined}
          aria-label={joined ? `כבר הצטרפת ל${group.title}` : `הצטרפות ל${group.title}`}
        >
          {joined ? '✓ הצטרפת' : 'הצטרפות לקבוצה'}
        </button>
      </div>
    </Tilt3D>
  )
}
