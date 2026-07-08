import type { ReactNode } from 'react'

type Variant = 'default' | 'narrow' | 'wide'

interface ContainerProps {
  children: ReactNode
  variant?: Variant
}

export const Container = ({
  children,
  variant = 'default',
}: ContainerProps) => {

  const variants: Record<Variant, string> = {
    default: 'max-w-6xl',
    narrow: 'max-w-2xl',
    wide: 'max-w-screen-2xl',
  }

  return (
    <div className={variants[variant] + ' mx-auto px-6 md:px-10'}>
      {children}
    </div>
  )
}
