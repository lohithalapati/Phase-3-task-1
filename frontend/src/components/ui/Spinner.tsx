import { motion } from 'framer-motion'

type Size = 'sm' | 'md' | 'lg'
type Variant = 'default' | 'light'

interface SpinnerProps {
  size?: Size
  variant?: Variant
}

export const Spinner = ({
  size = 'md',
  variant = 'default',
}: SpinnerProps) => {

  const sizes: Record<Size, string> = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-4',
  }

  const variants: Record<Variant, string> = {
    default: 'border-white/20 border-t-white',
    light: 'border-white/10 border-t-slate-300',
  }

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: 'linear',
        duration: 1,
      }}
      className={
        sizes[size] + ' ' +
        variants[variant] + ' rounded-full'
      }
      role="status"
      aria-label="Loading"
    />
  )
}
