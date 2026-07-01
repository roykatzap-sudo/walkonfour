/* ════════════════════════════════════════════════════════════
   רכיב "גזעים דומים" - internal linking לכל דף גזע.
   מבוסס על סקירת SEO: 4-6 קישורי גזעים דומים בתחתית = ranking boost.
   המיפוי ידני (לא אוטומטי לפי size/energy) כי קישורים סמנטיים
   טובים יותר לגוגל מקישורים אקראיים.
   ════════════════════════════════════════════════════════════ */

export type RelatedBreed = { slug: string; reason: string }

export const relatedBreeds: Record<string, RelatedBreed[]> = {
  // ─── Retrievers / כלבי משפחה ───
  labrador: [
    { slug: 'golden', reason: 'משפחתי דומה, פרווה ארוכה יותר' },
    { slug: 'goldendoodle', reason: 'נשירה מופחתת' },
    { slug: 'vizsla', reason: 'אנרגטי דומה, פרווה קצרה' },
    { slug: 'cocker', reason: 'משפחתי קטן יותר' },
  ],
  golden: [
    { slug: 'labrador', reason: 'משפחתי דומה, פחות סירוק' },
    { slug: 'goldendoodle', reason: 'הכלאה שלו עם פודל - נשירה מופחתת' },
    { slug: 'saint-bernard', reason: 'ענק רגוע ומשפחתי' },
    { slug: 'cocker', reason: 'משפחתי קטן ורגוע' },
  ],
  goldendoodle: [
    { slug: 'golden', reason: 'אחד מההורים' },
    { slug: 'poodle', reason: 'ההורה השני - נשירה מופחתת' },
    { slug: 'labrador', reason: 'אופי דומה, יותר נשירה' },
  ],
  cocker: [
    { slug: 'shih-tzu', reason: 'משפחתי קטן וחיבוקי' },
    { slug: 'beagle', reason: 'גודל דומה, אנרגטי' },
    { slug: 'golden', reason: 'אופי דומה, גדול יותר' },
  ],
  vizsla: [
    { slug: 'labrador', reason: 'אנרגטי משפחתי דומה' },
    { slug: 'malinois', reason: 'כלב עבודה אתלטי' },
    { slug: 'border-collie', reason: 'אנרגטי וחכם' },
  ],

  // ─── רועים וכלבי עבודה ───
  'german-shepherd': [
    { slug: 'malinois', reason: 'דומה אבל אתלטי יותר' },
    { slug: 'doberman', reason: 'מגן וחכם דומה' },
    { slug: 'rottweiler', reason: 'כלב שמירה גדול' },
    { slug: 'border-collie', reason: 'חכם וצריך אילוף' },
  ],
  malinois: [
    { slug: 'german-shepherd', reason: 'דומה אבל כבד יותר' },
    { slug: 'border-collie', reason: 'אנרגיה ועבודה' },
    { slug: 'doberman', reason: 'כלב עבודה דומה' },
  ],
  'border-collie': [
    { slug: 'australian-shepherd', reason: 'דומה מאוד באופי ועבודה' },
    { slug: 'malinois', reason: 'אינטליגנציה ואנרגיה' },
    { slug: 'corgi', reason: 'רועים בגודל קטן' },
  ],
  'australian-shepherd': [
    { slug: 'border-collie', reason: 'דומה מאוד' },
    { slug: 'corgi', reason: 'רועה קטן יותר' },
    { slug: 'malinois', reason: 'אנרגיה ועבודה' },
  ],
  corgi: [
    { slug: 'beagle', reason: 'גודל דומה משפחתי' },
    { slug: 'australian-shepherd', reason: 'רועה קרוב משפחתית' },
    { slug: 'french-bulldog', reason: 'קטן ומשפחתי' },
  ],

  // ─── שמירה / חזקים ───
  rottweiler: [
    { slug: 'doberman', reason: 'כלב שמירה דומה' },
    { slug: 'cane-corso', reason: 'גדול מגן דומה' },
    { slug: 'amstaff', reason: 'חזק ונאמן' },
    { slug: 'german-shepherd', reason: 'שמירה ואינטליגנציה' },
  ],
  doberman: [
    { slug: 'rottweiler', reason: 'שמירה דומה' },
    { slug: 'german-shepherd', reason: 'חכם ומגן' },
    { slug: 'malinois', reason: 'אתלטי וחכם' },
  ],
  'cane-corso': [
    { slug: 'rottweiler', reason: 'שמירה גדול דומה' },
    { slug: 'amstaff', reason: 'חזק ונאמן' },
    { slug: 'saint-bernard', reason: 'ענק רגוע' },
  ],
  amstaff: [
    { slug: 'bulldog', reason: 'דומה במבנה ובאופי' },
    { slug: 'french-bulldog', reason: 'קומפקטי וחזק' },
    { slug: 'boxer', reason: 'אנרגטי ומשחקי' },
    { slug: 'rottweiler', reason: 'חזק ומגן' },
  ],
  boxer: [
    { slug: 'amstaff', reason: 'אנרגטי דומה' },
    { slug: 'doberman', reason: 'אתלטי ומגן' },
    { slug: 'bulldog', reason: 'קרוב משפחתית' },
  ],

  // ─── ספיץ וקור ───
  husky: [
    { slug: 'pomeranian', reason: 'משפחת הספיץ - קטן יותר' },
    { slug: 'german-shepherd', reason: 'אנרגטי וגדול' },
    { slug: 'canaan', reason: 'עצמאי ופרימיטיבי' },
  ],
  canaan: [
    { slug: 'husky', reason: 'פרימיטיבי ועצמאי' },
    { slug: 'border-collie', reason: 'חכם ועצמאי' },
    { slug: 'australian-shepherd', reason: 'רועה חכם' },
  ],

  // ─── קטנים וחברתיים ───
  'french-bulldog': [
    { slug: 'bulldog', reason: 'אח גדול יותר' },
    { slug: 'pomeranian', reason: 'קטן משפחתי' },
    { slug: 'corgi', reason: 'קומפקטי וחברותי' },
    { slug: 'shih-tzu', reason: 'משפחתי רגוע קטן' },
  ],
  bulldog: [
    { slug: 'french-bulldog', reason: 'גרסה קטנה יותר' },
    { slug: 'amstaff', reason: 'מבנה גוף דומה' },
    { slug: 'boxer', reason: 'קרוב משפחתית' },
  ],
  'shih-tzu': [
    { slug: 'maltese', reason: 'דומה - קטן ופרווה ארוכה' },
    { slug: 'french-bulldog', reason: 'משפחתי קטן ורגוע' },
    { slug: 'yorkshire', reason: 'קטן ופרווה ארוכה' },
  ],
  maltese: [
    { slug: 'shih-tzu', reason: 'דומה מאוד' },
    { slug: 'yorkshire', reason: 'קטן ופרווה ארוכה' },
    { slug: 'pomeranian', reason: 'קטן חברתי' },
  ],
  yorkshire: [
    { slug: 'maltese', reason: 'קטן ופרווה ארוכה' },
    { slug: 'shih-tzu', reason: 'דומה' },
    { slug: 'pomeranian', reason: 'קטן וערני' },
  ],
  pomeranian: [
    { slug: 'yorkshire', reason: 'קטן ועליז' },
    { slug: 'husky', reason: 'משפחת הספיץ' },
    { slug: 'maltese', reason: 'קטן חברתי' },
  ],
  chihuahua: [
    { slug: 'pomeranian', reason: 'קטן וערני' },
    { slug: 'yorkshire', reason: 'הקטנים בעולם' },
    { slug: 'french-bulldog', reason: 'קטן חברותי' },
  ],

  // ─── ספיץ פרימיטיבי / ייחודי ───
  poodle: [
    { slug: 'goldendoodle', reason: 'הכלאה שלו עם גולדן' },
    { slug: 'maltese', reason: 'אלגנטי וחכם' },
    { slug: 'cocker', reason: 'חברותי ולבבי' },
  ],

  // ─── ענקים ───
  'saint-bernard': [
    { slug: 'labrador', reason: 'גדול רגוע ומשפחתי' },
    { slug: 'cane-corso', reason: 'גדול ורגוע' },
    { slug: 'golden', reason: 'משפחתי רגוע' },
  ],

  // ─── ציד / טריירים ───
  beagle: [
    { slug: 'cocker', reason: 'משפחתי חברותי' },
    { slug: 'dachshund', reason: 'כלב ציד קטן' },
    { slug: 'corgi', reason: 'גודל דומה' },
  ],
  dachshund: [
    { slug: 'beagle', reason: 'כלב ציד דומה' },
    { slug: 'corgi', reason: 'קצר רגליים, אישיות גדולה' },
    { slug: 'french-bulldog', reason: 'קומפקטי' },
  ],

  // ─── מעורב ───
  mixed: [
    { slug: 'canaan', reason: 'גזע ישראלי שגדל ברחוב' },
    { slug: 'labrador', reason: 'הכי פופולרי - להשוואה' },
    { slug: 'golden', reason: 'משפחתי קלאסי' },
  ],
}

export function getRelatedBreeds(slug: string): RelatedBreed[] {
  return relatedBreeds[slug] ?? []
}
