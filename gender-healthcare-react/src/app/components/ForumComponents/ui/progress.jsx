

import React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

export const Progress = React.forwardRef(({ className = "", value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full flex-1 bg-blue-500 transition-all"
      style={{ transform: `translateX(-${100 - value}%)` }}
    />
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName
