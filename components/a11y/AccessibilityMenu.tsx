'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * AccessibilityMenu - תפריט נגישות (פינה שמאלית-תחתונה).
 * גודל טקסט ב-4 רמות + 8 התאמות נוספות. נשמר ב-localStorage ומוחל כ-class על <html>.
 */

type ToggleKey =
  | 'spacing'
  | 'readableFont'
  | 'highContrast'
  | 'grayscale'
  | 'invert'
  | 'highlightLinks'
  | 'reduceMotion'
  | 'bigCursor'

type Prefs = { textScale: number } & Record<ToggleKey, boolean>

const STORAGE_KEY = 'kv-a11y'
const MAX_SCALE = 4

const TOGGLES: { key: ToggleKey; label: string; icon: string }[] = [
  { key: 'spacing', label: 'ריווח טקסט מוגדל', icon: '↔️' },
  { key: 'readableFont', label: 'גופן קריא', icon: '🔡' },
  { key: 'highContrast', label: 'ניגודיות גבוהה', icon: '🌗' },
  { key: 'grayscale', label: 'גווני אפור', icon: '⬜' },
  { key: 'invert', label: 'ניגודיות הפוכה', icon: '🌑' },
  { key: 'highlightLinks', label: 'הדגשת קישורים', icon: '🔗' },
  { key: 'reduceMotion', label: 'הפחתת תנועה', icon: '🛑' },
  { key: 'bigCursor', label: 'סמן עכבר גדול', icon: '🖱️' },
]

const TOGGLE_CLASS: Record<ToggleKey, string> = {
  spacing: 'kv-a11y-spacing',
  readableFont: 'kv-a11y-readable-font',
  highContrast: 'kv-a11y-high-contrast',
  grayscale: 'kv-a11y-grayscale',
  invert: 'kv-a11y-invert',
  highlightLinks: 'kv-a11y-links',
  reduceMotion: 'kv-a11y-reduce-motion',
  bigCursor: 'kv-a11y-big-cursor',
}

const DEFAULTS: Prefs = {
  textScale: 0,
  spacing: false,
  readableFont: false,
  highContrast: false,
  grayscale: false,
  invert: false,
  highlightLinks: false,
  reduceMotion: false,
  bigCursor: false,
}

function applyPrefs(prefs: Prefs) {
  const root = document.documentElement
  ;(Object.keys(TOGGLE_CLASS) as ToggleKey[]).forEach((key) => {
    root.classList.toggle(TOGGLE_CLASS[key], prefs[key])
  })
  for (let n = 1; n <= MAX_SCALE; n++) root.classList.toggle(`kv-a11y-text-${n}`, prefs.textScale === n)
}

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = { ...DEFAULTS, ...JSON.parse(raw) } as Prefs
        setPrefs(saved)
        applyPrefs(saved)
      }
    } catch {
      /* localStorage לא זמין */
    }
  }, [])

  function update(next: Prefs) {
    setPrefs(next)
    applyPrefs(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* התעלם */
    }
  }

  const toggle = (key: ToggleKey) => update({ ...prefs, [key]: !prefs[key] })
  const setScale = (n: number) => update({ ...prefs, textScale: Math.max(0, Math.min(MAX_SCALE, n)) })
  const reset = () => update({ ...DEFAULTS })

  const activeCount =
    (prefs.textScale > 0 ? 1 : 0) + TOGGLES.filter((t) => prefs[t.key]).length

  useEffect(() => {
    if (!open) return
    function onPointer(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="kv-a11y">
      {open && (
        <div ref={panelRef} className="kv-a11y-panel" role="dialog" aria-label="הגדרות נגישות">
          <div className="kv-a11y-head">
            <p className="kv-a11y-title">הגדרות נגישות</p>
            {activeCount > 0 && (
              <button type="button" className="kv-a11y-reset" onClick={reset}>
                איפוס ({activeCount})
              </button>
            )}
          </div>

          {/* גודל טקסט - 4 רמות */}
          <div className="kv-a11y-sizerow">
            <span className="kv-a11y-size-label">
              <span aria-hidden="true" className="kv-a11y-opt-ico">🔠</span> גודל טקסט
            </span>
            <div className="kv-a11y-stepper">
              <button type="button" className="kv-a11y-step" onClick={() => setScale(prefs.textScale - 1)} disabled={prefs.textScale === 0} aria-label="הקטנת טקסט">A−</button>
              <span className="kv-a11y-level" aria-live="polite" aria-label={`רמה ${prefs.textScale} מתוך ${MAX_SCALE}`}>{prefs.textScale}/{MAX_SCALE}</span>
              <button type="button" className="kv-a11y-step" onClick={() => setScale(prefs.textScale + 1)} disabled={prefs.textScale === MAX_SCALE} aria-label="הגדלת טקסט">A+</button>
            </div>
          </div>

          <div className="kv-a11y-list">
            {TOGGLES.map((o) => (
              <button
                key={o.key}
                type="button"
                className="kv-a11y-opt"
                role="switch"
                aria-checked={prefs[o.key]}
                onClick={() => toggle(o.key)}
              >
                <span className="kv-a11y-opt-label">
                  <span aria-hidden="true" className="kv-a11y-opt-ico">{o.icon}</span>
                  {o.label}
                </span>
                <span className="kv-a11y-state" aria-hidden="true">{prefs[o.key] ? 'פעיל' : 'כבוי'}</span>
              </button>
            ))}
          </div>

          <a href="/accessibility" className="kv-a11y-statement">הצהרת נגישות ←</a>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="kv-a11y-trigger"
        aria-label="הגדרות נגישות"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4" r="2" fill="currentColor" />
          <path d="M3 7h18M12 7v6m0 0l-3 7m3-7l3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <style jsx>{`
        .kv-a11y { position: fixed; bottom: 18px; left: 18px; z-index: 9000; display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .kv-a11y-trigger {
          width: 52px; height: 52px; min-width: 44px; min-height: 44px; border-radius: 50%;
          border: 2px solid #e8c887; background: #241a12; color: #fbf7ef;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: 0 8px 24px rgba(40, 28, 12, 0.3); transition: transform 0.18s ease, background 0.18s ease;
        }
        .kv-a11y-trigger:hover { background: #c99a5b; }
        .kv-a11y-trigger:focus-visible { outline: 3px solid #c99a5b; outline-offset: 3px; }
        .kv-a11y-panel {
          background: #fbf7ef; border: 1.5px solid #c99a5b; border-radius: 16px; padding: 14px;
          width: 268px; max-height: min(66vh, 560px); overflow-y: auto;
          box-shadow: 0 14px 40px rgba(40, 28, 12, 0.25); display: flex; flex-direction: column; gap: 8px;
        }
        .kv-a11y-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .kv-a11y-title { margin: 0; font-size: 15px; font-weight: 800; color: #241a12; }
        .kv-a11y-reset { background: none; border: none; color: #8a5a2b; font-size: 13px; font-weight: 800; cursor: pointer; font-family: inherit; padding: 4px 6px; border-radius: 8px; }
        .kv-a11y-reset:hover { background: rgba(201, 154, 91, 0.14); }

        .kv-a11y-sizerow {
          display: flex; align-items: center; justify-content: space-between; gap: 8px;
          padding: 8px 13px; border-radius: 10px; border: 1.5px solid #e6d9c2; background: #fff;
        }
        .kv-a11y-size-label { display: inline-flex; align-items: center; gap: 9px; font-size: 14.5px; font-weight: 700; color: #241a12; }
        .kv-a11y-stepper { display: flex; align-items: center; gap: 6px; }
        .kv-a11y-step {
          width: 34px; height: 34px; border-radius: 8px; border: 1.5px solid #c99a5b; background: #fdf6e9;
          color: #6b4d24; font-weight: 900; font-size: 14px; cursor: pointer; font-family: inherit;
        }
        .kv-a11y-step:hover:not(:disabled) { background: #c99a5b; color: #fff; }
        .kv-a11y-step:disabled { opacity: 0.4; cursor: default; }
        .kv-a11y-level { min-width: 30px; text-align: center; font-weight: 800; font-size: 13.5px; color: #241a12; }

        .kv-a11y-list { display: flex; flex-direction: column; gap: 7px; }
        .kv-a11y-opt {
          display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%;
          min-height: 44px; padding: 8px 13px; border-radius: 10px; border: 1.5px solid #e6d9c2;
          background: #fff; color: #241a12; font-size: 14.5px; font-weight: 600; text-align: start; cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
        .kv-a11y-opt:hover { border-color: #c99a5b; }
        .kv-a11y-opt:focus-visible { outline: 3px solid #c99a5b; outline-offset: 2px; }
        .kv-a11y-opt[aria-checked='true'] { border-color: #c99a5b; background: #f7eed9; }
        .kv-a11y-opt-label { display: inline-flex; align-items: center; gap: 9px; }
        .kv-a11y-opt-ico { font-size: 16px; }
        .kv-a11y-state { font-size: 12.5px; font-weight: 700; color: #8a6a3a; min-width: 34px; text-align: center; flex: none; }
        .kv-a11y-opt[aria-checked='true'] .kv-a11y-state { color: #6b4d24; }
        .kv-a11y-statement { display: block; text-align: center; font-size: 13px; font-weight: 800; color: #8a5a2b; text-decoration: none; padding: 8px; }
        .kv-a11y-statement:hover { text-decoration: underline; }

        /* ════════ אפקטים גלובליים על <html> ════════ */

        /* גודל טקסט - 4 רמות (zoom עובד גם על px) */
        :global(html.kv-a11y-text-1 #main) { zoom: 1.12; }
        :global(html.kv-a11y-text-2 #main) { zoom: 1.25; }
        :global(html.kv-a11y-text-3 #main) { zoom: 1.4; }
        :global(html.kv-a11y-text-4 #main) { zoom: 1.6; }

        :global(html.kv-a11y-spacing #main),
        :global(html.kv-a11y-spacing #main *) {
          line-height: 1.95 !important; letter-spacing: 0.04em !important; word-spacing: 0.12em !important;
        }
        :global(html.kv-a11y-readable-font #main),
        :global(html.kv-a11y-readable-font #main *) { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif !important; }

        :global(html.kv-a11y-high-contrast) { --text: #000; --text-secondary: #14100a; --text-muted: #14100a; --text-soft: #1f1810; --brand-dark: #6b4a1d; }
        :global(html.kv-a11y-high-contrast body) { color: #000; }
        :global(html.kv-a11y-high-contrast #main a) { text-decoration: underline; }
        :global(html.kv-a11y-high-contrast .muted),
        :global(html.kv-a11y-high-contrast .page-sub) { color: #14100a !important; }
        :global(html.kv-a11y-high-contrast .kv-footer-links a) { color: #fff; }

        :global(html.kv-a11y-grayscale #main) { filter: grayscale(1); }
        :global(html.kv-a11y-invert #main) { filter: invert(1) hue-rotate(180deg); }
        :global(html.kv-a11y-grayscale.kv-a11y-invert #main) { filter: grayscale(1) invert(1) hue-rotate(180deg); }
        :global(html.kv-a11y-invert #main img),
        :global(html.kv-a11y-invert #main video) { filter: invert(1) hue-rotate(180deg); }

        :global(html.kv-a11y-links #main a) {
          text-decoration: underline !important; text-underline-offset: 2px;
          background: #fff3cf !important; color: #3a2a12 !important; box-shadow: 0 0 0 2px #fff3cf; border-radius: 3px;
        }
        :global(html.kv-a11y-reduce-motion *) {
          animation-duration: 0.001ms !important; animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important; scroll-behavior: auto !important;
        }

        /* סמן עכבר גדול - חץ 64px בולט */
        :global(html.kv-a11y-big-cursor),
        :global(html.kv-a11y-big-cursor *) {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Cpath d='M10 4 L54 30 L33 34 L45 58 L35 62 L24 38 L10 52 Z' fill='%23000' stroke='%23fff' stroke-width='3' stroke-linejoin='round'/%3E%3C/svg%3E") 10 4, auto !important;
        }
        :global(html.kv-a11y-big-cursor .kv-cursor) { display: none !important; }
      `}</style>
    </div>
  )
}
