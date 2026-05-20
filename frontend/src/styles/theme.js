/**
 * Centralized Theme Configuration for CharacterU
 * Contains standard tokens for colors, shadows, border radiuses, and spacing 
 * to ensure a consistent SaaS design language across all components.
 */
export const theme = {
  colors: {
    primary: {
      light: 'bg-primary-500/10 text-primary-400',
      DEFAULT: 'bg-primary-600 text-white',
      hover: 'hover:bg-primary-500',
      border: 'border-primary-500/20',
      glow: 'shadow-primary-900/20',
    },
    success: {
      light: 'bg-emerald-500/10 text-emerald-400',
      DEFAULT: 'bg-emerald-600 text-white',
      hover: 'hover:bg-emerald-500',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-900/20',
    },
    danger: {
      light: 'bg-red-500/10 text-red-400',
      DEFAULT: 'bg-red-600 text-white',
      hover: 'hover:bg-red-500',
      border: 'border-red-500/20',
      glow: 'shadow-red-900/20',
    },
    warning: {
      light: 'bg-yellow-500/10 text-yellow-400',
      DEFAULT: 'bg-yellow-600 text-white',
      hover: 'hover:bg-yellow-500',
      border: 'border-yellow-500/20',
      glow: 'shadow-yellow-900/20',
    },
    surface: {
      base: 'bg-dark-900 border-dark-800',
      elevated: 'bg-dark-950 border-dark-700',
      glass: 'bg-dark-900/60 backdrop-blur-md border-dark-800',
    }
  },
  borderRadius: {
    base: 'rounded-xl',
    card: 'rounded-2xl',
    pill: 'rounded-full',
  },
  shadows: {
    soft: 'shadow-sm',
    base: 'shadow-md',
    glow: 'shadow-lg',
  },
  transitions: {
    base: 'transition-all duration-300 ease-out',
    fast: 'transition-all duration-150 ease-out',
  }
};
