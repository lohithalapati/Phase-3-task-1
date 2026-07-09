/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { neural: '#2563EB', cyan: '#06B6D4' },
        secondary: { blue: '#3B82F6' },
        status: { success: '#10B981', warning: '#F59E0B', error: '#EF4444' },
        background: { primary: '#050816', secondary: '#0B1120', surface: '#111827' },
        surface: { glass: 'rgba(255, 255, 255, 0.05)', card: 'rgba(15, 23, 42, 0.72)', border: 'rgba(255, 255, 255, 0.08)', hover: 'rgba(255, 255, 255, 0.08)' },
        text: { primary: '#E2E8F0', secondary: '#CBD5E1', muted: '#94A3B8' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem', xl: '1.25rem' },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(37, 99, 235, 0.5)',
      },
      backdropBlur: { xl: '16px' },
      transitionDuration: { fast: '150ms', medium: '250ms', slow: '400ms' },
      animation: {
        ripple: 'ripple 0.6s ease-out',
      },
      keyframes: {
        ripple: { to: { transform: 'scale(4)', opacity: '0' } },
      },
    },
  },
  plugins: [ require('@tailwindcss/forms'), require('@tailwindcss/typography') ],
};