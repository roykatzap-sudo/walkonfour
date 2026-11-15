'use client'

import { useState } from 'react'

/**
 * חיפוש עיר בעמוד מדריכי הערים. הכרטיסים עצמם מרונדרים בשרת (וכולם ב-HTML);
 * כאן רק מסתירים את אלה שלא תואמים להקלדה.
 */
export function CityFilter({ total }: { total: number }) {
  const [shown, setShown] = useState(total)

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value.trim()
    let n = 0
    document.querySelectorAll<HTMLElement>('.city-card[data-name]').forEach((el) => {
      const match = !q || (el.dataset.name ?? '').includes(q)
      el.style.display = match ? '' : 'none'
      if (match) n += 1
    })
    setShown(n)
  }

  return (
    <div style={{ margin: '0 0 18px' }}>
      <label htmlFor="city-filter" style={{ display: 'block', fontSize: 16, fontWeight: 800, color: 'var(--ink)', marginBottom: 6 }}>
        חיפוש עיר
      </label>
      <input
        id="city-filter"
        type="search"
        inputMode="search"
        autoComplete="off"
        placeholder="למשל: חיפה"
        onChange={onChange}
        style={{
          width: '100%', maxWidth: 420, minHeight: 50, padding: '10px 16px', font: 'inherit', fontSize: 17,
          border: '1.5px solid rgba(90,77,60,.4)', borderRadius: 14, background: '#fff', color: '#2a2018',
        }}
      />
      <p role="status" aria-live="polite" style={{ margin: '8px 0 0', fontSize: 15, color: '#5b4d3c' }}>
        {shown === total ? `${total} ערים` : shown === 0 ? 'לא נמצאה עיר בשם הזה' : `${shown} ערים תואמות`}
      </p>
    </div>
  )
}
