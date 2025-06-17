"use client"

import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useState } from "react"

interface ErrorFallbackProps {
  error: Error
  reset: () => void
  title?: string
  description?: string
  showDetails?: boolean
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  showDetails = true,
}: ErrorFallbackProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-500 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 animate-pulse">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">{title}</CardTitle>
          <CardDescription className="text-gray-600">{description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {showDetails && (
            <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-sm">
                  Error Details
                  {isDetailsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md border font-mono">
                  <strong>Error:</strong> {error.message}
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-600">Stack trace</summary>
                      <pre className="mt-1 text-xs overflow-auto max-h-32 whitespace-pre-wrap">{error.stack}</pre>
                    </details>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={reset} className="w-full transition-all duration-200 transform hover:scale-105">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
              className="w-full transition-all duration-200 transform hover:scale-105"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
