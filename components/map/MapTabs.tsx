'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import { MapSection } from '@/components/map/MapSection'

const CommunitiesMap = dynamic(
  () => import('@/components/map/CommunitiesMap').then((m) => m.CommunitiesMap),
  {
    ssr: false,
    loading: () => (
      <div className="map-wrap" style={{ borderRadius: 28, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.4)' }}>
        טוען מפה...
      </div>
    ),
  }
)

type Tab = 'parks' | 'communities'

const TABS: { id: Tab; emoji: string; label: string }[] = [
  { id: 'parks', emoji: '🐕', label: 'גינות כלבים' },
  { id: 'communities', emoji: '🐾', label: 'קהילות לפי עיר' },
]

export function MapTabs() {
  const [tab, setTab] = useState<Tab>('parks')

  return (
    <>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="tab-bar" role="tablist" aria-label="בחירת תצוגת מפה">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              className={`tab-btn${tab === t.id ? ' on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span aria-hidden="true">{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'parks' ? (
        <div role="tabpanel" id="panel-parks" aria-labelledby="tab-parks">
          <MapSection />
        </div>
      ) : (
        <section role="tabpanel" id="panel-communities" aria-labelledby="tab-communities" style={{ padding: '8px 0 64px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 52px' }}>
            <CommunitiesMap />
          </div>
        </section>
      )}

      <style>{`
        .tab-bar {
          display: inline-flex;
          gap: 6px;
          padding: 6px;
          border-radius: 999px;
          background: rgba(42,32,24,.06);
          border: 1px solid rgba(201,154,91,.12);
          margin-bottom: 36px;
        }
        .tab-btn {
          padding: 11px 26px;
          border-radius: 999px;
          border: none;
          background: transparent;
          color: #5b4a3a;
          font-family: Heebo, sans-serif;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all .22s;
          white-space: nowrap;
        }
        .tab-btn:hover { color: #c99a5b; }
        .tab-btn.on {
          background: #c99a5b;
          color: #fff;
          box-shadow: 0 6px 18px rgba(201,154,91,.32);
        }
        @media (max-width: 600px) {
          .tab-bar { width: 100%; }
          .tab-btn { flex: 1; padding: 11px 12px; font-size: 14px; }
        }
      `}</style>
    </>
  )
}
