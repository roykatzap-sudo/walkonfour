/** בלובים מטושטשים מונפשים לרקע סקשן (הצב בתוך position:relative; overflow:hidden). */
export function FloatingShapes({ dark = false }: { dark?: boolean }) {
  const cls = dark ? 'blob-teal' : 'blob-green'
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
      <div className={`blob ${cls}`} style={{ width: 360, height: 360, top: '-80px', right: '-60px', animationDelay: '0s' }} />
      <div className={`blob ${cls}`} style={{ width: 280, height: 280, bottom: '-60px', left: '-40px', animationDelay: '3s', opacity: 0.35 }} />
      <div className={`blob ${cls}`} style={{ width: 200, height: 200, top: '40%', left: '50%', animationDelay: '6s', opacity: 0.25 }} />
    </div>
  )
}
