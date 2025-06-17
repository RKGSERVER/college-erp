"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Search, Plus, Edit, Settings, Download, Upload, Shield, Eye, Lock, Unlock } from "lucide-react"
import { ProfileManagement } from "@/components/profile-management"

interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
  profileImage: string
}

export default function AdminProfileManagement() {
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")
  const [showProfileEditor, setShowProfileEditor] = useState(false)

  const mockUsers: User[] = [
    {
      id: "STU001",
      name: "John Smith",
      email: "john.smith@student.college.edu",
      role: "student",
      department: "Computer Science",
      status: "Active",
      lastLogin: "2024-01-15 10:30 AM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "STU002",
      name: "Emily Davis",
      email: "emily.davis@student.college.edu",
      role: "student",
      department: "Electronics",
      status: "Active",
      lastLogin: "2024-01-15 09:15 AM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "FAC001",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@faculty.college.edu",
      role: "faculty",
      department: "Computer Science",
      status: "Active",
      lastLogin: "2024-01-15 08:45 AM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "FAC002",
      name: "Prof. Michael Brown",
      email: "michael.brown@faculty.college.edu",
      role: "faculty",
      department: "Mechanical",
      status: "Active",
      lastLogin: "2024-01-14 05:20 PM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "EMP001",
      name: "Mike Wilson",
      email: "mike.wilson@admin.college.edu",
      role: "employee",
      department: "Administration",
      status: "Active",
      lastLogin: "2024-01-15 11:00 AM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "EMP002",
      name: "Lisa Anderson",
      email: "lisa.anderson@admin.college.edu",
      role: "employee",
      department: "Finance",
      status: "Inactive",
      lastLogin: "2024-01-10 03:30 PM",
      profileImage: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleEditProfile = (userId: string) => {
    setSelectedUser(userId)
    setShowProfileEditor(true)
  }

  const handleBulkAction = (action: string) => {
    // Handle bulk actions like export, import, etc.
    console.log(`Performing bulk action: ${action}`)
  }

  if (showProfileEditor && selectedUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Edit User Profile</h1>
              <p className="text-gray-600">Managing profile for user ID: {selectedUser}</p>
            </div>
            <Button variant="outline" onClick={() => setShowProfileEditor(false)}>
              Back to User List
            </Button>
          </div>
          <ProfileManagement userRole="admin" userId={selectedUser} isAdminView={true} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile Management</h1>
            <p className="text-gray-600">Manage all user profiles and dashboard configurations</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleBulkAction("export")}>
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
            <Button variant="outline" onClick={() => handleBulkAction("import")}>
              <Upload className="h-4 w-4 mr-2" />
              Import Users
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="font-semibold">{mockUsers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="font-semibold">{mockUsers.filter((u) => u.status === "Active").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Inactive Users</p>
                  <p className="font-semibold">{mockUsers.filter((u) => u.status === "Inactive").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Roles</p>
                  <p className="font-semibold">{new Set(mockUsers.map((u) => u.role)).size}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Operations</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user profiles and permissions</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Students</option>
                      <option value="faculty">Faculty</option>
                      <option value="employee">Employees</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.profileImage || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary">{user.role}</Badge>
                            <Badge variant={user.status === "Active" ? "default" : "destructive"}>{user.status}</Badge>
                            <span className="text-xs text-gray-500">{user.department}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-gray-500">
                          <p>Last login:</p>
                          <p>{user.lastLogin}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" onClick={() => handleEditProfile(user.id)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEditProfile(user.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            {user.status === "Active" ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
                <CardDescription>Perform actions on multiple users simultaneously</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    <span>Export All Profiles</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Upload className="h-6 w-6 mb-2" />
                    <span>Import Profiles</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Settings className="h-6 w-6 mb-2" />
                    <span>Bulk Dashboard Reset</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Shield className="h-6 w-6 mb-2" />
                    <span>Update Permissions</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Lock className="h-6 w-6 mb-2" />
                    <span>Bulk Status Change</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Generate Reports</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Management Settings</CardTitle>
                <CardDescription>Configure system-wide profile management settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Allow Self Profile Editing</h4>
                      <p className="text-sm text-gray-600">Users can edit their own profiles</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Require Admin Approval</h4>
                      <p className="text-sm text-gray-600">Profile changes need admin approval</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Dashboard Customization</h4>
                      <p className="text-sm text-gray-600">Allow users to customize their dashboards</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Profile Image Upload</h4>
                      <p className="text-sm text-gray-600">Allow users to upload profile pictures</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
