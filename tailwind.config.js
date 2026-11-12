/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: '#FCF7F2', 50: '#FFFDFA', 200: '#F7EEE6', 300: '#F1E4D8' },
        champagne: { DEFAULT: '#EBDAC2', light: '#F5EBDD', deep: '#D8BF9B' },
        blush: { DEFAULT: '#F3DCD6', light: '#F9EDE9', deep: '#E6C1B8' },
        rose: { DEFAULT: '#B97A7F', light: '#D6A6A8', deep: '#8E5458', dark: '#74424A' },
        gold: { DEFAULT: '#C29B5A', light: '#E3C996', pale: '#F0E2C4', deep: '#9C7535' },
        ink: { DEFAULT: '#47352F', soft: '#6B5650', faint: '#9A8780' },
        night: { DEFAULT: '#221C33', deep: '#19152A', soft: '#2F2744' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Cormorant', 'Garamond', 'Georgia', 'serif'],
        sans: ['"Jost Variable"', 'Jost', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Pinyon Script"', '"Snell Roundhand"', 'cursive'],
      },
    },
  },
  plugins: [],
}
