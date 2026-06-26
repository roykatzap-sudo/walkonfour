/** מבנה מאמר גזע - כל הסוכנים בונים לפי הטיפוס הזה. */

export type ArticleSection = {
  heading: string
  /** כל מחרוזת = פסקה נפרדת. */
  paragraphs: string[]
}

export type ArticleFAQ = {
  q: string
  a: string
}

export type QuickFact = {
  label: string
  value: string
}

export type BreedArticle = {
  /** חייב להיות זהה ל-slug של הגזע ב-lib/breeds. */
  slug: string
  /** כותרת המאמר (מגזינית, לא רק שם הגזע). */
  title: string
  /** תקציר של משפט-שניים. */
  excerpt: string
  /** זמן קריאה משוער בדקות. */
  readMinutes: number
  /** 6-8 סקשנים. */
  sections: ArticleSection[]
  /** 3-5 שאלות נפוצות. */
  faq: ArticleFAQ[]
  /** 5-6 עובדות מהירות (גובה, משקל, תוחלת חיים, אנרגיה...). */
  quickFacts: QuickFact[]
}
