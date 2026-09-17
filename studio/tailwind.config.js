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
            950: '#090C10', // Deep obsidian canvas
            900: '#0F141C', // Card surface
            850: '#131A24', // Elevated surface
            800: '#18202E', // Subdued surface
            700: '#1E2638', // Forged steel border
          },
          crimson: {
            50: '#FFF1F2',
            100: '#FFE4E6',
            200: '#FECDD3',
            300: '#FDA4AF',
            400: '#FB7185',
            500: '#FF2A5F', // Electric Sovereign Crimson
            600: '#E11D48',
            700: '#BE123C',
            800: '#9F1239',
            900: '#881337',
          },
          cyan: {
            50: '#ECFEFF',
            100: '#CFFAFE',
            400: '#22D3EE',
            500: '#06B6D4',
            600: '#0891B2',
          }
        }
      }
    },
  },
  plugins: [],
}
