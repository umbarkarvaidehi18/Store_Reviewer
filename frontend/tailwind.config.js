/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a5ff',
          500: '#597ef7',
          600: '#2f54eb',
          700: '#1d39c4',
          800: '#0a1f8f',
          900: '#030852',
        }
      }
    },
  },
  plugins: [],
}
