'use client'

import { useMemo, useState } from 'react'
import { foodPrices, type FoodPrice } from '@/lib/foodPrices'

const TIER_COLOR: Record<string, string> = {
  'תקציבי': '#a89070', // טאופ חמים בתוך פלטת הקרם-זהב (היה ירוק זית - הוסר)
  'פרימיום': 'var(--brand)',
  'סופר פרימיום': '#8a5a2b',
}

function perKg(p: FoodPrice): number {
  return (p.low + p.high) / 2 / p.weightKg
}

export function FoodPriceTable() {
  const [sortByValue, setSortByValue] = useState(false)
  const rows = useMemo(
    () => [...foodPrices].sort((a, b) => (sortByValue ? perKg(a) - perKg(b) : 0)),
    [sortByValue]
  )

  // המוצר עם המחיר הזול ביותר לק״ג - מסומן כ״הכי משתלם״.
  const bestValueId = useMemo(() => {
    let best: FoodPrice | null = null
    for (const p of foodPrices) if (!best || perKg(p) < perKg(best)) best = p
    return best ? best.brand + best.product : null
  }, [])

  // מחשבון ₪ לק״ג
  const [price, setPrice] = useState('')
  const [weight, setWeight] = useState('')
  const ppk = useMemo(() => {
    const p = parseFloat(price)
    const w = parseFloat(weight)
    return p > 0 && w > 0 ? p / w : null
  }, [price, weight])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button
          type="button"
          className="chip3d"
          onClick={() => setSortByValue((v) => !v)}
          style={{ cursor: 'pointer', border: '1px solid rgba(201,154,91,.3)', background: sortByValue ? 'var(--brand)' : '#fff', color: sortByValue ? '#fff' : 'var(--ink)' }}
        >
          {sortByValue ? '✓ ממוין לפי שווי (₪/ק״ג)' : 'מיין לפי השווי הכי טוב'}
        </button>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {rows.map((p) => {
          const lowKg = p.low / p.weightKg
          const highKg = p.high / p.weightKg
          const isBest = p.brand + p.product === bestValueId
          return (
            <div key={p.brand + p.product} style={{ background: '#fff', border: isBest ? '2px solid var(--brand)' : '1px solid rgba(201,154,91,.18)', borderRadius: 16, padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 900, fontSize: 17, color: 'var(--ink)' }}>{p.brand}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 800, color: '#fff', background: TIER_COLOR[p.tier], padding: '2px 10px', borderRadius: 999 }}>{p.tier}</span>
                    {isBest && (
                      <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--brand-dark, #8a5a2b)', background: '#fdf6e9', border: '1px solid var(--brand-light, #e8c887)', padding: '2px 10px', borderRadius: 999 }}>⭐ הכי משתלם לק״ג</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: '#7a6c58', marginTop: 3 }}>{p.product} · {p.weightKg} ק״ג</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--brand-dark, #8a5a2b)', lineHeight: 1 }}>₪{lowKg.toFixed(1)}-{highKg.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 700 }}> לק״ג</span></div>
                  <div style={{ fontSize: 13.5, color: '#7a6c58', marginTop: 4 }}>שק שלם: ₪{p.low}-{p.high}</div>
                </div>
              </div>
              <div style={{ marginTop: 8 }}>
                <a href={p.zap} target="_blank" rel="noopener noreferrer" style={{ fontSize: 14, fontWeight: 700, color: 'var(--brand-dark, #8a5a2b)' }}>
                  השוואה חיה בזאפ ↗
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* מחשבון ₪ לק״ג */}
      <div style={{ marginTop: 26, background: 'linear-gradient(135deg, rgba(201,154,91,.1), rgba(232,200,135,.06))', border: '1px solid var(--brand-light, #e8c887)', borderRadius: 18, padding: '20px 22px' }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--ink)', margin: '0 0 4px' }}>🧮 מחשבון מחיר לק״ג</h3>
        <p style={{ fontSize: 14, color: '#6a6155', margin: '0 0 14px', lineHeight: 1.6 }}>
          שני שקים נראים באותו מחיר? בדקו מי באמת זול יותר. הזינו מחיר ומשקל:
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
            מחיר (₪)
            <input type="number" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="349" style={{ padding: '10px 12px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.3)', fontSize: 16, width: 110 }} />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
            משקל (ק״ג)
            <input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="15" style={{ padding: '10px 12px', borderRadius: 12, border: '1.5px solid rgba(201,154,91,.3)', fontSize: 16, width: 110 }} />
          </label>
          <div style={{ background: '#fff', borderRadius: 12, padding: '10px 18px', minWidth: 120, textAlign: 'center', border: '1.5px solid var(--brand)' }}>
            <div style={{ fontSize: 12, color: '#8a7c66' }}>מחיר לק״ג</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--brand)', lineHeight: 1.1 }}>
              {ppk !== null ? `₪${ppk.toFixed(1)}` : '-'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
