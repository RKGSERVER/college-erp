"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Database,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Bell,
  Shield,
  Settings,
  Calendar,
  Award,
} from "lucide-react"

const databaseTables = [
  {
    id: "users",
    name: "Users",
    icon: Users,
    description: "Central user management for all roles",
    file: "01-users.csv",
    records: 15,
    category: "Core",
  },
  {
    id: "profiles",
    name: "User Profiles",
    icon: Users,
    description: "Detailed personal information",
    file: "02-user-profiles.csv",
    records: 15,
    category: "Core",
  },
  {
    id: "departments",
    name: "Departments",
    icon: BookOpen,
    description: "Academic and administrative departments",
    file: "03-departments.csv",
    records: 10,
    category: "Academic",
  },
  {
    id: "students",
    name: "Students",
    icon: GraduationCap,
    description: "Student-specific information",
    file: "04-students.csv",
    records: 5,
    category: "Academic",
  },
  {
    id: "faculty",
    name: "Faculty",
    icon: Users,
    description: "Faculty member details",
    file: "05-faculty.csv",
    records: 3,
    category: "Academic",
  },
  {
    id: "employees",
    name: "Employees",
    icon: Users,
    description: "Non-academic staff information",
    file: "06-employees.csv",
    records: 5,
    category: "Administrative",
  },
  {
    id: "courses",
    name: "Courses",
    icon: BookOpen,
    description: "Course catalog and management",
    file: "07-courses.csv",
    records: 10,
    category: "Academic",
  },
  {
    id: "enrollments",
    name: "Course Enrollments",
    icon: BookOpen,
    description: "Student-course relationships",
    file: "08-course-enrollments.csv",
    records: 10,
    category: "Academic",
  },
  {
    id: "assignments",
    name: "Faculty Assignments",
    icon: Calendar,
    description: "Faculty-course teaching assignments",
    file: "09-faculty-course-assignments.csv",
    records: 7,
    category: "Academic",
  },
  {
    id: "attendance",
    name: "Attendance",
    icon: Calendar,
    description: "Student attendance tracking",
    file: "10-attendance.csv",
    records: 10,
    category: "Academic",
  },
  {
    id: "attendance-rules",
    name: "Attendance Rules",
    icon: Settings,
    description: "Attendance policies and rules",
    file: "11-attendance-rules.csv",
    records: 5,
    category: "Configuration",
  },
  {
    id: "fee-structures",
    name: "Fee Structures",
    icon: CreditCard,
    description: "Fee definitions by program",
    file: "12-fee-structures.csv",
    records: 7,
    category: "Financial",
  },
  {
    id: "fee-assignments",
    name: "Student Fee Assignments",
    icon: CreditCard,
    description: "Individual student fee assignments",
    file: "13-student-fee-assignments.csv",
    records: 5,
    category: "Financial",
  },
  {
    id: "payments",
    name: "Payments",
    icon: CreditCard,
    description: "Payment transactions and history",
    file: "14-payments.csv",
    records: 5,
    category: "Financial",
  },
  {
    id: "scholarships",
    name: "Scholarships",
    icon: Award,
    description: "Scholarship programs",
    file: "15-scholarships.csv",
    records: 5,
    category: "Financial",
  },
  {
    id: "scholarship-applications",
    name: "Scholarship Applications",
    icon: Award,
    description: "Student scholarship applications",
    file: "16-scholarship-applications.csv",
    records: 5,
    category: "Financial",
  },
  {
    id: "notifications",
    name: "Notifications",
    icon: Bell,
    description: "System notifications",
    file: "17-notifications.csv",
    records: 5,
    category: "System",
  },
  {
    id: "audit-logs",
    name: "Audit Logs",
    icon: Shield,
    description: "System activity audit trail",
    file: "18-audit-logs.csv",
    records: 5,
    category: "System",
  },
  {
    id: "permissions",
    name: "User Permissions",
    icon: Shield,
    description: "Role-based access control",
    file: "19-user-permissions.csv",
    records: 15,
    category: "System",
  },
  {
    id: "dashboard-configs",
    name: "Dashboard Configurations",
    icon: Settings,
    description: "User dashboard preferences",
    file: "20-dashboard-configurations.csv",
    records: 5,
    category: "Configuration",
  },
  {
    id: "sessions",
    name: "User Sessions",
    icon: Shield,
    description: "Active user sessions",
    file: "21-user-sessions.csv",
    records: 5,
    category: "System",
  },
  {
    id: "announcements",
    name: "Announcements",
    icon: Bell,
    description: "Institution-wide announcements",
    file: "22-announcements.csv",
    records: 5,
    category: "Communication",
  },
]

const categories = [
  "All",
  "Core",
  "Academic",
  "Financial",
  "Administrative",
  "System",
  "Configuration",
  "Communication",
]

export default function DatabaseViewer() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTable, setSelectedTable] = useState(databaseTables[0])

  const filteredTables =
    selectedCategory === "All" ? databaseTables : databaseTables.filter((table) => table.category === selectedCategory)

  const totalRecords = databaseTables.reduce((sum, table) => sum + table.records, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">College ERP Database Schema</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Comprehensive database structure with {databaseTables.length} tables and {totalRecords} sample records
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Database Tables</CardTitle>
                  <CardDescription>
                    {filteredTables.length} tables in {selectedCategory === "All" ? "all categories" : selectedCategory}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-2">
                      {filteredTables.map((table) => {
                        const Icon = table.icon
                        return (
                          <Button
                            key={table.id}
                            variant={selectedTable.id === table.id ? "default" : "ghost"}
                            className="w-full justify-start h-auto p-3"
                            onClick={() => setSelectedTable(table)}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <div className="text-left flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{table.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">{table.records} records</div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {table.category}
                              </Badge>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Table Details */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <selectedTable.icon className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl">{selectedTable.name}</CardTitle>
                      <CardDescription className="mt-1">{selectedTable.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="outline">{selectedTable.category}</Badge>
                    <Badge variant="secondary">{selectedTable.records} records</Badge>
                    <Badge variant="outline">CSV Format</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">File Information</h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>Filename:</strong> {selectedTable.file}
                        </p>
                        <p className="text-sm">
                          <strong>Location:</strong> /database/{selectedTable.file}
                        </p>
                        <p className="text-sm">
                          <strong>Format:</strong> CSV (Comma Separated Values)
                        </p>
                        <p className="text-sm">
                          <strong>Records:</strong> {selectedTable.records} sample entries
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Usage Instructions</h4>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <p className="text-sm">
                          <strong>Google Sheets:</strong> Import this CSV file directly into Google Sheets
                        </p>
                        <p className="text-sm">
                          <strong>Excel:</strong> Open with Microsoft Excel or import as external data
                        </p>
                        <p className="text-sm">
                          <strong>Database:</strong> Use for seeding your database with sample data
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Key Features</h4>
                      <ul className="text-sm space-y-1 text-gray-600">
                        {selectedTable.id === "users" && (
                          <>
                            <li>• Central authentication for all roles</li>
                            <li>• Password hashing and security</li>
                            <li>• Role-based access control</li>
                            <li>• Session management</li>
                          </>
                        )}
                        {selectedTable.id === "students" && (
                          <>
                            <li>• Academic progress tracking</li>
                            <li>• CGPA and credit management</li>
                            <li>• Guardian information</li>
                            <li>• Hostel and transport details</li>
                          </>
                        )}
                        {selectedTable.id === "payments" && (
                          <>
                            <li>• Multiple payment gateways</li>
                            <li>• Transaction tracking</li>
                            <li>• Receipt management</li>
                            <li>• Payment status monitoring</li>
                          </>
                        )}
                        {selectedTable.id === "notifications" && (
                          <>
                            <li>• Multi-channel delivery</li>
                            <li>• Priority-based routing</li>
                            <li>• Read/acknowledgment tracking</li>
                            <li>• Expiration management</li>
                          </>
                        )}
                        {selectedTable.id === "audit-logs" && (
                          <>
                            <li>• Complete activity tracking</li>
                            <li>• Before/after value logging</li>
                            <li>• IP and session tracking</li>
                            <li>• Security compliance</li>
                          </>
                        )}
                      </ul>
                    </div>

                    <div className="pt-4 border-t">
                      <Button className="w-full" asChild>
                        <a href={`/database/${selectedTable.file}`} download>
                          Download {selectedTable.name} CSV
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>

        {/* Summary Statistics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{databaseTables.length}</div>
              <div className="text-sm text-gray-600">Total Tables</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalRecords}</div>
              <div className="text-sm text-gray-600">Sample Records</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{categories.length - 1}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">CSV</div>
              <div className="text-sm text-gray-600">Format</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
