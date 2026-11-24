/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        outfit: ['"Outfit"', 'sans-serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'cursive'],
        kannada: ['"Baloo Tamma 2"', '"Noto Sans Kannada"', 'sans-serif'],
        hindi: ['"Rozha One"', '"Noto Sans Devanagari"', 'serif'],
        notoKannada: ['"Noto Sans Kannada"', 'sans-serif'],
        notoHindi: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)' },
          '50%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
