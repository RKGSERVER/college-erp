"use client"

import { cn } from "@/lib/utils"

interface CircleLoaderProps {
  size?: "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "success" | "warning" | "danger"
  className?: string
  text?: string
  showText?: boolean
}

export function CircleLoader({
  size = "md",
  color = "primary",
  className,
  text = "Loading...",
  showText = true,
}: CircleLoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const colorClasses = {
    primary: "border-blue-600",
    secondary: "border-gray-600",
    success: "border-green-600",
    warning: "border-yellow-600",
    danger: "border-red-600",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div
        className={cn("animate-spin rounded-full border-2 border-gray-300", sizeClasses[size], colorClasses[color])}
        style={{
          borderTopColor: "transparent",
        }}
      />
      {showText && <p className={cn("text-gray-600 font-medium", textSizeClasses[size])}>{text}</p>}
    </div>
  )
}

// Pulse Loader Component
export function PulseLoader({
  size = "md",
  color = "primary",
  className,
  count = 3,
}: CircleLoaderProps & { count?: number }) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
    xl: "h-5 w-5",
  }

  const colorClasses = {
    primary: "bg-blue-600",
    secondary: "bg-gray-600",
    success: "bg-green-600",
    warning: "bg-yellow-600",
    danger: "bg-red-600",
  }

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn("rounded-full animate-pulse", sizeClasses[size], colorClasses[color])}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  )
}

// Spinner with overlay
export function SpinnerOverlay({
  isVisible,
  text = "Processing...",
  size = "lg",
}: {
  isVisible: boolean
  text?: string
  size?: "sm" | "md" | "lg" | "xl"
}) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <CircleLoader size={size} text={text} />
      </div>
    </div>
  )
}
