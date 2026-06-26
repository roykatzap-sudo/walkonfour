/**
 * Template - רץ מחדש בכל ניווט (בניגוד ל-layout שנשאר). עוטף כל עמוד
 * באנימציית כניסה עדינה (fade + עלייה קלה), כדי שהמעבר בין עמודים
 * ירגיש חלק ואחיד. מכבד prefers-reduced-motion (מכובה ב-CSS).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="route-fade">{children}</div>
}
