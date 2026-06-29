'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/** רכיב העלאת תמונת כלב. EXIF מוסר בשרת אוטומטית.
 *  ניתן גם בטופס "כלב חדש" (אחרי שמירה ראשונית) וגם בעריכת כלב קיים. */
export function DogPhotoUpload({ dogId, currentUrl, dogName }: { dogId: number; currentUrl: string | null; dogName: string }) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState(currentUrl)
  const [state, setState] = useState<'idle' | 'uploading' | 'error'>('idle')
  const [err, setErr] = useState('')
  const [delConfirm, setDelConfirm] = useState(false)

  function pick() {
    inputRef.current?.click()
  }

  async function onSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 8 * 1024 * 1024) {
      setErr('הקובץ גדול מ-8MB. נסו תמונה קטנה יותר')
      setState('error')
      return
    }
    setState('uploading'); setErr('')
    try {
      const fd = new FormData()
      fd.append('photo', file)
      const res = await fetch(`/api/community/dogs/${dogId}/photo`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!data.ok) {
        if (data.error === 'too_large') setErr('הקובץ גדול מדי (מקסימום 8MB)')
        else if (data.error === 'bad_type') setErr('פורמט לא נתמך - JPG, PNG, WEBP, HEIC בלבד')
        else if (data.error === 'image_too_small') setErr('התמונה קטנה מדי')
        else setErr('שגיאה בהעלאה. נסו שוב')
        setState('error')
        return
      }
      setUrl(data.photo_url)
      setState('idle')
      router.refresh()
    } catch {
      setErr('שגיאת רשת')
      setState('error')
    } finally {
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function removePhoto() {
    if (!delConfirm) { setDelConfirm(true); return }
    setState('uploading')
    try {
      const res = await fetch(`/api/community/dogs/${dogId}/photo`, { method: 'DELETE' })
      if ((await res.json()).ok) {
        setUrl(null)
        setDelConfirm(false)
        router.refresh()
      }
    } finally {
      setState('idle')
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {url ? (
          <img
            src={url}
            alt={`תמונה של ${dogName}`}
            width={120}
            height={120}
            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--brand)', background: '#fbf7ef' }}
          />
        ) : (
          <div aria-hidden="true" style={{ width: 120, height: 120, borderRadius: '50%', background: '#fbf7ef', border: '3px dashed rgba(201,154,91,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44 }}>🐕</div>
        )}
        <div style={{ display: 'grid', gap: 8 }}>
          <button type="button" onClick={pick} disabled={state === 'uploading'} className="btn btn-primary" style={{ fontSize: 14, padding: '10px 18px' }}>
            {state === 'uploading' ? 'מעלה...' : url ? 'החלפת תמונה' : '📷 הוספת תמונה'}
          </button>
          {url && (
            <button type="button" onClick={removePhoto} disabled={state === 'uploading'} style={{ background: 'none', border: 'none', color: '#a23c2e', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline', alignSelf: 'flex-start' }}>
              {delConfirm ? 'בטוח? לחיצה נוספת' : 'הסרת תמונה'}
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={onSelected}
          style={{ display: 'none' }}
        />
      </div>

      <div style={{ background: '#fbf7ef', border: '1px solid rgba(201,154,91,.2)', borderRadius: 12, padding: '11px 14px', fontSize: 12.5, color: '#5b4d3c', lineHeight: 1.6 }}>
        🔒 <strong>פרטיות:</strong> אנא העלו רק תמונות של הכלב, <strong>ללא בני אדם</strong> בתמונה (גם לא ברקע). מטא-דאטה (מיקום GPS וכו') מוסרת אוטומטית. תמונה עם פני אדם תוסר.
      </div>

      {err && <div role="alert" style={{ fontSize: 13.5, color: '#a23c2e' }}>{err}</div>}
    </div>
  )
}
