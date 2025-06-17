"use client"

import { useCallback } from "react"

interface AuditLogEntry {
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
  reason?: string
  metadata?: Record<string, any>
}

export function useAuditLogger() {
  const logChange = useCallback(async (entry: AuditLogEntry) => {
    try {
      // Get additional context
      const timestamp = new Date().toISOString()
      const ipAddress = await getClientIP()
      const userAgent = navigator.userAgent
      const sessionId = getSessionId()

      const auditLog = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp,
        ipAddress,
        userAgent,
        sessionId,
        status: "success" as const,
        ...entry,
      }

      // Send to audit service
      await fetch("/api/audit/log", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(auditLog),
      })

      console.log("Audit log recorded:", auditLog)
    } catch (error) {
      console.error("Failed to record audit log:", error)
    }
  }, [])

  const logProfileUpdate = useCallback(
    (
      userId: string,
      userName: string,
      userRole: string,
      targetUserId: string,
      targetUserName: string,
      field: string,
      oldValue: string,
      newValue: string,
      reason?: string,
    ) => {
      logChange({
        userId,
        userName,
        userRole,
        targetUserId,
        targetUserName,
        action: "profile_update",
        category: "personal_info",
        field,
        oldValue,
        newValue,
        reason,
        metadata: {
          selfUpdate: userId === targetUserId,
          fieldType: typeof newValue,
          changeLength: Math.abs(newValue.length - oldValue.length),
        },
      })
    },
    [logChange],
  )

  const logDashboardUpdate = useCallback(
    (
      userId: string,
      userName: string,
      userRole: string,
      targetUserId: string,
      targetUserName: string,
      field: string,
      oldValue: string,
      newValue: string,
      reason?: string,
    ) => {
      logChange({
        userId,
        userName,
        userRole,
        targetUserId,
        targetUserName,
        action: "dashboard_update",
        category: "dashboard_settings",
        field,
        oldValue,
        newValue,
        reason,
        metadata: {
          adminOverride: userId !== targetUserId,
          dashboardComponent: field,
        },
      })
    },
    [logChange],
  )

  const logPermissionUpdate = useCallback(
    (
      userId: string,
      userName: string,
      userRole: string,
      targetUserId: string,
      targetUserName: string,
      oldPermissions: string[],
      newPermissions: string[],
      reason?: string,
    ) => {
      const addedPermissions = newPermissions.filter((p) => !oldPermissions.includes(p))
      const removedPermissions = oldPermissions.filter((p) => !newPermissions.includes(p))

      logChange({
        userId,
        userName,
        userRole,
        targetUserId,
        targetUserName,
        action: "permission_update",
        category: "security",
        field: "permissions",
        oldValue: oldPermissions.join(","),
        newValue: newPermissions.join(","),
        reason,
        metadata: {
          addedPermissions,
          removedPermissions,
          permissionCount: newPermissions.length,
          securityLevel: getSecurityLevel(newPermissions),
        },
      })
    },
    [logChange],
  )

  const logStatusUpdate = useCallback(
    (
      userId: string,
      userName: string,
      userRole: string,
      targetUserId: string,
      targetUserName: string,
      oldStatus: string,
      newStatus: string,
      reason?: string,
    ) => {
      logChange({
        userId,
        userName,
        userRole,
        targetUserId,
        targetUserName,
        action: "status_update",
        category: "account_management",
        field: "status",
        oldValue: oldStatus,
        newValue: newStatus,
        reason,
        metadata: {
          statusChange: `${oldStatus} → ${newStatus}`,
          isActivation: newStatus === "Active",
          isDeactivation: newStatus === "Inactive" || newStatus === "Suspended",
          requiresNotification: newStatus !== "Active",
        },
      })
    },
    [logChange],
  )

  const logBulkOperation = useCallback(
    (
      userId: string,
      userName: string,
      userRole: string,
      action: string,
      category: string,
      affectedUsers: string[],
      operation: string,
      reason?: string,
    ) => {
      logChange({
        userId,
        userName,
        userRole,
        targetUserId: "BULK_OPERATION",
        targetUserName: `${affectedUsers.length} users`,
        action: `bulk_${action}`,
        category,
        field: "bulk_operation",
        oldValue: "N/A",
        newValue: operation,
        reason,
        metadata: {
          bulkOperation: true,
          affectedUsers: affectedUsers.length,
          userIds: affectedUsers,
          operationType: operation,
          batchSize: affectedUsers.length,
        },
      })
    },
    [logChange],
  )

  return {
    logChange,
    logProfileUpdate,
    logDashboardUpdate,
    logPermissionUpdate,
    logStatusUpdate,
    logBulkOperation,
  }
}

// Helper functions
async function getClientIP(): Promise<string> {
  try {
    const response = await fetch("/api/client-ip")
    const data = await response.json()
    return data.ip || "Unknown"
  } catch {
    return "Unknown"
  }
}

function getSessionId(): string {
  return sessionStorage.getItem("sessionId") || `session_${Date.now()}`
}

function getSecurityLevel(permissions: string[]): string {
  const highSecurityPerms = ["manage_all_users", "system_settings", "full_access"]
  const mediumSecurityPerms = ["manage_courses", "financial_reports", "approve_requests"]

  if (permissions.some((p) => highSecurityPerms.includes(p))) return "high"
  if (permissions.some((p) => mediumSecurityPerms.includes(p))) return "medium"
  return "low"
}
