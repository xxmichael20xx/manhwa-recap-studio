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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          dark: {
            950: '#030712', // Deep Midnight Slate (Canvas)
            900: '#0f172a', // Clean Slate 900 (Cards & Sidebar)
            850: '#141e33', // Elevated Surface
            800: '#1e293b', // Slate 800 Border
            700: '#334155', // Slate 700 Accent Border
            600: '#475569'
          },
          amethyst: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            200: '#E9D5FF',
            300: '#D8B4FE',
            400: '#C084FC',
            500: '#8B5CF6', // Electric Amethyst
            600: '#7C3AED', // Royal Violet
            700: '#6D28D9',
            800: '#5B21B6',
            900: '#4C1D95',
          },
          gold: {
            50: '#FFFBEB',
            100: '#FEF3C7',
            400: '#FBBF24',
            500: '#F59E0B', // Imperial Gold Telemetry
            600: '#D97706',
          }
        }
      }
    },
  },
  plugins: [],
}
