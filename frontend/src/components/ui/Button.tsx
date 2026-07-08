import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neural-blue disabled:opacity-50", {
  variants: {
    variant: {
      primary: "bg-neural-blue text-white hover:bg-neural-blue/90 shadow-sm",
      outline: "border border-surface-border bg-transparent hover:bg-surface-glass",
      secondary: "bg-surface-glass border border-surface-border text-text-muted hover:bg-surface-glass/80",
      destructive: "bg-error text-white hover:bg-error/90",
    },
    size: { default: "h-10 px-5", lg: "h-11 rounded-lg px-8" },
  },
  defaultVariants: { variant: "primary", size: "default" },
})

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />)
})
Button.displayName = "Button"

export { Button, buttonVariants }
