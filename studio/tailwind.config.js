/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0d14',
          card: '#101622',
          border: '#1b2436',
          cyan: '#00f0ff',
          crimson: '#ff2a5f',
          amber: '#ffb300',
          purple: '#9d4edd'
        }
      }
    },
  },
  plugins: [],
}
