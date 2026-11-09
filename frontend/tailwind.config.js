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
          primary: '#536DFE',
          accent: '#8067E8',
          bg: '#F7F8FC',
          card: '#FFFFFF',
          text: '#171D32',
          secondary: '#64748B',
          muted: '#94A3B8',
          border: '#E8EAF2',
        },
        sentiment: {
          positive: '#15966A',
          'positive-light': '#E8F7F0',
          neutral: '#E5A12B',
          'neutral-light': '#FEF7E6',
          negative: '#DC6262',
          'negative-light': '#FDECEC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      transitionTimingFunction: {
        'ease-saas': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 29, 50, 0.04), 0 1px 2px -1px rgba(23, 29, 50, 0.04)',
        'card': '0 1px 3px 0 rgba(23, 29, 50, 0.04), 0 4px 8px -2px rgba(23, 29, 50, 0.02)',
        'hover': '0 4px 12px 0 rgba(23, 29, 50, 0.06)',
      }
    },
  },
  plugins: [],
}
