"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, GraduationCap, Users, BookOpen, Building, UserCheck, Eye, EyeOff } from "lucide-react"

const roles = [
  { value: "student", label: "Student", icon: GraduationCap, color: "text-blue-600" },
  { value: "faculty", label: "Faculty", icon: Users, color: "text-green-600" },
  { value: "admin", label: "Admin", icon: UserCheck, color: "text-purple-600" },
  { value: "employee", label: "Employee", icon: Building, color: "text-orange-600" },
  { value: "principal", label: "Principal", icon: BookOpen, color: "text-red-600" },
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Universal credentials for all roles
      const UNIVERSAL_USERNAME = "Admin"
      const UNIVERSAL_PASSWORD = "1234"

      // Check if credentials match universal login
      if (username === UNIVERSAL_USERNAME && password === UNIVERSAL_PASSWORD && role) {
        // Store user data for demo
        const userData = {
          id: Math.floor(Math.random() * 1000) + 1,
          username: UNIVERSAL_USERNAME,
          email: `${role}@college.edu`,
          role: role,
          firstName: "Admin",
          lastName: "User",
          departmentName: `${role.charAt(0).toUpperCase() + role.slice(1)} Department`,
          status: "active",
        }

        localStorage.setItem("user", JSON.stringify(userData))
        localStorage.setItem("isAuthenticated", "true")

        // Set cookie for middleware
        document.cookie = `auth_token=demo_token_${role}; path=/; max-age=86400`
        document.cookie = `user_role=${role}; path=/; max-age=86400`

        // Redirect to role dashboard
        router.push(`/${role}`)
      } else {
        setError("Invalid credentials. Please contact your administrator.")
      }
    } catch (error) {
      setError("Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">College ERP System</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Select Role</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => {
                    const Icon = roleOption.icon
                    return (
                      <SelectItem key={roleOption.value} value={roleOption.value}>
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${roleOption.color}`} />
                          {roleOption.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Contact your system administrator for login credentials
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
