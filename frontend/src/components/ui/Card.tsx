import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-surface-border bg-surface-card text-text-DEFAULT shadow-glass backdrop-blur-lg", className)} {...props} />
))
Card.displayName = "Card"

export { Card }
