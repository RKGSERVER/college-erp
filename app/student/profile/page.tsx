"use client"

import { StudentProfileEditor } from "@/components/student-profile-editor"
import { Navigation } from "@/components/navigation"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function StudentProfilePage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "student") {
        router.push("/unauthorized")
        return
      }
      setUser(parsedUser)
    } else {
      router.push("/")
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white font-semibold">{user.username?.charAt(0).toUpperCase() || "S"}</span>
            </div>
            <div>
              <h1 className="font-semibold">Student Profile</h1>
              <p className="text-sm text-gray-600">Manage your personal information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <StudentProfileEditor />
      </div>

      {/* Navigation */}
      <Navigation userRole="student" />
    </div>
  )
}
