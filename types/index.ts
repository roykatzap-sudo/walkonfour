export type Profile = {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  city: string | null
  dog_name: string | null
  dog_breed: string | null
  dog_age: number | null
  dog_photo_url: string | null
  bio: string | null
  is_premium: boolean
  premium_until: string | null
  created_at: string
}

export type EventCategory = 'meetup' | 'lecture' | 'market' | 'training' | 'other'

export type Event = {
  id: string
  title: string
  description: string | null
  location: string
  city: string
  lat: number | null
  lng: number | null
  event_date: string
  price: number
  max_participants: number | null
  image_url: string | null
  category: EventCategory
  organizer_id: string | null
  is_active: boolean
  created_at: string
  // joined
  organizer?: Profile
  registrations_count?: number
  is_registered?: boolean
}

export type ForumCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  sort_order: number
  posts_count?: number
}

export type ForumPost = {
  id: string
  category_id: string
  author_id: string
  title: string
  content: string
  image_url: string | null
  views: number
  is_pinned: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
  // joined
  author?: Profile
  category?: ForumCategory
  comments_count?: number
  likes_count?: number
  is_liked?: boolean
}

export type ForumComment = {
  id: string
  post_id: string
  author_id: string
  parent_id: string | null
  content: string
  created_at: string
  updated_at: string
  author?: Profile
  replies?: ForumComment[]
}

export type GroupPurchase = {
  id: string
  title: string
  product_name: string
  description: string | null
  image_url: string | null
  original_price: number
  group_price: number
  min_participants: number
  max_participants: number
  deadline: string
  supplier_name: string | null
  supplier_url: string | null
  is_active: boolean
  created_at: string
  members_count?: number
  is_member?: boolean
  savings_percent?: number
}

export type DogPark = {
  id: number
  name: string | null
  city: string | null
  lat: number
  lng: number
  opening_hours: string | null
  surface: string | null
  website: string | null
  /** כתובת רחוב (לרשימות עירוניות רשמיות; אופציונלי). */
  address?: string | null
}
