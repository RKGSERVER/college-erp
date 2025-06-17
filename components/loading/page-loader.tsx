"use client"

import { useEffect, useState } from "react"
import { CircleLoader } from "./circle-loader"

interface PageLoaderProps {
  isLoading: boolean
  text?: string
  delay?: number
}

export function PageLoader({ isLoading, text = "Loading...", delay = 0 }: PageLoaderProps) {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowLoader(true)
      }, delay)

      return () => clearTimeout(timer)
    } else {
      setShowLoader(false)
    }
  }, [isLoading, delay])

  if (!showLoader) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <CircleLoader size="xl" text={text} />
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500">Please wait while we load your content</p>
        </div>
      </div>
    </div>
  )
}
