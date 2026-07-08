import type { ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'ai'
type Size = 'sm' | 'md'

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  dot?: boolean
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
}: BadgeProps) => {

  const base =
    'inline-flex items-center gap-2 rounded-full font-medium backdrop-blur-md border'

  const sizes: Record<Size, string> = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
  }

  const variants: Record<Variant, string> = {
    default: 'bg-white/5 border-white/10 text-slate-300',
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    ai: 'bg-gradient-to-r from-[#3B82F6]/10 via-[#06B6D4]/10 to-[#8B5CF6]/10 border-white/20 text-white',
  }

  return (
    <span className={base + ' ' + sizes[size] + ' ' + variants[variant]}>
      {dot && <span className="w-2 h-2 rounded-full bg-current" />}
      {children}
    </span>
  )
}
