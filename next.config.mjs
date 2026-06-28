/** @type {import('next').NextConfig} */

// CSP מאוזן: מגן מפני clickjacking/הזרקת base/חטיפת טפסים/אובייקטים,
// ומאפשר את המשאבים שהאתר באמת צריך (סגנונות inline, תמונות unsplash,
// אריחי מפה, supabase, אנליטיקה). unsafe-inline נדרש בגלל ה-inline styles
// וה-hydration של Next; img/connect פתוחים ל-https כי המפה/הגיאוקודינג
// מושכים מכמה דומיינים.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), payment=(), usb=(), geolocation=(self)' },
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
]

const nextConfig = {
  poweredByHeader: false, // לא לחשוף X-Powered-By: Next.js
  images: {
    // העדפת פורמטים מודרניים וקלים (AVIF→WebP) כשמשתמשים ב-next/image.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
