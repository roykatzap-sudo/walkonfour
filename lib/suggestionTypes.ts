/* טיפוסים וקבועים של הצעות - בלי תלות ב-pg, כדי שאפשר לייבא גם בצד-לקוח. */

export const SUGGESTION_TYPES = ['park', 'route', 'dogfriendly', 'other'] as const
export type SuggestionType = (typeof SUGGESTION_TYPES)[number]

export const TYPE_LABELS: Record<string, string> = {
  park: 'גינת כלבים',
  route: 'מסלול טיול',
  dogfriendly: 'מקום דוג-פרנדלי',
  other: 'אחר',
}

export type Suggestion = {
  id: number
  city: string
  type: string
  name: string
  details: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
