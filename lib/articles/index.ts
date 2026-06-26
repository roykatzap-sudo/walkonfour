import type { BreedArticle } from './types'
import { part1 } from './part1'
import { part2 } from './part2'
import { part3 } from './part3'
import { part4 } from './part4'
import { part5 } from './part5'
import { part6 } from './part6'

export type { BreedArticle } from './types'

/** כל מאמרי הגזעים, מאוחדים. */
export const breedArticles: BreedArticle[] = [
  ...part1,
  ...part2,
  ...part3,
  ...part4,
  ...part5,
  ...part6,
]

export const getArticle = (slug: string): BreedArticle | null =>
  breedArticles.find((a) => a.slug === slug) ?? null

export const hasArticle = (slug: string): boolean =>
  breedArticles.some((a) => a.slug === slug)
