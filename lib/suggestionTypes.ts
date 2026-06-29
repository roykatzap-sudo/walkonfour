/* טיפוסים וקבועים של הצעות - בלי תלות ב-pg, כדי שאפשר לייבא גם בצד-לקוח. */

export const SUGGESTION_TYPES = ['park', 'route', 'breed', 'general', 'other'] as const
export type SuggestionType = (typeof SUGGESTION_TYPES)[number]

export const TYPE_LABELS: Record<string, string> = {
  park: 'גינת כלבים',
  route: 'מסלול טיול',
  breed: 'גזע',
  general: 'הצעה כללית',
  other: 'אחר',
}

export type Suggestion = {
  id: number
  page: string | null // העמוד שממנו נשלחה ההצעה (למשל /breeds/golden, /walks)
  city: string | null
  type: string
  name: string
  details: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}
