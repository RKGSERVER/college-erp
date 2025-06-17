"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Shield,
  User,
  Settings,
  Mail,
  MessageSquare,
  Smartphone,
  CheckCircle,
  Eye,
  Volume2,
  VolumeX,
  Trash2,
  Filter,
  Search,
  Download,
  RefreshCw,
  Zap,
  Lock,
  UserX,
  Database,
  Activity,
} from "lucide-react"

interface Notification {
  id: string
  type: "critical" | "warning" | "info" | "success"
  category: "security" | "profile" | "system" | "audit" | "payment"
  title: string
  message: string
  timestamp: string
  userId: string
  userName: string
  targetUserId?: string
  targetUserName?: string
  action: string
  severity: "low" | "medium" | "high" | "critical"
  read: boolean
  acknowledged: boolean
  channels: ("in_app" | "email" | "sms" | "push")[]
  metadata: Record<string, any>
  expiresAt?: string
  actionRequired: boolean
  relatedAuditId?: string
}

interface NotificationRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: {
    actions: string[]
    categories: string[]
    severityLevels: string[]
    userRoles: string[]
    timeWindow?: number
  }
  channels: ("in_app" | "email" | "sms" | "push")[]
  recipients: {
    type: "role" | "user" | "all"
    values: string[]
  }
  throttling: {
    enabled: boolean
    maxPerHour: number
    maxPerDay: number
  }
  escalation: {
    enabled: boolean
    escalateAfter: number // minutes
    escalateTo: string[]
  }
}

interface NotificationSystemProps {
  userRole: string
  userId: string
}

export function NotificationSystem({ userRole, userId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationRules, setNotificationRules] = useState<NotificationRule[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    initializeNotificationSystem()
    loadNotifications()
    loadNotificationRules()
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [userId])

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length
    setUnreadCount(unread)
  }, [notifications])

  const initializeNotificationSystem = () => {
    // Initialize audio for notifications
    audioRef.current = new Audio("/notification-sound.mp3")
    audioRef.current.volume = 0.5

    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Register service worker for push notifications
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error)
    }
  }

  const connectWebSocket = () => {
    const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/notifications/ws?userId=${userId}`

    wsRef.current = new WebSocket(wsUrl)

    wsRef.current.onopen = () => {
      setIsConnected(true)
      console.log("WebSocket connected for real-time notifications")
    }

    wsRef.current.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data)
      handleNewNotification(notification)
    }

    wsRef.current.onclose = () => {
      setIsConnected(false)
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000)
    }

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  const handleNewNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])

    // Play sound if enabled
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    // Show browser notification for critical alerts
    if (notification.severity === "critical" && "Notification" in window && Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
        tag: notification.id,
      })
    }

    // Show in-app toast for immediate attention
    if (notification.actionRequired || notification.severity === "critical") {
      showToastNotification(notification)
    }
  }

  const showToastNotification = (notification: Notification) => {
    // Create and show toast notification
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${getNotificationColor(notification.type)} animate-slide-in`

    toast.innerHTML = `
      <div class="flex items-start space-x-3">
        <div class="flex-shrink-0">
          ${getNotificationIcon(notification.type)}
        </div>
        <div class="flex-1">
          <h4 class="font-medium text-sm">${notification.title}</h4>
          <p class="text-sm opacity-90 mt-1">${notification.message}</p>
          <div class="flex space-x-2 mt-2">
            <button class="text-xs underline" onclick="this.closest('.fixed').remove()">Dismiss</button>
            ${notification.actionRequired ? '<button class="text-xs underline font-medium">View Details</button>' : ""}
          </div>
        </div>
      </div>
    `

    document.body.appendChild(toast)

    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 10000)
  }

  const loadNotifications = async () => {
    try {
      // Mock notifications - replace with actual API call
      const mockNotifications: Notification[] = [
        {
          id: "notif_001",
          type: "critical",
          category: "security",
          title: "Critical Security Alert",
          message: "Multiple failed login attempts detected for admin account",
          timestamp: new Date().toISOString(),
          userId: "system",
          userName: "System",
          targetUserId: "admin_001",
          targetUserName: "System Administrator",
          action: "failed_login_attempts",
          severity: "critical",
          read: false,
          acknowledged: false,
          channels: ["in_app", "email", "sms"],
          metadata: {
            attemptCount: 5,
            ipAddress: "192.168.1.100",
            lastAttempt: new Date().toISOString(),
            blocked: true,
          },
          actionRequired: true,
          relatedAuditId: "audit_security_001",
        },
        {
          id: "notif_002",
          type: "warning",
          category: "profile",
          title: "Bulk Profile Changes",
          message: "Administrator updated 247 student profiles simultaneously",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          userId: "admin_001",
          userName: "System Administrator",
          action: "bulk_profile_update",
          severity: "high",
          read: false,
          acknowledged: false,
          channels: ["in_app", "email"],
          metadata: {
            affectedUsers: 247,
            changeType: "dashboard_theme",
            bulkOperation: true,
          },
          actionRequired: false,
          relatedAuditId: "audit_008",
        },
        {
          id: "notif_003",
          type: "warning",
          category: "security",
          title: "Permission Elevation",
          message: "User permissions elevated to include financial reports access",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          userId: "admin_001",
          userName: "System Administrator",
          targetUserId: "EMP001",
          targetUserName: "Mike Wilson",
          action: "permission_update",
          severity: "high",
          read: true,
          acknowledged: true,
          channels: ["in_app", "email"],
          metadata: {
            addedPermissions: ["financial_reports"],
            securityLevel: "medium",
            approvedBy: "principal_001",
          },
          actionRequired: false,
          relatedAuditId: "audit_005",
        },
        {
          id: "notif_004",
          type: "critical",
          category: "security",
          title: "Account Suspended",
          message: "Student account suspended due to academic misconduct",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          userId: "admin_001",
          userName: "System Administrator",
          targetUserId: "STU003",
          targetUserName: "Alex Rodriguez",
          action: "status_update",
          severity: "critical",
          read: true,
          acknowledged: false,
          channels: ["in_app", "email", "sms"],
          metadata: {
            suspensionReason: "Academic misconduct",
            duration: "30 days",
            appealDeadline: "2024-01-21",
          },
          actionRequired: true,
          relatedAuditId: "audit_007",
        },
        {
          id: "notif_005",
          type: "info",
          category: "system",
          title: "System Maintenance",
          message: "Scheduled maintenance window starting in 2 hours",
          timestamp: new Date(Date.now() - 1200000).toISOString(),
          userId: "system",
          userName: "System",
          action: "maintenance_notification",
          severity: "low",
          read: false,
          acknowledged: false,
          channels: ["in_app"],
          metadata: {
            maintenanceStart: new Date(Date.now() + 7200000).toISOString(),
            estimatedDuration: "2 hours",
            affectedServices: ["profile_management", "payment_system"],
          },
          actionRequired: false,
          expiresAt: new Date(Date.now() + 7200000).toISOString(),
        },
      ]

      setNotifications(mockNotifications)
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const loadNotificationRules = async () => {
    try {
      // Mock notification rules - replace with actual API call
      const mockRules: NotificationRule[] = [
        {
          id: "rule_001",
          name: "Critical Security Events",
          description: "Immediate alerts for critical security incidents",
          enabled: true,
          conditions: {
            actions: ["failed_login_attempts", "permission_elevation", "account_breach"],
            categories: ["security"],
            severityLevels: ["critical"],
            userRoles: ["admin", "principal"],
          },
          channels: ["in_app", "email", "sms", "push"],
          recipients: {
            type: "role",
            values: ["admin", "principal"],
          },
          throttling: {
            enabled: false,
            maxPerHour: 0,
            maxPerDay: 0,
          },
          escalation: {
            enabled: true,
            escalateAfter: 5,
            escalateTo: ["principal", "system_admin"],
          },
        },
        {
          id: "rule_002",
          name: "Profile Changes",
          description: "Notifications for significant profile modifications",
          enabled: true,
          conditions: {
            actions: ["profile_update", "status_update", "bulk_profile_update"],
            categories: ["profile"],
            severityLevels: ["medium", "high", "critical"],
            userRoles: ["admin"],
          },
          channels: ["in_app", "email"],
          recipients: {
            type: "role",
            values: ["admin", "principal"],
          },
          throttling: {
            enabled: true,
            maxPerHour: 10,
            maxPerDay: 50,
          },
          escalation: {
            enabled: false,
            escalateAfter: 0,
            escalateTo: [],
          },
        },
        {
          id: "rule_003",
          name: "System Events",
          description: "Important system notifications and maintenance alerts",
          enabled: true,
          conditions: {
            actions: ["system_error", "maintenance_notification", "backup_failure"],
            categories: ["system"],
            severityLevels: ["medium", "high", "critical"],
            userRoles: ["admin"],
          },
          channels: ["in_app", "email"],
          recipients: {
            type: "role",
            values: ["admin"],
          },
          throttling: {
            enabled: true,
            maxPerHour: 5,
            maxPerDay: 20,
          },
          escalation: {
            enabled: true,
            escalateAfter: 15,
            escalateTo: ["principal"],
          },
        },
      ]

      setNotificationRules(mockRules)
    } catch (error) {
      console.error("Error loading notification rules:", error)
    }
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)))

    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      })
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAsAcknowledged = async (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, acknowledged: true, read: true } : n)),
    )

    try {
      await fetch(`/api/notifications/${notificationId}/acknowledge`, {
        method: "PATCH",
      })
    } catch (error) {
      console.error("Error acknowledging notification:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))

    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))

    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-600 text-white"
      case "warning":
        return "bg-yellow-600 text-white"
      case "success":
        return "bg-green-600 text-white"
      default:
        return "bg-blue-600 text-white"
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "critical":
        return '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>'
      case "warning":
        return '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>'
      case "success":
        return '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>'
      default:
        return '<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>'
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>
      case "high":
        return <Badge className="bg-orange-600 text-white">High</Badge>
      case "medium":
        return <Badge className="bg-yellow-600 text-white">Medium</Badge>
      default:
        return <Badge variant="secondary">Low</Badge>
    }
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "failed_login_attempts":
        return <Lock className="h-4 w-4" />
      case "permission_update":
        return <Shield className="h-4 w-4" />
      case "status_update":
        return <UserX className="h-4 w-4" />
      case "profile_update":
        return <User className="h-4 w-4" />
      case "bulk_profile_update":
        return <Database className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    const matchesType = filterType === "all" || notification.type === filterType
    const matchesCategory = filterCategory === "all" || notification.category === filterCategory
    const matchesSearch =
      !searchTerm ||
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.userName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-8 w-8" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">Real-Time Notifications</h2>
            <p className="text-gray-600">
              Critical alerts and security events • {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm" onClick={loadNotifications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Connection Status */}
      <Card className={`border-l-4 ${isConnected ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span className="text-sm font-medium">
              {isConnected ? "Real-time notifications active" : "Connection lost - attempting to reconnect..."}
            </span>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="notifications">Notifications ({unreadCount})</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
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
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="profile">Profile</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Actions</Label>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Advanced
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
                } ${notification.severity === "critical" ? "border-l-4 border-l-red-500 bg-red-50" : ""}`}
                onClick={() => setSelectedNotification(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="flex-shrink-0 mt-1">{getActionIcon(notification.action)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          {getSeverityBadge(notification.severity)}
                          {notification.actionRequired && (
                            <Badge variant="outline" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                          {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full" />}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(notification.timestamp).toLocaleString()}</span>
                          <span>{notification.userName}</span>
                          {notification.targetUserName && (
                            <>
                              <span>→</span>
                              <span>{notification.targetUserName}</span>
                            </>
                          )}
                          <span className="capitalize">{notification.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsRead(notification.id)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {notification.actionRequired && !notification.acknowledged && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            markAsAcknowledged(notification.id)
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                <p className="text-gray-600">
                  {searchTerm || filterType !== "all" || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "You're all caught up!"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <NotificationRules rules={notificationRules} setRules={setNotificationRules} userRole={userRole} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <NotificationSettings soundEnabled={soundEnabled} setSoundEnabled={setSoundEnabled} userRole={userRole} />
        </TabsContent>
      </Tabs>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <NotificationDetailModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          onMarkAsRead={markAsRead}
          onAcknowledge={markAsAcknowledged}
        />
      )}
    </div>
  )
}

interface NotificationRulesProps {
  rules: NotificationRule[]
  setRules: (rules: NotificationRule[]) => void
  userRole: string
}

function NotificationRules({ rules, setRules, userRole }: NotificationRulesProps) {
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  const toggleRule = (ruleId: string) => {
    setRules(rules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const deleteRule = (ruleId: string) => {
    setRules(rules.filter((rule) => rule.id !== ruleId))
  }

  if (userRole !== "admin") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-gray-600">Only administrators can manage notification rules.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Notification Rules</h3>
          <p className="text-gray-600">Configure when and how notifications are sent</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Zap className="h-4 w-4 mr-2" />
          Create Rule
        </Button>
      </div>

      <div className="space-y-3">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-medium">{rule.name}</h4>
                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.enabled ? "Active" : "Disabled"}
                    </Badge>
                    {rule.escalation.enabled && (
                      <Badge variant="outline" className="text-xs">
                        Escalation
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Actions: {rule.conditions.actions.length}</span>
                    <span>Channels: {rule.channels.length}</span>
                    <span>Recipients: {rule.recipients.values.length}</span>
                    {rule.throttling.enabled && <span>Throttled: {rule.throttling.maxPerHour}/hr</span>}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                  <Button size="sm" variant="outline" onClick={() => setEditingRule(rule)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => deleteRule(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Rule Modal would go here */}
    </div>
  )
}

interface NotificationSettingsProps {
  soundEnabled: boolean
  setSoundEnabled: (enabled: boolean) => void
  userRole: string
}

function NotificationSettings({ soundEnabled, setSoundEnabled, userRole }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    browserNotifications: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00",
    },
    frequency: {
      immediate: true,
      digest: false,
      digestFrequency: "daily",
    },
    categories: {
      security: true,
      profile: true,
      system: false,
      audit: false,
      payment: true,
    },
  })

  const handleSaveSettings = () => {
    // Save notification settings
    console.log("Saving notification settings:", settings)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Delivery Channels</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>In-App Notifications</span>
                </div>
                <Switch checked={true} disabled />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email Notifications</span>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4" />
                  <span>SMS Notifications</span>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Push Notifications</span>
                </div>
                <Switch
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span>Sound Alerts</span>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Quiet Hours</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Enable Quiet Hours</span>
                <Switch
                  checked={settings.quietHours.enabled}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      quietHours: { ...settings.quietHours, enabled: checked },
                    })
                  }
                />
              </div>
              {settings.quietHours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={settings.quietHours.start}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          quietHours: { ...settings.quietHours, start: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={settings.quietHours.end}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          quietHours: { ...settings.quietHours, end: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Categories</h4>
            <div className="space-y-3">
              {Object.entries(settings.categories).map(([category, enabled]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="capitalize">{category} Events</span>
                  <Switch
                    checked={enabled}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        categories: { ...settings.categories, [category]: checked },
                      })
                    }
                  />
                </div>
              ))}
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

interface NotificationDetailModalProps {
  notification: Notification
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onAcknowledge: (id: string) => void
}

function NotificationDetailModal({ notification, onClose, onMarkAsRead, onAcknowledge }: NotificationDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Notification Details</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant={
                notification.type === "critical"
                  ? "destructive"
                  : notification.type === "warning"
                    ? "secondary"
                    : "default"
              }
            >
              {notification.type.toUpperCase()}
            </Badge>
            <Badge variant="outline">{notification.category}</Badge>
            {notification.actionRequired && (
              <Badge variant="outline" className="text-red-600">
                Action Required
              </Badge>
            )}
          </div>

          <div>
            <h4 className="font-medium text-lg mb-2">{notification.title}</h4>
            <p className="text-gray-700">{notification.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label className="text-gray-500">Timestamp</Label>
              <p>{new Date(notification.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-gray-500">Severity</Label>
              <p className="capitalize">{notification.severity}</p>
            </div>
            <div>
              <Label className="text-gray-500">Triggered By</Label>
              <p>{notification.userName}</p>
            </div>
            {notification.targetUserName && (
              <div>
                <Label className="text-gray-500">Target User</Label>
                <p>{notification.targetUserName}</p>
              </div>
            )}
          </div>

          <div>
            <Label className="text-gray-500">Delivery Channels</Label>
            <div className="flex space-x-2 mt-1">
              {notification.channels.map((channel) => (
                <Badge key={channel} variant="outline" className="text-xs">
                  {channel.replace("_", " ").toUpperCase()}
                </Badge>
              ))}
            </div>
          </div>

          {Object.keys(notification.metadata).length > 0 && (
            <div>
              <Label className="text-gray-500">Additional Information</Label>
              <div className="mt-1 p-3 bg-gray-50 border rounded text-sm">
                <pre className="whitespace-pre-wrap">{JSON.stringify(notification.metadata, null, 2)}</pre>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            {!notification.read && (
              <Button
                variant="outline"
                onClick={() => {
                  onMarkAsRead(notification.id)
                  onClose()
                }}
              >
                Mark as Read
              </Button>
            )}
            {notification.actionRequired && !notification.acknowledged && (
              <Button
                onClick={() => {
                  onAcknowledge(notification.id)
                  onClose()
                }}
              >
                Acknowledge
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
