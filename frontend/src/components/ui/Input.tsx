import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-10 w-full rounded-lg border border-surface-border bg-surface-glass px-4 py-2 text-sm text-text-DEFAULT placeholder:text-text-muted transition-shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neural-blue", className)} ref={ref} {...props} />
))
Input.displayName = "Input"

export { Input }
