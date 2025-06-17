"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Save, Upload, Edit, Shield, Settings, Eye } from "lucide-react"
import { userProfileSchema } from "@/lib/validation"
import { useFormValidation } from "@/hooks/use-form-validation"
import { FormField } from "@/components/ui/form-field"

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  address: string
  dateOfBirth: string
  joinDate: string
  profileImage: string
  bio: string
  emergencyContact: string
  bloodGroup: string
  nationality: string
  status: string
  permissions: string[]
  dashboardLayout: any
  first_name: string
  last_name: string
  gender: string
  city: string
  state: string
  country: string
  postalCode: string
}

interface ProfileManagementProps {
  userRole: string
  userId?: string
  isAdminView?: boolean
}

export function ProfileManagement({ userRole, userId, isAdminView = false }: ProfileManagementProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [allUsers, setAllUsers] = useState<ProfileData[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [formValues, setFormValues] = useState<any>(null)

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      // API call to save profile data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsEditing(false)
      // Show success message
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const { values, errors, isValid, handleSubmit, getFieldProps, setValue } = useFormValidation({
    schema: userProfileSchema,
    initialValues: formValues || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      nationality: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      emergencyContact: "",
      bio: "",
    },
    validateOnChange: true,
    onSubmit: handleSaveProfile,
  })

  useEffect(() => {
    loadProfileData()
    if (userRole === "admin") {
      loadAllUsers()
    }
  }, [userId, userRole])

  const loadProfileData = () => {
    // Mock data - replace with actual API call
    const mockProfile: ProfileData = {
      id: userId || "current-user",
      name: getUserName(userRole),
      email: `${userRole}@college.edu`,
      phone: "+1 (555) 123-4567",
      role: userRole,
      department: getDepartment(userRole),
      address: "123 College Street, Education City, EC 12345",
      dateOfBirth: "1990-05-15",
      joinDate: "2020-08-01",
      profileImage: "/placeholder.svg?height=100&width=100",
      bio: `Dedicated ${userRole} with passion for education and excellence.`,
      emergencyContact: "+1 (555) 987-6543",
      bloodGroup: "O+",
      nationality: "Indian",
      status: "Active",
      permissions: getDefaultPermissions(userRole),
      dashboardLayout: getDefaultDashboardLayout(userRole),
      first_name: "John",
      last_name: "Doe",
      gender: "Male",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
    }
    setProfileData(mockProfile)
    setFormValues({
      firstName: mockProfile.first_name,
      lastName: mockProfile.last_name,
      email: mockProfile.email,
      phone: mockProfile.phone,
      dateOfBirth: mockProfile.dateOfBirth,
      gender: mockProfile.gender,
      bloodGroup: mockProfile.bloodGroup,
      nationality: mockProfile.nationality,
      address: mockProfile.address,
      city: mockProfile.city,
      state: mockProfile.state,
      country: mockProfile.country,
      postalCode: mockProfile.postalCode,
      emergencyContact: mockProfile.emergencyContact,
      bio: mockProfile.bio,
    })
  }

  const loadAllUsers = () => {
    // Mock data for all users - replace with actual API call
    const mockUsers: ProfileData[] = [
      {
        id: "STU001",
        name: "John Smith",
        email: "john.smith@student.college.edu",
        phone: "+1 (555) 111-1111",
        role: "student",
        department: "Computer Science",
        address: "456 Student Ave, Campus City, CC 12346",
        dateOfBirth: "2002-03-20",
        joinDate: "2022-08-15",
        profileImage: "/placeholder.svg?height=100&width=100",
        bio: "Computer Science student passionate about AI and machine learning.",
        emergencyContact: "+1 (555) 111-2222",
        bloodGroup: "A+",
        nationality: "Indian",
        status: "Active",
        permissions: ["view_courses", "submit_assignments", "view_grades"],
        dashboardLayout: getDefaultDashboardLayout("student"),
        first_name: "John",
        last_name: "Smith",
        gender: "Male",
        city: "Campus City",
        state: "CA",
        country: "USA",
        postalCode: "12346",
      },
      {
        id: "FAC001",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@faculty.college.edu",
        phone: "+1 (555) 222-2222",
        role: "faculty",
        department: "Computer Science",
        address: "789 Faculty Lane, Academic City, AC 12347",
        dateOfBirth: "1985-07-10",
        joinDate: "2018-01-15",
        profileImage: "/placeholder.svg?height=100&width=100",
        bio: "Associate Professor specializing in Database Systems and Software Engineering.",
        emergencyContact: "+1 (555) 222-3333",
        bloodGroup: "B+",
        nationality: "Indian",
        status: "Active",
        permissions: ["manage_courses", "grade_students", "view_reports"],
        dashboardLayout: getDefaultDashboardLayout("faculty"),
        first_name: "Sarah",
        last_name: "Johnson",
        gender: "Female",
        city: "Academic City",
        state: "GA",
        country: "USA",
        postalCode: "12347",
      },
      {
        id: "EMP001",
        name: "Mike Wilson",
        email: "mike.wilson@admin.college.edu",
        phone: "+1 (555) 333-3333",
        role: "employee",
        department: "Administration",
        address: "321 Admin Street, Office City, OC 12348",
        dateOfBirth: "1988-12-05",
        joinDate: "2020-03-01",
        profileImage: "/placeholder.svg?height=100&width=100",
        bio: "Administrative staff member handling student records and documentation.",
        emergencyContact: "+1 (555) 333-4444",
        bloodGroup: "AB+",
        nationality: "Indian",
        status: "Active",
        permissions: ["manage_records", "process_documents", "view_reports"],
        dashboardLayout: getDefaultDashboardLayout("employee"),
        first_name: "Mike",
        last_name: "Wilson",
        gender: "Male",
        city: "Office City",
        state: "TX",
        country: "USA",
        postalCode: "12348",
      },
    ]
    setAllUsers(mockUsers)
  }

  const getUserName = (role: string) => {
    const names = {
      student: "John Smith",
      faculty: "Dr. Sarah Johnson",
      admin: "System Administrator",
      employee: "Mike Wilson",
      principal: "Dr. Margaret Thompson",
    }
    return names[role as keyof typeof names] || "User"
  }

  const getDepartment = (role: string) => {
    const departments = {
      student: "Computer Science",
      faculty: "Computer Science",
      admin: "Administration",
      employee: "Administration",
      principal: "Executive",
    }
    return departments[role as keyof typeof departments] || "General"
  }

  const getDefaultPermissions = (role: string) => {
    const permissions = {
      student: ["view_courses", "submit_assignments", "view_grades", "make_payments"],
      faculty: ["manage_courses", "grade_students", "view_reports", "manage_attendance"],
      admin: ["manage_all_users", "system_settings", "financial_reports", "full_access"],
      employee: ["manage_records", "process_documents", "view_reports", "handle_requests"],
      principal: ["approve_requests", "view_all_reports", "policy_management", "strategic_decisions"],
    }
    return permissions[role as keyof typeof permissions] || []
  }

  const getDefaultDashboardLayout = (role: string) => {
    return {
      widgets: [
        { id: "stats", enabled: true, position: 1 },
        { id: "recent_activity", enabled: true, position: 2 },
        { id: "quick_actions", enabled: true, position: 3 },
        { id: "notifications", enabled: true, position: 4 },
      ],
      theme: "default",
      layout: "grid",
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (profileData) {
          setProfileData({
            ...profileData,
            profileImage: e.target?.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const canEditProfile = () => {
    return userRole === "admin" || !isAdminView
  }

  if (!profileData) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {userRole === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Admin Profile Management</span>
            </CardTitle>
            <CardDescription>Manage all user profiles and dashboard configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-select">Select User to Manage</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user to manage" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role}) - {user.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUser && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>View Profile</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Settings className="h-4 w-4" />
                    <span>Dashboard Settings</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="contact">Contact Details</TabsTrigger>
          <TabsTrigger value="academic">Academic/Work Info</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    {isAdminView ? "Manage user's personal details" : "Manage your personal details"}
                  </CardDescription>
                </div>
                {canEditProfile() && (
                  <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.profileImage || "/placeholder.svg"} alt={profileData.name} />
                    <AvatarFallback>
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute bottom-0 right-0">
                      <Label htmlFor="image-upload" className="cursor-pointer">
                        <div className="bg-blue-600 text-white p-1 rounded-full">
                          <Upload className="h-4 w-4" />
                        </div>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </Label>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <Badge variant="secondary" className="mb-2">
                    {profileData.role.toUpperCase()}
                  </Badge>
                  <h3 className="text-2xl font-semibold">{profileData.name}</h3>
                  <p className="text-gray-600">{profileData.department}</p>
                </div>
              </div>

              {/* In the renderPersonalInfo section, replace the form inputs with: */}
              {/* Replace the input fields with FormField components: */}
              {profileData && (
                <>
                  {/* Form validation setup */}

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="First Name"
                      name="firstName"
                      required
                      disabled={!isEditing}
                      {...getFieldProps("firstName")}
                    />
                    <FormField
                      label="Last Name"
                      name="lastName"
                      required
                      disabled={!isEditing}
                      {...getFieldProps("lastName")}
                    />

                    <FormField
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      disabled={!isEditing}
                      {...getFieldProps("email")}
                    />

                    <FormField
                      label="Phone Number"
                      name="phone"
                      required
                      disabled={!isEditing}
                      {...getFieldProps("phone")}
                    />

                    <FormField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      disabled={!isEditing}
                      {...getFieldProps("dateOfBirth")}
                    />

                    <FormField label="Gender" name="gender" disabled={!isEditing} {...getFieldProps("gender")} />

                    <FormField
                      label="Blood Group"
                      name="bloodGroup"
                      disabled={!isEditing}
                      {...getFieldProps("bloodGroup")}
                    />

                    <FormField
                      label="Nationality"
                      name="nationality"
                      disabled={!isEditing}
                      {...getFieldProps("nationality")}
                    />

                    <FormField label="Address" name="address" disabled={!isEditing} {...getFieldProps("address")} />

                    <FormField label="City" name="city" disabled={!isEditing} {...getFieldProps("city")} />

                    <FormField label="State" name="state" disabled={!isEditing} {...getFieldProps("state")} />

                    <FormField label="Country" name="country" disabled={!isEditing} {...getFieldProps("country")} />

                    <FormField
                      label="Postal Code"
                      name="postalCode"
                      disabled={!isEditing}
                      {...getFieldProps("postalCode")}
                    />

                    <FormField
                      label="Emergency Contact"
                      name="emergencyContact"
                      disabled={!isEditing}
                      {...getFieldProps("emergencyContact")}
                    />

                    <FormField label="Bio" name="bio" disabled={!isEditing} {...getFieldProps("bio")} textarea />

                    {isEditing && (
                      <div className="flex justify-end space-x-2 col-span-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                          {loading ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    )}
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Contact details and emergency information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={values.phone}
                    onChange={(e) => setValue("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency">Emergency Contact</Label>
                  <Input
                    id="emergency"
                    value={values.emergencyContact}
                    onChange={(e) => setValue("emergencyContact", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={values.address}
                  onChange={(e) => setValue("address", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic/Work Information</CardTitle>
              <CardDescription>Professional and academic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={profileData.role}
                    onValueChange={(value) => setProfileData({ ...profileData, role: value })}
                    disabled={!isEditing || userRole !== "admin"}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="faculty">Faculty</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="principal">Principal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={profileData.department}
                    onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Mechanical">Mechanical</SelectItem>
                      <SelectItem value="Civil">Civil</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="join-date">Join Date</Label>
                  <Input
                    id="join-date"
                    type="date"
                    value={profileData.joinDate}
                    onChange={(e) => setProfileData({ ...profileData, joinDate: e.target.value })}
                    disabled={!isEditing || userRole !== "admin"}
                  />
                </div>
              </div>

              {userRole === "admin" && (
                <div className="space-y-4">
                  <Label>User Permissions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {[
                      "view_courses",
                      "manage_courses",
                      "grade_students",
                      "view_grades",
                      "submit_assignments",
                      "make_payments",
                      "view_reports",
                      "manage_attendance",
                      "manage_records",
                      "process_documents",
                      "handle_requests",
                      "approve_requests",
                      "system_settings",
                      "financial_reports",
                      "full_access",
                      "policy_management",
                    ].map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Switch
                          id={permission}
                          checked={profileData.permissions.includes(permission)}
                          onCheckedChange={(checked) => {
                            const newPermissions = checked
                              ? [...profileData.permissions, permission]
                              : profileData.permissions.filter((p) => p !== permission)
                            setProfileData({ ...profileData, permissions: newPermissions })
                          }}
                          disabled={!isEditing}
                        />
                        <Label htmlFor={permission} className="text-sm">
                          {permission.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <DashboardCustomization
            userRole={userRole}
            profileData={profileData}
            setProfileData={setProfileData}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isAdminView={isAdminView}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface DashboardCustomizationProps {
  userRole: string
  profileData: ProfileData
  setProfileData: (data: ProfileData) => void
  isEditing: boolean
  setIsEditing: (editing: boolean) => void
  isAdminView: boolean
}

function DashboardCustomization({
  userRole,
  profileData,
  setProfileData,
  isEditing,
  setIsEditing,
  isAdminView,
}: DashboardCustomizationProps) {
  const availableWidgets = [
    { id: "stats", name: "Statistics Overview", description: "Key metrics and numbers" },
    { id: "recent_activity", name: "Recent Activity", description: "Latest actions and updates" },
    { id: "quick_actions", name: "Quick Actions", description: "Frequently used functions" },
    { id: "notifications", name: "Notifications", description: "Important alerts and messages" },
    { id: "calendar", name: "Calendar", description: "Schedule and events" },
    { id: "tasks", name: "Tasks", description: "Pending tasks and assignments" },
    { id: "performance", name: "Performance Charts", description: "Visual performance data" },
    { id: "announcements", name: "Announcements", description: "Important notices" },
  ]

  const handleWidgetToggle = (widgetId: string, enabled: boolean) => {
    const updatedWidgets = profileData.dashboardLayout.widgets.map((widget: any) =>
      widget.id === widgetId ? { ...widget, enabled } : widget,
    )

    if (enabled && !profileData.dashboardLayout.widgets.find((w: any) => w.id === widgetId)) {
      updatedWidgets.push({
        id: widgetId,
        enabled: true,
        position: updatedWidgets.length + 1,
      })
    }

    setProfileData({
      ...profileData,
      dashboardLayout: {
        ...profileData.dashboardLayout,
        widgets: updatedWidgets,
      },
    })
  }

  const canCustomizeDashboard = () => {
    return userRole === "admin" || !isAdminView
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Dashboard Customization</CardTitle>
            <CardDescription>
              {isAdminView
                ? "Customize user's dashboard layout and widgets"
                : "Customize your dashboard layout and widgets"}
            </CardDescription>
          </div>
          {canCustomizeDashboard() && (
            <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Customize Dashboard"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label>Dashboard Theme</Label>
            <Select
              value={profileData.dashboardLayout.theme}
              onValueChange={(value) =>
                setProfileData({
                  ...profileData,
                  dashboardLayout: { ...profileData.dashboardLayout, theme: value },
                })
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="colorful">Colorful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Layout Style</Label>
            <Select
              value={profileData.dashboardLayout.layout}
              onValueChange={(value) =>
                setProfileData({
                  ...profileData,
                  dashboardLayout: { ...profileData.dashboardLayout, layout: value },
                })
              }
              disabled={!isEditing}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">Grid Layout</SelectItem>
                <SelectItem value="list">List Layout</SelectItem>
                <SelectItem value="compact">Compact Layout</SelectItem>
                <SelectItem value="expanded">Expanded Layout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Dashboard Widgets</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableWidgets.map((widget) => {
              const isEnabled =
                profileData.dashboardLayout.widgets.find((w: any) => w.id === widget.id)?.enabled || false

              return (
                <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{widget.name}</h4>
                    <p className="text-sm text-gray-600">{widget.description}</p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => handleWidgetToggle(widget.id, checked)}
                    disabled={!isEditing}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {userRole === "admin" && isAdminView && (
          <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <Label className="text-blue-800">Admin Dashboard Controls</Label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Force Dashboard Reset</span>
                <Button size="sm" variant="outline">
                  Reset to Default
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lock Dashboard Layout</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Hide Customization Options</span>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Apply Template</span>
                <Select>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="analytics">Analytics Focus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button>
              <Save className="h-4 w-4 mr-2" />
              Save Dashboard Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
