/* ════════════════════════════════════════════════════════════
   ניהול כלבי המשתמש. אין תמונות בשלב הראשון - רק שדות.
   תמונה תתווסף אחרי הגדרת Cloudflare Images / Vercel Blob + EXIF strip.
   ════════════════════════════════════════════════════════════ */

import type { Client } from 'pg'

export const TEMPERAMENTS = ['רגוע', 'אנרגטי', 'חברותי', 'ביישן', 'משחקי', 'שמירה'] as const
export type Temperament = (typeof TEMPERAMENTS)[number]

export type Dog = {
  id: number
  user_id: number
  name: string
  breed: string | null
  age_years: number | null
  temperament: string | null
  photo_url: string | null
  created_at: string
  updated_at: string
}

export async function listUserDogs(client: Client, userId: number): Promise<Dog[]> {
  const res = await client.query(
    'select id, user_id, name, breed, age_years, temperament, photo_url, created_at, updated_at from dogs where user_id = $1 order by created_at asc',
    [userId],
  )
  return res.rows as Dog[]
}

export async function getDog(client: Client, userId: number, dogId: number): Promise<Dog | null> {
  const res = await client.query(
    'select id, user_id, name, breed, age_years, temperament, photo_url, created_at, updated_at from dogs where id = $1 and user_id = $2 limit 1',
    [dogId, userId],
  )
  return (res.rows[0] as Dog | undefined) ?? null
}

export type DogInput = {
  name: string
  breed: string | null
  age_years: number | null
  temperament: string | null
}

export function validateDogInput(input: unknown): { ok: true; data: DogInput } | { ok: false; field: string } {
  const i = input as Record<string, unknown>
  const name = typeof i?.name === 'string' ? i.name.trim().slice(0, 40) : ''
  if (!name || name.length < 1) return { ok: false, field: 'name' }
  const breedRaw = typeof i?.breed === 'string' ? i.breed.trim().slice(0, 60) : ''
  const ageRaw = i?.age_years
  let age: number | null = null
  if (typeof ageRaw === 'number') age = ageRaw
  else if (typeof ageRaw === 'string' && ageRaw.trim()) age = Number(ageRaw)
  if (age !== null && (Number.isNaN(age) || age < 0 || age > 30)) return { ok: false, field: 'age' }
  const tRaw = typeof i?.temperament === 'string' ? i.temperament.trim() : ''
  const temperament = (TEMPERAMENTS as readonly string[]).includes(tRaw) ? tRaw : null
  return {
    ok: true,
    data: { name, breed: breedRaw || null, age_years: age, temperament },
  }
}

export async function createDog(client: Client, userId: number, input: DogInput): Promise<Dog> {
  const res = await client.query(
    `insert into dogs (user_id, name, breed, age_years, temperament)
     values ($1, $2, $3, $4, $5)
     returning id, user_id, name, breed, age_years, temperament, photo_url, created_at, updated_at`,
    [userId, input.name, input.breed, input.age_years, input.temperament],
  )
  return res.rows[0] as Dog
}

export async function updateDog(client: Client, userId: number, dogId: number, input: DogInput): Promise<Dog | null> {
  const res = await client.query(
    `update dogs set name = $1, breed = $2, age_years = $3, temperament = $4, updated_at = now()
     where id = $5 and user_id = $6
     returning id, user_id, name, breed, age_years, temperament, photo_url, created_at, updated_at`,
    [input.name, input.breed, input.age_years, input.temperament, dogId, userId],
  )
  return (res.rows[0] as Dog | undefined) ?? null
}

export async function deleteDog(client: Client, userId: number, dogId: number): Promise<boolean> {
  const res = await client.query('delete from dogs where id = $1 and user_id = $2', [dogId, userId])
  return (res.rowCount ?? 0) > 0
}
