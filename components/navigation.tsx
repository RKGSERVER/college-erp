"use client"

import { Button } from "@/components/ui/button"
import { Home, Users, BookOpen, DollarSign, Settings, LogOut, User, Receipt } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

interface NavigationProps {
  userRole: string
}

export function Navigation({ userRole }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const getNavigationItems = () => {
    const baseItems = [{ icon: Home, label: "Dashboard", path: `/${userRole}` }]

    switch (userRole) {
      case "student":
        return [
          ...baseItems,
          { icon: BookOpen, label: "Courses", path: `/${userRole}/courses` },
          { icon: DollarSign, label: "Payments", path: `/${userRole}/payments` },
          { icon: Receipt, label: "Receipts", path: `/${userRole}/academic-receipts` },
          { icon: User, label: "Profile", path: `/${userRole}/profile` },
        ]
      case "faculty":
        return [
          ...baseItems,
          { icon: BookOpen, label: "My Courses", path: `/${userRole}/courses` },
          { icon: Users, label: "Students", path: `/${userRole}/students` },
          { icon: User, label: "Profile", path: `/${userRole}/profile` },
        ]
      case "admin":
        return [
          ...baseItems,
          { icon: Users, label: "Users", path: `/${userRole}/users` },
          { icon: BookOpen, label: "Academics", path: `/${userRole}/academics` },
          { icon: DollarSign, label: "Finance", path: `/${userRole}/finance` },
          { icon: Settings, label: "Settings", path: `/${userRole}/settings` },
          { icon: Users, label: "Profiles", path: `/${userRole}/profile-management` },
        ]
      case "employee":
        return [
          ...baseItems,
          { icon: Users, label: "Tasks", path: `/${userRole}/tasks` },
          { icon: Settings, label: "Profile", path: `/${userRole}/profile` },
          { icon: User, label: "Profile", path: `/${userRole}/profile` },
        ]
      case "principal":
        return [
          ...baseItems,
          { icon: BookOpen, label: "Academics", path: `/${userRole}/academics` },
          { icon: Users, label: "Reports", path: `/${userRole}/reports` },
          { icon: Settings, label: "Approvals", path: `/${userRole}/approvals` },
          { icon: User, label: "Profile", path: `/${userRole}/profile` },
        ]
      default:
        return baseItems
    }
  }

  const navigationItems = getNavigationItems()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className="flex flex-col items-center space-y-1 h-auto py-2"
              onClick={() => router.push(item.path)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center space-y-1 h-auto py-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-xs">Logout</span>
        </Button>
      </div>
    </div>
  )
}
