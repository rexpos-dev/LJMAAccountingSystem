import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-xl border border-foreground/5 bg-background/40 px-3 py-1 text-xs ring-offset-background transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground",
          "placeholder:text-foreground/20",
          "hover:border-foreground/10 hover:bg-background/60",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
