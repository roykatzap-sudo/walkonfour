'use client'

import { useState } from 'react'
import { AdminGate } from './AdminGate'
import { AdminWaitlist } from './AdminWaitlist'
import { AdminSuggestions } from './AdminSuggestions'
import { AdminParkReports } from './AdminParkReports'

const TABS = [
  { key: 'waitlist', label: 'רשימת המתנה', icon: '📋' },
  { key: 'suggestions', label: 'הצעות', icon: '💡' },
  { key: 'park-reports', label: 'דיווחי גינות', icon: '🌳' },
]

export function AdminDashboard() {
  const [tab, setTab] = useState('waitlist')

  return (
    <AdminGate>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>פאנל ניהול</h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '4px 0 0' }}>קהילה על ארבע</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '2px solid rgba(201,154,91,.18)' }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: '10px 18px',
              fontWeight: tab === t.key ? 900 : 600,
              fontSize: 15,
              color: tab === t.key ? 'var(--brand-dark)' : 'var(--text-muted)',
              background: 'none',
              border: 'none',
              borderBottom: tab === t.key ? '2.5px solid var(--brand-dark)' : '2.5px solid transparent',
              cursor: 'pointer',
              marginBottom: -2,
              transition: 'color .15s, border-color .15s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: tab === 'waitlist' ? 'block' : 'none' }}><AdminWaitlist /></div>
      <div style={{ display: tab === 'suggestions' ? 'block' : 'none' }}><AdminSuggestions /></div>
      <div style={{ display: tab === 'park-reports' ? 'block' : 'none' }}><AdminParkReports /></div>
    </AdminGate>
  )
}
