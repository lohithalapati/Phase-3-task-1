// Design Tokens - Single source of truth for all design values
// This file centralizes every color, spacing, typography, and animation value

export const tokens = {
  // ===== COLORS =====
  colors: {
    // Primary
    primary: {
      neural: '#3B82F6',
      cyan: '#06B6D4',
    },
    // Secondary
    secondary: {
      purple: '#8B5CF6',
      violet: '#A855F7',
    },
    // Status
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Background
    background: {
      primary: '#050816',
      secondary: '#0B1120',
      tertiary: '#111827',
    },
    
    // Surface (Glassmorphism)
    surface: {
      glass: 'rgba(255, 255, 255, 0.05)',
      card: 'rgba(15, 23, 42, 0.72)',
      interactive: 'rgba(59, 130, 246, 0.1)',
      hover: 'rgba(255, 255, 255, 0.08)',
      border: 'rgba(255, 255, 255, 0.08)',
    },
    
    // Text
    text: {
      primary: '#E2E8F0',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      subtle: '#64748B',
      disabled: '#475569',
    },
  },

  // ===== TYPOGRAPHY =====
  typography: {
    fontFamily: {
      serif: "'Playfair Display', serif",
      sans: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeights: {
      tight: 1.2,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
  },

  // ===== SPACING =====
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    6: '1.5rem',
    8: '2rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  // ===== BORDER RADIUS =====
  radius: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  // ===== SHADOWS =====
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
  },

  // ===== BLUR =====
  blur: {
    none: '0',
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
  },

  // ===== Z-INDEX =====
  zIndex: {
    background: '-10',
    hide: '-1',
    base: '0',
    dropdown: '10',
    sticky: '20',
    fixed: '30',
    overlay: '40',
    modal: '50',
    popover: '60',
    tooltip: '70',
  },

  // ===== ANIMATION =====
  animation: {
    duration: {
      fastest: '75ms',
      faster: '100ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms',
      slowest: '1000ms',
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // ===== BREAKPOINTS =====
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
    ultrawide: '1920px',
  },
};

export type TokenType = typeof tokens;
