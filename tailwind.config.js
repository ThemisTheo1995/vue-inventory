/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enables dark mode toggling
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A minimal, standardized SaaS palette
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb', // Primary Call-to-Action
          900: '#1e3a8a',
        },
        dark: {
          bg: '#09090b', // Zinc-950 for deep minimal dark mode
          card: '#18181b', // Zinc-900
          border: '#27272a', // Zinc-800
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
