import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-heebo)', 'Heebo', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#c99a5b', // קרם-לברדור ראשי
          light: '#e8c887',   // קרם בהיר / accent
          dark: '#a97c46',
          ink: '#2a2018',     // חום כהה מאוד (רקע hero)
        },
        cream: '#fbf7ef',
        ink: '#241a12',
      },
      borderRadius: {
        card: '20px',
        pill: '100px',
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(.34,1.56,.64,1)',
      },
      keyframes: {
        blink: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '.3' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        blink: 'blink 1.5s infinite',
        marquee: 'marquee 18s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
