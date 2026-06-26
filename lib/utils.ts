/** מאחד class names, מסנן ערכים falsy. */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

/** פורמט מספר עם הפרדת אלפים בעברית. */
export function formatNumber(n: number) {
  return n.toLocaleString('he-IL')
}

/** פורמט מחיר בשקלים. */
export function formatPrice(n: number) {
  return n === 0 ? 'חינם' : `₪${n.toLocaleString('he-IL')}`
}

/** תאריך קצר בעברית: "שישי · 14.3". */
export function formatEventDate(iso: string) {
  const d = new Date(iso)
  const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
  return `${days[d.getDay()]} · ${d.getDate()}.${d.getMonth() + 1}`
}

/** "לפני 3 ימים" וכו'. */
export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'עכשיו'
  if (mins < 60) return `לפני ${mins} דק׳`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `לפני ${hours === 1 ? 'שעה אחת' : `${hours} שעות`}`
  const days = Math.floor(hours / 24)
  if (days < 30) return `לפני ${days === 1 ? 'יום אחד' : `${days} ימים`}`
  const months = Math.floor(days / 30)
  return `לפני ${months === 1 ? 'חודש אחד' : `${months} חודשים`}`
}

/** מחשב אחוז חיסכון. */
export function savingsPercent(original: number, group: number) {
  if (!original) return 0
  return Math.round(((original - group) / original) * 100)
}
