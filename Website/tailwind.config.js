/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        'primary-text': '#0F172A',
        'secondary-text': '#475569',
        accent: '#2563EB',
        'accent-light': '#EFF6FF',
        border: '#E2E8F0',
        surface: '#FFFFFF',
        'accent-700': '#1D4ED8',
        'accent-100': '#DBEAFE',
        'accent-200': '#BFDBFE',
        'slate-50': '#F8FAFC',
        'slate-100': '#F1F5F9',
        'slate-900': '#0F172A',
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'counter': 'counterSpin 0.3s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 30px -5px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06)',
        'blue-glow': '0 0 0 3px rgba(37,99,235,0.15)',
      },
    },
  },
  plugins: [],
};
