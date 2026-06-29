'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteDogButton({ dogId, dogName }: { dogId: number; dogName: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'confirm' | 'deleting' | 'error'>('idle')

  async function doDelete() {
    if (state === 'deleting') return
    setState('deleting')
    try {
      const res = await fetch(`/api/community/dogs/${dogId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.ok) {
        router.push('/community/dogs')
        router.refresh()
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'confirm') {
    return (
      <div style={{ display: 'inline-flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ fontSize: 14, color: '#5b4d3c' }}>למחוק את {dogName}?</span>
        <button type="button" onClick={doDelete} style={{ background: '#a23c2e', color: '#fff', border: 'none', borderRadius: 999, padding: '8px 18px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          כן, למחוק
        </button>
        <button type="button" onClick={() => setState('idle')} style={{ background: 'none', border: 'none', color: '#5b4d3c', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
          ביטול
        </button>
      </div>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setState('confirm')}
        disabled={state === 'deleting'}
        style={{ background: 'none', border: 'none', color: '#a23c2e', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}
      >
        🗑️ מחיקת הכלב
      </button>
      {state === 'error' && <div role="alert" style={{ fontSize: 13, color: '#a23c2e', marginTop: 8 }}>שגיאה. נסו שוב.</div>}
    </>
  )
}
