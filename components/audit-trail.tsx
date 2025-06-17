"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  History,
  User,
  Filter,
  Download,
  Search,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Shield,
  Activity,
  Database,
  RefreshCw,
} from "lucide-react"

interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  targetUserId: string
  targetUserName: string
  action: string
  category: string
  field: string
  oldValue: string
  newValue: string
  ipAddress: string
  userAgent: string
  sessionId: string
  status: "success" | "failed" | "pending"
  reason?: string
  metadata: Record<string, any>
}

interface AuditTrailProps {
  userId?: string
  userRole: string
  showAllUsers?: boolean
}

export function AuditTrail({ userId, userRole, showAllUsers = false }: AuditTrailProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterUser, setFilterUser] = useState("all")
  const [dateRange, setDateRange] = useState({ from: "", to: "" })
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  useEffect(() => {
    loadAuditLogs()
  }, [userId, showAllUsers])

  useEffect(() => {
    filterLogs()
  }, [auditLogs, searchTerm, filterAction, filterCategory, filterStatus, filterUser, dateRange])

  const loadAuditLogs = async () => {
    setLoading(true)
    try {
      // Mock audit logs - replace with actual API call
      const mockLogs: AuditLog[] = [
        {
          id: "audit_001",
          timestamp: "2024-01-15T10:30:00Z",
          userId: "admin_001",
          userName: "System Administrator",
          userRole: "admin",
          targetUserId: "STU001",
          targetUserName: "John Smith",
          action: "profile_update",
          category: "personal_info",
          field: "email",
          oldValue: "john.old@student.college.edu",
          newValue: "john.smith@student.college.edu",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_12345",
          status: "success",
          metadata: {
            approvedBy: "admin_001",
            reason: "Email correction requested by student",
            department: "Computer Science",
          },
        },
        {
          id: "audit_002",
          timestamp: "2024-01-15T09:15:00Z",
          userId: "STU001",
          userName: "John Smith",
          userRole: "student",
          targetUserId: "STU001",
          targetUserName: "John Smith",
          action: "profile_update",
          category: "contact_info",
          field: "phone",
          oldValue: "+1 (555) 123-4567",
          newValue: "+1 (555) 987-6543",
          ipAddress: "192.168.1.150",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          sessionId: "sess_67890",
          status: "success",
          metadata: {
            selfUpdate: true,
            verificationSent: true,
          },
        },
        {
          id: "audit_003",
          timestamp: "2024-01-15T08:45:00Z",
          userId: "admin_001",
          userName: "System Administrator",
          userRole: "admin",
          targetUserId: "FAC001",
          targetUserName: "Dr. Sarah Johnson",
          action: "dashboard_update",
          category: "dashboard_settings",
          field: "theme",
          oldValue: "default",
          newValue: "dark",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_12345",
          status: "success",
          metadata: {
            adminOverride: true,
            reason: "Faculty request for dark theme",
          },
        },
        {
          id: "audit_004",
          timestamp: "2024-01-15T08:30:00Z",
          userId: "FAC001",
          userName: "Dr. Sarah Johnson",
          userRole: "faculty",
          targetUserId: "FAC001",
          targetUserName: "Dr. Sarah Johnson",
          action: "profile_update",
          category: "academic_info",
          field: "bio",
          oldValue: "Associate Professor in Computer Science",
          newValue: "Associate Professor specializing in Database Systems and Software Engineering",
          ipAddress: "192.168.1.200",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          sessionId: "sess_11111",
          status: "success",
          metadata: {
            selfUpdate: true,
            characterCount: 89,
          },
        },
        {
          id: "audit_005",
          timestamp: "2024-01-15T07:20:00Z",
          userId: "admin_001",
          userName: "System Administrator",
          userRole: "admin",
          targetUserId: "EMP001",
          targetUserName: "Mike Wilson",
          action: "permission_update",
          category: "security",
          field: "permissions",
          oldValue: "manage_records,process_documents",
          newValue: "manage_records,process_documents,view_reports",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_12345",
          status: "success",
          metadata: {
            requestedBy: "principal_001",
            approvalRequired: true,
            effectiveDate: "2024-01-15",
          },
        },
        {
          id: "audit_006",
          timestamp: "2024-01-14T16:45:00Z",
          userId: "STU002",
          userName: "Emily Davis",
          userRole: "student",
          targetUserId: "STU002",
          targetUserName: "Emily Davis",
          action: "profile_update",
          category: "personal_info",
          field: "profile_image",
          oldValue: "default_avatar.png",
          newValue: "emily_profile_2024.jpg",
          ipAddress: "192.168.1.175",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_22222",
          status: "failed",
          reason: "File size exceeds maximum limit (5MB)",
          metadata: {
            fileSize: "7.2MB",
            fileType: "image/jpeg",
            maxAllowed: "5MB",
          },
        },
        {
          id: "audit_007",
          timestamp: "2024-01-14T15:30:00Z",
          userId: "admin_001",
          userName: "System Administrator",
          userRole: "admin",
          targetUserId: "STU003",
          targetUserName: "Alex Rodriguez",
          action: "status_update",
          category: "account_management",
          field: "status",
          oldValue: "Active",
          newValue: "Suspended",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_12345",
          status: "success",
          reason: "Disciplinary action - Academic misconduct",
          metadata: {
            suspensionDuration: "30 days",
            reviewDate: "2024-02-14",
            appealDeadline: "2024-01-21",
            notificationSent: true,
          },
        },
        {
          id: "audit_008",
          timestamp: "2024-01-14T14:15:00Z",
          userId: "admin_001",
          userName: "System Administrator",
          userRole: "admin",
          targetUserId: "ALL_STUDENTS",
          targetUserName: "All Students",
          action: "bulk_dashboard_update",
          category: "dashboard_settings",
          field: "widgets",
          oldValue: "default_widgets",
          newValue: "academic_focused_widgets",
          ipAddress: "192.168.1.100",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          sessionId: "sess_12345",
          status: "success",
          metadata: {
            affectedUsers: 1247,
            bulkOperation: true,
            template: "academic_focus",
            rollbackAvailable: true,
          },
        },
      ]

      // Filter logs based on user permissions
      let filteredMockLogs = mockLogs
      if (!showAllUsers && userId) {
        filteredMockLogs = mockLogs.filter((log) => log.targetUserId === userId || log.userId === userId)
      }

      setAuditLogs(filteredMockLogs)
    } catch (error) {
      console.error("Error loading audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = auditLogs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (log) =>
          log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.targetUserName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.field.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.oldValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          log.newValue.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Action filter
    if (filterAction !== "all") {
      filtered = filtered.filter((log) => log.action === filterAction)
    }

    // Category filter
    if (filterCategory !== "all") {
      filtered = filtered.filter((log) => log.category === filterCategory)
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((log) => log.status === filterStatus)
    }

    // User filter
    if (filterUser !== "all") {
      filtered = filtered.filter((log) => log.userId === filterUser)
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp)
        const fromDate = new Date(dateRange.from)
        const toDate = new Date(dateRange.to)
        return logDate >= fromDate && logDate <= toDate
      })
    }

    setFilteredLogs(filtered)
  }

  const exportAuditLogs = () => {
    const csvContent = [
      [
        "Timestamp",
        "User",
        "Target User",
        "Action",
        "Category",
        "Field",
        "Old Value",
        "New Value",
        "Status",
        "IP Address",
      ].join(","),
      ...filteredLogs.map((log) =>
        [
          log.timestamp,
          log.userName,
          log.targetUserName,
          log.action,
          log.category,
          log.field,
          log.oldValue,
          log.newValue,
          log.status,
          log.ipAddress,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "profile_update":
        return <User className="h-4 w-4" />
      case "dashboard_update":
        return <Activity className="h-4 w-4" />
      case "permission_update":
        return <Shield className="h-4 w-4" />
      case "status_update":
        return <RefreshCw className="h-4 w-4" />
      case "bulk_dashboard_update":
        return <Database className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Success
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getUniqueValues = (field: keyof AuditLog) => {
    return [...new Set(auditLogs.map((log) => log[field] as string))]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading audit trail...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <History className="h-6 w-6" />
            <span>Audit Trail</span>
          </h2>
          <p className="text-gray-600">{showAllUsers ? "Complete system audit history" : "Profile change history"}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportAuditLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="outline" onClick={loadAuditLogs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="font-semibold">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="font-semibold">{auditLogs.filter((log) => log.status === "success").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="font-semibold">{auditLogs.filter((log) => log.status === "failed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="font-semibold">
                  {
                    auditLogs.filter((log) => new Date(log.timestamp).toDateString() === new Date().toDateString())
                      .length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Action</Label>
                  <Select value={filterAction} onValueChange={setFilterAction}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Actions</SelectItem>
                      {getUniqueValues("action").map((action) => (
                        <SelectItem key={action} value={action}>
                          {action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {getUniqueValues("category").map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs ({filteredLogs.length})</CardTitle>
              <CardDescription>Detailed history of all profile and system changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">{getActionIcon(log.action)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-sm">{log.userName}</p>
                          <span className="text-gray-400">→</span>
                          <p className="text-sm text-gray-600">{log.targetUserName}</p>
                          {getStatusBadge(log.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} • {log.field}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <span>{formatTimestamp(log.timestamp)}</span>
                          <span>{log.ipAddress}</span>
                          <span>{log.category.replace(/_/g, " ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="text-gray-500">From:</p>
                        <p className="font-mono text-xs bg-red-50 px-2 py-1 rounded max-w-32 truncate">
                          {log.oldValue}
                        </p>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div className="text-right text-sm">
                        <p className="text-gray-500">To:</p>
                        <p className="font-mono text-xs bg-green-50 px-2 py-1 rounded max-w-32 truncate">
                          {log.newValue}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AuditAnalytics auditLogs={auditLogs} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <AuditSettings userRole={userRole} />
        </TabsContent>
      </Tabs>

      {/* Detailed Log Modal */}
      {selectedLog && <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
    </div>
  )
}

interface AuditAnalyticsProps {
  auditLogs: AuditLog[]
}

function AuditAnalytics({ auditLogs }: AuditAnalyticsProps) {
  const getActionStats = () => {
    const stats: Record<string, number> = {}
    auditLogs.forEach((log) => {
      stats[log.action] = (stats[log.action] || 0) + 1
    })
    return Object.entries(stats).sort(([, a], [, b]) => b - a)
  }

  const getCategoryStats = () => {
    const stats: Record<string, number> = {}
    auditLogs.forEach((log) => {
      stats[log.category] = (stats[log.category] || 0) + 1
    })
    return Object.entries(stats).sort(([, a], [, b]) => b - a)
  }

  const getUserStats = () => {
    const stats: Record<string, number> = {}
    auditLogs.forEach((log) => {
      stats[log.userName] = (stats[log.userName] || 0) + 1
    })
    return Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
  }

  const getTimelineData = () => {
    const timeline: Record<string, number> = {}
    auditLogs.forEach((log) => {
      const date = new Date(log.timestamp).toDateString()
      timeline[date] = (timeline[date] || 0) + 1
    })
    return Object.entries(timeline).sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Actions by Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getActionStats().map(([action, count]) => (
              <div key={action} className="flex items-center justify-between">
                <span className="text-sm">{action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / auditLogs.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getCategoryStats().map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm">{category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(count / auditLogs.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getUserStats().map(([user, count]) => (
              <div key={user} className="flex items-center justify-between">
                <span className="text-sm">{user}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(count / Math.max(...getUserStats().map(([, c]) => c))) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {getTimelineData()
              .slice(-7)
              .map(([date, count]) => (
                <div key={date} className="flex items-center justify-between text-sm">
                  <span>{new Date(date).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-orange-600 h-1.5 rounded-full"
                        style={{ width: `${(count / Math.max(...getTimelineData().map(([, c]) => c))) * 100}%` }}
                      />
                    </div>
                    <span className="font-medium">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface AuditSettingsProps {
  userRole: string
}

function AuditSettings({ userRole }: AuditSettingsProps) {
  const [settings, setSettings] = useState({
    retentionPeriod: "365",
    logLevel: "all",
    realTimeAlerts: true,
    emailNotifications: false,
    autoArchive: true,
    compressionEnabled: true,
    encryptionEnabled: true,
    backupFrequency: "daily",
  })

  const handleSaveSettings = () => {
    // Save audit settings
    console.log("Saving audit settings:", settings)
  }

  if (userRole !== "admin") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only administrators can modify audit settings.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audit Configuration</CardTitle>
          <CardDescription>Configure audit trail settings and retention policies</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Log Retention Period (days)</Label>
              <Select
                value={settings.retentionPeriod}
                onValueChange={(value) => setSettings({ ...settings, retentionPeriod: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="1095">3 years</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Log Level</Label>
              <Select
                value={settings.logLevel}
                onValueChange={(value) => setSettings({ ...settings, logLevel: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal (Critical only)</SelectItem>
                  <SelectItem value="standard">Standard (Important changes)</SelectItem>
                  <SelectItem value="detailed">Detailed (All changes)</SelectItem>
                  <SelectItem value="all">All (Including views)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => setSettings({ ...settings, backupFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Real-time Alerts</h4>
                <p className="text-sm text-gray-600">Get instant notifications for critical changes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.realTimeAlerts}
                onChange={(e) => setSettings({ ...settings, realTimeAlerts: e.target.checked })}
                className="toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-600">Send email summaries of audit activity</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Auto Archive</h4>
                <p className="text-sm text-gray-600">Automatically archive old logs</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoArchive}
                onChange={(e) => setSettings({ ...settings, autoArchive: e.target.checked })}
                className="toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Compression</h4>
                <p className="text-sm text-gray-600">Compress archived logs to save space</p>
              </div>
              <input
                type="checkbox"
                checked={settings.compressionEnabled}
                onChange={(e) => setSettings({ ...settings, compressionEnabled: e.target.checked })}
                className="toggle"
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Encryption</h4>
                <p className="text-sm text-gray-600">Encrypt audit logs for security</p>
              </div>
              <input
                type="checkbox"
                checked={settings.encryptionEnabled}
                onChange={(e) => setSettings({ ...settings, encryptionEnabled: e.target.checked })}
                className="toggle"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface LogDetailModalProps {
  log: AuditLog
  onClose: () => void
}

function LogDetailModal({ log, onClose }: LogDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Audit Log Details</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Timestamp</Label>
              <p className="text-sm">{new Date(log.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Status</Label>
              <div className="mt-1">
                {log.status === "success" && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Success
                  </Badge>
                )}
                {log.status === "failed" && <Badge variant="destructive">Failed</Badge>}
                {log.status === "pending" && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Performed By</Label>
              <p className="text-sm">
                {log.userName} ({log.userRole})
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Target User</Label>
              <p className="text-sm">{log.targetUserName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Action</Label>
              <p className="text-sm">{log.action.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Category</Label>
              <p className="text-sm">{log.category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-500">Field Changed</Label>
            <p className="text-sm">{log.field}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">Old Value</Label>
              <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded text-sm font-mono">{log.oldValue}</div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">New Value</Label>
              <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded text-sm font-mono">
                {log.newValue}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">IP Address</Label>
              <p className="text-sm font-mono">{log.ipAddress}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">Session ID</Label>
              <p className="text-sm font-mono">{log.sessionId}</p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-500">User Agent</Label>
            <p className="text-sm font-mono text-gray-600 break-all">{log.userAgent}</p>
          </div>

          {log.reason && (
            <div>
              <Label className="text-sm font-medium text-gray-500">Reason</Label>
              <p className="text-sm">{log.reason}</p>
            </div>
          )}

          {Object.keys(log.metadata).length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-500">Additional Metadata</Label>
              <div className="mt-1 p-3 bg-gray-50 border rounded">
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">{JSON.stringify(log.metadata, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
