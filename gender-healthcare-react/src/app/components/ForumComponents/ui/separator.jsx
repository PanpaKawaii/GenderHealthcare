import React from "react"

export function Separator({ orientation = "horizontal", className = "", ...props }) {
  const baseClasses = "shrink-0 bg-gray-200"
  const orientationClasses =
    orientation === "horizontal" ? "h-px w-full" : "h-full w-px"

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={`${baseClasses} ${orientationClasses} ${className}`}
      {...props}
    />
  )
}
