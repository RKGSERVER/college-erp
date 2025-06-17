"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Home, ArrowLeft, FileQuestion } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-4 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* 404 Animation */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1
              className={`text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-1000 ${
                isAnimating ? "scale-150 rotate-12" : "scale-100 rotate-0"
              }`}
            >
              404
            </h1>
            <div className="absolute inset-0 text-9xl font-bold text-purple-200 -z-10 animate-pulse">404</div>
          </div>

          {/* Floating Icon */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full animate-float">
              <FileQuestion className="w-10 h-10 text-white" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-in slide-in-from-top-4 duration-700">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 animate-in slide-in-from-top-6 duration-700 delay-150">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Search and Navigation Card */}
        <Card className="animate-in slide-in-from-bottom-4 duration-700 delay-300 shadow-2xl backdrop-blur-sm bg-white/90">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-blue-600">
              <Search className="w-5 h-5" />
              Find What You're Looking For
            </CardTitle>
            <CardDescription>Try searching for the content you need or navigate back to safety.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search for pages, features, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>

            {/* Navigation Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="transition-all duration-200 transform hover:scale-105 hover:shadow-md"
              >
                <Home className="mr-2 h-4 w-4" />
                Home Page
              </Button>
            </div>

            {/* Quick Links */}
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick Links:</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a href="/student" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Student Portal
                </a>
                <a href="/faculty" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Faculty Portal
                </a>
                <a href="/admin" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Admin Panel
                </a>
                <a href="/database" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                  Database View
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
