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
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { DEFAULT: '0.5rem', lg: '0.75rem', xl: '1.25rem' /* 20px */ },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px rgba(37, 99, 235, 0.5)',
      },
      backdropBlur: { xl: '16px' },
      transitionDuration: { fast: '150ms', medium: '250ms', slow: '400ms' },
      animation: {
        aurora: 'aurora 80s ease-in-out infinite',
        float: 'float 12s ease-in-out infinite',
        pulse: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ripple: 'ripple 0.6s ease-out',
      },
      keyframes: {
        aurora: { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } },
        pulse: { '50%': { opacity: '0.6' } },
        ripple: { to: { transform: 'scale(4)', opacity: '0' } },
      },
    },
  },
  plugins: [ require('@tailwindcss/forms'), require('@tailwindcss/typography') ],
};
