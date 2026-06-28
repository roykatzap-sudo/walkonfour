/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // העדפת פורמטים מודרניים וקלים (AVIF→WebP) כשמשתמשים ב-next/image.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

export default nextConfig
