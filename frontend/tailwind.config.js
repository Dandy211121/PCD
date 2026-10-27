/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#06080d',
          900: '#090d16',
          850: '#0d121f',
          800: '#131929',
          700: '#1c2438',
          600: '#2b3652',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['"Outfit"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        'bento': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06), 0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'bento-active': 'inset 0 1px 0 0 rgba(59, 130, 246, 0.3), 0 8px 30px -4px rgba(37, 99, 235, 0.25)',
      }
    },
  },
  plugins: [],
}
