import React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

export const Avatar = React.forwardRef(({ className = "", ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  />
))
Avatar.displayName = "Avatar"

export const AvatarImage = React.forwardRef(({ className = "", ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={`aspect-square h-full w-full ${className}`}
    {...props}
  />
))
AvatarImage.displayName = "AvatarImage"

export const AvatarFallback = React.forwardRef(({ className = "", ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 ${className}`}
    {...props}
  />
))
AvatarFallback.displayName = "AvatarFallback"
